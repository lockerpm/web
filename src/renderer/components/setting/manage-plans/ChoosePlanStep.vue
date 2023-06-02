<template>
  <div class="flex-column-fluid py-6 px-10 mb-20">
    <!-- Step title -->
    <div class="flex flex-col mb-6 items-center">
      <h1 class="text-head-3 font-semibold mb-1">
        {{ $t('data.plans.choose_plan') }}
      </h1>
      <div class="mb-3">{{ $t('data.plans.choose_plan_desc') }}</div>
      <div
        class="flex items-center rounded-full border-black-50 border p-1 bg-white"
      >
        <button
          class="rounded-full h-12 w-52"
          :class="isMonthly ? 'bg-[#E7F6E9]' : ''"
          @click="switchToMonthly"
        >
          <p
            :class="isMonthly ? 'text-primary font-semibold' : 'text-black-600'"
          >
            {{ $t('data.plans.bill_monthly') }}
          </p>
        </button>
        <button
          class="rounded-full h-12 w-52 text-center"
          :class="isYearly ? 'bg-[#E7F6E9]' : ''"
          @click="switchToYearly"
        >
          <p
            :class="isYearly ? 'text-primary font-semibold' : 'text-black-600'"
          >
            {{ $t('data.plans.bill_annually') }} <br>
            {{ $t('data.plans.bill_annually_desc') }}
          </p>
        </button>
      </div>
    </div>
    <!-- Step title end-->

    <!-- Choose a plan -->
    <div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-6 gap-y-3">
      <div
        v-for="item in plans"
        :key="item.id"
        :class="{
          '!border-primary': selectedPlan.alias === item.alias,
          'mt-[38px]': !isPopularPlan(item)
        }"
        class="border border-black-100 rounded-xl hover:border-primary overflow-hidden relative flex flex-col bg-white"
      >
        <div v-if="isPopularPlan(item)" class="text-center gradient-bg py-2">
          <p class="text-white font-semibold tracking-wide">
            {{ $t('data.plans.most_popular').toUpperCase() }}
          </p>
        </div>

        <div
          v-if="
            item.alias !== 'pm_free' && selectedPeriod.duration === 'yearly'
          "
          class="bg-warning absolute right-0 top-0 pt-4 w-[50px] text-center overflow-hidden"
        >
          <p class="text-white font-semibold">
            {{ $t('data.plans.save') }}
            {{ discountPercentage(item) }}%
          </p>
          <div
            class="h-[50px] w-[50px] bg-white rotate-45 translate-y-[25px]"
          />
        </div>

        <div class="p-8 flex-1 flex flex-col justify-between">
          <!-- Info -->
          <div class="flex flex-col mb-2">
            <!-- Plan name -->
            <div class="flex items-center">
              <p class="font-semibold text-[18px]">
                {{ item.name }}
              </p>
              <div
                v-if="isCurrentPlan(item)"
                class="bg-black-200 ml-2 px-2 py-1 rounded"
              >
                <p class="text-[9px] text-black-600 leading-[12px]">
                  {{ $t('data.plans.current_plan').toUpperCase() }}
                </p>
              </div>
            </div>
            <!-- Plan name end -->

            <!-- Price -->
            <div class="mb-4 mt-2 text-primary">
              <div>
                <!-- Free plan -->
                <template v-if="item.alias === 'pm_free'">
                  <p class="text-head-3 font-semibold">
                    ${{ item.price.usd | formatNumber }}
                  </p>
                </template>
                <!-- Free plan -->

                <!-- Other plans -->
                <template v-else>
                  <p class="text-black">
                    <span
                      :class="
                        isYearly
                          ? 'line-through text-sm text-black'
                          : 'text-head-3 font-semibold text-primary'
                      "
                    >${{ item.price.usd | formatNumber }}</span>

                    <span
                      v-if="isYearly"
                      class="text-head-3 font-semibold text-primary"
                    >${{ (item.yearly_price.usd / 12) | formatNumber }}</span>

                    <span>/ mo</span>

                    <span v-if="item.max_number">/
                      {{
                        $tc('data.plans.members', item.max_number, {
                          count: item.max_number
                        })
                      }}
                    </span>
                    <span
                      v-else-if="item.alias === 'pm_business_premium'"
                      class="text-black-600"
                    >/ {{ $tc('data.plans.members', 1, { count: 1 }) }}
                    </span>
                  </p>
                </template>
                <!-- Other plans -->
              </div>

              <!-- Yearly desc -->
              <p v-if="isYearly && item.alias != 'pm_free'" class="text-black">
                {{ $t('data.plans.price_12months') }}
                <span class="text-primary font-semibold">${{ item.yearly_price.usd }}</span>
              </p>
              <!-- Yearly desc end -->
            </div>
            <!-- Price end -->

            <!-- Description -->
            <p class="text-black-600 mb-4">
              {{ $t(`data.plans.descriptions.${item.alias}`) }}
            </p>
            <br
              v-if="
                item.alias === 'pm_free' && selectedPeriod.duration === 'yearly'
              "
            >
            <!-- Description end -->

            <!-- Features -->
            <div class="mb-8 flex-grow">
              <div v-for="feature in features" :key="feature" class="flex">
                <i
                  v-if="blockedFeatures[item.alias].includes(feature)"
                  class="text-danger el-icon-close !font-bold mt-1.5"
                />
                <i
                  v-else
                  class="text-primary el-icon-check !font-bold mt-1.5"
                />
                <div class="ml-2">
                  {{
                    $t(
                      `data.plans.features.${
                        ['private_email', 'sync_devices'].includes(feature) &&
                        item.alias !== 'pm_free'
                          ? feature + '_unlimited'
                          : feature
                      }`
                    )
                  }}
                </div>
              </div>
            </div>
            <!-- Features end -->
          </div>
          <!-- Info end -->

          <!-- Button -->
          <el-button
            :type="isPurchaseBtnDisabled(item) ? 'default' : 'primary'"
            class="w-full"
            :disabled="isPurchaseBtnDisabled(item)"
            :loading="loading[item.alias]"
            @click="handleBtnClick(item)"
          >
            {{ getBtnText(item) }}
          </el-button>
          <!-- Button end -->
        </div>
      </div>
    </div>
    <!-- Choose a plan end -->
  </div>
