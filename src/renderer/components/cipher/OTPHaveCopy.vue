<template>
  <div class="grid sm:grid-cols-6 grid-cols-1 cipher-item">
    <p class="!break-normal mr-4">{{ $t('common.totp') }}</p>

    <div class="col-span-4 font-semibold mb-2 sm:mb-0 flex items-center">
      <div class="mr-3">
        <p class="text-primary font-semibold">
          {{ otp | filterPassword(showPassword) }}
        </p>
      </div>

      <div>
        <circular-count-down-timer
          :circles="[
            {
              id: 'main',
              steps: otpData.period,
              size: 16,
              showValue: false,
              stepLength: -1,
              value: start,
              strokeWidth: 2,
              strokeColor: '#268334'
            }
          ]"
          :interval="1000"
          :size="16"
          main-circle-id="main"
          @update="countdown"
        />
      </div>
    </div>

    <div v-if="otp && viewPassword === true" class="text-right">
      <button
        v-if="shouldHide"
        class="btn btn-icon btn-xs btn-action"
        @click="toggleShowPw"
      >
        <i
          class="far"
          :class="{ 'fa-eye': !showPassword, 'fa-eye-slash': showPassword }"
        />
      </button>
      <button
        v-clipboard:copy="otp"
        v-clipboard:success="clipboardSuccessHandler"
        class="btn btn-icon btn-xs btn-action"
      >
        <i class="far fa-copy" />
      </button>
    </div>
  </div>
</template>

<script>
import { getTOTP, parseOTPUri } from '@/utils/totp/index.ts'

export default {
  props: {
    loginTotp: {
      type: String,
      default: ''
    },
    shouldHide: {
      type: Boolean,
      default: false
    },
    viewPassword: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      showPassword: false,
      otp: '',
      start: 0,
      otpData: {}
    }
  },
  watch: {
    shouldHide (val) {
      this.showPassword = !val
    }
  },
  mounted () {
    this.showPassword = !this.shouldHide
    if (this.loginTotp) {
      const otpData = parseOTPUri(this.loginTotp)
      this.start = this.getRemainingTime(otpData.period)
      this.otp = getTOTP(otpData)
      this.otpData = otpData
    }
  },
  methods: {
    toggleShowPw () {
      this.showPassword = !this.showPassword
      this.start = this.getRemainingTime(this.otpData.period)
    },
    getRemainingTime (period = 30) {
      // Better late 1 sec than early
      return period + 1 - (Math.floor(new Date().getTime() / 1000) % period)
    },
    countdown (val) {
      this.start = val.main
      if (val.main === 0) {
        this.start = this.getRemainingTime(this.otpData.period)
        setTimeout(() => {
          this.otp = getTOTP(this.otpData)
        }, 100)
      }
    }
  }
}
</script>
