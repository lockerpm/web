<template>
  <div class="flex flex-grow flex-col">
    <nuxt />
  </div>
</template>

<script>
if (process.env.CS_ENV !== 'web') {
  // eslint-disable-next-line no-var
  var { remote } = require('electron')
}

export default {
  components: {
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
