<template>
  <div>
    <PaymentFailedWarning />
    <TrialAboutToExpireWarning />

    <div class="flex flex-col sm:flex-row flex-1 relative">
      <client-only>
        <template v-if="!locked">
          <!-- Sidebar -->
          <div class="hidden md:block">
            <SideBarMenu :closable="false" />
          </div>
          <!-- Sidebar end -->

          <div class="md:pl-60 flex flex-col flex-row-fluid">
            <Header />

            <Tutorial />

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

            <!-- Bottom banner -->
            <BottomBanner />
            <!-- Bottom banner end -->
          </div>
        </template>

        <BusyOverlay v-else />

        <LockedUntilPay />

        <PremiumDialog />

        <WelcomeToBusiness />
      </client-only>
    </div>
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
import Tutorial from '../components/notice/Tutorial'
import PaymentFailedWarning from '../components/notice/PaymentFailedWarning'
import TrialAboutToExpireWarning from '../components/notice/TrialAboutToExpireWarning'
import PremiumDialog from '../components/upgrade/PremiumDialog.vue'
import BottomBanner from '../components/landing/BottomBanner.vue'
import BusyOverlay from '@/components/BusyOverlay'

if (process.env.CS_ENV !== 'web') {
  // eslint-disable-next-line no-var, @typescript-eslint/no-unused-vars
  var { remote } = require('electron')
}
const BroadcasterSubscriptionId = 'AppComponent'
const IdleTimeout = 60000 * 10 // 10 minutes

