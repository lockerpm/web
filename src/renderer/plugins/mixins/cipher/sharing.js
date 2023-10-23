import Vue from 'vue'
import find from 'lodash/find'
import { CipherType } from '../../../jslib/src/enums/cipherType'
import { AccountRole } from '../../../constants'

Vue.mixin({
  computed: {
    myShares () {
      return this.$store.state.myShares
    },
    shareInvitations () {
      return this.$store.state.shareInvitations
    },
    pendingShareInvitations () {
      return this.$store.state.shareInvitations.filter(
        item => item.status === 'invited'
      )
    },
    pendingMyShares () {
      return this.$store.state.myShares.filter(
        s => !!s.members.find(m => m.status === 'accepted')
      )
    }
  },

  methods: {
    isOwner (teams, cipher) {
      if (cipher.organizationId) {
        const team = this.getTeam(teams, cipher.organizationId)
        if (team.type === AccountRole.OWNER) {
          return true
        }
        return false
      }
      return true
    },

    getTeam (teams, orgId) {
      return find(teams, e => e.id === orgId) || {}
    },

    canManageItem (teams, item) {
      const team = this.getTeam(teams, item.organizationId)
      if (team.id) {
        return [AccountRole.OWNER, AccountRole.ADMIN].includes(team.type)
      }
      return true
    },

    isCipherShared (organizationId) {
      const share = this.myShares.find(s => s.id === organizationId) || {
        members: [],
        groups: []
      }
      return share?.members?.length || share?.groups?.length
    },

    isCipherSharedWithMe (organizationId, organizations) {
      const team = this.getTeam(organizations, organizationId)
      return !!team
    },

    isCipherShareable (cipher, organizations) {
      return (
        !cipher.isDeleted &&
        this.isOwner(organizations, cipher) &&
        // Not in any shared folder
        !cipher.collectionIds?.length &&
        !this.isProtectedCipher(cipher) &&
        cipher.type !== CipherType.TOTP
      )
    },

    isCipherQuickShareable (cipher) {
      const isBelongToSelf =
        !cipher.organizationId ||
        !!this.myShares.find(i => i.organization_id === cipher.organizationId)
      return (
        !cipher.isDeleted &&
        !this.isProtectedCipher(cipher) &&
        cipher.type !== CipherType.TOTP &&
        isBelongToSelf &&
        !this.isOnPremise
      )
    },

    getSharedCipherMembers (organizationId) {
      const share = this.myShares.find(s => s.id === organizationId) || {
        members: [],
        groups: []
      }
      return (
        share.members.map(member => {
          return {
            ...member,
            username: member.email,
            status: member.status,
            role: member.role,
            id: member.id,
            key: null
          }
        }) || []
      )
    },

    getPublicShareUrl (accessId, key) {
      return `${process.env.baseUrl}/shares/${accessId}#${encodeURIComponent(
        key
      )}`
    },

    // Stop quick share
    async stopQuickSharing (send) {
      try {
        this.$store.commit('UPDATE_SYNCING_QUICK_SHARES', true)
        await this.$axios.$delete(`cystack_platform/pm/quick_shares/${send.id}`)
        await this.$sendService.delete([send.id])
        this.notify(this.$t('data.notifications.stop_share_success'), 'success')
        return true
      } catch (error) {
        this.notify(this.$t('errors.something_went_wrong'), 'warning')
        console.log(error)
        return false
      } finally {
        this.$store.commit('UPDATE_SYNCING_QUICK_SHARES', false)
      }
    },

    // Stop share
    async stopShareCipher (cipher, silent = false) {
      try {
        let memberId = null
        if (cipher.user) {
          memberId = cipher.user.id
          delete cipher.user
        }
        const { data } = await this.getEncCipherForRequest(cipher, {
          noCheck: true,
          encKey: await this.$cryptoService.getEncKey()
        })

        if (memberId) {
          await this.$axios.$post(
            `cystack_platform/pm/sharing/${cipher.organizationId}/members/${memberId}/stop`,
            {
              folder: null,
              cipher: { ...data, id: cipher.id }
            }
          )
        } else {
          await this.$axios.$post(
            `cystack_platform/pm/sharing/${cipher.organizationId}/stop`,
            {
              folder: null,
              cipher: { ...data, id: cipher.id }
            }
          )
          await this.upsertCipherLocal(cipher, {
            ...data,
            organizationId: null,
            collectionIds: []
          })
        }

        if (!silent) {
          this.notify(
            this.$tc('data.notifications.update_success', 1, {
              type: this.$tc(`type.${cipher.type}`, 1)
            }),
            'success'
          )
        }

        this.$store.dispatch('LoadMyShares')
      } catch (error) {
        if (!silent) {
          this.notify(
            this.$tc('data.notifications.update_failed', 1, {
              type: this.$tc(`type.${cipher.type}`, 1)
            }),
            'warning'
          )
        } else {
          console.log(error)
        }
      }
    },

    // Stop share a cipher in a shared folder
    async stopShareCipherInCollection (cipher) {
      try {
        const { data } = await this.getEncCipherForRequest(cipher, {
          noCheck: true,
          encKey: await this.$cryptoService.getEncKey()
        })

        await this.$axios.$put(
          `cystack_platform/pm/sharing/${cipher.organizationId}/folders/${cipher.collectionIds[0]}/items`,
          {
            cipher: { ...data, id: cipher.id }
          }
        )
        await this.upsertCipherLocal(cipher, {
          ...data,
          organizationId: null,
          collectionIds: []
        })
        this.$store.dispatch('LoadMyShares')
      } catch (error) {
        console.log(error)
      }
    },

    // Stop share folder
    async stopShareFolder (folder) {
      try {
        let memberId = null
        if (folder.user) {
          memberId = folder.user.id
          delete folder.user
        }
        let folderNameEnc = await this.$cryptoService.encrypt(folder.name)
        folderNameEnc = folderNameEnc.encryptedString

        // Encrypt ciphers with self key
        const personalKey = await this.$cryptoService.getEncKey()
        const cipherInsideFolder =
          (await this.$searchService.searchCiphers(
            this.searchText,
            [c => c.collectionIds.includes(folder.id)],
            null
          )) || []
        const ciphers = await Promise.all(
          cipherInsideFolder.map(async cipher => {
            const { data } = await this.getEncCipherForRequest(cipher, {
              noCheck: true,
              encKey: personalKey
            })
            return {
              id: cipher.id,
              ...data,
              creationDate: cipher.creationDate
            }
          })
        )
        const payload = {
          folder: {
            id: folder.id,
            name: folderNameEnc,
            ciphers
          }
        }
        if (memberId) {
          await this.$axios.$post(
            `cystack_platform/pm/sharing/${folder.organizationId}/members/${memberId}/stop`,
            payload
          )
        } else {
          const res = await this.$axios.$post(
            `cystack_platform/pm/sharing/${folder.organizationId}/stop`,
            payload
          )
          await this.$collectionService.delete(folder.id)
          if (res.personal_folder_id) {
            const now = new Date().toISOString()
            await this.$cipherService.upsert(
              ciphers.map(c => ({
                ...c,
                revisionDate: now,
                organizationId: null,
                collectionIds: [],
                folderId: res.personal_folder_id
              }))
            )
            await this.$folderService.upsert([
              {
                id: res.personal_folder_id,
                name: folderNameEnc,
                creationDate: now,
                revisionDate: now
              }
            ])
          }
          this.$store.commit('UPDATE_SYNCED_CIPHERS')
        }
        this.notify(
          this.$tc('data.notifications.update_success', 1, {
            type: this.$tc('type.Folder', 1)
          }),
          'success'
        )
        this.$store.dispatch('LoadMyShares')
      } catch (error) {
        this.notify(
          this.$tc('data.notifications.update_failed', 1, {
            type: this.$tc('type.Folder', 1)
          }),
          'warning'
        )
      }
    },

    // Leave share cipher/folder
    async leaveShare (cipher) {
      try {
        await this.$axios.$post(
          `cystack_platform/pm/sharing/${
            cipher.organizationId || cipher?.team?.id
          }/leave`
        )
        if (cipher.ciphers) {
          // This is a folder
          await this.$cipherService.delete(cipher.ciphers.map(c => c.id))
          await this.$collectionService.delete(cipher.id)
        } else {
          await this.$cipherService.delete([cipher.id])
        }
        this.notify(
          this.$t('data.notifications.leave_share_success'),
          'success'
        )
        this.$store.commit('UPDATE_SYNCED_CIPHERS')
        return true
      } catch (error) {
        this.notify(this.$t('errors.something_went_wrong'), 'warning')
        console.log(error)
        return false
      }
    }
  }
})
