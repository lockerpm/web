<template>
  <div>
    <!-- Display -->
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <div class="text-head-5 font-semibold">
            {{ $t('data.settings.factor2.title') }}
          </div>
        </div>

        <!-- Current status -->
        <div class="mt-4 block md:flex justify-between items-center">
          <p class="text-black">
            {{
              factor2.is_factor2
                ? $t('data.settings.factor2.is_on')
                : $t('data.settings.factor2.is_off')
            }}
            <span
              v-if="
                $moment(factor2.updated_time * 1000).isValid() &&
                  factor2.updated_time > 0
              "
            >({{ $moment(factor2.updated_time * 1000).format('LL') }})</span>
          </p>
        </div>
        <!-- Current status end -->

        <!-- Options -->
        <el-collapse class="mt-5">
          <!-- Email -->
          <el-collapse-item class="border-[1px] border-black-200 rounded-t">
            <!-- Title -->
            <template slot="title">
              <div
                class="flex justify-between items-center w-full pr-4 text-black"
              >
                <p>
                  <i class="fas fa-envelope text-lg w-4 text-center" />
                  {{ $t('common.authentication_email') }}
                </p>
                <i
                  class="fas"
                  :class="
                    !factor2.is_factor2 || !factor2.mail_otp.is_activate
                      ? 'fa-minus-circle'
                      : 'fa-check-circle text-primary'
                  "
                />
              </div>
            </template>
            <!-- Title end -->

            <!-- Body -->
            <div class="px-4 mt-2">
              <p>
                {{ $t('data.settings.factor2.factor2_email_des.title') }}
              </p>
              <div class="mt-3" style="max-width: 148px">
                <button
                  class="btn btn-primary btn-sm btn-block"
                  :class="
                    loadingEmail
                      ? 'm-loader m-loader--light m-loader--left m-loader--sm'
                      : ''
                  "
                  @click="toggle2FactorEmail"
                >
                  {{
                    factor2.mail_otp.is_activate
                      ? $t('common.disable')
                      : $t('common.enable')
                  }}
                </button>
              </div>
              <!-- Body end -->
            </div>
          </el-collapse-item>
          <!-- Email end -->

          <!-- App -->
          <el-collapse-item
            class="border-[1px] border-t-0 border-black-200 rounded-b"
          >
            <!-- Title -->
            <template slot="title">
              <div
                class="flex justify-between items-center w-full pr-4 text-black"
              >
                <p>
                  <i class="fas fa-mobile text-lg w-4 text-center" />
                  {{ $t('common.authentication_app') }}
                </p>
                <i
                  class="fas"
                  :class="
                    !factor2.is_factor2 || !factor2.smart_otp.is_activate
                      ? 'fa-minus-circle'
                      : 'fa-check-circle text-primary'
                  "
                />
              </div>
            </template>
            <!-- Title end -->

            <!-- Body -->
            <div class="px-4 mt-2">
              <p>
                {{ $t('data.settings.factor2.factor2_app_des.title') }}
              </p>
              <ol
                v-if="!factor2.smart_otp.is_activate"
                style="list-style-type: decimal; margin-left: 20px"
              >
                <li>
                  <span
                    v-html="
                      $t('data.settings.factor2.factor2_app_des.step1', {
                        href: lockerDownloadUrl
                      })
                    "
                  />
                </li>
                <li>
                  <span
                    v-html="
                      $t('data.settings.factor2.factor2_app_des.step2', {
                        key: factor2.smart_otp.secret
                      })
                    "
                  />
                </li>
                <li>
                  <span
                    v-html="$t('data.settings.factor2.factor2_app_des.step3')"
                  />
                </li>
                <li>
                  <span
                    v-html="$t('data.settings.factor2.factor2_app_des.step4')"
                  />
                </li>
              </ol>
              <div v-if="!factor2.smart_otp.is_activate" class="">
                <img v-if="qrcode" :src="qrcode" alt="" class="">
              </div>
              <div
                class="mt-3"
                :class="errors.code === '1002' ? 'has-danger m-form' : ''"
              >
                <el-input
                  v-model="otp"
                  placeholder="OTP"
                  size="small"
                  style="max-width: 148px"
                />
                <div
                  v-if="errors.code === '1002'"
                  class="form-control-feedback"
                >
                  {{ $t('errors.1002') }}
                </div>
              </div>
              <div class="mt-3" style="max-width: 148px">
                <button
                  class="btn btn-primary btn-sm btn-block"
                  :class="
                    loading2Factor
                      ? 'm-loader m-loader--light m-loader--left m-loader--sm'
                      : ''
                  "
                  :disabled="!otp || loading2Factor"
                  @click="toggle2FactorMethod('smart_otp')"
                >
                  {{
                    factor2.smart_otp.is_activate
                      ? $t('common.disable')
                      : $t('common.enable')
                  }}
                </button>
              </div>
            </div>
            <!-- Body end -->
          </el-collapse-item>
          <!-- App end -->
        </el-collapse>
        <!-- Options end -->
      </div>
    </div>
    <!-- Display end -->

    <el-dialog
      title="Turn on authentication email"
      :visible.sync="dialogVisible"
      width="420px"
      custom-class="locker-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div>
        <div v-if="step === 1">
          <el-radio v-model="value" :label="1" border class="w-full">
            <span class="text-black-600">
              {{ $t('data.settings.factor2.send_code_via_email') }}
              <span class="text-black">{{ currentUser.email }}</span>
            </span>
          </el-radio>

          <div class="mt-2">
            <a class="text-primary" @click="step = 3">
              {{ $t('common.have_code') }}
            </a>
          </div>
        </div>
        <div v-if="step === 2 || step === 3" class="" role="tablist">
          <p v-if="step === 2">
            {{ $t('data.settings.factor2.email_sent') }}
            {{ currentUser.email }}
          </p>
          <div class="form-group m-form__group">
            <label>{{ $t('data.settings.factor2.enter_code') }}</label>
            <el-input v-model="code" placeholder="******" size="small" />
          </div>
          <a
            v-if="!resent && step === 2"
            class="m-link m-link--primary _clickable m--font-primary"
            @click="sendEmail(true)"
          >
            {{ $t('data.settings.factor2.resend_email') }}
          </a>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div v-if="step === 1">
          <button
            class="btn btn-primary btn-sm m-btn--wide m-btn"
            @click="sendEmail"
          >
            {{ $t('common.next') }}
          </button>
        </div>
        <div v-if="step === 2 || step === 3">
          <button class="btn btn-default btn-sm" @click="step = 1">
            {{ $t('common.previous') }}
          </button>
          <button
            class="btn btn-primary btn-sm"
            :class="
              loadingEmail
                ? 'm-loader m-loader--light m-loader--left m-loader--sm'
                : ''
            "
            @click="toggle2FactorMethod('mail')"
          >
            {{ $t('common.confirm') }}
          </button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import QRCode from 'qrcode'

