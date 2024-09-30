<template>
  <div class="flex flex-grow flex-col">
    <nuxt />
    <LockedUntilPay />
  </div>
</template>

<script>
import LockedUntilPay from '../components/notice/LockedUntilPay'

if (process.env.CS_ENV !== 'web') {
  // eslint-disable-next-line no-var
  var { remote } = require('electron')
}

export default {
  components: {
    LockedUntilPay
  },
  middleware: ['LoggedIn', 'UserInfo'],
  data () {
    return {
      externalContent: ''
    }
  },
  head () {
    return {
      link: [{ rel: 'canonical', href: `https://locker.io${this.$route.path}` }]
    }
  },
  async mounted () {
    if (this.$store.state.isLoggedIn) {
      await this.$store.dispatch('LoadCurrentUser')
    }

    // Set lang based on user language
    if (this.currentUser?.language && this.currentUser.language !== this.locale) {
      const value = this.currentUser.language
      this.$i18n.setLocale(value)
      this.setupMomentLocale(value)
      this.postIframeMessage('changeLang', value)
      window.$chatwoot?.setLocale(value)
    } else {
      this.setupMomentLocale(this.locale)
    }
  },
  methods: {
    openURL (url) {
      if (remote) {
        remote.shell.openExternal(url)
      }
    }
  }
}
</script>
