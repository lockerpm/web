<template>
  <div
    v-if="emergencyAccessInvitations.length"
    class="flex-column-fluid lg:px-28 py-10 md:px-10 px-4"
  >
    <div
      v-for="invitation in emergencyAccessInvitations.slice(0, 1)"
      :key="invitation.id"
      class="banner-invitation border border-black-200 rounded p-5 md:p-8"
    >
      <div class="flex items-center justify-between">
        <div>
          <div class="text-lg font-semibold mb-2">
            {{ $t('data.emergency_access.invitation') }}
          </div>
          <div class="text-black-600 mb-5">
            {{ $t('data.emergency_access.invitation_details') }}
            {{ invitation.full_name }}.<br>{{
              $t('data.emergency_access.access_type')
            }}: {{ invitation.type }}
          </div>
          <div>
            <button
              class="btn btn-default"
              :disabled="loading"
              @click="deleteEmergencyAccess(invitation)"
            >
              {{ $t('common.reject') }}
            </button>
            <button
              class="btn btn-primary"
              :disabled="loading"
              @click="acceptEmergencyAccessInvitation(invitation.id)"
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
      loading: false,
      emergencyAccessInvitations: []
    }
  },
  methods: {
    async getEmergencyAccessInvitations () {
      this.emergencyAccessInvitations = await this.$axios.$get(
        'cystack_platform/pm/emergency_access/granted'
      )
      this.emergencyAccessInvitations = this.emergencyAccessInvitations.filter(
        invitations => invitations.status === 'invited'
      )
    },
    async acceptEmergencyAccessInvitation (id) {
      try {
        this.loading = true
        await this.$axios.$post(
          `cystack_platform/pm/emergency_access/${id}/accept`
        )
        this.getEmergencyAccessInvitations()
        this.notify(
          this.$t('data.notifications.accept_invitation_success'),
          'success'
        )
      } catch (e) {
        this.notify(
          this.$t('data.notifications.accept_invitation_failed'),
          'warning'
        )
      } finally {
        this.loading = false
      }
    },
    async deleteEmergencyAccess (emergencyAccess) {
      this.$confirm(
        this.$t('data.notifications.delete_emergency_contact'),
        emergencyAccess.full_name || this.$t('common.warning'),
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(async () => {
          try {
            this.loading = true
            await this.$axios.$delete(
              `cystack_platform/pm/emergency_access/${emergencyAccess.id}`
            )
            this.getEmergencyAccessInvitations()
            this.notify(
              this.$t('data.notifications.remove_user_success', {
                user: emergencyAccess.email
              }),
              'success'
            )
          } catch (e) {
            // this.errors = (e.response && e.response.data && e.response.data.details) || {}
            this.notify(
              this.$t('data.notifications.remove_user_failed'),
              'warning'
            )
          } finally {
            this.loading = false
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped></style>
