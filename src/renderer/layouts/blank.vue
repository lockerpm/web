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
  mounted () {
    // this.$store.dispatch('LoadCurrentUser')
    // this.$store.dispatch('LoadCurrentUserPw')
    this.setupMomentLocale(this.locale)
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
