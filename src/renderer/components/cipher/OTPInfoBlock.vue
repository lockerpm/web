<template>
  <div class="flex items-center">
    <div
      class="text-[34px] mr-3 flex-shrink-0"
    >
      <circular-count-down-timer
        :circles="[{
          id: 'main',
          steps: otpData.period,
          size: 34,
          showValue: false,
          stepLength: -1,
          value: start,
          strokeWidth: 5,
          strokeColor: '#268334'
        }]"
        :interval="1000"
        :size="34"
        main-circle-id="main"
        @update="countdown"
      />
    </div>

    <div class="flex flex-col overflow-hidden">
      <!-- Name -->
      <p
        class="text-black font-semibold truncate flex items-center"
      >
        <span class="overflow-hidden overflow-ellipsis">{{ name }}</span>
      </p>
      <!-- Name end -->

      <!-- Subtitle -->
      <div class="overflow-hidden overflow-ellipsis">
        {{ otp }}
      </div>
      <!-- Subtitle end -->
    </div>
  </div>
</template>

<script>
import { getTOTP } from '../../utils/totp/index.ts'

export default {
  props: {
    name: {
      type: String,
      default: () => ''
    },
    otpData: {
      type: Object,
      default: () => ({
        account: undefined,
        secret: undefined,
        algorithm: undefined,
        period: undefined,
        digits: undefined
      })
    }
  },
  data () {
    return {
      otp: '',
      start: 0
    }
  },
  mounted () {
    this.start = this.getRemainingTime(this.otpData.period)
    this.otp = getTOTP(this.otpData)
  },
  methods: {
    countdown (val) {
      if (val.main === 0) {
        this.start = this.otpData.period
        setTimeout(() => {
          this.otp = getTOTP(this.otpData)
        }, 100)
      }
    },
    getRemainingTime (period) {
      // Better late 1 sec than early
      return (period + 1) - Math.floor(new Date().getTime() / 1000) % period
    }
  }
}
</script>

<style scoped>

</style>
