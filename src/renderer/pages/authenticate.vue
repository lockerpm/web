<template>
  <BusyOverlay />
</template>

<script>
import isString from 'lodash/isString'
import BusyOverlay from '@/components/BusyOverlay'

export default {
  components: {
    BusyOverlay
  },
  layout: 'authenticate',
  data () {
    return {}
  },
  mounted () {
    // On premise will never go to this page => not on premise
    this.$store.commit('UPDATE_ON_PREMISE_INFO', {})
    this.loginByToken()
  },
  methods: {
    async loginByToken () {
      this.$store.commit('UPDATE_LOADING', true)

      // Set token
      const token =
        this.$route.query.token || this.$cookies.get('cs_locker_token')
      await this.$axios.setToken(token, 'Bearer')
      await this.$cookies.set('cs_locker_token', token, {
        path: '/',
        domain: '.locker.io',
        ...(this.environment === '' ? { secure: true } : { secure: false })
      })
      this.$store.commit('UPDATE_IS_LOGGEDIN', true)

      // Login extension
      if (this.$route.query.client === 'browser' && token.toString()) {
        const extensionToken = token
        window.postMessage(
          {
            command: 'cs-authResult',
            token: extensionToken
          },
          window.location.origin
        )
      }

      // Choose path to redirect
      const BLACK_LIST_URLS = ['/register', '/login']
      const returnUrl = this.$route.query.return_url
      if (
        returnUrl &&
        isString(returnUrl) &&
        !BLACK_LIST_URLS.some(path => returnUrl.includes(path))
      ) {
        this.$router
          .replace(this.localePath({ path: returnUrl }))
          .catch(() => {})
      } else {
        this.$router.replace(this.localePath({ name: 'lock' })).catch(() => {})
      }
      this.$store.commit('UPDATE_LOADING', false)
    }
  }
}
</script>

<style scoped></style>
