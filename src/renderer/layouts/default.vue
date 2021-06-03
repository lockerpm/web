<template>
  <div class="flex flex-col sm:flex-row flex-1">
    <client-only>
      <template v-if="!locked">
        <div class="w-60 h-screen bg-aside relative min-h-500px min-w-60 fixed border-0 border-b border-black-200 flex flex-col justify-between">
          <div>
            <div class="mt-10 px-8">
              <img class="h-6" src="~assets/images/logo/logo_white.svg">
            </div>
            <nav class="mt-10">
              <nuxt-link v-for="(item, index) in menu" :key="index" :to="localePath({name: item.routeName})"
                         class="flex items-center py-2 px-6 hover:text-white hover:bg-white hover:bg-opacity-20 text-black-400 font-semibold "
                         active-class="bg-white bg-opacity-20 text-white"
              >
                <div class="mr-2 w-[22px] h-[22px] flex items-center">
                  <img :src="require(`~/assets/images/icons/${item.icon}.svg`)" alt="">
                </div>
                <span class="text-sm font-medium">{{ $t(`sidebar.${item.label}`) }}</span>
              </nuxt-link>
            </nav>
          </div>
          <div>
            <nav class="mb-10">
              <nuxt-link v-for="(item, index) in bottomMenu" :key="index"
                         :to="localePath({name: item.routeName, params: item.params})"
                         class="flex items-center py-2 px-6 hover:text-white hover:bg-white hover:bg-opacity-20 text-black-400 font-semibold "
                         active-class="bg-white bg-opacity-20 text-white"
              >
                <div class="mr-2 w-[22px] h-[22px] flex items-center">
                  <img :src="require(`~/assets/images/icons/${item.icon}.svg`)" alt="">
                </div>
                <span class="text-sm font-medium">{{ $t(`sidebar.${item.label}`) }}</span>
              </nuxt-link>
            </nav>
          </div>
        </div>
        <div class="pl-60 flex flex-col flex-row-fluid">
          <Header />
          <div v-if="shouldWelcome !=='false'" class="flex-column-fluid lg:px-28 py-10 px-10">
            <div class="border border-black-200 rounded p-5 md:p-8 relative">
              <div class="flex items-center justify-between">
                <div class="">
                  <div class="text-lg font-semibold mb-2">
                    Chào mừng bạn đến với CyStack Manager
                  </div>
                  <div class="text-black-600 mb-5">
                    Bạn có thể lưu trữ mật khẩu, ghi chú, hồ sơ để mua sắm trực tuyến và thậm chí cả tài liệu một cách an toàn.
                    <br>
                    Và bất kể bạn làm việc ở đâu, kho tiền của bạn luôn đồng bộ hóa mọi thứ, vì vậy bạn có thể luôn ngăn nắp và tiết kiệm thời gian.
                  </div>
                </div>
                <div>
                  <img src="~/assets/images/icons/welcome.svg" alt="">
                </div>
                <button class="btn btn-clean absolute top-2 -right-2"
                        @click="offWelcome"
                >
                  <i class="el-icon-close text-lg" />
                </button>
              </div>
            </div>
          </div>
          <div v-if="invitations.length" class="flex-column-fluid lg:px-28 py-10 px-10">
            <div v-for="invitation in invitations.slice(0, 1)"
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
                    <button class="btn btn-default"
                            :disabled="loading"
                            @click="putInvitation(invitation.id, 'reject')"
                    >
                      Từ chối
                    </button>
                    <button class="btn btn-primary"
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
          <nuxt />
        </div>
      </template>
    </client-only>
  </div>
</template>

<script>
import Header from '../components/Header'
if (process.env.CS_ENV !== 'web') {
  // eslint-disable-next-line no-var
  var { remote } = require('electron')
}
const BroadcasterSubscriptionId = 'AppComponent'
const IdleTimeout = 60000 * 10 // 10 minutes

export default {
  components: {
    Header
  },
  middleware: ['LoggedIn', 'UserInfo', 'NotHaveAccountService'],
  data () {
    return {
      externalContent: '',
      menu: [
        {
          label: 'all',
          routeName: 'vault',
          icon: 'all'
        },
        {
          label: 'passwords',
          routeName: 'passwords',
          icon: 'passwords'
        },
        {
          label: 'notes',
          routeName: 'notes',
          icon: 'notes'
        },
        {
          label: 'cards',
          routeName: 'cards',
          icon: 'cards'
        },
        {
          label: 'identities',
          routeName: 'identities',
          icon: 'identities'
        },
        {
          label: 'shares',
          routeName: 'shares',
          icon: 'shares'
        },
        {
          label: 'trash',
          routeName: 'trash',
          icon: 'trash'
        }
      ],
      locked: true,
      invitations: [],
      loading: false,
      lastActivity: null,
      idleTimer: null,
      isIdle: false,
      shouldWelcome: 'false'
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
      return this.teams.filter(e => ['owner', 'admin'].includes(e.role))
    },
    bottomMenu () {
      return [
        // {
        //   label: 'upgrade',
        //   routeName: 'upgrade',
        //   icon: 'upgrade'
        // },
        ...this.manageableTeams && this.manageableTeams.length
          ? [{
            label: 'dashboard',
            routeName: 'admin-teamId',
            icon: 'dashboard',
            params: { teamId: this.manageableTeams[0].id }
          }]
          : [],
        {
          label: 'settings',
          routeName: 'settings',
          icon: 'settings'
        },
        {
          label: 'tools',
          routeName: 'tools',
          icon: 'tools'
        }
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
        this.$router.push(this.localeRoute({ name: 'lock' }))
        this.disconnectSocket()
      }
      if (newValue === false) {
        this.$store.dispatch('LoadTeams')
        this.getSyncData()
        this.getInvitations()
        this.reconnectSocket()
      }
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
    async putInvitation (id, status) {
      try {
        this.loading = true
        await this.$axios.$put(`cystack_platform/pm/users/invitations/${id}`, {
          status
        })
        this.notify(this.$t(`data.notifications.${status}_member_success)`), 'success')
        this.getInvitations()
      } catch (e) {
        this.notify(this.$t(`data.notifications.${status}_member_failed)`), 'warning')
        console.log(e)
      } finally {
        this.loading = false
      }
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
          this.getSyncData()
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
      const deviceId = this.$cookies.get('device_id')
      return localStorage.getItem(`${deviceId}_welcome`)
    },
    offWelcome () {
      const deviceId = this.$cookies.get('device_id')
      localStorage.setItem(`${deviceId}_welcome`, 'false')
      this.shouldWelcome = 'false'
    }
  }
}
</script>
