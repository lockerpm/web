<template>
  <div v-loading="true" style="height: 100vh; width: 100vw" />
</template>
<script>
import isString from 'lodash/isString'

export default {
  layout: 'authenticate',

  async mounted () {
    const email = this.$cookies.get('on_premise_email')
    const avatar = this.$cookies.get('on_premise_avatar')
    const baseApi = this.$cookies.get('on_premise_base_url')

    // Clear cookies (Disable for now)
    // const baseCookiesDomain = process.env.lockerCookieDomain
    // this.$cookies.remove('on_premise_email', {
    //   domain: baseCookiesDomain,
    //   path: '/'
    // })
    // this.$cookies.remove('on_premise_avatar', {
    //   domain: baseCookiesDomain,
    //   path: '/'
    // })
    // this.$cookies.remove('on_premise_base_url', {
    //   domain: baseCookiesDomain,
    //   path: '/'
    // })

    if (!email || !baseApi) {
      this.$router.push('/')
      return
    }

    const isValid = await this.validateOnPremiseBaseApi(baseApi)
    if (isValid) {
      this.loginWithoutToken(email, baseApi, avatar)
    }
  },

  methods: {
    async loginWithoutToken (email, baseApi, avatar) {
      this.$store.commit('UPDATE_IS_LOGGEDIN', true)
      this.$store.commit('UPDATE_IS_LOGGEDIN_ON_PREMISE', false)
      this.$store.commit('UPDATE_USER', { email, avatar })
      this.$store.commit('UPDATE_USER_PW', {
        is_pwd_manager: true,
        pwd_user_type: 'enterprise'
      })
      this.$store.commit('UPDATE_ON_PREMISE_INFO', baseApi + '/v3')

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
        this.$router.replace(this.localePath({ name: 'vault' })).catch(() => {})
      }
    }
  }
}
</script>
