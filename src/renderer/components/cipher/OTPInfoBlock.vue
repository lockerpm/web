<template>
  <div class="flex items-center w-full">
    <el-avatar :size="40" :src="getAvatarUrl(name)" shape="square">
      <img :src="require('~/assets/images/icons/icon_Authenticator.svg')">
    </el-avatar>

    <div class="flex flex-1 flex-col overflow-hidden ml-4">
      <!-- Name -->
      <p class="text-black truncate flex items-center">
        <span class="overflow-hidden overflow-ellipsis">{{ name }}</span>
      </p>
      <!-- Name end -->
    </div>

    <div class="mr-3">
      <p class="text-primary font-bold text-[24px]">
        {{ otp }}
      </p>
    </div>

    <div>
      <circular-count-down-timer
        :circles="[
          {
            id: 'main',
            steps: otpData.period,
            size: 24,
            showValue: false,
            stepLength: -1,
            value: start,
            strokeWidth: 3,
            strokeColor: '#268334'
          }
        ]"
        :interval="1000"
        :size="24"
        main-circle-id="main"
        @update="countdown"
      />
    </div>
  </div>
</template>

<script>
import { getTOTP } from '../../utils/totp/index.ts'
import { generateLettersAvatarUrl } from '../../utils/avatar/index.ts'

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
      this.start = val.main
      if (val.main === 0) {
        this.start = this.getRemainingTime(this.otpData.period)
        setTimeout(() => {
          this.otp = getTOTP(this.otpData)
        }, 100)
      }
    },
    getRemainingTime (period = 30) {
      // Better late 1 sec than early
      return period + 1 - (Math.floor(new Date().getTime() / 1000) % period)
    },
    getAvatarUrl (name) {
      if (!name) {
        return ''
      }
      return generateLettersAvatarUrl(name.trim().split(' ')[0])
    }
  }
}
</script>

<style scoped></style>
