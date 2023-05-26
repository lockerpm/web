<template>
  <div v-loading="loadingCalc" class="min-w-[200px] md:max-w-[200px]">
    <h2 class="text-[18px] font-semibold mb-4">
      {{ $t('data.plans.payment_step.step_3') }}
    </h2>

    <div class="flex justify-between">
      <div class="pr-3">
        <p class="text-black-600">
          Locker {{ selectedPlan.name }}
          <span v-if="!currentPlan.personal_trial_applied">({{ $t('data.plans.trial_included') }})</span>
          <br>
          {{ $t(`data.plans.price.${selectedPeriod.label}`) }}
        </p>
      </div>

      <p class="text-black-600">
        {{ result.price | formatNumber }} {{ result.currency }}
      </p>
    </div>

    <!-- Promo code -->
    <div class="mt-3">
      <div v-if="result.discount && promoCode" class="flex justify-between">
        <p class="text-primary italic pr-2">
          {{ promoCode }}
        </p>

        <div class="text-right">
          <p class="text-black-600">
            -{{ result.discount | formatNumber }} {{ result.currency }}
          </p>
          <p class="text-warning">{{ discountPercentage }}% off</p>
        </div>
      </div>

      <div v-else class="flex items-center">
        <el-input
          v-model="promoCode"
          :placeholder="$t('data.plans.payment_step.enter_code')"
          class="mr-2"
        />
        <el-button
          type="primary"
          :disabled="!promoCode || loading"
          @click="calcPrice"
        >
          {{ $t('common.add') }}
        </el-button>
      </div>
    </div>
    <!-- Promo code end -->

    <hr class="my-4 border-black-100">

    <div class="flex justify-between">
      <p class="font-semibold text-[16px] pr-3">
        {{ $t('data.billing.total') }}
      </p>
      <p class="font-semibold text-[16px]">
        <span
          v-if="!currentPlan.personal_trial_applied"
          class="text-black-600 line-through"
        >{{
           result.next_billing_payment
             ? result.next_billing_payment
             : result.price | formatNumber
         }}
          {{ result.currency }}</span>
        {{ result.immediate_payment | formatNumber }}
        {{ result.currency
        }}<span v-if="!currentPlan.personal_trial_applied">*</span>
      </p>
    </div>

    <div class="text-black-600 mb-4 mt-4">
      <ul v-if="!currentPlan.personal_trial_applied">
        <li
          v-html="
            $t('data.billing.trial_summary[0]', {
              duration: result.duration || 'yearly',
              price: result.next_billing_payment
                ? result.next_billing_payment
                : result.price || 0,
              currency: result.currency || 'USD',
              next_bill: nextBill || ''
            })
          "
        />
        <li>{{ $t('data.billing.trial_summary[1]') }}</li>
      </ul>
      <ul v-else>
        <li
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
        <li>{{ $t('data.billing.plan_details[2]') }}</li>
      </ul>
    </div>

    <el-button
      type="primary"
      :disabled="!selectedCard || !selectedCard.id_card"
      :loading="loading"
      class="w-full"
      @click="confirmPlan()"
    >
      {{ $t('data.billing.pay_and_upgrade') }}
    </el-button>
  </div>
</template>
<script>
import debounce from 'lodash/debounce'
export default {
  props: {
    selectedPeriod: {
      type: Object,
      default: () => ({})
    },
    selectedPlan: {
      type: Object,
      default: () => ({})
    },
    selectedCard: {
      type: Object,
      default: () => ({})
    },
    familyMembers: {
      type: Array,
      default: () => []
    },
    onDone: {
      type: Function,
      default: () => () => {}
    }
  },

  data () {
    return {
      result: {},
      loadingCalc: false,
      loading: false,
      promoCode: this.$route.query.code || ''
    }
  },

  computed: {
    currentPlan () {
      return this.$store.state.currentPlan
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
    },
    discountPercentage () {
      const discountPercentage =
        (this.result.discount * 100) / this.result.total_price
      if (!Number.isNaN(discountPercentage)) {
        return Math.ceil(discountPercentage)
      }
      return 0
    }
  },

  watch: {
    selectedPeriod: {
      deep: true,
      handler () {
        this.calcPrice()
      }
    },
    selectedPlan: {
      deep: true,
      handler () {
        this.calcPrice()
      }
    }
  },

  mounted () {
    this.calcPrice()
  },

  methods: {
    calcPrice: debounce(function () {
      if (!this.selectedPlan.alias || !this.selectedPeriod.duration) {
        this.result = {}
        return
      }
      const currency = 'USD'
      const numberMembers = this.selectedPlan.alias === 'pm_family' ? 6 : 1
      this.loadingCalc = true
      const url = 'cystack_platform/pm/payments/calc'
      this.$axios
        .$post(url, {
          plan_alias: this.selectedPlan.alias,
          promo_code: this.promoCode,
          duration: this.selectedPeriod.duration,
          number_members: numberMembers,
          currency
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
          this.loadingCalc = false
        })
    }, 300),

    async confirmPlan () {
      try {
        if (this.promoCode && this.result.error_promo) {
          this.promoCode = ''
        }
        this.loading = true
        const shareKey = await this.$cryptoService.makeShareKey()
        const orgKey = shareKey[0].encryptedString
        const collection = await this.$cryptoService.encrypt(
          'defaultCollection',
          shareKey[1]
        )
        const collectionName = collection.encryptedString
        const familyMembers =
          this.selectedPlan.alias === 'pm_family' ? this.familyMembers : []
        const numberMembers = this.selectedPlan.alias === 'pm_family' ? 6 : 1

        await this.$axios.$post('cystack_platform/pm/payments/plan', {
          plan_alias: this.selectedPlan.alias,
          duration: this.selectedPeriod.duration,
          payment_method: 'card',
          id_card: this.selectedCard.id_card,
          promo_code: this.promoCode,
          number_members: numberMembers,
          key: orgKey,
          collection_name: collectionName,
          family_members: familyMembers
        })
        this.$store.dispatch('LoadCurrentPlan')
        this.onDone(this.result)
        this.notify(this.$t('data.notifications.upgrade_success'), 'success')
      } catch {
        this.notify(this.$t('data.notifications.error_occurred'), 'warning')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
