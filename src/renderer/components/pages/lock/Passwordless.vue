<template>
  <div
    class="sm:w-[480px] md:mx-0 mx-5 border border-black-200 rounded py-[2.8125rem] px-6 text-center"
  >
    <!-- Title + info -->
    <div>
      <div class="text-head-4 font-semibold mb-2.5">
        {{ $t('lock.pwl.title') }}
      </div>

      <div class="mb-8 select-none flex items-center justify-center">
        <div class="rounded-[21px] flex items-center bg-black-250 p-1 mr-2">
          <client-only>
            <img
              :src="currentUser.avatar"
              alt=""
              class="w-[28px] h-[28px] rounded-full mr-2"
            >
          </client-only>
          <div class="mr-2">{{ currentUser.email }}</div>
        </div>
        <a @click.prevent="logout">{{ $t('common.logout') }}</a>
      </div>

      <div v-if="!pwlOtp" class="text-base mb-4">
        {{ $t('lock.pwl.pls_login_desktop') }}
      </div>
    </div>
    <!-- Title + info end -->

    <!-- 2FA form -->
    <TwoFactor
      v-if="factor2"
      :crypto-key="cryptoKey"
      :hashed-pw="hashedPw"
      :user="currentUser"
      :loading="loading"
      :methods="factor2Methods"
      :master-pw="masterPassword"
      @goBack="factor2 = false"
    />
    <!-- 2FA form end -->

    <!-- Enter master pw and buttons -->
    <template v-else>
      <div v-if="pwlOtp">
        <p class="text-base">{{ $t('lock.pwl.pls_enter_otp') }}</p>

        <div class="grid grid-cols-6 gap-3 max-w-[300px] mx-auto mt-6">
          <div
            v-for="(item, index) in pwlOtp"
            :key="index"
            class="border-b-2 border-black-200 pb-2"
          >
            <p class="font-semibold text-[24px] leading-[31px]">
              {{ item }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="loading">
        <i class="el-icon-loading text-[24px] text-primary mt-8" />
      </div>

      <div v-else class="flex flex-wrap justify-center mt-10">
        <a href="/download" target="_blank">{{
          $t('lock.pwl.download_app')
        }}</a>
        <p class="mx-2">{{ $t('common.or') }}</p>
        <a @click.prevent="requestPwlVerification">{{
          $t('lock.pwl.try_again')
        }}</a>
      </div>
    </template>
    <!-- Enter master pw and buttons end -->
  </div>
</template>
<script>
import TwoFactor from './TwoFactor'

export default {
  components: { TwoFactor },

  data () {
    return {
      loading: false,
      errors: false,
      invalidPinAttempts: 0,

      // PWL
      isDesktopSocketReady: false,
      isDesktopSocketError: false,
      encPwlData: null,
      pwlOtp: '',

      // 2FA
      factor2: false,
      factor2Methods: [],
      cryptoKey: null,
      hashedPw: null
    }
  },

  mounted () {
    this.requestPwlVerification()
  },

  methods: {
    // Request desktop verification
    requestPwlVerification () {
      this.loading = true
      this.pwlOtp = ''
      if (this.isDesktopSocketReady) {
        this.sendDesktopSocketConnectionMessage(this.currentUser.email)
      } else {
        this.clearDesktopSocketHandlers()
        this.reconnectDesktopSocket({
          onEncryptedDataReceived: data => {
            this.encPwlData = data
            this.handlePwlOTP()
          },
          onOTPReceived: otp => {
            this.pwlOtp = otp.toString()
            this.loading = false
          },
          onDesktopRejected: () => {
            this.loading = false
            this.notify(this.$t('lock.pwl.errors.rejected'), 'error')
          },
          onSocketError: () => {
            this.isDesktopSocketError = true
            this.notify(this.$t('lock.pwl.errors.cannot_connect'), 'error')
          },
          onSocketClosed: () => {
            this.isDesktopSocketReady = false
            this.loading = false
          },
          onSocketOpen: () => {
            this.isDesktopSocketReady = true
            this.isDesktopSocketError = false
          }
        })
        setTimeout(() => {
          this.sendDesktopSocketConnectionMessage(this.currentUser.email)
        }, 500)
      }
    },

    // Handle pwl login
    async handlePwlOTP () {
      if (!this.pwlOtp || !this.encPwlData) {
        return
      }
      this.loading = true
      this.errors = false
      try {
        const decryptedData = await this.$cryptoService.decryptData(
          this.pwlOtp,
          this.encPwlData
        )
        const res = await this.login({
          key: decryptedData.key,
          hashedPassword: decryptedData.keyHash
        })
        if (res?.is_factor2) {
          this.handle2FARequirement(res.methods, res.key, decryptedData.keyHash)
        }
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
    },

    handle2FARequirement (methods, key, keyHash) {
      this.factor2 = true
      this.factor2Methods = methods
      this.cryptoKey = key
      this.hashedPw = keyHash
    }
  }
}
</script>
