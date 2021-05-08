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
  middleware: ['notAuthenticated'],
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
  mounted () {
    this.$store.dispatch('LoadCurrentUser')
    this.$store.dispatch('LoadCurrentUserPw')
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
