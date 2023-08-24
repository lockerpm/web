<template>
  <div>
    <section class="pt-32 pb-12 bg-[#F5F6F7] full-width">
      <div class="w-full max-w-6xl mx-auto px-6">
        <div class="flex items-end mb-12">
          <h1 class="font-bold text-black landing-font-38 mr-[38px]">
            {{ $t('promo.lifetime.header.title') }}
          </h1>
          <p class="text-primary font-semibold">
            <span class="text-head-3">$69.99</span>
            / {{ $t('promo.lifetime.common.lifetime') }}
          </p>
        </div>

        <div class="flex flex-wrap">
          <!-- Left -->
          <div
            class="w-full md:w-6/12 flex flex-col pr-0 md:pr-12 mb-12 md:mb-0"
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
                <p class="font-semibold">Lifetime Premium</p>
                <p class="text-right">$69.99 USD</p>
              </div>
              <div class="flex justify-between">
                <p class="font-semibold">
                  {{ $t('promo.lifetime.header.duration') }}
                </p>
                <p class="text-right">
                  {{ $t('promo.lifetime.header.unlimited') }}
                </p>
              </div>
              <hr class="border-black-100 mt-6 mb-8">
              <div class="flex justify-between font-semibold">
                <p>
                  {{ $t('common.total') }}
                </p>
                <p>$69.99 USD</p>
              </div>
            </div>
            <!-- Invoice end -->

            <!-- Desc -->
            <div class="flex-1 mb-6">
              <p>
                {{ $t('promo.lifetime.header.desc1') }}
                <br>
                <br>
                {{ $t('promo.lifetime.header.desc2') }}
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
          <div class="w-full md:w-6/12 rounded bg-white p-8">
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
    </section>

    <!-- Testimonials -->
    <Testimonials />
    <!-- Testimonials end -->

    <!-- Benefits -->
    <section class="w-full py-[120px] max-w-6xl mx-auto px-6">
      <div class="w-full flex flex-row items-center justify-center mb-[80px]">
        <h2 class="text-black font-bold text-[48px] leading-[58px]">
          {{ $t('lifetime.redeem_page.benefits.title') }}
        </h2>
        <img
          class="h-14 ml-2.5"
          src="~/assets/images/landing/lifetime/success.png"
        >
      </div>

      <div
        class="sm:grid md:grid-cols-4 sm:grid-cols-2 flex flex-col gap-x-6 gap-y-6"
      >
        <div
          v-for="(item, index) in $t('lifetime.redeem_page.benefits.items')"
          :key="index"
        >
          <img
            class="h-16 mb-6"
            :src="
              require(`~/assets/images/landing/lifetime/benefits/${
                index + 1
              }.svg`)
            "
          >
          <p class="font-bold text-[20px] mb-3">
            {{ item.title }}
          </p>
          <p>
            {{ item.desc }}
          </p>
        </div>

        <div
          class="col-span-2 md:px-6 flex flex-col items-start justify-center"
        >
          <img
            class="h-16 mb-6"
            src="~/assets/images/landing/lifetime/benefits/more.svg"
          >
          <p class="font-bold text-[20px]">
            {{ $t('lifetime.redeem_page.benefits.more_features') }}
          </p>
        </div>
      </div>
    </section>
    <!-- Benefits end -->

    <!-- Platforms -->
    <AvailablePlatforms />
    <!-- Platforms end -->

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

        <template v-if="needCreateAccount">
          <p>
            {{ $t('promo.buy13.form.success.desc_1_new') }}
          </p>
          <p class="mb-6">
            {{ $t('promo.buy13.form.success.desc_2_new') }}
          </p>
        </template>
        <template v-else>
          <p>
            {{ $t('promo.buy13.form.success.desc_1') }}
          </p>
          <p class="mb-6">
            {{ $t('promo.buy13.form.success.desc_2') }}
          </p>
        </template>

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
import AvailablePlatforms from '~/components/pages/landing/AvailablePlatforms.vue'
import Testimonials from '~/components/pages/landing/Testimonials.vue'
import StripeForm from '~/components/upgrade/StripeForm.vue'

export default {
  components: { AvailablePlatforms, Testimonials, StripeForm },

  layout: 'landing',

  data () {
    return {
      needCreateAccount: false,
      isSuccessOpen: false,
      form: {
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        agreed: false
      }
    }
  },

  head () {
    const title = this.$t('promo.lifetime.title')
    const desc = this.$t('promo.lifetime.desc')
    return {
      title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: title
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: title
        },
        {
          hid: 'description',
          name: 'description',
          content: desc
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: desc
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: desc
        }
      ],
      script: [{ src: 'https://js.stripe.com/v3/' }]
    }
  },

  computed: {
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
          '/cystack_platform/pm/lifetime/payments/plan',
          payload
        )
        this.clearInput()
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
.success-dialog {
  max-width: 612px;
}
</style>
