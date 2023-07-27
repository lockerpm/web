<template>
  <div class="full-width">
    <!-- Body -->
    <div class="flex flex-row flex-wrap" style="min-height: calc(100vh - 50px)">
      <!-- Left content -->
      <div class="w-full md:w-8/12 xl:w-9/12 max-w-2xl mx-auto px-6 py-6">
        <a @click.prevent="goToLocker">
          <img
            src="~/assets/images/logo/logo_black_with_text.svg"
            class="mx-auto h-12 mb-16"
          >
        </a>

        <!-- Sorry -->
        <div v-if="isInvalid">
          <h1 class="font-medium text-center text-[28px] leading-[34px]">
            {{ $t('data.sharing.quick_share.view_item.no_item.title') }}
          </h1>

          <div
            class="mt-9 rounded-lg border border-black-200 px-8 py-4 mx-auto"
          >
            <p>{{ $t('data.sharing.quick_share.view_item.no_item.desc') }}</p>
            <ul class="list-disc ml-6">
              <li
                v-for="(item, index) in $t(
                  'data.sharing.quick_share.view_item.no_item.reasons'
                )"
                :key="index"
              >
                {{ item }}
              </li>
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
            {{ $t('data.sharing.quick_share.view_item.require_email.title') }}
          </h1>

          <!-- Enter email -->
          <template v-if="!isWaitingOtp">
            <p class="text-center mb-6">
              {{
                $t(
                  'data.sharing.quick_share.view_item.require_email.desc_email'
                )
              }}
            </p>

            <div class="mb-6">
              <el-input
                v-model="email"
                placeholder="Email"
                @keyup.enter.native="submitEmail()"
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
              @click="submitEmail()"
            >
              {{
                $t('data.sharing.quick_share.view_item.require_email.send_code')
              }}
            </el-button>
          </template>
          <!-- Enter email end -->

          <!-- Enter OTP -->
          <template v-else>
            <p class="text-center mb-6">
              {{
                $t('data.sharing.quick_share.view_item.require_email.desc_otp')
              }}
            </p>

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
              {{ $t('common.verify') }}
            </el-button>

            <div class="text-center mt-6">
              <a class="text-primary" @click.prevent="sendOTP(true)">{{
                $t(
                  'data.sharing.quick_share.view_item.require_email.resend_code'
                )
              }}</a>
            </div>
          </template>
          <!-- Enter OTP end -->
        </div>
        <!-- Require email end -->

        <!-- Cipher detail -->
        <div v-else v-loading="isLoading">
          <DetailQuickSharedCipherContent
            is-public
            :cipher-data="send.cipher"
          />
        </div>
        <!-- Cipher detail end -->
      </div>
      <!-- Left content end -->

      <!-- Right content -->
      <div
        class="w-full md:w-4/12 xl:w-3/12 border-t border-b md:border-l md:border-t-0 md:border-b-0 border-black-200 py-6"
      >
        <img
          src="~/assets/images/pages/quick-share-item/intro3.png"
          class="w-full"
        >
        <div class="px-6 -translate-y-20">
          <h2
            class="font-semibold text-[24px] leading-[34px] mb-4 text-primary"
          >
            {{ $t('data.sharing.quick_share.view_item.intro.title') }}
          </h2>

          <p class="text-black mb-4">
            {{ $t('data.sharing.quick_share.view_item.intro.desc') }}
          </p>

          <a
            href="https://id.locker.io/register"
            target="_blank"
            class="btn btn-primary py-4 hover:text-white"
          >
            {{ $t('data.sharing.quick_share.view_item.intro.btn') }}
          </a>
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
      <p class="!break-normal">
        Copyright © {{ currentYear }} Locker.io · All rights reserved.
      </p>
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
import { Utils } from '../../core/misc/utils'
import { Cipher } from '../../core/models/domain/cipher'
import DetailQuickSharedCipherContent from '@/components/cipher/shares/quick-shares/DetailQuickSharedCipherContent.vue'

