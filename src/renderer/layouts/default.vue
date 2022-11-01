<template>
  <div class="flex flex-col sm:flex-row flex-1 relative">
    <client-only>
      <template v-if="!locked">
        <!-- Sidebar -->
        <div class="hidden md:block">
          <SideBarMenu :closable="false" :pending-shares="pendingShares" />
        </div>
        <!-- Sidebar end -->

        <div class="md:pl-60 flex flex-col flex-row-fluid">
          <Header />

          <!-- Welcome banner -->
          <WelcomeBanner />
          <!-- Welcome banner end -->

          <!-- Enterprise invitations -->
          <EnterpriseInvitations />
          <!-- Enterprise invitations end -->

          <!-- Emergency access invitations -->
          <EmergencyAccessInvitations ref="emergencyAccessInvitations" />
          <!-- Emergency access invitations end -->

          <nuxt />
        </div>
      </template>

      <LockedUntilPay />

      <WelcomeToBusiness />
    </client-only>
  </div>
</template>

<script>
import Header from '../components/Header'
import SideBarMenu from '../components/SideBarMenu.vue'
import WelcomeBanner from '../components/notice/WelcomeBanner'
import EnterpriseInvitations from '../components/notice/EnterpriseInvitations'
import EmergencyAccessInvitations from '../components/notice/EmergencyAccessInvitations'
import LockedUntilPay from '../components/notice/LockedUntilPay'
import WelcomeToBusiness from '../components/notice/WelcomeToBusiness'

if (process.env.CS_ENV !== 'web') {
  // eslint-disable-next-line no-var
  var { remote } = require('electron')
}
const BroadcasterSubscriptionId = 'AppComponent'
const IdleTimeout = 60000 * 10 // 10 minutes

export default {
  components: {
    LockedUntilPay,
    WelcomeBanner,
    EnterpriseInvitations,
    EmergencyAccessInvitations,
    WelcomeToBusiness,
    Header,
    SideBarMenu
  },
  middleware: ['LoggedIn', 'UserInfo', 'NotHaveAccountService', 'blockBySource'],
  data () {
    return {
      locked: true,
      lastActivity: null,
      idleTimer: null,
      isIdle: false
    }
  },
  head () {
    return {
      script: [
        { src: 'https://js.stripe.com/v3/' }
      ]
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
        clearInterval(this.intervalGet)
        this.$router.push(this.localeRoute({ name: 'lock' }))
        this.disconnectSocket()
      }
      if (newValue === false) {
        this.$store.dispatch('LoadNotification')
        this.$store.dispatch('LoadTeams')
        this.getSyncData()
        this.$refs.emergencyAccessInvitations.getEmergencyAccessInvitations()
        this.reconnectSocket()
        this.getShareInvitations()
        this.getMyShares()
        this.$store.dispatch('LoadCurrentPlan')
        this.intervalGet = setInterval(() => {
          this.$store.dispatch('LoadNotification')
        }, 1000 * 30)
      }
    }
  },
  created () {
    if (this.$route.query.client === 'browser') {
      this.notify(this.$t('data.notifications.extension_loggedin'), 'success')
    }
  },
  mounted () {
    this.$store.dispatch('LoadEnterpriseInvitations')
    this.$broadcasterService.subscribe(BroadcasterSubscriptionId, async message => {
      switch (message.command) {
      case 'loggedIn':
        break
      case 'loggedOut':
      case 'unlocked':
        break
      case 'authBlocked':
      case 'logout':
        clearInterval(this.intervalGet)
        this.logout()
        break
      case 'lockVault':
        break
      case 'locked':
        clearInterval(this.intervalGet)
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
      return await this.$vaultTimeoutService.isLocked(this.$store.state.isLoggedInPw)
    }
  },
  beforeDestroy () {
    this.$broadcasterService.unsubscribe(BroadcasterSubscriptionId)
    this.removeEvent()
    this.disconnectSocket()
    clearInterval(this.intervalGet)
  },
  methods: {
    async getShareInvitations () {
      const shareInvitations = await this.$axios.$get('cystack_platform/pm/sharing/invitations') || []
      this.$store.commit('UPDATE_PENDING_SHARES', shareInvitations.filter(item => item.status === 'invited').length)
      // this.pendingShares = shareInvitations.filter(item => item.status === 'invited').length
    },
    async getMyShares () {
      this.$store.dispatch('LoadMyShares')
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
    init () {
      window.onmousemove = () => this.recordActivity()
      window.onmousedown = () => this.recordActivity()
      window.ontouchstart = () => this.recordActivity()
      window.onclick = () => this.recordActivity()
      window.onscroll = () => this.recordActivity()
      window.onkeypress = () => this.recordActivity()
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
          this.getSyncData()
          this.getShareInvitations()
          this.getMyShares()
          break
        case 'emergency_access':
          this.$refs.emergencyAccessInvitations.getEmergencyAccessInvitations()
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
    }
  }
}
</script>
