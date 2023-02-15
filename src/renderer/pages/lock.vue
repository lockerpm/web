<template>
  <div class="flex flex-grow flex-col items-center mb-8">
    <!-- Logo -->
    <div class="mt-[5.625rem] mb-5">
      <img src="~assets/images/logo/logo_black.svg" alt="" class="h-[36px]">
    </div>
    <!-- Logo end -->

    <!-- Send hint -->
    <SendHint v-if="showSendHint" :go-back="() => toggleSendHint(false)" />
    <!-- Send hint end -->

    <!-- Join enterprise -->
    <JoinEnterprise
      v-else-if="showJoinEnterprise"
      :continue-login="checkInvitation"
    />
    <!-- Join enterprise end -->

    <!-- Not enable 2FA -->
    <NotEnable2FA v-else-if="notEnable2FA" />
    <!-- Not enable 2FA end -->

    <!-- Basic lock form -->
    <div
      v-else
      class="md:w-[410px] md:mx-0 mx-5 border border-black-200 rounded py-[2.8125rem] px-6 text-center"
    >
      <!-- Title + info -->
      <div class="text-head-4 font-semibold mb-2.5">
        {{ $t('master_password.enter_password_title') }}
      </div>
      <div class="text-base mb-4">
        {{ $t('master_password.enter_password_desc') }}
      </div>
      <div class="inline-block mb-8 select-none">
        <div class="rounded-[21px] flex items-center bg-black-250 p-1 mx-auto">
          <client-only>
            <img
              :src="currentUser.avatar"
              alt=""
              class="w-[28px] h-[28px] rounded-full mr-2"
            >
          </client-only>
          <div class="mr-2">{{ currentUser.email }}</div>
        </div>
      </div>
      <!-- Title + info end -->

      <!-- 2FA form -->
      <template v-if="factor2">
        <TwoFactor
          :crypto-key="cryptoKey"
          :user="currentUser"
          :loading="loading"
          :methods="factor2Methods"
          :master-pw="masterPassword"
          @goBack="factor2 = false"
        />
      </template>
      <!-- 2FA form end -->

      <!-- Enter master pw and buttons -->
      <template v-else>
        <form class="mb-8" @submit.prevent="checkInvitation">
          <div class="form-group !mb-4">
            <label for="" class="text-left">
              {{ $t('master_password.enter_password') }}
            </label>
            <div class="input-group mb-1.5">
              <input
                v-model="masterPassword"
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                :class="[errors ? 'is-invalid' : '']"
                :name="randomString()"
                autocomplete="new-password"
              >
              <div class="input-group-append !bg-white">
                <button
                  class="btn btn-icon"
                  type="button"
                  tabindex="-1"
                  @click="showPassword = !showPassword"
                >
                  <i
                    class="far"
                    :class="{
                      'fa-eye': !showPassword,
                      'fa-eye-slash': showPassword
                    }"
                  />
                </button>
              </div>
            </div>
            <div class="invalid-feedback">
              {{ $t('errors.invalid_password') }}
            </div>
            <div
              class="text-primary text-left cursor-pointer"
              @click="toggleSendHint(true)"
            >
              {{ $t('master_password.get_hint') }}
            </div>
          </div>
        </form>
        <div class="form-group">
          <div class="grid lg:grid-cols-2 grid-cols-1 gap-2">
            <button
              class="btn btn-primary w-full"
              :disabled="loading"
              @click="checkInvitation"
            >
              {{ $t('master_password.unlock') }}
            </button>
            <button
              class="btn btn-default w-full"
              :disabled="loading"
              @click="logout"
            >
              {{ $t('common.logout') }}
            </button>
          </div>
        </div>
      </template>
      <!-- Enter master pw and buttons end -->
    </div>
    <!-- Basic lock form end -->
  </div>
</template>

<script>
import SendHint from '../components/pages/lock/SendHint'
import JoinEnterprise from '../components/pages/lock/JoinEnterprise'
import NotEnable2FA from '../components/pages/lock/NotEnable2FA'
import TwoFactor from '../components/pages/lock/TwoFactor'

export default {
  components: { JoinEnterprise, SendHint, NotEnable2FA, TwoFactor },
  layout: 'blank',
  middleware: ['NotHaveAccountService', 'blockBySource'],
  data () {
    return {
      invalidPinAttempts: 0,
      masterPassword: '',
      loading: false,
      errors: false,
      showPassword: false,
      showSendHint: false,
      showJoinEnterprise: false,
      factor2: false,
      factor2Methods: [],
      cryptoKey: null
    }
  },
  mounted () {
    this.checkBlockedBy2FA()
    if (this.extensionLoggedIn) {
      this.notify(this.$t('data.notifications.extension_loggedin'), 'success')
      this.$store.commit('UPDATE_LOGIN_EXTENSION', false)
    }
    this.$store.dispatch('LoadEnterpriseInvitations')
    if (this.$route.query?.joinEnterprise === '1') {
      this.showJoinEnterprise = true
    }
  },
  methods: {
    // Unlock vault
    async setMasterPass () {
      if (!this.masterPassword) {
        return
      }
      this.loading = true
      this.errors = false
      this.factor2 = false
      this.factor2Methods = []
      try {
        const res = await this.login()
        if (res?.is_factor2) {
          this.factor2 = true
          this.factor2Methods = res.methods
          this.cryptoKey = res.key
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

    toggleSendHint (value) {
      this.showSendHint = value
    },

    // Check enterprise invitation
    checkInvitation () {
      if (
        this.enterpriseInvitations.length &&
        this.enterpriseInvitations[0].domain != null
      ) {
        this.showJoinEnterprise = true
      } else {
        this.showJoinEnterprise = false
        this.setMasterPass()
      }
    }

    // TODO: change masterpass if have account
  }
}
</script>
