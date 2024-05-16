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
  async mounted () {
    const email = this.$cookies.get('on_premise_email')
    const avatar = this.$cookies.get('on_premise_avatar')
    const baseApi = this.$cookies.get('on_premise_base_url')
    const requirePwl = this.$cookies.get('on_premise_require_pwl')
    const hasPwl = this.$cookies.get('on_premise_has_pwl')

    // Clear cookies (Disable for now)
    // this.clearOnPremiseCookies()

    if (!email || !baseApi) {
      this.$router.push(this.localeRoute({ path: '/' }))
      return
    }

    const isValid = await this.validateOnPremiseBaseApi(baseApi)
    if (isValid) {
      this.loginWithoutToken(email, baseApi, avatar, requirePwl, hasPwl)
    }
  },

  methods: {
    async loginWithoutToken (email, baseApi, avatar, requirePwl, hasPwl) {
      // Set user info
      this.$store.commit('UPDATE_IS_LOGGEDIN', true)
      this.$store.commit('UPDATE_IS_LOGGEDIN_ON_PREMISE', false)
      this.$store.commit('UPDATE_USER', { email, avatar })
      this.$store.commit('UPDATE_USER_PW', {
        is_pwd_manager: true,
        pwd_user_type: 'enterprise'
      })
      this.$store.commit('UPDATE_ON_PREMISE_INFO', {
        baseApi: baseApi + '/v3',
        hasPwl,
        requirePwl
      })

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
    }
  }
}
</script>
