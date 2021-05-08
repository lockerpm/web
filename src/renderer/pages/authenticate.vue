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
    loginByToken () {
      const auth = {
        isLoggedIn: true,
        accessToken: ''
      }
      this.$store.commit('UPDATE_LOADING', true)
      setTimeout(() => {
        this.$axios.setToken(this.$route.query.token, 'Bearer')
        this.$cookies.set('cs_locker_token', this.$route.query.token, { path: '/', ...this.environment === '' ? { secure: true } : { secure: false } })
        this.$store.commit('SET_AUTH', auth) // mutating to store for client rendering
        if (this.$route.query.return_url && isString(this.$route.query.return_url)) {
          this.$router.replace(this.localePath({ path: this.$route.query.return_url }))
        } else {
          this.$router.replace(this.localePath({ name: 'dashboard' }))
        }
        this.$store.commit('UPDATE_LOADING', false)
      }, 300)
    }
  }
}
</script>

<style scoped>

</style>
