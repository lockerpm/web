<template>
  <div
    class="flex flex-col flex-column-fluid relative bg-[#FBFBFC] min-h-screen"
  >
    <!-- Steps -->
    <div class="flex mb-5 border-b border-black-400 pt-3 lg:px-28 px-10">
      <template v-for="(item, index) in planMenu">
        <div
          :key="index"
          :class="[
            step === index + 1
              ? '!text-black font-semibold border-b-2 border-primary pb-3'
              : '',
            index + 1 > step ? 'opacity-60 cursor-not-allowed' : ''
          ]"
          class="text-black-600 mr-8 last:mr-0 cursor-pointer"
          @click="index === 0 ? (step = index + 1) : () => {}"
        >
          {{ $t(`sidebar.${item.label}`) }}
        </div>
      </template>
    </div>
    <!-- Steps end -->

    <choose-plan-step
      v-if="step === 1"
      :selected-period="selectedPeriod"
      :switch-period="duration => (selectedPlanDuration = duration)"
      :plans="plans"
      :selected-plan="selectedPlan"
      :switch-plan="handleSwitchPlan"
    />

    <payment-step v-if="step === 2" />

    <confirmation-step v-if="step === 3" />

    <el-dialog
      :visible.sync="dialogThank"
      width="500px"
      custom-class="locker-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div slot="title">
        <div class="text-head-5 text-black-700 font-semibold truncate">
          {{ $t('data.billing.transfer_thank') }}
        </div>
      </div>
      <div class="text-black-700">
        <div class="text-lg mb-3">
          {{
            $t('data.billing.transfer_thank_content', {
              plan: selectedPlan.name
            })
          }}
        </div>
        <div class="text-lg">
          {{ $t('data.billing.transfer_thank_content_1') }}
        </div>
      </div>
      <div slot="footer">
        <div>
          <button class="btn btn-default w-full" @click="dialogThank = false">
            {{ $t('common.close') }}
          </button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import find from 'lodash/find'
import { PlanPeriod } from '../../constants'
import Payment from '../../components/upgrade/Payment'
import Check from '../../components/icons/check'
import InputText from '../../components/input/InputText'
import ChoosePlanStep from '~/components/setting/manage-plans/ChoosePlanStep'
import ConfirmationStep from '~/components/setting/manage-plans/ConfirmationStep'
import PaymentStep from '~/components/setting/manage-plans/PaymentStep'

