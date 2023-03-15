<template>
  <div>
    <div class="w-[420px] rounded bg-white m-auto">
      <div class="mt-[120px] mb-[20px]">
        <img class="h-8 mx-auto" src="~/assets/images/logo/locker_logo.png">
      </div>
      <div class="block w-full bg-white border border-[#E3E3E3] rounded dark:bg-gray-800">
        <div class="text-center ">
          <h3 class="text-[24px] mb-[30px] mt-[80px] font-medium">Log in successful</h3>
          <img class="h-[60px] mx-auto" src="~/assets/images/icons/success.svg">
          <div class="inline-block select-none">
            <div class="mt-[40px] mb-[60px] flex items-center rounded-[21px] border border-[#E3E3E3] p-2 justify-center">
              <img :src="user ? user.avatar: ''" class="w-[28px] h-[28px] rounded-full mr-2"/>
              {{ user ? user.email : '' }}
            </div>
          </div>
          <div>Locker desktop app will be opened shortly.</div>
          <div class="text-center mt-[20px] mb-[80px]">
            <a :href="`lockerApp://auth?action=login&status=done&token=${token}&email=${email}&host=${host}&loginType=${loginType}`">Open the app manually</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'authenticate',
  async mounted () {
    this.token = encodeURIComponent(this.$route.query.token)
    this.email = encodeURIComponent(this.$route.query.email)
    this.host = encodeURIComponent(this.$route.query.host)
    this.loginType = encodeURIComponent(this.$route.query.loginType)
    await this.$axios.setToken(this.$route.query.token, 'Bearer')
    this.$axios.$get('me').then(res => {
      this.user = res
    })
  },
  data () {
    return {
      token: null,
      user: null,
      email: null,
      host: null,
      loginType: null
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