export default {
  data () {
    return {
      qrcode: '',
      otp: '',
      factor2: {
        is_factor2: false,
        mail_otp: {},
        smart_otp: {}
      },
      loading2Factor: false,
      loadingEmail: false,
      loadingSendEmail: false,
      errors: {},
      dialogVisible: false,
      dialogPasswordVisible: false,
      password: '',
      code: '',
      value: 1,
      step: 1,
      resent: false
    }
  },

  computed: {
    lockerDownloadUrl () {
      if (this.$ua.isFromIos()) {
        return this.language === 'vi'
          ? 'https://apps.apple.com/vn/app/locker-password-manager/id1586927301?l=vi'
          : 'https://apps.apple.com/us/app/locker-password-manager/id1586927301'
      }

      if (this.$ua.isFromAndroidOs()) {
        return 'https://play.google.com/store/apps/details?id=com.cystack.locker'
      }

      return 'https://locker.io/download'
    }
  },

  async mounted () {
    try {
      const factor2 = await this.$axios.$get('/sso/me/factor2')
      this.factor2 = factor2

      if (factor2.smart_otp.url) {
        QRCode.toDataURL(factor2.smart_otp.url, {
          width: 148,
          margin: 0,
          color: { dark: '#072245' }
        })
          .then(url => {
            this.qrcode = url
          })
          .catch(err => {
            console.error(err)
          })
      }
    } catch (e) {
      console.log(e)
    }
  },

  methods: {
    get2Factor () {
      this.$axios.$get('/sso/me/factor2').then(res => {
        this.factor2 = res
      })
    },

    toggle2FactorMethod (method) {
      this.errors = {}
      this.loading2Factor = true
      const data = {
        method,
        ...(method === 'smart_otp' ? { otp: this.otp } : { otp: this.code })
      }
      this.$axios
        .$post('/sso/me/factor2', data)
        .then(() => {
          this.get2Factor()
          this.notify(this.$t('common.success'), 'success')
        })
        .catch(e => {
          if (e.response) {
            this.errors = e.response.data
          }
          this.notify(this.$t('common.failed'), 'warning')
        })
        .then(() => {
          this.loading2Factor = false
          this.dialogVisible = false
          this.otp = ''
          this.code = ''
        })
    },

    toggle2FactorEmail () {
      this.dialogVisible = true
      this.step = 1
    },

    sendEmail (sent = false) {
      this.loadingSendEmail = true
      this.$axios
        .$post('/sso/me/factor2/activate_code', { method: 'mail' })
        .then(() => {
          this.step = 2
          this.resent = sent
          this.loadingSendEmail = false
        })
    }
  }
}
</script>
