<template>
  <div class="full-width bg-[#DFDFDF]">
    <div class="max-w-6xl px-6 mx-auto" :class="submitted?'h-screen flex items-center justify-center':'mt-20 py-[100px]'">
      <div v-if="submitted">
        <div class="text-center mb-4">
          <img src="~/assets/images/img-cs.svg#icon-successful" class="mx-auto" style="height: 100px; background: transparent" alt="success">
        </div>
        <div class="m-login__signin markdown-body">
          <div class="m-login__head text-center">
            <h1 class="landing-font-28 font-semibold mb-3">
              {{ $t("business.register.sigup_guide_l1") }}
            </h1>
            <p class="mb-0">
              {{ $t("business.register.sigup_guide_l2") }} <strong>{{ newuser.email }}</strong>. <br>
              {{ $t("business.register.sigup_guide_l3") }}
            </p>
          </div>
        </div>
      </div>
      <div v-else class="flex">
        <div class="md:w-1/2 w-full">
          <h1
            class="landing-font-42 font-semibold"
            v-html="$t('business.register.title')"
          />
          <div class="mt-8 landing-font-16 ">
            {{ $t('business.register.desc') }}
          </div>
          <div class="landing-font-16 italic text-black-500 my-5">
            {{ $t('common.no_credit_card') }}
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
            {{ $t('business.register.support_text') }} <span><a
              class="text-info"
              @click.prevent="openIntercom"
            >{{ locale==='vi'?'Liên hệ':'Contact us' }}</a></span>
          </div>
        </div>
        <div class="w-full md:w-1/2 shadow-custom rounded-lg h-auto bg-white py-[30px] px-[75px]">
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
                <el-form-item
                  :label="$t('common.last_name')"
                  prop="lastName"
                >
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
            <el-form-item
              :label="$t('common.work_email')"
              prop="email"
            >
              <el-input
                v-model="newuser.email"
                :placeholder="$t('common.work_email_placeholder')"
              />
              <div v-if="bugs.email" class="form-control-feedback">
                {{ bugs.email[0] }}
              </div>
            </el-form-item>
            <el-form-item
              :label="$t('common.new_password')"
              prop="password"
            >
              <el-input
                v-model="newuser.password"
                :placeholder="$t('common.new_password_placeholder')"
                type="password"
                show-password
              />
              <div v-if="bugs.password" class="form-control-feedback">
                {{ bugs.password[0] }}
              </div>
            </el-form-item>
            <el-form-item
              :label="$t('common.confirm_password')"
              prop="confirm_password"
            >
              <el-input
                v-model="newuser.confirm_password"
                :placeholder="$t('common.confirm_password_placeholder')"
                type="password"
                show-password
              />
              <div v-if="bugs.confirm_password" class="form-control-feedback">
                {{ bugs.confirm_password[0] }}
              </div>
            </el-form-item>
            <el-form-item
              :label="$t('common.phone')"
              prop="phone"
            >
              <el-input
                v-model="newuser.phone"
                :placeholder="$t('common.phone_placeholder')"
              />
              <div v-if="bugs.phone" class="form-control-feedback">
                {{ bugs.phone[0] }}
              </div>
            </el-form-item>
            <el-form-item
              :label="$t('common.company')"
              prop="organization"
            >
              <el-input
                v-model="newuser.organization"
                :placeholder="$t('common.company_placeholder')"
              />
              <div v-if="bugs.organization" class="form-control-feedback">
                {{ bugs.organization[0] }}
              </div>
            </el-form-item>
            <el-form-item
              :label="$t('common.job_title')"
              prop="title"
            >
              <el-input
                v-model="newuser.title"
                :placeholder="$t('common.job_title_placeholder')"
              />
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="agree">
                {{ $t('business.register.receive_email') }}
              </el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-button
                class="landing-btn w-full"
                :loading="loading"
                :disabled="loading || !agree "
                @click.prevent="register"
              >
                {{ $t('landing_contact.send') }}
              </el-button>
            </el-form-item>
            <div class="w-1/2 mx-auto text-center text-xs text-black-500" v-html="$t('business.register.agree_policy')" />
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'landing',
  data () {
    const phoneNotRequiredValidator = (rule, value, callback) => {
      for (const i in value) {
        if (isNaN(value[i])) {
          return callback(new Error('Please input digits'))
        }
      }

      return callback()
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password again'))
      } else if (value !== this.newuser.password) {
        callback(new Error('Two inputs don\'t match!'))
      } else {
        callback()
      }
    }
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
          { validator: phoneNotRequiredValidator, trigger: ['blur', 'change'] }
        ],
        firstName: [
          { required: true }
        ],
        lastName: [
          { required: true }
        ],
        email: [
          { required: true },
          { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true }
        ],
        confirm_password: [
          { required: true },
          { validator: validatePass }
        ],
        organization: [
          { required: true }
        ]
      }
    }
  },
  mounted () {
    this.$recaptcha.init()
  },
  methods: {
    openIntercom () {
      if (window.Intercom) { window.Intercom('show') }
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
      const fullName = this.newuser.firstName + ' ' + this.newuser.lastName
      this.newuser.language = this.locale
      const SERVICE_SCOPE = 'pwdmanager'
      if (SERVICE_SCOPE) {
        this.newuser.scope = SERVICE_SCOPE
      }
      this.loading = true
      const token = await this.$recaptcha.execute('login')
      this.$axios.$post('https://api.locker.io/v2/sso/users', {
        ...this.newuser,
        full_name: fullName,
        request_code: token
      })
        .then(async response => {
          this.submitted = true
        })
        .catch(err => {
          if (err.response) {
            this.bugs = err.response.data.details || {}
          }
        })
        .then(() => {
          this.loading = false
        })
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
    color: #F54F64;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
  }
}
</style>
