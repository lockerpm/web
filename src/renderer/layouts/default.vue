<template>
  <div class="flex flex-col sm:flex-row flex-1 relative">
    <client-only>
      <template v-if="!locked">
        <div class="hidden md:block">
          <SideBarMenu :closable="false" :pending-shares="pendingShares" />
        </div>
        <div class="md:pl-60 flex flex-col flex-row-fluid">
          <Header />
          <div v-if="shouldWelcome !=='false'" class="flex-column-fluid lg:px-28 py-10 px-10">
            <div class="border border-black-200 rounded p-5 md:p-8 relative">
              <div class="flex items-center justify-between">
                <div class="">
                  <div class="text-lg font-semibold mb-2">
                    {{ $t('data.welcome.title') }}
                  </div>
                  <div class="text-black-600 mb-5">
                    {{ $t('data.welcome.text1') }}
                    <br>
                    {{ $t('data.welcome.text2') }}
                    <br>
                    <span v-html="$t('data.welcome.text3')" />
                  </div>
                </div>
                <div>
                  <img src="~/assets/images/icons/welcome.svg" alt="">
                </div>
                <button
                  class="btn btn-clean absolute top-2 -right-2"
                  @click="offWelcome"
                >
                  <i class="el-icon-close text-lg" />
                </button>
              </div>
            </div>
          </div>
          <div v-if="invitations.length" class="flex-column-fluid lg:px-28 py-10 px-10">
            <div
              v-for="invitation in invitations.slice(0, 1)"
              :key="invitation.id"
              class="banner-invitation border border-black-200 rounded p-5 md:p-8"
            >
              <div class="flex items-center justify-between">
                <div class="">
                  <div class="text-lg font-semibold mb-2">
                    Invitation to join {{ invitation.team && invitation.team.name }}
                  </div>
                  <div class="text-black-600 mb-5">
                    You’ve been invited to the {{ invitation.team && invitation.team.name }} organization! Join now and start collaborating with your teammates.
                  </div>
                  <div>
                    <button
                      class="btn btn-default"
                      :disabled="loading"
                      @click="putInvitation(invitation.id, 'reject')"
                    >
                      Từ chối
                    </button>
                    <button
                      class="btn btn-primary"
                      :disabled="loading"
                      @click="putInvitation(invitation.id, 'accept')"
                    >
                      Đồng ý
                    </button>
                  </div>
                </div>
                <div>
                  <img src="~/assets/images/icons/invitaion.svg" alt="">
                </div>
              </div>
            </div>
          </div>
          <div v-if="emergencyAccessInvitations.length" class="flex-column-fluid lg:px-28 py-10 px-10">
            <div
              v-for="invitation in emergencyAccessInvitations.slice(0, 1)"
              :key="invitation.id"
              class="banner-invitation border border-black-200 rounded p-5 md:p-8"
            >
              <div class="flex items-center justify-between">
                <div class="">
                  <div class="text-lg font-semibold mb-2">
                    {{ $t('data.emergency_access.invitation') }}
                  </div>
                  <div class="text-black-600 mb-5">
                    {{ $t('data.emergency_access.invitation_details') }} {{ invitation.full_name }}.<br>{{ $t('data.emergency_access.access_type') }}: {{ invitation.type }}
                  </div>
                  <div>
                    <button
                      class="btn btn-default"
                      :disabled="loading2"
                      @click="deleteEmergencyAccess(invitation)"
                    >
                      {{ $t('common.decline') }}
                    </button>
                    <button
                      class="btn btn-primary"
                      :disabled="loading2"
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
          <nuxt />
        </div>
      </template>
    </client-only>
  </div>
</template>

<script>
import Header from '../components/Header'
import SideBarMenu from '../components/SideBarMenu.vue'
if (process.env.CS_ENV !== 'web') {
  // eslint-disable-next-line no-var
  var { remote } = require('electron')
}
const BroadcasterSubscriptionId = 'AppComponent'
const IdleTimeout = 60000 * 10 // 10 minutes

