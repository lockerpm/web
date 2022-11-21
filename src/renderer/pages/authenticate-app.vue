<template>
  <div>
    <div class="w-[420px] rounded bg-white m-auto">
      <div class="mt-[40px] mb-[60px]">
        <img class="h-8 mx-auto" src="~/assets/images/logo/locker_logo.png">
      </div>
<!--      <div class="text-center mt-[40px] mb-[20px]">-->
<!--        {{ currentUser ? currentUser.email : '' }}-->
<!--      </div>-->
      <div class="text-center ">
        <h3 class="text-[24px] mb-[20px]">Great – you're in!</h3>
        <h5>You've successfully logged in.</h5>
      </div>
      <div class="text-center mt-[50px]">
        <a :href="`lockerApp://auth?action=login&status=done&token=${token}`">Click here to launch the app</a>
      </div>
    </div>
    <footer class="fixed w-full mx-auto bottom-0">
      <div class="max-w-6xl mx-auto px-6">
        <div class="md:flex md:items-center py-3 border-t border-black-200 landing-font-12 text-black-600">
          <div class="flex items-center">
            <div v-if="locale==='vi'">
              Một sản phẩm của
            </div>
            <div v-else>
              A product of
            </div>
            <a :href="locale==='vi'?'https://cystack.net/vi':'https://cystack.net'" target="_blank">
              <img class="h-4 ml-2 mr-3" src="~/assets/images/logo/CyStack.png" alt="CyStack">
            </a>
          </div>
          <div class="">
            Copyright © {{ currentYear }} Locker.io ·  All rights reserved.
          </div>
          <div class="flex-grow md:text-right">
            <nuxt-link
              :to="localePath(`/terms`)"
              class="mr-4 text-black-600 hover:no-underline hover:text-green"
            >
              {{ $t('landing_footer.terms') }}
            </nuxt-link>
            <nuxt-link
              :to="localePath(`/privacy`)"
              class="text-black-600 hover:no-underline hover:text-green"
            >
              {{ $t('landing_footer.policy') }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  layout: 'authenticate',
  mounted () {
    this.token = this.$route.query.token
    // this.$nextTick(() => {
    //   this.loginByToken()
    // })
  },
  data () {
    return {
      token: null
    }
  },
  methods: {
    // async loginByToken () {
    //   await this.$axios.setToken(this.$route.query.token, 'Bearer')
    //   await this.$cookies.set('cs_locker_token', this.$route.query.token, { path: '/', ...this.environment === '' ? { secure: true } : { secure: false } })
    //   const isLoggedIn = this.$store.state.isLoggedIn
    //   if (!isLoggedIn) {
    //     this.$store.commit('UPDATE_IS_LOGGEDIN', true)
    //   }
    //   if (!this.currentUser.email) {
    //     await this.$store.dispatch('LoadCurrentUser')
    //   }
    // }
  }
}
</script>

<style scoped>

</style>
