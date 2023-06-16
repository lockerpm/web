<template>
  <div>
    <!-- Payment dialog -->
    <el-dialog :visible.sync="isOpen" width="90%" custom-class="payment-dialog">
      <!-- Title -->
      <div slot="title">
        <h2 class="landing-font-38 font-semibold">
          {{ $t('promo.buy13.form.title') }}
        </h2>
      </div>
      <!-- Title end -->

      <div>
        <!-- Price -->
        <p class="text-primary font-semibold mb-6">
          <span class="landing-font-34"> $4.99 </span>
          <span class="landing-font-16">
            / 3 {{ $tc('common.month', 3) }}
          </span>
        </p>

        <div class="flex flex-wrap">
          <!-- Left -->
          <div
            class="w-full md:w-7/12 flex flex-col pr-0 md:pr-12 mb-12 md:mb-0"
          >
            <!-- Logo -->
            <div class="flex items-center mb-8">
              <img
                src="~assets/images/logo/locker-logo.svg"
                alt="Locker"
                class="h-11 mr-4"
              >
              <p class="landing-font-18">Your Digital Vault</p>
            </div>
            <!-- Logo end -->

            <!-- Invoice -->
            <div class="mb-8">
              <div class="flex justify-between mb-3">
                <p class="font-semibold">1 {{ $tc('common.month', 1) }}</p>
                <p class="text-right">$1.66 USD</p>
              </div>
              <div class="flex justify-between">
                <p class="font-semibold">
                  {{ $t('promo.buy13.form.total_month') }}
                </p>
                <p class="text-right">x 3 {{ $tc('common.month', 3) }}</p>
              </div>
              <hr class="border-black-100 mt-6 mb-8">
              <div class="flex justify-between font-semibold">
                <p>
                  {{ $t('common.total') }}
                </p>
                <p>$4.99 USD</p>
              </div>
            </div>
            <!-- Invoice end -->

            <!-- Desc -->
            <div class="flex-1 mb-6">
              <p>
                {{ $t('promo.buy13.form.offer_desc_1') }} <br>
                <br>
                {{
                  $t('promo.buy13.form.offer_desc_2', { date: nextBillingDate })
                }}
                <br>
                <br>
                {{ $t('promo.buy13.form.offer_desc_3') }}
              </p>
            </div>
            <!-- Desc end -->

            <!-- Footer -->
            <div class="flex items-center">
              <div class="flex-1">
                <img
                  src="~assets/images/logo/stripe.svg"
                  alt="Stripe"
                  class="h-6"
                >
              </div>
              <a
                class="text-black mr-6"
                href="https://stripe.com/legal/end-users"
                target="_blank"
              >{{ $t('common.terms') }}</a>
              <a
                class="text-black"
                href="https://stripe.com/privacy"
                target="_blank"
              >{{ $t('common.privacy') }}</a>
            </div>
            <!-- Footer end-->
          </div>
          <!-- Left end -->

          <!-- Right -->
          <div class="w-full md:w-5/12 rounded border border-black-100 p-8">
            <!-- Need create account? -->
            <el-checkbox v-model="needCreateAccount" class="mb-6 w-full">
              {{ $t('promo.buy13.form.need_create_account') }}
            </el-checkbox>
            <!-- Need create account? end -->

            <p
              v-if="!needCreateAccount"
              class="landing-font-18 font-semibold mb-4 text-black"
            >
              {{ $t('promo.buy13.form.pay_with_card') }}
            </p>

            <div class="mb-4">
              <p class="text-black mb-2">
                <span class="text-danger">*</span>
                {{ needCreateAccount ? 'Email' : 'Locker Email' }}
              </p>
              <el-input v-model="form.email" />
            </div>

            <template v-if="needCreateAccount">
              <!-- Password -->
              <div class="mb-4">
                <p class="text-black mb-2">
                  <span class="text-danger">*</span>
                  {{ $t('promo.buy13.form.create_pw') }}
                </p>
                <el-input v-model="form.password" type="password" />
              </div>
              <!-- Password end -->

              <!-- Confirm Password -->
              <div class="mb-4">
                <p class="text-black mb-2">
                  <span class="text-danger">*</span>
                  {{ $t('promo.buy13.form.confirm_pw') }}
                </p>
                <el-input v-model="form.confirmPassword" type="password" />
              </div>
              <!-- Confirm Password end -->

              <!-- Fullname -->
              <div class="mb-4">
                <p class="text-black mb-2">
                  <span class="text-danger">*</span>
                  {{ $t('common.fullname') }}
                </p>
                <el-input v-model="form.fullName" />
              </div>
              <!-- Fullname end -->
            </template>

            <p
              v-if="needCreateAccount"
              class="landing-font-18 font-semibold mb-4 text-black"
            >
              {{ $t('promo.buy13.form.pay_with_card') }}
            </p>

            <stripe-form
              :email="form.email"
              :is-btn-disable="isBtnDisabled"
              :on-add-card-success="handleAddCardDone"
            >
              <template #before-submit>
                <!-- Agree? -->
                <el-checkbox
                  v-if="needCreateAccount"
                  v-model="form.agreed"
                  class="mt-4 w-full"
                >
                  <span
                    class="flex flex-wrap gap-1"
                    v-html="$t('common.agree_terms')"
                  />
                </el-checkbox>
                <!-- Agree? end -->
              </template>
            </stripe-form>
          </div>
          <!-- Right end -->
        </div>
      </div>
    </el-dialog>
    <!-- Payment dialog end -->

    <!-- Success dialog -->
    <el-dialog
      :visible.sync="isSuccessOpen"
      width="90%"
      custom-class="success-dialog"
    >
      <div class="flex flex-col items-center text-center">
        <p class="text-primary landing-font-48 mb-6">
          <i class="el-icon-success" />
        </p>
        <p class="landing-font-28 font-semibold mb-6">
          {{ $t('promo.buy13.form.success.title') }}
        </p>
        <p>
          {{ $t('promo.buy13.form.success.desc_1') }}
        </p>
        <p class="mb-6">
          {{ $t('promo.buy13.form.success.desc_2') }}
        </p>
        <el-button
          v-if="!needCreateAccount"
          type="primary"
          plain
          @click="goToLogin"
        >
          {{ $t('common.login') }}
        </el-button>
      </div>
    </el-dialog>
    <!-- Success dialog end -->
  </div>