export default {
  components: {
    Header, SideBarMenu
  },
  middleware: ['LoggedIn', 'UserInfo', 'NotHaveAccountService'],
  data () {
    return {
      externalContent: '',
      locked: true,
      invitations: [],
      loading: false,
      loading2: false,
      lastActivity: null,
      idleTimer: null,
      isIdle: false,
      shouldWelcome: 'false',
      emergencyAccessInvitations: []
      // pendingShares: 0
    }
  },
  head () {
    return {
      script: [
        { src: 'https://js.stripe.com/v3/' }
      ]
    }
  },
  computed: {
    manageableTeams () {
      return this.teams.filter(e => ['owner', 'admin'].includes(e.role) && e.is_business)
    }
  },
  watch: {
    '$store.state.userPw' (newValue) {
      if (newValue.is_pwd_manager === false) {
        this.$router.push(this.localeRoute({ name: 'set-master-password' }))
      }
    },
    'locked' (newValue) {
      if (newValue === true) {
        this.$router.push(this.localeRoute({ name: 'lock' }))
        this.disconnectSocket()
      }
      if (newValue === false) {
        this.$store.dispatch('LoadTeams')
        // console.log('unlocked sync')
        this.getSyncData()
        // this.getInvitations()
        this.getEmergencyAccessInvitations()
        this.reconnectSocket()
        this.getShareInvitations()
        this.getMyShares()
        this.$store.dispatch('LoadCurrentPlan')
      }
    }
  },
  created () {
    if (this.$route.query.client === 'browser') {
      this.notify(this.$t('data.notifications.extension_loggedin'), 'success')
    }
  },
  mounted () {
    this.$broadcasterService.subscribe(BroadcasterSubscriptionId, async message => {
      switch (message.command) {
      case 'loggedIn':
        break
      case 'loggedOut':
      case 'unlocked':
        break
      case 'authBlocked':
      case 'logout':
        this.logout()
        break
      case 'lockVault':
        break
      case 'locked':
        this.lock()
        break
      case 'lockedUrl':
      case 'syncStarted':
      case 'syncCompleted':
      case 'upgradeOrganization':
      case 'premiumRequired':
      case 'emailVerificationRequired':
      case 'showToast':
      case 'setFullWidth':
      default:
        break
      }
    })
    this.init()
  },
  asyncComputed: {
    async locked () {
      // console.log('locked status: ', await this.$vaultTimeoutService.isLocked())
      return await this.$vaultTimeoutService.isLocked(this.$store.state.isLoggedInPw)
    }
  },
  beforeDestroy () {
    this.$broadcasterService.unsubscribe(BroadcasterSubscriptionId)
    this.removeEvent()
    this.disconnectSocket()
  },
  methods: {
    openURL (url) {
      if (remote) {
        remote.shell.openExternal(url)
      }
    },
    async getInvitations () {
      this.invitations = await this.$axios.$get('cystack_platform/pm/users/invitations')
    },
    async getShareInvitations () {
      const shareInvitations = await this.$axios.$get('cystack_platform/pm/sharing/invitations') || []
      this.$store.commit('UPDATE_PENDING_SHARES', shareInvitations.filter(item => item.status === 'invited').length)
      // this.pendingShares = shareInvitations.filter(item => item.status === 'invited').length
    },
    async getMyShares () {
      this.$store.dispatch('LoadMyShares')
    },
    async getEmergencyAccessInvitations () {
      this.emergencyAccessInvitations = await this.$axios.$get('cystack_platform/pm/emergency_access/granted')
      this.emergencyAccessInvitations = this.emergencyAccessInvitations.filter(invitations => invitations.status === 'invited')
    },
    async putInvitation (id, status) {
      try {
        this.loading = true
        await this.$axios.$put(`cystack_platform/pm/users/invitations/${id}`, {
          status
        })
        this.notify(this.$t(`data.notifications.${status}_member_success`), 'success')
        this.getInvitations()
      } catch (e) {
        this.notify(this.$t(`data.notifications.${status}_member_failed`), 'warning')
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    async acceptEmergencyAccessInvitation (id) {
      try {
        this.loading2 = true
        await this.$axios.$post(`cystack_platform/pm/emergency_access/${id}/accept`)
        this.getEmergencyAccessInvitations()
        this.notify(this.$t('data.notifications.accept_invitation_success'), 'success')
      } catch (e) {
        this.notify(this.$t('data.notifications.accept_invitation_failed'), 'warning')
      } finally {
        this.loading2 = false
      }
    },
    async deleteEmergencyAccess (emergency_access) {
      this.$confirm(this.$t('data.notifications.delete_emergency_contact'), emergency_access.full_name || this.$t('common.warning'), {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        try {
          this.loading2 = true
          await this.$axios.$delete(`cystack_platform/pm/emergency_access/${emergency_access.id}`)
          this.getEmergencyAccessInvitations()
          this.notify(this.$t('data.notifications.remove_user_success', { user: emergency_access.email }), 'success')
        } catch (e) {
          // this.errors = (e.response && e.response.data && e.response.data.details) || {}
          this.notify(this.$t('data.notifications.remove_user_failed'), 'warning')
        } finally {
          this.loading2 = false
        }
      }).catch(() => {

      })
    },
    async recordActivity () {
      const now = (new Date()).getTime()
      if (this.lastActivity != null && now - this.lastActivity < 250) {
        return
      }

      this.lastActivity = now
      this.$storageService.save('lastActive', now)

      if (this.isIdle) {
        this.isIdle = false
      }

      if (this.idleTimer != null) {
        clearTimeout(this.idleTimer)
        this.idleTimer = null
      }

      this.idleTimer = setTimeout(() => {
        if (!this.isIdle) {
          this.isIdle = true
        }
      }, IdleTimeout)
    },
    noop () {
    },
    idleStateChanged () {
      if (this.isIdle) {
        this.disconnectSocket()
      } else {
        this.reconnectSocket()
      }
    },
    init () {
      window.onmousemove = () => this.recordActivity()
      window.onmousedown = () => this.recordActivity()
      window.ontouchstart = () => this.recordActivity()
      window.onclick = () => this.recordActivity()
      window.onscroll = () => this.recordActivity()
      window.onkeypress = () => this.recordActivity()
      this.shouldWelcome = this.checkWelcome()
    },
    reconnectSocket () {
      const token = this.$cookies.get('cs_locker_token')
      this.$connect(this.sanitizeUrl(`${process.env.wsUrl}/cystack_platform/pm/sync?token=${token}`), {
        format: 'json',
        reconnection: true,
        reconnectionAttempts: 60,
        reconnectionDelay: 3000
      })
      this.$options.sockets.onmessage = message => {
        const data = JSON.parse(message.data)
        switch (data.event) {
        case 'sync':
          // console.log('socket sync')
          this.getSyncData()
          this.getShareInvitations()
          this.getMyShares()
          break
        // case 'members':
        //   this.getInvitations()
        //   break
        case 'emergency_access':
          this.getEmergencyAccessInvitations()
          break
        default:
          break
        }
      }
    },
    disconnectSocket () {
      delete this.$options.sockets.onmessage
      this.$disconnect()
    },
    removeEvent () {
      window.onmousemove = () => this.noop()
      window.onmousedown = () => this.noop()
      window.ontouchstart = () => this.noop()
      window.onclick = () => this.noop()
      window.onscroll = () => this.noop()
      window.onkeypress = () => this.noop()
    },
    checkWelcome () {
      const deviceId = this.$cookies.get('locker_device_id')
      return localStorage.getItem(`${deviceId}_welcome`)
    },
    offWelcome () {
      const deviceId = this.$cookies.get('locker_device_id')
      localStorage.setItem(`${deviceId}_welcome`, 'false')
      this.shouldWelcome = 'false'
    }
  }
}
</script>
