<template>
  <div class="flex flex-grow flex-col items-center">
    <div class="mt-[5.625rem] mb-5">
      <img src="~assets/images/logo/logo_black.svg" alt="" class="h-[1.875rem]">
    </div>
    <div class="md:w-[410px] md:mx-0 mx-5 border border-black-200 rounded py-[2.8125rem] px-6 text-center">
      <div class="text-head-4 font-semibold mb-2.5">Đăng nhập</div>
      <div class="text-base mb-4">
        Nhập lại mật khẩu tổng cho tài khoản của bạn
      </div>
      <div class="inline-block mb-8 select-none">
        <div class="rounded-[21px] flex items-center bg-black-250 p-1 mx-auto">
          <client-only>
            <img :src="currentUser.avatar" alt="" class="w-[28px] h-[28px] rounded-full mr-2">
          </client-only>
          <div class="mr-2">{{ currentUser.email }}</div>
        </div>
      </div>
      <form @submit.prevent="setMasterPass">
        <div class="form-group !mb-4">
          <input v-model="masterPassword" class="form-control"
                 placeholder="Nhập mật khẩu tổng"
                 :name="randomString()" autocomplete="new-password"
                 :class="[errors ? 'is-invalid' :'']"
                 type="password"
          ></input>
          <div class="invalid-feedback">{{ $t('errors.invalid_password') }}</div>
        </div>
      </form>
      <div class="form-group">
        <div class="grid lg:grid-cols-2 grid-cols-1 gap-2">
          <button class="btn btn-primary w-full" :disabled="loading"
                  @click="setMasterPass"
          >
            Unlock
          </button>
          <button class="btn btn-default w-full" :disabled="loading"
                  @click="logout"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'blank',
  middleware: ['NotHaveAccountService'],
  data () {
    return {
      invalidPinAttempts: 0,
      masterPassword: '12345678',
      loading: false,
      errors: false
    }
  },
  mounted () {
  },
  methods: {
    async setMasterPass () {
      this.loading = true
      this.errors = false
      try {
        await this.login()
      } catch (e) {
        console.log(e)
        this.errors = true
      } finally {
        this.loading = false
      }

      if (this.errors) {
        this.invalidPinAttempts++
        if (this.invalidPinAttempts >= 5) {
          await this.logout()
          this.$messagingService.send('logout')
        }
      }
    }
    // TODO change masterpass if have account
  }
}
</script>
