<template>
  <div>
    <!-- Sorry -->
    <div v-if="isInvalid">
      <h1>Sorry no data</h1>
    </div>
    <!-- Sorry end -->

    <!-- Enter email -->
    <div v-else-if="requireOtp">
      <template v-if="!isWaitingOtp">
        <el-input v-model="email" placeholder="Email">
          <el-button
            slot="append"
            :disabled="isLoading"
            :loading="isLoading"
            @click="sendOTP"
          >
            Send OTP
          </el-button>
        </el-input>
      </template>

      <template v-else>
        <el-input v-model="otp" placeholder="OTP">
          <el-button
            slot="append"
            :disabled="isLoading"
            :loading="isLoading"
            @click="submitOTP"
          >
            Get item
          </el-button>
        </el-input>
      </template>

      <p v-if="errorMessage" class="text-danger">
        {{ errorMessage }}
      </p>
    </div>
    <!-- Enter email end -->

    <!-- Cipher detail -->
    <div v-else v-loading="isLoading">
      <DetailQuickSharedCipherContent :cipher-data="send.cipher" />
    </div>
    <!-- Cipher detail end -->
  </div>
</template>
<script>
import { Utils } from '../../../jslib/src/misc/utils'
import { Cipher } from '../../../core/models/domain/cipher'
import DetailQuickSharedCipherContent from '@/components/cipher/shares/DetailQuickSharedCipherContent.vue'

export default {
  components: { DetailQuickSharedCipherContent },

  layout: 'white',

  async asyncData ({ $axios, params }) {
    try {
      const res = await $axios.$get(
        `cystack_platform/pm/quick_shares/${params.id}/access`
      )
      if (res.require_otp) {
        return {
          requireOtp: true
        }
      }
      return {
        send: res
      }
    } catch (e) {
      console.log(e)
      return {
        isInvalid: true
      }
    }
  },

  data () {
    return {
      isLoading: false,
      requireOtp: false,
      isInvalid: false,
      isWaitingOtp: false,
      send: {
        cipher: {},
        key: null
      },
      email: '',
      otp: '',
      errorMessage: ''
    }
  },

  computed: {
    sendId () {
      return this.$route.params.id
    }
  },

  mounted () {
    const key = this.$route.hash ? this.$route.hash.replace('#', '') : null
    if (!this.requireOtp && !this.isInvalid && key) {
      this.decryptCipher(this.send.cipher, key)
    } else {
      this.send.key = key
    }
  },

  methods: {
    async decryptCipher (cipher, key) {
      try {
        this.isLoading = true
        const decKey = await this.$cryptoService.makeSendKey(
          Utils.fromUrlB64ToArray(key)
        )
        const encCipher = new Cipher(cipher)
        const cipherView = await encCipher.decrypt(decKey)
        this.send.cipher = cipherView
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },

    async sendOTP () {
      try {
        this.isLoading = true
        this.errorMessage = ''

        // Check permission first (will not be throttled)
        await this.$axios.$post(
          `cystack_platform/pm/quick_shares/${this.sendId}/access`,
          { email: this.email }
        )

        // Send otp (throttled + captcha)
        await this.$axios.$post(
          `cystack_platform/pm/quick_shares/${this.sendId}/otp`,
          { email: this.email, language: this.locale }
        )
        this.isWaitingOtp = true
      } catch (error) {
        console.log(error)
        this.errorMessage =
          error.response?.data?.message || error.response?.data?.details
      } finally {
        this.isLoading = false
      }
    },

    async submitOTP () {
      try {
        this.isLoading = true
        this.errorMessage = ''
        const res = await this.$axios.$post(
          `cystack_platform/pm/quick_shares/${this.sendId}/public`,
          { email: this.email, code: this.otp }
        )
        this.isWaitingOtp = false
        this.requireOtp = false
        this.decryptCipher(res.cipher, this.send.key)
      } catch (error) {
        console.log(error)
        this.errorMessage =
          error.response?.data?.message || error.response?.data?.details
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
<style scoped></style>
