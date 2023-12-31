<template>
  <div class="bg-[#FBFBFC]">
    <HeaderPayment />
    <div class="max-w-6xl mx-auto relative">
      <div
        class="flex flex-col flex-column-fluid relative bg-[#FBFBFC] min-h-screen"
      >
        <!-- Steps -->
        <div class="flex mb-5 border-b border-black-400 pt-3 md:px-10 px-4">
          <template v-for="(item, index) in planMenu">
            <div
              :key="index"
              :class="{
                '!text-black font-semibold border-b-2 border-primary pb-3':
                  step === index + 1,
                'opacity-60': index + 1 > step,
                'cursor-not-allowed': index === 2 && index + 1 > step
              }"
              class="text-black-600 mr-8 last:mr-0 cursor-pointer"
              @click="handleMenuClick(index)"
            >
              {{ $t(`sidebar.${item.label}`) }}
            </div>
          </template>
        </div>
        <!-- Steps end -->

        <choose-plan-step
          v-if="step === 1"
          v-loading="loading"
          :selected-period="selectedPeriod"
          :switch-period="duration => (selectedPlanDuration = duration)"
          :plans="plans"
          :selected-plan="selectedPlan"
          :switch-plan="handleSwitchPlan"
        />

        <payment-step
          v-if="step === 2"
          :selected-period="selectedPeriod"
          :switch-period="duration => (selectedPlanDuration = duration)"
          :plans="plans"
          :selected-plan="selectedPlan"
          :switch-plan="handleSwitchPlan"
          :on-done="handlePaymentDone"
        />

        <confirmation-step
          v-if="step === 3"
          :selected-period="selectedPeriod"
          :selected-plan="selectedPlan"
          :result="result"
          :selected-card="selectedCard"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { PlanPeriod } from '../constants'
import ConfirmationStep from '~/components/setting/manage-plans/ConfirmationStep.vue'
import ChoosePlanStep from '~/components/setting/manage-plans/ChoosePlanStep'
import PaymentStep from '~/components/setting/manage-plans/payment/PaymentStep'
import HeaderPayment from '~/components/HeaderPayment'

export default {
  components: {
    HeaderPayment,
    ChoosePlanStep,
    PaymentStep,
    ConfirmationStep
  },
  layout: 'blank',
  middleware: ['NotHaveAccountService', 'BlockEnterpriseMember'],

  async asyncData ({ store, $axios, error }) {
    let userType = ''
    if (store.state.userPw.pwd_user_type) {
      userType = store.state.userPw.pwd_user_type
    } else {
      const res = await $axios.$get('/cystack_platform/pm/users/me')
      userType = res.pwd_user_type
    }
    if (userType === 'enterprise') {
      error({ errorCode: 404 })
    }
  },

  data () {
    return {
      step: 1,
      plans: [],
      selectedPlan: {
        half_yearly_price: {},
        price: {},
        yearly_price: {},
        name: ''
      },
      selectedPlanDuration: PlanPeriod.YEARLY,
      loading: true,
      planMenu: [
        {
          label: 'choose_plan'
        },
        {
          label: 'payment'
        },
        {
          label: 'confirmation'
        }
      ],
      result: {},
      selectedCard: {}
    }
  },

  head () {
    return {
      script: [{ src: 'https://js.stripe.com/v3/' }]
    }
  },

  computed: {
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
    }
  },

  mounted () {
    this.getPlans().then(() => {
      const selectedPlan = this.$route.query.plan
      const period = this.$route.query.period
      const code = this.$route.query.code
      if (period) {
        this.selectedPlanDuration = period
      }
      if (selectedPlan && this.plans.find(p => p.alias === selectedPlan)) {
        this.handleSwitchPlan(this.plans.find(p => p.alias === selectedPlan))
        return
      }
      if (code) {
        this.selectedPlanDuration = PlanPeriod.YEARLY
        this.handleSwitchPlan(
          this.plans.find(p => p.alias === 'pm_premium'),
          true
        )
      }
    })
    this.$store.dispatch('LoadCurrentPlan')
  },

  methods: {
    async getPlans () {
      this.loading = true
      this.plans = await this.$axios.$get('resources/cystack_platform/pm/plans')
      this.loading = false
    },

    handleSwitchPlan (plan, silent = false) {
      const confirmMessage = this.$t('data.notifications.switch_plan', {
        currentPlan: this.currentPlan.name,
        currentPeriod: this.$t(`common.${this.currentPlan.duration}`),
        chosenPlan: plan.name,
        chosenPeriod: this.$t(`common.${this.selectedPeriod.duration}`)
      })

      const _switchPlan = () => {
        this.selectedPlan = plan
        this.step = 2
      }

      const shouldShowConfirmation =
        this.currentPlan.alias &&
        (this.currentPlan.alias !== plan.alias ||
          this.currentPlan.duration !== this.selectedPeriod.duration) &&
        !silent

      if (shouldShowConfirmation) {
        this.$confirm(confirmMessage, this.$t('common.warning'), {
          confirmButtonText: this.$t('common.proceed'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          _switchPlan()
        })
      } else {
        _switchPlan()
      }
    },

    handlePaymentDone (res, card) {
      this.result = res
      this.selectedCard = card
      this.step = 3
    },

    handleMenuClick (index) {
      if (index === 2) {
        return
      }
      if (index === 1 && !this.selectedPlan.alias) {
        const defaultPlan = this.plans.find(p => p.alias === 'pm_premium')
        if (defaultPlan) {
          this.selectedPlanDuration = PlanPeriod.YEARLY
          this.handleSwitchPlan(defaultPlan, true)
          return
        }
      }
      this.step = index + 1
    }
  }
}
</script>