export default {
  components: {
    Tutorial,
    PaymentFailedWarning,
    TrialAboutToExpireWarning,
    LockedUntilPay,
    WelcomeBanner,
    EnterpriseInvitations,
    EmergencyAccessInvitations,
    WelcomeToBusiness,
    PremiumDialog,
    Header,
    SideBarMenu,
    BottomBanner,
    BusyOverlay
  },

  middleware: [
    'LoggedIn',
    'UserInfo',
    'NotHaveAccountService',
    'blockBySource'
  ],

  data () {
    return {
      locked: true,
      lastActivity: null,
      idleTimer: null,
      isIdle: false,

      // Used when socket is dead
      lastSync: null,
      checkSyncInterval: null
    }
  },

  head () {
    return {
      script: [{ src: 'https://js.stripe.com/v3/' }]
    }
  },

  watch: {
    '$store.state.userPw' (newValue) {
      if (newValue.is_pwd_manager === false) {
        this.$router.push(this.localeRoute({ name: 'set-master-password' }))
      }
    },

    locked (newValue) {
      const userChatwoot = this.$store.state.userChatwoot
      if (userChatwoot.user_hash) {
        window.$chatwoot?.setUser(userChatwoot.email, {
          name: userChatwoot.name,
          email: userChatwoot.email,
          identifier_hash: userChatwoot.user_hash
        })
        window.$chatwoot?.setLocale(userChatwoot.language_override)
      }
      if (newValue === true) {
        clearInterval(this.intervalGet)
        this.$router.push(this.localeRoute({ name: 'lock' }))
        this.disconnectSocket()
      }
      if (newValue === false) {
        this.$store.dispatch('LoadNotification')
        this.$store.dispatch('LoadTeams')
        this.getSyncData()
        this.syncQuickShares()
        this.$refs.emergencyAccessInvitations?.getEmergencyAccessInvitations()
        this.reconnectSocket()
        this.getShareInvitations()
        this.getMyShares()
        this.getItemsCount()
        this.$store.dispatch('LoadCurrentPlan')
        this.intervalGet = setInterval(() => {
          this.$store.dispatch('LoadNotification')
        }, 1000 * 30)
        this.checkOnboardingProgress()
      }
    }
  },

  created () {
    if (this.$route.query.client === 'browser') {
      this.notify(this.$t('data.notifications.extension_loggedin'), 'success')
    }
  },

  mounted () {
    this.lastSync = Date.now()
    this.setupMomentLocale(this.locale)
    this.$store.dispatch('LoadEnterpriseInvitations')
    this.$broadcasterService.subscribe(
      BroadcasterSubscriptionId,
      async message => {
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
      }
    )
    this.init()
  },

  asyncComputed: {
    async locked () {
      return await this.$vaultTimeoutService.isLocked()
    }
  },

  beforeDestroy () {
    this.$broadcasterService.unsubscribe(BroadcasterSubscriptionId)
    this.removeEvent()
    this.disconnectSocket()
    clearInterval(this.intervalGet)
    if (this.checkSyncInterval) {
      console.log('stop polling')
      clearInterval(this.checkSyncInterval)
      this.checkSyncInterval = null
    }
  },

  methods: {
    async getShareInvitations () {
      this.$store.dispatch('LoadMyShareInvitations')
    },

    async getMyShares () {
      this.$store.dispatch('LoadMyShares')
    },

    async getItemsCount () {
      this.$store.dispatch('LoadItemsCount')
    },

    async recordActivity () {
      const now = new Date().getTime()
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

    noop () {},

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
      const _sanitizeUrl = connectionUrl => {
        if (connectionUrl.startsWith('//')) {
          const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws'
          connectionUrl = `${scheme}:${connectionUrl}`
        }

        return connectionUrl
      }
      const socketUrl = this.isOnPremise
        ? this.$store.state.onPremiseBaseApi
          .replace('http', 'ws')
          .replace('/v3', '/ws')
        : process.env.wsUrl
      this.$connect(
        _sanitizeUrl(`${socketUrl}/cystack_platform/pm/sync?token=${token}`),
        {
          format: 'json',
          reconnection: true,
          reconnectionAttempts: 60,
          reconnectionDelay: 3000
        }
      )
      this.$options.sockets.onmessage = message => {
        const data = JSON.parse(message.data)
        switch (data.event) {
        case 'sync': {
          switch (data.type) {
          case 'cipher_update':
            this.syncSingleCipher(data.data.id)
            break
          case 'folder_update':
            this.syncSingleFolder(data.data.id)
            break
          case 'collection_update':
            this.syncSingleCollection(data.data.id)
            break
          case 'enterprise_policy_update':
            this.loadEnterprisePolicies()
            break
          default:
            this.getSyncData()
            this.getShareInvitations()
          }
          this.getMyShares()
          this.getItemsCount()
          break
        }
        case 'emergency_access':
          this.$refs.emergencyAccessInvitations?.getEmergencyAccessInvitations()
          break
        case 'quick_share':
          switch (data.type) {
          case 'quick_share':
            this.syncSingleQuickShare(data.data.id)
            break
          default:
            this.syncQuickShares()
          }
          break
        case 'members':
          this.getMyShares()
          this.getShareInvitations()
          break
        default:
          break
        }
      }
      this.$options.sockets.onerror = e => {
        console.log('socket error', e)
        if (!this.checkSyncInterval) {
          console.log('start polling...')
          this.checkSyncInterval = setInterval(async () => {
            const lastUpdate = await this.getLastUpdate()
            const bumpTimestamp =
              (lastUpdate - new Date().getTimezoneOffset() * 60) * 1000
            if (bumpTimestamp > this.lastSync) {
              this.lastSync = bumpTimestamp
              this.getSyncData()
              this.getShareInvitations()
              this.getMyShares()
              this.getItemsCount()
            }
          }, 5000)
        }
      }
      this.$options.sockets.onclose = e => {
        console.log('socket closed', e)
      }
      this.$options.sockets.onopen = () => {
        console.log('socket open')
        if (this.checkSyncInterval) {
          console.log('stop polling')
          clearInterval(this.checkSyncInterval)
          this.checkSyncInterval = null
        }
      }
    },

    disconnectSocket () {
      delete this.$options.sockets.onmessage
      delete this.$options.sockets.onerror
      delete this.$options.sockets.onclose
      delete this.$options.sockets.onopen
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

    async getLastUpdate () {
      try {
        const res = await this.$axios.$get(
          '/cystack_platform/pm/users/me/revision_date'
        )
        return res.revision_date
      } catch (error) {
        return 0
      }
    }
  }
}
</script>
