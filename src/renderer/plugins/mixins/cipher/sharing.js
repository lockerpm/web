import Vue from 'vue'
import find from 'lodash/find'
import { CipherType } from '../../../core/enums/cipherType'

Vue.mixin({
  computed: {
    pendingShares () {
      return this.$store.state.pendingShares
    },
    myShares () {
      return this.$store.state.myShares
    },
    myQuickShares () {
      return this.$store.state.myQuickShares
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

    isCipherQuickShared (cipherId) {
      const share = this.myQuickShares.find(s => s.cipher_id === cipherId)
      return !!share
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
        isBelongToSelf
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

    getPublicShareUrl (id, key) {
      return `${
        process.env.baseUrl
      }/flash-share-item/${id}#${encodeURIComponent(key)}`
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
    }
  }
})
