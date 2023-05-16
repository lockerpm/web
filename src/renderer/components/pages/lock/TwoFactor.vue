<template>
  <div>
    <!-- 2 factor step 1 -->
    <div v-if="step === 1" class="text-left">
      <div class="flex flex-wrap items-center mb-5">
        <a class="btn !pl-3 !pr-3 mr-2" @click="$emit('goBack')">
          <i class="fas fa-long-arrow-alt-left text-primary" />
        </a>
        <p class="text-base">{{ $t('lock.factor2.step_1.title') }}</p>
      </div>

      <el-radio-group v-model="selectedMethod" class="w-full">
        <el-radio
          v-for="m in methods"
          :key="m.type"
          :label="m.type"
          border
          class="w-full mb-3 !ml-0"
        >
          <template v-if="m.type === 'mail'">
            <i class="fas fa-envelope w-4" />
            <span> Email {{ m.data }} </span>
          </template>

          <template v-else-if="m.type === 'smart_otp'">
            <i class="fas fa-mobile w-4" />
            <span>{{ $t('common.authentication_app') }} </span>
          </template>
        </el-radio>
      </el-radio-group>

      <a
        v-if="selectedMethod === 'mail'"
        class="m-link m-link--primary _clickable m--font-primary m--icon-font-size-sm3 text-left"
        @click="step = 3"
      >
        {{ $t('common.have_code') }}
      </a>

      <div class="form-group mt-5">
        <button
          class="btn btn-primary w-full"
          :disabled="loading || loadingSendEmail"
          @click="nextMethod"
        >
          {{ $t('common.next') }}
        </button>
      </div>
    </div>
    <!-- 2 factor step 1 end -->

    <!-- 2 factor step 2 + 3 -->
    <div v-if="step === 2 || step === 3" class="text-left">
      <div class="flex flex-wrap items-center mb-5">
        <a class="btn !pl-3 !pr-3 mr-2" @click="step = 1">
          <i class="fas fa-long-arrow-alt-left text-primary" />
        </a>
        <p class="text-base">{{ $t('lock.factor2.step_2.title') }}</p>
      </div>

      <p v-if="selectedMethod === 'mail'">
        {{ $t('lock.factor2.step_2.mail_desc', { email: otpEmail }) }}
      </p>
      <p v-if="selectedMethod === 'smart_otp' && step !== 3">
        {{ $t('lock.factor2.step_2.app_desc') }}
      </p>

      <div :class="['form-group m-form__group']">
        <label>{{ $t('lock.factor2.step_2.enter_code') }}</label>
        <input
          v-model="otp"
          class="form-control m-input mt-2"
          :name="randomString()"
        >
      </div>

      <div class="row m-login__form-sub">
        <div class="col m--align-left m-login__form-left pl-0">
          <el-checkbox v-model="save_device">
            {{ $t('lock.factor2.step_2.save_device') }}
          </el-checkbox>
        </div>
      </div>

      <div class="form-group mt-5">
        <button
          class="btn btn-primary w-full"
          :disabled="loadingOtp || !otp"
          @click="postOtp"
        >
          {{ $t('common.login') }}
        </button>
      </div>
    </div>
    <!-- 2 factor step 2 + 3 end -->
  </div>
</template>
<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => ({
        email: ''
      })
    },
    cryptoKey: {
      type: Object,
      default: () => null
    },
    masterPw: {
      type: String,
      default: () => ''
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    methods: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      step: 1,
      selectedMethod: null,
      loadingSendEmail: false,
      save_device: false,
      loadingOtp: false,
      otp: '',
      masterPassword: ''
    }
  },

  computed: {
    otpEmail () {
      const mailMethod = this.methods.find(m => m.type === 'mail')
      return mailMethod?.data
    }
  },

  mounted () {
    this.masterPassword = this.masterPw
    if (this.methods.length) {
      this.selectedMethod = this.methods[0].type
    }
  },

  methods: {
    async nextMethod () {
      if (this.loadingSendEmail) {
        return
      }

      if (this.selectedMethod === 'mail') {
        this.loadingSendEmail = true
        try {
          const token = await this.$recaptcha.execute('login')
          const hashedPassword = await this.$cryptoService.hashPassword(
            this.masterPassword,
            this.cryptoKey
          )
          const payload = {
            username: this.user?.email,
            password: hashedPassword,
            request_code: token
          }
          await this.$axios.$post('sso/auth/otp/mail', payload)
          this.step = 2
        } catch (e) {
          console.log(e)
          this.notify(e.response.data.message, 'warning')
        } finally {
          this.loadingSendEmail = false
        }
      } else {
        this.step = 2
      }
    },

    async postOtp () {
      try {
        this.loadingOtp = true
        await this.login({
          extraData: {
            otp: this.otp,
            method: this.selectedMethod,
            save_device: this.save_device
          },
          isOtp: true,
          key: this.cryptoKey
        })
        this.loadingOtp = false
      } catch (e) {
        console.log(e)
        this.loadingOtp = false
      }
    }
  }
}
</script>
