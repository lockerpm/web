<template>
  <div />
</template>

<script>
import isString from 'lodash/isString'
export default {
  layout: 'authenticate',
  data () {
    return {
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.loginByToken()
    })
  },
  methods: {
    updateLoginExtension (response) {
      // console.log(response)
      // eslint-disable-next-line no-undef
      if (response && !response.success) { console.log(response) }
      if (response && response.success && this.$route.query.client === 'browser') {
        this.$store.commit('UPDATE_LOGIN_EXTENSION', true)
      }
    },
    loginByToken () {
      this.$store.commit('UPDATE_LOADING', true)
      setTimeout(async () => {
        await this.$axios.setToken(this.$route.query.token, 'Bearer')
        await this.$cookies.set('cs_locker_token', this.$route.query.token, { path: '/', ...this.environment === '' ? { secure: true } : { secure: false } })
        this.$store.commit('UPDATE_IS_LOGGEDIN', true)

        // sendMessage to Locker extension
        const lockerExtensionId = process.env.extensionId
        if (this.$route.query.client === 'browser') {
          // window.postMessage({ command: 'locker-authResult', token: this.$route.query.token }, 'https://locker.io')
          const extensionToken = this.$route.query.token
          try {
            for (const id of lockerExtensionId) {
            // eslint-disable-next-line no-undef
              chrome.runtime.sendMessage(id, { command: 'cs-authResult', token: extensionToken }, response => this.updateLoginExtension(response))
            }
          } catch (error) {

          }
        } else {
          const url = 'https://api.locker.io/v3/sso/access_token'
          this.$axios.post(url, {
            SERVICE_URL: '/sso',
            SERVICE_SCOPE: 'pwdmanager',
            CLIENT: 'browser'
          }).then(async result => {
            const extensionToken = result.data ? result.data.access_token : ''
            try {
              for (const id of lockerExtensionId) {
              // eslint-disable-next-line no-undef
                chrome.runtime.sendMessage(id, { command: 'cs-authResult', token: extensionToken }, response => this.updateLoginExtension(response))
              }
            } catch (error) {

            }
          }).catch(() => {})
        }
        // end sendMessage
        if (this.$route.query.external_url && isString(this.$route.query.external_url)) {
          window.location.replace(this.$route.query.external_url)
        } else if (this.$route.query.return_url && isString(this.$route.query.return_url)) {
          this.$router.replace(this.localePath({ path: this.$route.query.return_url })).catch(() => {})
        } else {
          this.$router.replace(this.localePath({ name: 'vault' })).catch(() => {})
        }
        this.$store.commit('UPDATE_LOADING', false)
      }, 300)
    }
  }
}
</script>

<style scoped>

</style>