export default {
  components: { DetailQuickSharedCipherContent },

  layout: 'white',

  data () {
    return {
      isLoading: false,
      requireOtp: false,
      isInvalid: false,
      isWaitingOtp: false,
      send: {
        cipher: {}
      },
      key: '',
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
    this.getCipher()
  },

  methods: {
    goToLocker () {
      this.$router.push(this.localeRoute('/'))
    },

    async getCipher () {
      try {
        this.isLoading = true
        const key = this.$route.hash ? this.$route.hash.replace('#', '') : null
        this.key = key
        if (!key) {
          this.isInvalid = true
          this.isLoading = false
          return
        }

        const res = await this.$axios.$get(
          `cystack_platform/pm/quick_shares/${this.$route.params.id}/access`
        )
        if (res.require_otp) {
          const isSuccess = await this.checkTokensLocal()
          if (!isSuccess) {
            this.requireOtp = true
          }
        } else {
          this.send = res
          this.decryptCipher(res.cipher, key)
        }
        this.isLoading = false
      } catch (e) {
        console.log(e)
        this.isInvalid = true
        this.isLoading = false
      }
    },

    async checkTokensLocal () {
      try {
        for (const key in localStorage) {
          if (key.startsWith('token_')) {
            const email = key.split('token_')[1]
            const token = this.getToken(email)
            if (token) {
              const isSuccess = await this.submitToken(token, email)
              if (isSuccess) {
                return true
              }
            }
          }
        }
      } catch (error) {
        //
      }
      return false
    },

    async submitEmail () {
      if (!this.email.trim()) {
        return
      }
      const token = this.getToken(this.email)
      if (token) {
        const isSuccess = await this.submitToken(token, this.email)
        if (!isSuccess) {
          this.sendOTP()
        }
      } else {
        this.sendOTP()
      }
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
          this.notify(
            this.$t('data.sharing.quick_share.view_item.messages.check_email'),
            'success'
          )
        }
      } catch (error) {
        console.log(error)
        if (error.response?.status === 400) {
          this.errorMessage = this.$t(
            'data.sharing.quick_share.view_item.messages.no_access'
          )
          return
        }
        this.errorMessage =
          error.response?.data?.message || error.response?.data?.detail
      } finally {
        this.isLoading = false
      }
    },

    async submitToken (token, email, keepToken = false) {
      if (!token) {
        return false
      }
      try {
        this.isLoading = true
        this.errorMessage = ''
        const res = await this.$axios.$post(
          `cystack_platform/pm/quick_shares/${this.sendId}/public`,
          { email, token }
        )
        this.isWaitingOtp = false
        this.requireOtp = false
        this.decryptCipher(res.cipher, this.key)
        return true
      } catch (error) {
        if (!keepToken) {
          this.removeToken(email)
        }
        return false
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
        this.decryptCipher(res.cipher, this.key)
        if (res.token) {
          this.storeToken(res.token)
        }
      } catch (error) {
        console.log(error)
        if (error.response?.status === 400) {
          this.errorMessage = this.$t(
            'data.sharing.quick_share.view_item.messages.wrong_otp'
          )
          return
        }
        this.errorMessage =
          error.response?.data?.message || error.response?.data?.detail
      } finally {
        this.isLoading = false
      }
    },

    storeToken (token) {
      localStorage.setItem(`token_${this.email}`, JSON.stringify(token))
    },

    getToken (email) {
      try {
        const token = JSON.parse(localStorage.getItem(`token_${email}`))
        if (token.expiredTime * 1000 < Date.now()) {
          this.removeToken(email)
          return null
        } else {
          return token.value
        }
      } catch (error) {
        this.removeToken(email)
        return null
      }
    },

    removeToken (email) {
      localStorage.removeItem(`token_${email}`)
    }
  }
}
</script>
<style scoped></style>
