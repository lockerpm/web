<template>
  <div>
    <el-form
      ref="redeemForm"
      :model="redeemForm"
      :rules="redeemForm.needCreateAccount ? createAccountRules : basicRules"
    >
      <!-- Need create account? -->
      <el-form-item prop="needCreateAccount">
        <el-checkbox v-model="redeemForm.needCreateAccount" class="!text-white">
          {{ $t('lifetime.redeem_page.form.need_create_account') }}
        </el-checkbox>
      </el-form-item>
      <!-- Need create account? end -->

      <!-- Email -->
      <el-form-item prop="email" :show-message="false">
        <el-input v-model="redeemForm.email" placeholder="Email" />
      </el-form-item>
      <!-- Email end -->

      <!-- Code -->
      <el-form-item
        prop="code"
        :show-message="false"
        :error="errorMessage === 'invalid_code' ? '_' : ''"
      >
        <el-input
          v-model="redeemForm.code"
          :placeholder="
            $t('lifetime.redeem_page.form.app_code', { service: 'AppSumo' })
          "
        />
      </el-form-item>
      <!-- Code end -->

      <!-- Register info -->
      <template v-if="redeemForm.needCreateAccount">
        <!-- Password -->
        <el-form-item
          prop="password"
          :show-message="!!errorDetails.password"
          :error="errorDetails.password && errorDetails.password[0]"
        >
          <el-input
            v-model="redeemForm.password"
            :placeholder="$t('common.password')"
            type="password"
          />
        </el-form-item>
        <!-- Password end -->

        <!-- Confirm Password -->
        <el-form-item prop="confirmPassword" :show-message="false">
          <el-input
            v-model="redeemForm.confirmPassword"
            :placeholder="$t('common.confirm_password')"
            type="password"
          />
        </el-form-item>
        <!-- Confirm Password end -->

        <!-- Fullname -->
        <el-form-item prop="fullName" :show-message="false">
          <el-input
            v-model="redeemForm.fullName"
            :placeholder="$t('common.name')"
          />
        </el-form-item>
        <!-- Fullname end -->

        <!-- Org -->
        <el-form-item prop="org" :show-message="false">
          <el-input
            v-model="redeemForm.org"
            :placeholder="$t('common.company')"
          />
        </el-form-item>
        <!-- Org end -->

        <!-- Country + phone -->
        <div class="flex flex-row items-center">
          <!-- Country -->
          <div class="w-1/3">
            <el-form-item prop="country">
              <el-select
                v-model="redeemForm.country"
                filterable
                placeholder="Select"
              >
                <el-option
                  v-for="item in countries"
                  :key="item.country_code"
                  :label="item.country_name"
                  :value="item.country_code"
                />
              </el-select>
            </el-form-item>
          </div>
          <!-- Country end -->

          <!-- Phone -->
          <div class="w-2/3 pl-2">
            <el-form-item
              prop="phone"
              :show-message="!!errorDetails.phone"
              :error="errorDetails.phone && errorDetails.phone[0]"
            >
              <el-input
                v-model="redeemForm.phone"
                :placeholder="$t('common.phone')"
              >
                <template slot="prepend">
                  {{ redeemForm.countryPhoneCode }}
                </template>
              </el-input>
            </el-form-item>
          </div>
          <!-- Phone end -->
        </div>
        <!-- Country + phone end -->

        <!-- Agree? -->
        <el-form-item prop="agreeTerms">
          <el-checkbox v-model="redeemForm.agreeTerms">
            <span v-html="$t('lifetime.redeem_page.form.agree_terms')" />
          </el-checkbox>
        </el-form-item>
        <!-- Agree? end -->
      </template>
      <!-- Register info end -->

      <!-- Error message -->
      <p v-if="errorMessage" class="text-danger">
        {{ $t(`lifetime.redeem_page.error.${errorMessage}`) }}
      </p>
      <!-- Error message end -->

      <!-- Submit -->
      <button
        class="bg-black text-white w-full"
        :disabled="!isBtnActive"
        @click="handleSubmit"
      >
        {{ $t('lifetime.redeem_page.form.submit_btn') }}
      </button>
      <!-- Submit end -->
    </el-form>

    <!-- Success dialog -->
    <el-dialog :visible.sync="showSuccessDialog" width="30%">
      <span>{{ $t('lifetime.redeem_page.form.success.title') }}</span>
      <span>{{ $t('lifetime.redeem_page.form.success.desc') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showSuccessDialog = false">
          {{ $t('lifetime.redeem_page.form.success.btn') }}
        </el-button>
      </span>
    </el-dialog>
    <!-- Success dialog end -->
  </div>
</template>
<script>
export default {
  props: {
    countries: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      isLoading: false,
      redeemForm: {
        needCreateAccount: false,
        email: '',
        code: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        org: '',
        country: 'VN',
        countryPhoneCode: '+84',
        phone: '',
        agreeTerms: false
      },
      basicRules: {
        email: [{ required: true, trigger: 'change', type: 'email' }],
        code: [{ required: true, trigger: 'change' }]
      },
      createAccountRules: {
        email: [{ required: true, trigger: 'change', type: 'email' }],
        code: [{ required: true, trigger: 'change' }],
        password: [{ required: true, trigger: 'change' }],
        confirmPassword: [{ required: true, trigger: 'blur' }],
        fullName: [{ required: true, trigger: 'change' }]
      },
      errorMessage: '',
      errorDetails: {},
      showSuccessDialog: false
    }
  },

  computed: {
    isBtnActive () {
      if (
        !this.redeemForm.email ||
        !this.redeemForm.code ||
        !!this.errorMessage
      ) {
        return false
      }
      if (this.redeemForm.needCreateAccount) {
        return (
          this.redeemForm.password === this.redeemForm.confirmPassword &&
          this.redeemForm.agreeTerms
        )
      }
      return true
    }
  },

  watch: {
    'redeemForm.country' (val) {
      const country = this.countries.find(c => c.country_code === val)
      if (country) {
        this.redeemForm.countryPhoneCode = country.country_phone_code
      }
    },
    redeemForm: {
      handler () {
        this.errorMessage = ''
      },
      deep: true
    }
  },

  mounted () {
    this.$recaptcha.init()
  },

  methods: {
    handleSubmit () {
      this.errorDetails = {}
      this.$refs.redeemForm.validate(isValid => {
        if (isValid) {
          if (this.redeemForm.needCreateAccount) {
            this.redeemCodeAndCreateAccount()
          } else {
            this.redeemCode()
          }
        }
      })
    },

    async redeemCode () {
      const payload = {
        email: this.redeemForm.email,
        code: this.redeemForm.code
      }
      this.sendRequest(payload)
    },

    async redeemCodeAndCreateAccount () {
      const payload = {
        email: this.redeemForm.email,
        code: this.redeemForm.code,
        country: this.redeemForm.country,
        password: this.redeemForm.password,
        full_name: this.redeemForm.fullName,
        organization: this.redeemForm.org,
        phone: this.redeemForm.phone
          ? `${this.redeemForm.countryPhoneCode} ${this.redeemForm.phone}`
          : undefined
      }
      this.sendRequest(payload)
    },

    async sendRequest (payload) {
      this.isLoading = true
      try {
        const token = await this.$recaptcha.execute('login')
        await this.$axios.$post('/cystack_platform/pm/payments/lifetime', {
          ...payload,
          request_code: token
        })
        this.$refs.redeemForm.resetFields()
        this.showSuccessDialog = true
      } catch (error) {
        const errorData = error.response?.data

        // Account not exists
        if (errorData?.code === '1004') {
          this.redeemForm.needCreateAccount = true
          this.$nextTick(() => {
            this.errorMessage = 'account_not_exist'
          })
          return
        }

        // Invalid data
        if (errorData?.code === '0004') {
          // Invalid code
          if (errorData?.details?.code) {
            this.errorMessage = 'invalid_code'
            return
          }

          this.errorDetails = errorData?.details
          this.errorMessage = 'invalid_data'
          return
        }
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