</template>
<script>
import StripeForm from '../../upgrade/StripeForm.vue'
export default {
  components: { StripeForm },

  data () {
    return {
      isOpen: false,
      isSuccessOpen: false,
      needCreateAccount: false,
      form: {
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        agreed: false
      }
    }
  },

  computed: {
    nextBillingDate () {
      const currentTime = this.$moment()
      currentTime.add(90, 'days')
      return currentTime.format('DD MMMM YYYY')
    },
    isBtnDisabled () {
      if (this.needCreateAccount) {
        return (
          !this.form.email ||
          !this.form.password ||
          !this.form.confirmPassword ||
          !this.form.fullName ||
          !this.form.agreed ||
          this.form.password !== this.form.confirmPassword
        )
      }
      return !this.form.email
    }
  },

  mounted () {
    this.$recaptcha.init()
  },

  methods: {
    openDialog () {
      this.isOpen = true
    },

    clearInput () {
      this.form = {
        email: '',
        password: '',
        fullName: ''
      }
    },

    goToLogin () {
      this.$router.push('/vault')
    },

    async handleAddCardDone ({ tokenId, country }) {
      try {
        const token = await this.$recaptcha.execute('login')
        const payload = {
          email: this.form.email,
          token_card: tokenId,
          request_code: token
        }
        if (this.needCreateAccount) {
          payload.full_name = this.form.fullName
          payload.password = this.form.password
          payload.country = country
        }
        await this.$axios.$post(
          '/cystack_platform/pm/payments/three_promo',
          payload
        )
        this.clearInput()
        this.isOpen = false
        this.isSuccessOpen = true
      } catch (error) {
        const errorData = error.response?.data
        let message =
          errorData?.message || this.$t('errors.something_went_wrong')

        // Account not exists
        if (errorData?.code === '1004') {
          this.needCreateAccount = true
          this.$nextTick(() => {
            message = this.$t('promo.buy13.form.error.account_not_exist')
            this.needCreateAccount = true
          })
        }

        // Block business/family
        if (errorData?.code === '7015') {
          message = this.$t('promo.buy13.form.error.only_individual')
        }

        // Invalid data
        if (errorData?.code === '0004') {
          message = this.$t('promo.buy13.form.error.invalid_data')
        }

        this.notify(message, 'warning')
      }
    }
  }
}
</script>
<style>
.payment-dialog {
  max-width: 1067px;
}
.success-dialog {
  max-width: 612px;
}
</style>
