<template>
  <div class="flex flex-col sm:flex-row">
    <client-only>
      <template v-if="!locked">
        <div class="w-60 h-screen bg-aside relative min-h-500px min-w-60 fixed">
          <div class="mt-10 px-8">
            <img class="h-6" src="~assets/images/logo/logo_white.svg">
          </div>

          <nav class="mt-10">
            <nuxt-link v-for="(item, index) in menu" :key="index" :to="localePath({name: item.routeName})"
                       class="flex items-center py-2 px-6 hover:text-white hover:bg-white hover:bg-opacity-20 text-black-400 font-semibold "
                       active-class="bg-white bg-opacity-20 text-white"
                       exact
            >
              <img :src="require(`~/assets/images/icons/${item.icon}.svg`)" alt="" class="mr-2">

              <span class="text-sm font-medium">{{ $t(`sidebar.${item.label}`) }}</span>
            </nuxt-link>
          </nav>

          <div class="absolute bottom-0 my-10">
            <a class="flex items-center py-2 px-8 text-black-400 hover:text-white" href="#">
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM10 7C9.63113 7 9.3076 7.19922 9.13318 7.50073C8.85664 7.97879 8.24491 8.14215 7.76685 7.86561C7.28879 7.58906 7.12543 6.97733 7.40197 6.49927C7.91918 5.60518 8.88833 5 10 5C11.6569 5 13 6.34315 13 8C13 9.30622 12.1652 10.4175 11 10.8293V11C11 11.5523 10.5523 12 10 12C9.44773 12 9.00001 11.5523 9.00001 11V10C9.00001 9.44772 9.44773 9 10 9C10.5523 9 11 8.55228 11 8C11 7.44772 10.5523 7 10 7ZM10 15C10.5523 15 11 14.5523 11 14C11 13.4477 10.5523 13 10 13C9.44772 13 9 13.4477 9 14C9 14.5523 9.44772 15 10 15Z" fill="currentColor" />
              </svg>

              <span class="mx-4 font-medium">Support</span>
            </a>
          </div>
        </div>
        <div class="flex-1 pl-60">
          isLocked: {{ locked }}
          <nuxt />
        </div>
      </template>
    </client-only>
  </div>
</template>

<script>
if (process.env.CS_ENV !== 'web') {
  // eslint-disable-next-line no-var
  var { remote } = require('electron')
}
const BroadcasterSubscriptionId = 'AppComponent'

export default {
  components: {
  },
  middleware: ['LoggedIn', 'NotHaveAccountService'],
  data () {
    return {
      externalContent: '',
      menu: [
        {
          label: 'all',
          routeName: 'dashboard',
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
          label: 'profile',
          routeName: 'profile',
          icon: 'profile'
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
      }
      if (newValue === false) {
        this.getSyncData()
      }
    }
  },
  mounted () {
    this.$store.dispatch('LoadCurrentUser')
    this.$store.dispatch('LoadCurrentUserPw')
  },
  asyncComputed: {
    async locked () {
      return await this.$vaultTimeoutService.isLocked(this.$store.state.isLoggedInPw)
    }
  },
  beforeDestroy () {
    this.$broadcasterService.unsubscribe(BroadcasterSubscriptionId)
  },
  methods: {
    openURL (url) {
      if (remote) {
        remote.shell.openExternal(url)
      }
    },
    async getSyncData () {
      try {
        this.$messagingService.send('syncStarted')
        const res = await this.$axios.$get('cystack_platform/pm/sync')
        const userId = await this.$userService.getUserId()
        await this.$syncService.syncProfile(res.profile)
        await this.$syncService.syncFolders(userId, res.folders)
        await this.$syncService.syncCollections(res.collections)
        await this.$syncService.syncCiphers(userId, res.ciphers)
        await this.$syncService.syncSends(userId, res.sends)
        await this.$syncService.syncSettings(userId, res.domains)
        await this.$syncService.syncPolicies(res.policies)
        await this.$syncService.setLastSync(new Date())
        this.$messagingService.send('syncCompleted', { successfully: true })
        this.$store.commit('UPDATE_SYNCED_CIPHERS', true)
      } catch (e) {
        this.$messagingService.send('syncCompleted', { successfully: false })
        this.$store.commit('UPDATE_SYNCED_CIPHERS', false)
      }
    }
  }
}
</script>
