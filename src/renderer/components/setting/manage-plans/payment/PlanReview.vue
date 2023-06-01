<template>
  <div>
    <h2 class="text-[18px] font-semibold mb-6">
      {{ $t('data.plans.payment_step.step_1') }}
    </h2>

    <div class="grid xl:grid-cols-4 lg:grid-cols-2 grid-cols-1 gap-x-6 gap-y-3">
      <div
        v-for="(plan, index) in allPlans"
        :key="index"
        :class="{
          'bg-[#F0FAF1]':
            plan.alias === selectedPlan.alias &&
            plan.duration === selectedPeriod.duration
        }"
        class="border border-black-100 rounded hover:border-primary flex flex-col p-6 text-center cursor-pointer"
        @click="handleChangePlan(plan)"
      >
        <input
          type="radio"
          class="checked:bg-primary"
          :checked="
            plan.alias === selectedPlan.alias &&
              plan.duration === selectedPeriod.duration
          "
        >
        <div class="h-6 -ml-6 mb-2 mt-3">
          <div v-if="plan.popular" class="gradient-bg rounded-r-full">
            <p class="text-white font-semibold text-[10px]">
              {{ $t('data.plans.most_popular').toUpperCase() }}
            </p>
          </div>
        </div>

        <p class="font-semibold mb-1 text-[16px]">
          {{ plan.name }}
        </p>
        <p>{{ plan.monthCount }} {{ $tc('common.month', plan.monthCount) }}</p>

        <div class="h-[30px] my-2">
          <div
            v-if="plan.saved"
            class="flex items-center justify-center rounded-full bg-warning"
          >
            <p class="font-semibold text-white">
              {{ $t('data.plans.save') }} {{ plan.saved }}%
            </p>
          </div>
        </div>

        <p class="text-head-3 font-semibold text-primary mb-3">
          ${{
            (plan.duration === 'yearly'
              ? plan.yearly_price.usd
              : plan.price.usd) | formatNumber
          }}
        </p>

        <p>
          ${{ plan.price.usd | formatNumber }} / mo /
          {{
            $tc('data.plans.members', plan.max_number, {
              count: plan.max_number
            })
          }}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { PlanPeriod } from '../../../../constants'

export default {
  props: {
    selectedPeriod: {
      type: Object,
      default: () => ({})
    },
    switchPeriod: {
      type: Function,
      default: () => {}
    },
    plans: {
      type: Array,
      default: () => []
    },
    selectedPlan: {
      type: Object,
      default: () => ({})
    },
    switchPlan: {
      type: Function,
      default: () => {}
    }
  },

  computed: {
    allPlans () {
      const res = []
      this.plans.forEach(plan => {
        if (plan.alias === 'pm_free') {
          return
        }
        res.push({
          ...plan,
          duration: PlanPeriod.MONTHLY,
          monthCount: 1
        })
        res.push({
          ...plan,
          duration: PlanPeriod.YEARLY,
          monthCount: 12,
          saved: this.discountPercentage(plan),
          popular: plan.alias === 'pm_premium'
        })
      })
      return res
    }
  },

  methods: {
    discountPercentage (plan) {
      const fullPrice = plan.price.usd * 12
      const discount = fullPrice - plan.yearly_price.usd
      const discountPercentage = (discount * 100) / fullPrice
      if (!Number.isNaN(discountPercentage)) {
        return Math.ceil(discountPercentage)
      }
      return 0
    },

    handleChangePlan (plan) {
      this.switchPeriod(plan.duration)
      this.switchPlan(plan, true)
    }
  }
}
</script>
<style scoped>
.gradient-bg {
  background: linear-gradient(67.94deg, #34e98d 15.01%, #4c9aff 85.93%),
    linear-gradient(0deg, #ebeef2, #ebeef2);
}
</style>
