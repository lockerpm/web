<template>
  <div v-if="enterpriseInvitations.length" class="flex-column-fluid lg:px-28 py-10 px-10">
    <div
      v-for="invitation in enterpriseInvitations.slice(0, 1)"
      :key="invitation.id"
      class="banner-invitation border border-black-200 rounded p-5 md:p-8"
    >
      <div class="flex items-center justify-between">
        <div class="">
          <div class="text-lg font-semibold mb-2">
            {{ $t('data.enterprise.banner.title', {team: invitation.enterprise && invitation.enterprise.name}) }}
          </div>
          <div class="text-black-600 mb-5">
            {{ $t('data.enterprise.banner.desc', {team: invitation.enterprise && invitation.enterprise.name, owner: invitation.owner}) }}
          </div>
          <div>
            <button
              class="btn btn-default"
              :disabled="loading"
              @click="putInvitation(invitation.id, 'reject')"
            >
              {{ $t('common.reject') }}
            </button>
            <button
              class="btn btn-primary"
              :disabled="loading"
              @click="putInvitation(invitation.id, 'confirmed')"
            >
              {{ $t('common.accept') }}
            </button>
          </div>
        </div>
        <div>
          <img src="~/assets/images/icons/invitaion.svg" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async getInvitations () {
      this.invitations = await this.$axios.$get('cystack_platform/pm/users/invitations')
    },
    async putInvitation (id, status) {
      try {
        this.loading = true
        await this.$axios.$put(`cystack_platform/pm/enterprises/members/invitations/${id}`, {
          status
        })
        this.notify(this.$t('common.success'), 'success')
        if (status === 'confirmed') {
          this.$store.dispatch('LoadCurrentUserPw')
          this.$store.dispatch('LoadTeams').then(this.loadEnterprisePolicies)
        }
        this.getInvitations()
      } catch (e) {
        this.notify(this.$t('common.failed'), 'warning')
        console.log(e)
      } finally {
        this.$store.dispatch('LoadEnterpriseInvitations')
        this.loading = false
      }
    },
  }
}
</script>

<style scoped>

</style>
