<template>
  <div class="full-width bg-[#F4F5F7]">
    <div
      class="max-w-6xl px-6 mx-auto"
      :class="
        submitted
          ? 'h-screen flex items-center justify-center'
          : 'mt-20 py-[100px]'
      "
    >
      <div v-if="submitted">
        <div class="text-center mb-12">
          <img
            src="~/assets/images/email-success-locker.svg"
            class="mx-auto"
            style="height: 100px; background: transparent"
            alt="success"
          >
        </div>
        <div class="m-login__signin markdown-body">
          <div class="m-login__head text-center">
            <h1 class="landing-font-28 font-semibold mb-4">
              {{ $t('business.register.sigup_guide_l1') }}
            </h1>
            <p class="mb-0">
              {{ $t('business.register.sigup_guide_l2') }}
              <strong>{{ newuser.email }}</strong>. <br>
              {{ $t('business.register.sigup_guide_l3') }}
            </p>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-wrap">
        <div class="md:w-1/2 w-full">
          <h1
            class="landing-font-38 font-semibold"
            v-html="$t('business.register.title')"
          />
          <div class="mt-8 landing-font-16">
            {{ $t('business.register.desc') }}
          </div>
          <div
            v-for="(item, index) in $t('business.register.features')"
            :key="index"
            class="mt-5 flex gap-x-3"
          >
            <img :src="require(`~/assets/images/business/${item.icon}`)">
            <div class="landing-font-16">{{ item.text }}</div>
          </div>
          <div class="mt-12 landing-font-16">
            {{ $t('business.register.support_text') }}
            <span>
              <a class="text-info" @click.prevent="openChat">
                {{ $t('common.contact_us') }}
              </a></span>
          </div>
        </div>
        <div class="w-full md:w-1/2 md:pl-5 pl-0 md:mt-0 mt-8">
          <div
            class="shadow-custom rounded-lg h-auto bg-white py-[30px] px-[72px]"
          >
            <el-form
              id="business-form"
              ref="inputForm"
              :model="newuser"
              :rules="rules"
              label-position="top"
              label-width="120px"
              class="business-form"
            >
              <h4 class="w-full text-center mb-5 landing-font-24 font-semibold">
                {{ $t('business.register.form_title') }}
              </h4>
              <div class="w-full grid grid-cols-2 gap-x-4">
                <div class="col-span-1">
                  <el-form-item
                    :label="$t('common.first_name')"
                    prop="firstName"
                  >
                    <el-input
                      v-model="newuser.firstName"
                      :placeholder="$t('common.first_name_placeholder')"
                    />
                    <div v-if="bugs.full_name" class="form-control-feedback">
                      {{ bugs.full_name[0] }}
                    </div>
                  </el-form-item>
                </div>
                <div class="col-span-1">
                  <el-form-item :label="$t('common.last_name')" prop="lastName">
                    <el-input
                      v-model="newuser.lastName"
                      :placeholder="$t('common.last_name_placeholder')"
                    />
                    <div v-if="bugs.full_name" class="form-control-feedback">
                      {{ bugs.full_name[0] }}
                    </div>
                  </el-form-item>
                </div>
              </div>
              <el-form-item :label="$t('common.work_email')" prop="email">
                <el-input
                  v-model="newuser.email"
                  :placeholder="$t('common.work_email_placeholder')"
                />
                <div v-if="bugs.email" class="form-control-feedback">
                  {{ bugs.email[0] }}
                </div>
              </el-form-item>
              <div class="w-full grid grid-cols-2 gap-x-4">
                <div class="col-span-1">
                  <el-form-item :label="$t('common.phone')" prop="phone">
                    <el-input
                      v-model="newuser.phone"
                      :placeholder="$t('common.phone_placeholder')"
                    />
                    <div v-if="bugs.phone" class="form-control-feedback">
                      {{ bugs.phone[0] }}
                    </div>
                  </el-form-item>
                </div>
                <div class="col-span-1">
                  <el-form-item :label="$t('common.country')" prop="country">
                    <el-select
                      v-model="newuser.country"
                      placeholder=""
                      filterable
                      class="w-full"
                      auto-complete="off"
                      @change="changeDialCode"
                    >
                      <el-option
                        v-for="country in countries"
                        :key="country.country_code"
                        :value="country.country_code"
                        :label="country.country_name"
                      >
                        <span>
                          <span
                            :class="`flag flag-${country.country_code.toLowerCase()}`"
                            class=""
                          />
                          {{ country.country_name }}
                        </span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <el-form-item :label="$t('common.company')" prop="organization">
                <el-input
                  v-model="newuser.organization"
                  :placeholder="$t('common.company_placeholder')"
                />
                <div v-if="bugs.organization" class="form-control-feedback">
                  {{ bugs.organization[0] }}
                </div>
              </el-form-item>
              <el-form-item :label="$t('common.job_title')" prop="title">
                <el-input
                  v-model="newuser.title"
                  :placeholder="$t('common.job_title_placeholder')"
                />
              </el-form-item>
              <div class="flex flex-nowrap mb-2 mt-6">
                <el-checkbox v-model="agree" class="mt-[2px]" />
                <p
                  class="ml-[10px] cursor-pointer"
                  @click="
                    () => {
                      agree = !agree
                    }
                  "
                >
                  {{ $t('business.register.receive_email') }}
                </p>
              </div>
              <el-form-item>
                <el-button
                  class="landing-btn w-full"
                  :loading="loading"
                  :disabled="signupBtnDisabled"
                  @click.prevent="signupBusiness"
                >
                  {{ $t('landing_contact.send') }}
                </el-button>
              </el-form-item>
              <div
                class="w-1/2 mx-auto text-center text-xs text-black-500"
                v-html="$t('business.register.agree_policy')"
              />
            </el-form>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      :visible.sync="enterPasswordVisible"
      destroy-on-close
      top="5vh"
      custom-class="locker-dialog"
    >
      <div slot="title">
        <div class="text-head-5 text-black-700 font-semibold truncate">
          {{ $t('business.register.create_account') }}
        </div>
      </div>
      <div class="text-left">
        <InputText
          v-model="newuser.email"
          :label="$t('common.email')"
          class="w-full"
          :error-text="bugs.emails && bugs.email[0]"
          :disabled="true"
          @change="errors = {}"
        />
        <InputText
          v-model="newuser.password"
          :label="$t('common.new_password')"
          class="w-full"
          :error-text="bugs.password && bugs.password[0]"
          is-password
          :required="true"
          @change="errors = {}"
        />
        <InputText
          v-model="newuser.confirm_password"
          :label="$t('common.confirm_password')"
          class="w-full"
          :error-text="bugs.confirm_password && bugs.confirm_password[0]"
          is-password
          :required="true"
          @change="errors = {}"
        />
      </div>
      <div slot="footer" class="dialog-footer flex items-center text-left">
        <div class="flex-grow" />
        <div>
          <button
            class="btn btn-default mb-4 md:mb-0"
            @click="enterPasswordVisible = false"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            class="btn btn-primary"
            :disabled="setPwBtnDisabled"
            @click="register"
          >
            {{ $t('common.sign_up') }}
          </button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import InputText from '~/components/input/InputText'
