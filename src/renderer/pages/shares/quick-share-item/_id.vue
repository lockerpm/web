<template>
  <div class="full-width">
    <!-- Body -->
    <div class="flex flex-row flex-wrap">
      <!-- Left content -->
      <div class="w-full md:w-8/12 max-w-2xl mx-auto px-6 py-6">
        <a @click.prevent="goToLocker">
          <img
            src="~/assets/images/logo/logo_black.svg"
            class="mx-auto h-12 mb-16"
          >
        </a>

        <!-- Sorry -->
        <div v-if="isInvalid">
          <h1 class="font-medium text-center text-[28px] leading-[34px]">
            Sorry, there is no item to view.
          </h1>

          <div
            class="mt-9 rounded-lg border border-black-200 px-8 py-4 mx-auto"
          >
            <p>You may find the reason in one of the following cases:</p>
            <ul class="list-disc ml-6">
              <li>
                The link to view the item expired or reached limited access.
              </li>
              <li>The owner stopped sharing the item.</li>
              <li>The link you've entered is not correct.</li>
            </ul>
          </div>
        </div>
        <!-- Sorry end -->

        <!-- Require email -->
        <div v-else-if="requireOtp">
          <img
            src="~/assets/images/icons/icon_any.svg"
            class="mx-auto h-14 mb-6"
          >
          <h1 class="font-semibold text-[28px] leading-[38px] mb-6 text-center">
            You have been shared sensitive data
          </h1>

          <!-- Enter email -->
          <template v-if="!isWaitingOtp">
            <p class="text-center mb-6">
              You need to verify yourself before viewing the item. Please enter
              your email to receive an OTP code.
            </p>

            <div class="mb-6">
              <el-input
                v-model="email"
                placeholder="Email"
                @keyup.enter.native="sendOTP()"
              />
            </div>

            <p v-if="errorMessage" class="text-danger text-center mb-6">
              {{ errorMessage }}
            </p>

            <el-button
              class="w-full"
              type="primary"
              :disabled="isLoading || !email.trim()"
              :loading="isLoading"
              @click="sendOTP()"
            >
              Send code
            </el-button>
          </template>
          <!-- Enter email end -->

          <!-- Enter OTP -->
          <template v-else>
            <p class="text-center mb-6">Please enter your OTP code.</p>

            <div class="mb-6">
              <el-input
                v-model="otp"
                placeholder="Enter Code"
                @keyup.enter.native="submitOTP()"
              />
            </div>

            <p v-if="errorMessage" class="text-danger text-center mb-6">
              {{ errorMessage }}
            </p>

            <el-button
              class="w-full"
              type="primary"
              :disabled="isLoading || !otp.trim()"
              :loading="isLoading"
              @click="submitOTP()"
            >
              Verify
            </el-button>

            <div class="text-center mt-6">
              <a
                class="text-primary"
                @click.prevent="sendOTP(true)"
              >Resend code</a>
            </div>
          </template>
          <!-- Enter OTP end -->
        </div>
        <!-- Require email end -->

        <!-- Cipher detail -->
        <div v-else v-loading="isLoading">
          <DetailQuickSharedCipherContent :cipher-data="send.cipher" />
        </div>
        <!-- Cipher detail end -->
      </div>
      <!-- Left content end -->

      <!-- Right content -->
      <div class="w-full md:w-4/12 border-l border-black-200 py-6">
        <img
          src="~/assets/images/pages/quick-share-item/intro.png"
          class="w-full"
        >
        <div class="px-6 -translate-y-20">
          <h2
            class="font-semibold text-[24px] leading-[34px] mb-4 text-primary"
          >
            Simple and Quick
          </h2>

          <p class="text-black mb-4">
            Locker Quick Share lets you share sensitive information (including
            passwords, crypto assets,...) with encryption and a link that
            automatically expires. So you can keep what you share private and
            make sure your stuff doesn't stay online forever.
          </p>

          <el-button type="primary" @click="goToLocker">
            Try Locker now!
          </el-button>
        </div>
      </div>
      <!-- Right content end -->
    </div>
    <!-- Body end -->

    <!-- Footer -->
    <div
      class="md:flex md:items-center py-3 landing-font-12 text-black-600 max-w-6xl mx-auto px-6"
    >
      <div class="flex items-center">
        <div v-if="locale === 'vi'">Một sản phẩm của</div>
        <div v-else>A product of</div>
        <a
          :href="
            locale === 'vi' ? 'https://cystack.net/vi' : 'https://cystack.net'
          "
          target="_blank"
        >
          <img
            class="h-4 ml-2 mr-3"
            src="~/assets/images/logo/CyStack.png"
            alt="CyStack"
          >
        </a>
      </div>
      <div class="">
        Copyright © {{ currentYear }} Locker.io · All rights reserved.
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
    <!-- Footer end -->
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
    goToLocker () {
      this.$router.push(this.localeRoute('/'))
    },

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

    async sendOTP (isRetry = false) {
      if (!this.email.trim()) {
        return
      }
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

        if (isRetry) {
          this.notify('Please check your email', 'success')
        }
      } catch (error) {
        console.log(error)
        if (error.response?.status === 400) {
          this.errorMessage =
            "You don't have access to view this item. Please try with another email."
          return
        }
        this.errorMessage =
          error.response?.data?.message || error.response?.data?.detail
      } finally {
        this.isLoading = false
      }
    },

    async submitOTP () {
      if (!this.otp.trim()) {
        return
      }
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
        if (error.response?.status === 400) {
          this.errorMessage = 'OTP wrong. Enter the correct OTP'
          return
        }
        this.errorMessage =
          error.response?.data?.message || error.response?.data?.detail
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
<style scoped></style>
