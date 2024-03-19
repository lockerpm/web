<template>
  <div>
    <!-- Purchase content -->
    <section class="full-width pt-32 pb-12">
      <div v-loading="loading.all" class="w-full max-w-7xl mx-auto px-6">
        <div class="mb-12">
          <h1 class="font-bold text-black landing-font-38 mr-[38px]">
            {{ $t('purchase.header.title') }}
          </h1>
        </div>

        <div class="flex flex-wrap">
          <!-- Left -->
          <div
            class="w-full md:w-8/12 flex flex-col pr-0 md:pr-12 mb-12 md:mb-0"
          >
            <!-- Logo -->
            <div class="flex items-center mb-8">
              <img
                src="~assets/images/logo/locker-logo.svg"
                alt="Locker"
                class="h-11 mr-4"
              >
              <p class="landing-font-18">
                {{ $t('common.your_digital_vault') }}
              </p>
            </div>
            <!-- Logo end -->

            <!-- Choose subscription -->
            <div class="mb-6">
              <p class="font-semibold mb-6">
                {{ $t('promo.lifetime.header.choose_subscription') }}
              </p>

              <plan-review
                no-header
                :selected-period="selectedPeriod"
                :switch-period="duration => (selectedPlanDuration = duration)"
                :plans="plans"
                :selected-plan="selectedPlan"
                :switch-plan="plan => (selectedPlan = plan)"
              />
            </div>
            <!-- Choose subscription end -->

            <!-- Invoice -->
            <div class="mb-8">
              <div class="flex justify-between mb-3">
                <p class="font-semibold">{{ $t('common.price') }}</p>
                <p v-if="result.price" class="text-right">
                  ${{ result.price | formatNumber }} {{ result.currency }}
                </p>
              </div>

              <div class="flex justify-between mb-3">
                <p class="font-semibold">
                  {{ $t('promo.lifetime.header.duration') }}
                </p>
                <p class="text-right">
                  {{ selectedPeriod.value }} {{ $tc('common.month', selectedPeriod.value) }}
                </p>
              </div>

              <hr class="border-black-100 my-6">

              <!-- Promo code -->
              <div class="mb-8">
                <div v-if="result.discount" class="flex justify-between">
                  <p class="text-primary italic pr-2">
                    {{ form.promo_code || $t('common.discount') }}
                  </p>

                  <div class="text-right">
                    <p class="text-black-600">
                      -{{ result.discount | formatNumber }}
                      {{ result.currency }}
                    </p>
                    <p class="text-warning">{{ discountPercentage }}% off</p>
                  </div>
                </div>

                <div v-else class="flex items-center">
                  <el-input
                    v-model="form.promo_code"
                    :placeholder="$t('data.plans.payment_step.enter_code')"
                    class="mr-2"
                    @keyup.native.enter="!!form.promo_code && calcPrice()"
                  />
                  <el-button
                    type="primary"
                    :loading="loading.calc"
                    :disabled="!form.promo_code || loading.calc"
                    @click="calcPrice"
                  >
                    {{ $t('common.apply') }}
                  </el-button>
                </div>
              </div>
              <!-- Promo code end -->

              <div class="flex justify-between font-semibold">
                <p>
                  {{ $t('common.total') }}
                </p>
                <p v-if="result.immediate_payment">
                  ${{ result.immediate_payment | formatNumber }}
                  {{ result.currency }}
                </p>
              </div>
            </div>
            <!-- Invoice end -->

            <!-- Desc -->
            <div class="flex-1 mb-6">
              <p>
                <span
                  v-html="
                    $t('data.billing.plan_details[1]', {
                      duration: result.duration || 'yearly',
                      price: result.next_billing_payment
                        ? result.next_billing_payment
                        : result.price || 0,
                      currency: result.currency || 'USD',
                      next_bill: nextBill || ''
                    })
                  "
                />
                {{ $t('data.billing.plan_details[2]') }}
                <br>
                <br>
                {{ $t('purchase.header.desc2') }}
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
          <div class="w-full md:w-4/12">
            <div class="rounded border border-black-50 p-8">
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
                <el-input
                  v-model="form.email"
                  @blur="calcPriceWithEmail"
                  @keyup.native.enter="calcPriceWithEmail"
                />
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
          </div>

        <!-- Right end -->
        </div>
      </div>
    </section>
    <!-- Purchase content end -->

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
  </div>
</template>
<script>
import debounce from 'lodash/debounce'
import { PlanPeriod } from '../constants'
import StripeForm from '~/components/upgrade/StripeForm.vue'
import PlanReview from '~/components/setting/manage-plans/payment/PlanReview.vue'
import AvailablePlatforms from '~/components/pages/landing/AvailablePlatforms.vue'
import Testimonials from '~/components/pages/landing/Testimonials.vue'

