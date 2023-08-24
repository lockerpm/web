<template>
  <div />
</template>

<script>
import isString from 'lodash/isString'

export default {
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
    updateLoginExtension (response) {
      if (
        response &&
        response.success &&
        this.$route.query.client === 'browser'
      ) {
        this.$store.commit('UPDATE_LOGIN_EXTENSION', true)
      }
    },

    async loginByToken () {
      this.$store.commit('UPDATE_LOADING', true)
      const token =
        this.$route.query.token || this.$cookies.get('cs_locker_token')
      await this.$axios.setToken(token, 'Bearer')
      await this.$cookies.set('cs_locker_token', token, {
        path: '/',
        domain: 'locker.io',
        ...(this.environment === '' ? { secure: true } : { secure: false })
      })
      this.$store.commit('UPDATE_IS_LOGGEDIN', true)
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

      // end sendMessage
      if (
        this.$route.query.return_url &&
        isString(this.$route.query.return_url)
      ) {
        this.$router
          .replace(this.localePath({ path: this.$route.query.return_url }))
          .catch(() => {})
      } else {
        this.$router.replace(this.localePath({ name: 'vault' })).catch(() => {})
      }
      this.$store.commit('UPDATE_LOADING', false)
    }
  }
}
</script>

<style scoped></style>
