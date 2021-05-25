<template>
  <div>
    Trang user
    <button @click="openInvitationDialog" class="btn btn-primary">open</button>
    <InvitationUser ref="invitationUser" />
  </div>
</template>

<script>
import InvitationUser from '../../../components/user/InvitationUser'
export default {
  components: {
    InvitationUser
  },
  mounted () {
  },
  methods: {
    openInvitationDialog () {
      this.$refs.invitationUser.openDialog()
    },
    getMembers () {
      this.$axios.$get(`cystack_platform/pm/${this.$route.params.teamId}/members`)
    }
  }
}
</script>