export default {
  components: {
    InputText
  },
  layout: 'register',
  data () {
    return {
      loading: false,
      agree: false,
      submitted: false,
      newuser: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirm_password: '',
        organization: '',
        title: ''
      },
      bugs: {},
      rules: {
        phone: [
          { required: true },
          {
            validator: this.phoneNotRequiredValidator,
            trigger: ['blur', 'change']
          }
        ],
        firstName: [{ required: true }],
        lastName: [{ required: true }],
        email: [
          { required: true },
          {
            type: 'email',
            message: 'Please input correct email address',
            trigger: ['blur', 'change']
          }
        ],
        country: [{ required: true }],
        organization: [{ required: true }]
      },
      countries: [],
      selectedCountryCode: '+84',
      enterPasswordVisible: false
    }
  },
  computed: {
    fullName () {
      return this.newuser.firstName + ' ' + this.newuser.lastName
    },
    signupBtnDisabled () {
      return !!this.loading
    },
    setPwBtnDisabled () {
      return (
        this.loading ||
        !this.newuser.password ||
        !this.newuser.confirm_password ||
        this.newuser.password !== this.newuser.confirm_password
      )
    }
  },
  mounted () {
    if (this.$route.query.submitted === '1') {
      this.submitted = true
    }
    if (this.$route.query.email) {
      this.newuser.email = this.$route.query.email
    }
    this.getCountries()
    this.$recaptcha.init()
  },
  methods: {
    async signupBusiness () {
      if (this.$refs.inputForm) {
        const isValid = await this.$refs.inputForm.validate()
        if (!isValid) {
          return
        }
      } else {
        return
      }
      this.loading = true
      try {
        const res = await this.$axios.$post('cystack_platform/pm/users/exist', {
          email: this.newuser.email
        })
        if (res.activated) {
          try {
            const token = await this.$recaptcha.execute('login')
            await this.$axios.$put(
              'cystack_platform/pm/payments/trial/enterprise',
              {
                email: this.newuser.email,
                enterprise_name: this.newuser.organization,
                request_code: token
              }
            )
            this.submitted = true
          } catch (error) {
            if (
              error.response &&
              error.response.data &&
              ['7013', '7015'].includes(error.response.data.code)
            ) {
              this.notify(
                this.$t(`errors.${error.response.data.code}`, {
                  email: this.newuser.email
                }),
                'warning'
              )
            } else if (
              error.response &&
              error.response.data &&
              error.response.data.code === '7014' &&
              error.response.data.email
            ) {
              this.$message({
                message: this.$t('landing_contact.messages.error_existed'),
                type: 'error'
              })
            } else {
              this.$message({
                message: this.$t('landing_contact.messages.error_occurred'),
                type: 'error'
              })
            }
          }
        } else {
          this.enterPasswordVisible = true
        }
      } catch (error) {
        this.$message({
          message: this.$t('landing_contact.messages.error_occurred'),
          type: 'error'
        })
      } finally {
        this.loading = false
      }
    },
    async register () {
      if (this.$refs.inputForm) {
        const isValid = await this.$refs.inputForm.validate()
        if (!isValid) {
          return
        }
      } else {
        return
      }
      this.newuser.language = this.locale
      const phone = `${this.selectedCountryCode} ${this.newuser.phone}`
      const SERVICE_SCOPE = 'pwdmanager'
      if (SERVICE_SCOPE) {
        this.newuser.scope = SERVICE_SCOPE
      }
      this.loading = true
      const token = await this.$recaptcha.execute('login')
      this.$axios
        .$post('https://api.locker.io/v2/sso/users', {
          ...this.newuser,
          phone,
          full_name: this.fullName,
          request_code: token
        })
        .then(async () => {
          this.enterPasswordVisible = false
          this.submitted = true
          this.$cookies.set('trial_plan', 'pm_enterprise', {
            domain: '.locker.io',
            path: '/',
            maxAge: 3600 * 24
          })
        })
        .catch(err => {
          if (err.response) {
            this.bugs = err.response.data.details || {}
          }
        })
        .then(() => {
          this.loading = false
        })
    },
    getCountries () {
      this.$axios.$get('resources/countries').then(res => {
        this.countries = res
      })
    },
    changeDialCode (countryCode) {
      for (let i = 0; i < this.countries.length; i++) {
        if (this.countries[i].country_code.toUpperCase() === countryCode) {
          this.selectedCountryCode = this.countries[i].country_phone_code
          break
        }
      }
    }
  }
}
</script>

<style lang="scss">
#business-form {
  label {
    padding-bottom: 4px;
    line-height: 20px;
    font-weight: 600;
  }
  .el-form-item {
    margin-bottom: 14px;
  }
  .el-checkbox__label {
    font-weight: 400;
  }
  .el-form-item__error {
    display: none;
  }
  .form-control-feedback {
    color: #f54f64;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
  }
}
</style>
