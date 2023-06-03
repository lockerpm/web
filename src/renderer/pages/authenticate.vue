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

    this.$nextTick(() => {
      this.loginByToken()
    })
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

    loginByToken () {
      this.$store.commit('UPDATE_LOADING', true)
      setTimeout(async () => {
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
        } else {
          const url = `${process.env.baseApiUrl}/sso/access_token`
          this.$axios
            .post(url, {
              SERVICE_URL: '/sso',
              SERVICE_SCOPE: 'pwdmanager',
              CLIENT: 'browser'
            })
            .then(async result => {
              const extensionToken = result.data ? result.data.access_token : ''
              window.postMessage(
                {
                  command: 'cs-authResult',
                  token: extensionToken
                },
                window.location.origin
              )
            })
            .catch(() => {})
        }

        // end sendMessage
        if (
          this.$route.query.external_url &&
          isString(this.$route.query.external_url)
        ) {
          window.location.replace(this.$route.query.external_url)
        } else if (
          this.$route.query.return_url &&
          isString(this.$route.query.return_url)
        ) {
          this.$router
            .replace(this.localePath({ path: this.$route.query.return_url }))
            .catch(() => {})
        } else {
          this.$router
            .replace(this.localePath({ name: 'vault' }))
            .catch(() => {})
        }
        this.$store.commit('UPDATE_LOADING', false)
      }, 300)
    }
  }
}
</script>

<style scoped></style>
