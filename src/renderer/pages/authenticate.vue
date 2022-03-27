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
      this.$store.commit('UPDATE_LOADING', true)
      setTimeout(async () => {
        if (this.$route.query.client === 'browser') {
          window.postMessage({ command: 'locker-authResult', token: this.$route.query.token }, 'https://locker.io')
        }
        await this.$axios.setToken(this.$route.query.token, 'Bearer')
        await this.$cookies.set('cs_locker_token', this.$route.query.token, { path: '/', ...this.environment === '' ? { secure: true } : { secure: false } })
        this.$store.commit('UPDATE_IS_LOGGEDIN', true)
        if (this.$route.query.return_url && isString(this.$route.query.return_url)) {
          this.$router.replace(this.localePath({ path: this.$route.query.return_url, query: { client: this.$route.query.client } }))
        } else {
          this.$router.replace(this.localePath({ name: 'vault', query: { client: this.$route.query.client } }))
        }
        this.$store.commit('UPDATE_LOADING', false)
      }, 300)
    }
  }
}
</script>

<style scoped>

</style>
