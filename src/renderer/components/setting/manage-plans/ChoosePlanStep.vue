<template>
  <div class="flex-column-fluid lg:px-28 py-10 px-10 mb-20">
    <div class="flex mb-5">
      <div class="w-full">
        <!-- Step title -->
        <div class="mb-6">
          <div class="text-head-3 font-semibold mb-2">
            {{ $t('data.plans.choose_plan') }}
          </div>
          <div class="mb-8">{{ $t('data.plans.choose_plan_desc') }}</div>
          <div class="flex">
            <button
              class="btn-round btn-left-round"
              :class="isMonthly ? 'text-primary' : 'text-black'"
              @click="switchToMonthly"
            >
              {{ $t('data.plans.bill_monthly') }}
            </button>
            <button
              class="btn-round btn-right-round"
              :class="isYearly ? 'text-primary' : 'text-black'"
              @click="switchToYearly"
            >
              {{ $t('data.plans.bill_annually') }} <br>
              {{ $t('data.plans.bill_annually_desc') }}
            </button>
          </div>
        </div>
        <!-- Step title end-->

        <!-- Choose a plan -->
        <div
          class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-6 gap-y-3"
        >
          <div
            v-for="item in plans"
            :key="item.id"
            :class="selectedPlan.alias === item.alias ? '!border-primary' : ''"
            class="p-8 border border-black-200 rounded hover:border-primary flex flex-col justify-between"
          >
            <!-- Info -->
            <div class="flex flex-col mb-6">
              <!-- Plan name -->
              <div class="2xl:flex items-center text-center justify-center">
                <span class="font-semibold !text-lg">
                  {{ getPlanName(item.name).name }}
                </span>
                <span class="text-black-600 ml-2">
                  {{ getPlanName(item.name).tag }}
                </span>
              </div>
              <!-- Plan name end -->

              <!-- Price -->
              <div class="mb-4 mt-2 text-primary">
                <div>
                  <!-- Free plan -->
                  <template v-if="item.alias === 'pm_free'">
                    <div class="text-head-3 font-semibold text-center">
                      <span>${{ item.price.usd | formatNumber }}</span>
                    </div>
                  </template>
                  <!-- Free plan -->

                  <!-- Other plans -->
                  <template v-else>
                    <div class="text-center">
                      <span
                        :class="
                          periodSwitch
                            ? 'line-through text-sm text-black'
                            : 'text-head-3 font-semibold'
                        "
                      >${{ item.price.usd | formatNumber }}</span>
                      <span
                        v-if="periodSwitch"
                        class="text-head-3 font-semibold"
                      >${{
                        (item.yearly_price.usd / 12) | formatNumber
                      }}</span>
                      <span>/ mo</span>
                      <span
                        v-if="item.max_number"
                        class=""
                      >/
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
                    </div>
                  </template>
                  <!-- Other plans -->
                </div>

                <!-- Yearly desc -->
                <div
                  v-if="isYearly && item.alias != 'pm_free'"
                  class="flex items-center justify-center mt-1"
                >
                  <div>
                    {{ $t('data.plans.price_12months') }} ${{
                      item.yearly_price.usd
                    }}
                    <span
                      class="py-[1px] px-2 bg-primary text-white rounded-[20px]"
                    >{{ $t('data.plans.save') }}
                      {{ discountPercentage(item) }}%</span>
                  </div>
                </div>
                <!-- Yearly desc end -->
              </div>
              <!-- Price end -->

              <!-- Description -->
              <div class="text-black-600 mb-4">
                {{ $t(`data.plans.descriptions.${item.alias}`) }}
              </div>
              <!-- Description end -->

              <!-- Features -->
              <div class="mb-8 flex-grow">
                <div
                  v-for="feature in features[item.alias]"
                  :key="feature"
                  class="flex items-center"
                >
                  <Check class="text-primary" />
                  <div class="ml-2">
                    {{ $t(`data.plans.features.${feature}`) }}
                  </div>
                </div>
              </div>
              <!-- Features end -->
            </div>
            <!-- Info end -->

            <!-- Button -->
            <div class="w-full">
              <button
                :class="
                  currentPlan.alias === item.alias
                    ? 'btn-default'
                    : 'btn-primary'
                "
                class="btn text-center w-full"
                :disabled="
                  item.alias === 'pm_free' ||
                    currentPlan.alias === 'pm_lifetime_premium'
                "
                @click="
                  currentPlan.personal_trial_applied === false
                    ? startTrial(item)
                    : item.alias !== 'pm_free' &&
                      currentPlan.alias !== item.alias
                      ? selectPlan(item)
                      : ''
                "
              >
                <template v-if="currentPlan.alias === item.alias">
                  {{ $t('data.plans.current_plan') }}
                </template>
                <template
                  v-else-if="
                    currentPlan.alias === 'pm_lifetime_premium' &&
                      item.alias === 'pm_premium'
                  "
                >
                  {{ $t('data.plans.current_plan') }}
                </template>
                <template v-else>
                  {{
                    currentPlan.personal_trial_applied === false
                      ? $t('data.plans.start_trial')
                      : $t('data.plans.choose_this_plan')
                  }}
                </template>
              </button>
            </div>
            <!-- Button end -->
          </div>
        </div>
        <!-- Choose a plan end -->
      </div>
    </div>
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
      features: {
        pm_free: [
          'secure_data',
          'sync_devices',
          'auto_fill',
          'biometric_login',
          'password_generator'
        ],
        pm_premium: [
          'free_features',
          'unlimited_storage',
          'password_health',
          'data_breach',
          'emergency_access',
          'share_passwords'
        ],
        pm_family: [
          'free_features',
          'unlimited_storage',
          'password_health',
          'data_breach',
          'emergency_access',
          'share_passwords'
        ],
        pm_personal_premium: [
          'store_password',
          'cards_and_notes',
          'password_generator',
          'sync_devices',
          'password_health',
          'data_breach'
        ],
        pm_family_discount: [
          'store_password',
          'cards_and_notes',
          'password_generator',
          'sync_devices',
          'password_health',
          'data_breach'
        ],
        pm_business_premium: [
          'store_password',
          'cards_and_notes',
          'password_generator',
          'sync_devices',
          'password_health',
          'data_breach',
          'shares_passwords',
          'admin_panel',
          'activity_logs'
        ]
      }
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

    getPlanName (text) {
      if (text) {
        const [name, tag] = text.split(' ')
        return { name, tag }
      }
      return { name: '', tag: '' }
    },

    async startTrial (plan) {
      try {
        await this.$axios.$post('cystack_platform/pm/payments/trial', {
          trial_plan: plan.alias
        })
        this.$store.dispatch('LoadCurrentPlan')
        this.notify(this.$t('data.notifications.upgrade_success'), 'success')
      } catch (error) {
        this.notify(this.$t('data.notifications.error_occurred'), 'warning')
      }
    },

    selectPlan (plan) {
      const confirmMessage = this.$t('data.notifications.switch_plan', {
        currentPlan: this.currentPlan.name,
        chosenPlan: plan.name
      })

      if (this.currentPlan.alias !== 'pm_free') {
        this.$confirm(confirmMessage, this.$t('common.warning'), {
          confirmButtonText: this.$t('common.proceed'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          this.switchPlan(plan)
        })
      } else {
        this.switchPlan(plan)
      }
    }
  }
}
</script>