export default {
  components: {
    Check,
    Payment,
    InputText,
    ChoosePlanStep,
    ConfirmationStep,
    PaymentStep
  },
  middleware: ['BlockEnterpriseMember'],
  data () {
    return {
      selectedPlanDuration: PlanPeriod.YEARLY,

      step: 1,
      plans: [],
      selectedPlan: {
        half_yearly_price: {},
        price: {},
        yearly_price: {},
        name: ''
      },
      periods: [
        {
          label: 'yearly_price',
          value: 12,
          duration: 'yearly'
        },
        {
          label: 'price',
          value: 1,
          duration: 'monthly'
        }
      ],
      cards: [],
      type: 'yearly_price',
      paymentMethod: 'card',
      selectedCard: '',
      duration: 'yearly',
      promo_code: '',
      havePromoCode: false,
      number_members: 1,
      result: {},
      balance: 0,
      dialogChange: false,
      loadingChange: false,
      loading: false,
      dialogTopup: false,
      loadingCalc: false,
      intervalBalance: null,
      banks: [],
      bank: '',
      dialogTransfer: false,
      order: {
        bank: {}
      },
      loadingDeposited: false,
      dialogThank: false,
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
      paymentVisible: false,
      dialogEnterMembers: false,
      emails: [],
      inputEmail: '',
      family_members: [],
      errors: {}
    }
  },
  computed: {
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
    },
    currency () {
      return this.language === 'vi' ? 'vnd' : 'usd'
    },
    symbol () {
      return this.currency === 'vnd' ? 'đ' : '$'
    },
    shouldDisableBtn () {
      if (this.loading || this.loadingCalc) return true
      if (this.paymentMethod === 'card' && this.cards.length === 0) return true
      return false
    },
    currentPlan () {
      return this.$store.state.currentPlan
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
    billing () {
      return this.cards.find(item => item.id_card === this.selectedCard)
    },
    trialLeft () {
      const now = this.$moment()
      return this.$moment(this.currentPlan.next_billing_time * 1000).diff(
        now,
        'days'
      )
    }
  },
  beforeDestroy () {
    clearInterval(this.intervalBalance)
  },
  mounted () {
    this.getPlans().then(() => {
      const selectedPlan = this.$route.query.plan
      if (selectedPlan && this.plans.find(p => p.alias === selectedPlan)) {
        this.selectPlan(this.plans.find(p => p.alias === selectedPlan))
      }
    })
    this.getCards()
    this.$store.dispatch('LoadCurrentPlan')
  },
  methods: {
    async getPlans () {
      this.plans = await this.$axios.$get('resources/cystack_platform/pm/plans')
    },
    editBilling () {
      this.paymentVisible = true
    },
    async getCards () {
      this.cards = await this.$axios.$get('cystack_platform/payments/cards')
    },
    calcPrice: debounce(function () {
      const currency = 'USD'
      this.loadingCalc = true
      const url = 'cystack_platform/pm/payments/calc'
      this.$axios
        .$post(url, {
          plan_alias: this.selectedPlan.alias,
          promo_code: this.promo_code,
          duration: this.selectedPeriod.duration,
          number_members: this.number_members,
          currency
        })
        .then(res => {
          this.result = res
        })
        .catch(error => {
          const isHandled = this.handleApiError(error?.response)
          if (!isHandled) {
            this.notify(this.$t('data.notifications.error_occurred'), 'warning')
          }
        })
        .then(() => {
          this.loadingCalc = false
        })
    }, 300),
    handleSwitchPlan (plan) {
      this.selectedPlan = plan
      if (this.currentPlan.alias !== 'pm_free') {
        this.dialogChange = true
        if (this.currentPlan.alias === 'pm_family') {
          this.number_members = 6
        }
      } else {
        this.number_members = 1
      }
      this.selectMethod('card')
      this.calcPrice()
      this.step = 2
    },
    selectMethod (method) {
      this.paymentMethod = method
      if (method === 'card' && this.cards.length) {
        const card = find(this.cards, e => e.default) || {}
        this.selectedCard = card.id_card
      }
      this.calcPrice()
    },

    addMember () {
      this.dialogEnterMembers = true
    },
    handleInputEmail () {
      const emailList = this.inputEmail.split(',')
      emailList.forEach(email => {
        email = email.trim()
        if (
          email &&
          this.validateEmail(email) &&
          !this.emails.includes(email)
        ) {
          this.emails.push(email)
          this.inputEmail = ''
        }
      })
    },
    handleClose (index) {
      this.emails.splice(index, 1)
    },
    emailInput (value) {
      this.inputEmail = value
      const lastChar = value.substr(value.length - 1)
      if ([',', ' '].includes(lastChar)) {
        this.handleInputEmail()
      }
    },
    confirmInputEmail () {
      this.emails.forEach(email => {
        if (!this.family_members.includes(email)) {
          if (this.family_members.length === 5) {
            this.notify(this.$t('errors.7012'), 'warning')
            return
          }
          this.family_members.push(email)
        }
      })
      const emailList = this.inputEmail.split(',')
      emailList.forEach(email => {
        email = email.trim()
        if (email && this.validateEmail(email)) {
          if (this.family_members.length === 5) {
            this.notify(this.$t('errors.7012'), 'warning')
            return
          }
          if (!this.family_members.includes(email)) {
            this.family_members.push(email)
          }
          this.inputEmail = ''
        } else if (email && !this.validateEmail(email)) {
          this.notify('Invalid email', 'warning')
        }
      })
      this.emails = []
    },
    removeMember (index) {
      this.family_members.splice(index, 1)
    },
    discountPercentage (plan) {
      const fullPrice = plan.price.usd * 12
      const discount = fullPrice - plan.yearly_price.usd
      const discountPercentage = (discount * 100) / fullPrice
      if (!Number.isNaN(discountPercentage)) {
        return Math.ceil(discountPercentage)
      }
      return 0
    }
  }
}
</script>
