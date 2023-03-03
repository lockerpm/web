<template>
  <div>
    <!-- Header -->
    <section class="full-width h-auto">
      <div
        class="md:pt-[186px] pt-28 flex flex-row items-center max-w-6xl mx-auto px-6"
      >
        <!-- Left -->
        <div class="w-full md:w-1/2">
          <!-- Intro -->
          <div>
            <h1>Redeem your AppSumo Code for Locker's Lifetime Package</h1>
            <p>
              If you have already had an AppSumo Code for Locker Password
              Manager, use the Code to redeem for Locker's services now.
            </p>
          </div>
          <!-- Intro end -->

          <!-- Form -->
          <div>
            <el-form
              ref="redeemForm"
              :model="redeemForm"
              :rules="
                redeemForm.needCreateAccount ? createAccountRules : basicRules
              "
            >
              <!-- Need create account? -->
              <el-form-item prop="needCreateAccount">
                <el-checkbox v-model="redeemForm.needCreateAccount">
                  Need create account?
                </el-checkbox>
              </el-form-item>
              <!-- Need create account? end -->

              <!-- Email -->
              <el-form-item prop="email">
                <el-input v-model="redeemForm.email" placeholder="Email" />
              </el-form-item>
              <!-- Email end -->

              <!-- Code -->
              <el-form-item prop="code">
                <el-input v-model="redeemForm.code" placeholder="Code" />
              </el-form-item>
              <!-- Code end -->

              <!-- Register info -->
              <template v-if="redeemForm.needCreateAccount">
                <!-- Password -->
                <el-form-item prop="password">
                  <el-input
                    v-model="redeemForm.password"
                    placeholder="Password"
                  />
                </el-form-item>
                <!-- Password end -->

                <!-- Confirm Password -->
                <el-form-item prop="confirmPassword">
                  <el-input
                    v-model="redeemForm.confirmPassword"
                    placeholder="Confirm Password"
                  />
                </el-form-item>
                <!-- Confirm Password end -->

                <!-- Fullname -->
                <el-form-item prop="fullName">
                  <el-input
                    v-model="redeemForm.fullName"
                    placeholder="Full name"
                  />
                </el-form-item>
                <!-- Fullname end -->

                <!-- Org -->
                <el-form-item prop="org">
                  <el-input v-model="redeemForm.org" placeholder="Org" />
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
                    <el-form-item prop="phone">
                      <el-input v-model="redeemForm.phone" placeholder="Phone">
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
                    I agree
                  </el-checkbox>
                </el-form-item>
                <!-- Agree? end -->
              </template>
              <!-- Register info end -->

              <!-- Submit -->
              <el-button
                type="primary"
                :disabled="!isBtnActive"
                @click="handleSubmit"
              >
                Redeem code
              </el-button>
              <!-- Submit end -->
            </el-form>
          </div>
          <!-- Form end -->
        </div>
        <!-- Left end -->
      </div>
    </section>
    <!-- Header end -->
  </div>
</template>

<script>
export default {
  layout: 'landing',

  asyncData ({ $axios }) {
    return $axios
      .$get('/resources/countries')
      .then(res => {
        return {
          countries: res
        }
      })
      .catch(() => {
        return {
          countries: []
        }
      })
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
      }
    }
  },

  computed: {
    isBtnActive () {
      if (!this.redeemForm.email || !this.redeemForm.code) {
        return false
      }
      if (this.redeemForm.needCreateAccount) {
        return (
          this.redeemForm.password === this.redeemForm.confirmPassword &&
          this.agreeTerms
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
    }
  },

  mounted () {
    this.$recaptcha.init()
  },

  methods: {
    handleSubmit () {
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
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped></style>