</template>
<script>
import { PlanPeriod } from '../../../constants'

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

  data () {
    return {
      features: [
        'unlimited_storage',
        'sync_devices',
        'auto_fill',
        'authenticator',
        'password_generator',
        'password_health',
        'data_breach',
        'emergency_access',
        'share_passwords',
        'private_email',
        'family_members'
      ],
      blockedFeatures: {
        pm_free: [
          'unlimited_storage',
          'password_health',
          'data_breach',
          'emergency_access',
          'share_passwords',
          'family_members'
        ],
        pm_premium: ['family_members'],
        pm_family: []
      },
      loading: {}
    }
  },

  computed: {
    isMonthly () {
      return this.selectedPeriod.duration === PlanPeriod.MONTHLY
    },
    isYearly () {
      return this.selectedPeriod.duration === PlanPeriod.YEARLY
    },
    currentPlan () {
      return this.$store.state.currentPlan
    }
  },

  methods: {
    switchToMonthly () {
      this.switchPeriod(PlanPeriod.MONTHLY)
    },

    switchToYearly () {
      this.switchPeriod(PlanPeriod.YEARLY)
    },

    discountPercentage (plan) {
      const fullPrice = plan.price.usd * 12
      const discount = fullPrice - plan.yearly_price.usd
      const discountPercentage = (discount * 100) / fullPrice
      if (!Number.isNaN(discountPercentage)) {
        return Math.ceil(discountPercentage)
      }
      return 0
    },

    async startTrial (plan) {
      try {
        this.loading[plan.alias] = true
        await this.$axios.$post('cystack_platform/pm/payments/trial', {
          trial_plan: plan.alias
        })
        this.loading[plan.alias] = false
        this.$store.dispatch('LoadCurrentPlan')
        this.notify(this.$t('data.notifications.upgrade_success'), 'success')
      } catch (error) {
        console.log(error)
        this.notify(this.$t('data.notifications.error_occurred'), 'warning')
      }
    },

    selectPlan (plan, silent) {
      this.switchPlan(plan, silent)
    },

    isCurrentPlan (plan) {
      return (
        this.currentPlan.alias === plan.alias &&
        this.currentPlan.duration === this.selectedPeriod.duration
      )
    },

    isPopularPlan (plan) {
      return (
        plan.alias === 'pm_premium' &&
        this.selectedPeriod.duration === PlanPeriod.YEARLY
      )
    },

    isPurchaseBtnDisabled (plan) {
      if (this.loading[plan.alias]) {
        return true
      }
      if (
        plan.alias === 'pm_free' ||
        this.currentPlan.alias === 'pm_lifetime_premium'
      ) {
        return true
      }
      if (this.currentPlan.alias === plan.alias) {
        if (this.currentPlan.duration === this.selectedPeriod.duration) {
          return !this.currentPlan.is_trailing
        }
      }
      return false
    },

    handleBtnClick (plan) {
      if (
        plan.alias === 'pm_free' ||
        this.currentPlan.alias === 'pm_lifetime_premium'
      ) {
        return
      }
      if (this.currentPlan.alias === plan.alias) {
        if (this.currentPlan.duration === this.selectedPeriod.duration) {
          if (this.currentPlan.is_trailing) {
            this.selectPlan(plan, true)
          }
          return
        }
      }
      if (!this.currentPlan.personal_trial_applied) {
        this.startTrial(plan)
      } else {
        this.selectPlan(plan)
      }
    },

    getBtnText (plan) {
      if (
        this.currentPlan.alias === plan.alias &&
        this.currentPlan.duration === this.selectedPeriod.duration
      ) {
        if (this.currentPlan.is_trailing) {
          return this.$t('data.plans.purchase_now')
        }
        return this.$t('data.plans.current_plan')
      }
      if (
        this.currentPlan.alias === 'pm_lifetime_premium' &&
        plan.alias === 'pm_premium'
      ) {
        return this.$t('data.plans.current_plan')
      }
      return !this.currentPlan.personal_trial_applied
        ? this.$t('data.plans.start_trial')
        : this.$t('data.plans.choose_this_plan')
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
