import Vue from 'vue'
import find from 'lodash/find'
import { CipherType } from '../../../core/enums/cipherType'

Vue.mixin({
  computed: {
    myShares () {
      return this.$store.state.myShares
    },
    pendingShares () {
      return this.$store.state.pendingShares
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
        if (team.type === 0) {
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
        return [0, 1].includes(team.type)
      }
      return true
    },

    canViewItem (teams, item) {
      const team = this.getTeam(teams, item.organizationId)
      if (team.id) {
        return [0, 1, 3].includes(team.type) || item.viewPassword
      }
      return true
    },

    canManageFolder (teams, item) {
      const team = this.getTeam(teams, item.organizationId)
      if (team.organization_id) {
        return ['owner', 'admin'].includes(team.role)
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
        !cipher.collectionIds.length &&
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

    async syncQuickShares () {
      try {
        // No quick shares for on premise
        if (this.isOnPremise) {
          return
        }
        this.$store.commit('UPDATE_SYNCING_QUICK_SHARES', true)
        const res = await this.$axios.$get(
          'cystack_platform/pm/quick_shares?paging=0'
        )
        const userId = await this.$userService.getUserId()
        await this.$syncService.syncSends(userId, res)
      } catch (error) {
        console.log(error)
      } finally {
        this.$store.commit('UPDATE_SYNCING_QUICK_SHARES', false)
      }
    },

    getPublicShareUrl (accessId, key) {
      return `${process.env.baseUrl}/shares/${accessId}#${encodeURIComponent(
        key
      )}`
    },

    async stopQuickSharing (send) {
      try {
        await this.$axios.$delete(`cystack_platform/pm/quick_shares/${send.id}`)
        this.notify(this.$t('data.notifications.stop_share_success'), 'success')
        return true
      } catch (error) {
        this.notify(this.$t('errors.something_went_wrong'), 'warning')
        console.log(error)
        return false
      }
    },

    async stopShareCipher (cipher) {
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
        }

        this.notify(
          this.$tc('data.notifications.update_success', 1, {
            type: this.$tc(`type.${cipher.type}`, 1)
          }),
          'success'
        )
        this.$store.dispatch('LoadMyShares')
      } catch (error) {
        this.notify(
          this.$tc('data.notifications.update_failed', 1, {
            type: this.$tc(`type.${cipher.type}`, 1)
          }),
          'warning'
        )
      }
    },

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
        const ciphers = await Promise.all(
          folder.ciphers.map(async cipher => {
            const { data } = await this.getEncCipherForRequest(cipher, {
              noCheck: true,
              encKey: personalKey
            })
            return {
              id: cipher.id,
              ...data
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
          await this.$axios.$post(
            `cystack_platform/pm/sharing/${folder.organizationId}/stop`,
            payload
          )
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
    }
  }
})