export default {
  components: {
    StripeForm,
    PlanReview,
    AvailablePlatforms,
    Testimonials
  },

  layout: 'landing',

  data () {
    return {
      needCreateAccount: false,
      loading: {
        all: false,
        calc: false
      },
      form: {
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        agreed: false,
        promo_code: ''
      },
      result: {},
      plans: [],
      selectedPlan: {
        half_yearly_price: {},
        price: {},
        yearly_price: {},
        name: ''
      },
      selectedPlanDuration: PlanPeriod.YEARLY
    }
  },

  head () {
    const title = this.$t('purchase.title')
    const desc = this.$t('purchase.desc')
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
      ]
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
          this.form.password !== this.form.confirmPassword ||
          !this.result.price
        )
      }
      return !this.form.email
    },

    selectedPeriod () {
      switch (this.selectedPlanDuration) {
      case PlanPeriod.YEARLY:
        return {
          label: 'yearly_price',
          value: 12,
          duration: 'yearly'
        }
      default:
        return {
          label: 'price',
          value: 1,
          duration: 'monthly'
        }
      }
    },

    discountPercentage () {
      const res = (this.result.discount * 100) / this.result.total_price
      if (!Number.isNaN(res)) {
        return Math.round(res)
      }
      return 0
    },

    nextBill () {
      const now = new Date().getTime()
      const nextBill = this.result.next_billing_time
        ? this.$moment(this.result.next_billing_time * 1000).format(
          'DD MMM YYYY'
        )
        : this.result.duration === 'yearly'
          ? this.$moment(now).add(1, 'years').format('DD MMM YYYY')
          : this.$moment(now).add(1, 'months').format('DD MMM YYYY')
      return nextBill
    }
  },

  watch: {
    selectedPlan () {
      this.calcPrice()
    }
  },

  mounted () {
    this.$recaptcha.init()
    this.calcPrice()
    this.getPlans().then(() => {
      const selectedPlan = this.$route.query.plan
      const period = this.$route.query.period
      const code = this.$route.query.code
      if (period) {
        this.selectedPlanDuration = period
      }
      if (selectedPlan && this.plans.find(p => p.alias === selectedPlan)) {
        this.selectedPlan = this.plans.find(p => p.alias === selectedPlan)
      } else {
        this.selectedPlan = this.plans.find(p => p.alias === 'pm_premium')
      }
      if (code) {
        this.form.promo_code = code
      }
    })
  },

  methods: {
    async getPlans () {
      this.loading.all = true
      this.plans = await this.$axios.$get('resources/cystack_platform/pm/plans')
      this.loading.all = false
    },

    clearInput () {
      this.form = {
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        agreed: false,
        promo_code: ''
      }
    },

    calcPriceWithEmail () {
      if (this.validateEmail(this.form.email)) {
        this.calcPrice()
      }
    },

    calcPrice: debounce(function () {
      if (this.loading.calc) {
        return
      }
      this.loading.calc = true
      this.result = {}
      const url = 'cystack_platform/pm/subscription/payments/calc'
      this.$axios
        .$post(url, {
          plan_alias: this.selectedPlan.alias,
          duration: this.selectedPlanDuration,
          promo_code: this.form.promo_code,
          currency: 'USD',
          email: this.form.email
        })
        .then(res => {
          this.result = res
          if (res.error_promo) {
            this.notify(this.$t('errors.invalid_code'), 'warning')
          }
        })
        .catch(error => {
          const isHandled = this.handleApiError(error?.response)
          if (!isHandled) {
            this.notify(this.$t('data.notifications.error_occurred'), 'warning')
          }
        })
        .then(() => {
          this.loading.calc = false
        })
    }, 300),

    async handleAddCardDone ({ tokenId, country }) {
      try {
        if (
          this.form.promo_code &&
          (this.result.error_promo || !this.result.price)
        ) {
          this.form.promo_code = ''
        }
        const token = await this.$recaptcha.execute('login')
        const payload = {
          email: this.form.email,
          token_card: tokenId,
          request_code: token,
          promo_code: this.form.promo_code,
          plan_alias: this.selectedPlan.alias,
          duration: this.selectedPlanDuration,
          utm_source: `${this.$cookies.get('utm_campaign')}__${this.$cookies.get('utm_source')}`
        }
        if (this.needCreateAccount) {
          payload.full_name = this.form.fullName
          payload.password = this.form.password
          payload.country = country
        }
        await this.$axios.$post(
          '/cystack_platform/pm/subscription/payments/plan',
          payload
        )
        this.clearInput()

        // GA tracking
        this.trackGAPurchase({
          planId: `${payload.plan_alias}_${payload.duration}`,
          value: this.result.price,
          currency: this.result.currency,
          coupon: payload.promo_code,
          discount: this.result.discount
        })

        // For GA reasons, use a separate thankyou page instead
        const action = `buy-${this.selectedPlan.alias.replace('pm_', '')}-${this.selectedPlanDuration}`
        const status = this.needCreateAccount ? 'account-created' : ''
        this.$router.push(
          this.localeRoute(`/thankyou?action=${action}&status=${status}`)
        )
      } catch (error) {
        const errorData = error.response?.data
        let message =
          errorData?.message || this.$t('errors.something_went_wrong')

        // Account not exists
        if (errorData?.code === '1004') {
          this.needCreateAccount = true
          this.$nextTick(() => {
            message = this.$t(
              'lifetime.redeem_page.form.error.account_not_exist'
            )
            this.needCreateAccount = true
          })
        }

        // Block business/family
        if (['7015', '7016'].includes(errorData?.code)) {
          message = this.$t(
            'lifetime.redeem_page.form.error.only_individual_no_service'
          )
        }

        // Invalid data
        if (errorData?.code === '0004') {
          message = this.$t('lifetime.redeem_page.form.error.invalid_data')
        }

        this.notify(message, 'warning')
      }
    }
  }
}
</script>
<style lang="scss">
</style>
