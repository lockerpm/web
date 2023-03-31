import Vue from 'vue'
import find from 'lodash/find'

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

    isCipherShareable (cipher, organizations) {
      return (
        !cipher.isDeleted &&
        this.isOwner(organizations, cipher) &&
        // Not in any shared folder
        !cipher.collectionIds.length &&
        !this.isProtectedCipher(cipher)
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
    }
  }
})
