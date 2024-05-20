<template>
  <section
    id="plans-header"
    class="full-width h-auto pt-32 relative overflow-hidden"
  >
    <div class="z-10 relative max-w-6xl mx-auto px-6">
      <h1 class="font-bold landing-font-42 text-center mb-2">
        {{ $t('plan.header.title') }}
      </h1>
      <p class="landing-font-20 text-center mb-8">
        {{ $t('plan.header.desc') }}
        <span class="gradient-text">
          {{ $t('plan.header.desc_colored') }}
        </span>
      </p>

      <!-- Lifetime -->
      <div
        class="flex flex-wrap rounded-xl border border-primary py-5 mb-7 px-2 justify-center items-center mx-auto bg-[#F5F9F5] relative max-w-[650px]"
      >
        <img
          :src="require('~/assets/images/landing/lifetime/special-offer.svg')"
          alt="Special offer"
          class="absolute top-[-10px] left-[-2px]"
        >
        <p class="mr-0 sm:mr-2 ml-0 sm:ml-8 mt-4 sm:mt-0 text-center">
          {{ $t('plan.header.lifetime.get') }}
          <span class="text-primary font-semibold">$69.99</span>.
          {{ $t('plan.header.lifetime.pay_once') }} 🎁
        </p>
        <nuxt-link to="/lifetime" class="text-primary">
          {{ $t('plan.header.lifetime.buy_now') }} <i class="el-icon-right" />
        </nuxt-link>
      </div>
      <!-- Lifetime end -->

      <!-- Plan selector -->
      <div class="flex flex-col mb-6 items-center">
        <div
          class="flex items-center rounded-full border-black-50 border p-1 bg-white"
        >
          <button
            class="rounded-full h-12 w-52"
            :class="isMonthly ? 'bg-[#E7F6E9]' : ''"
            @click="switchToMonthly"
          >
            <p
              :class="
                isMonthly ? 'text-primary font-semibold' : 'text-black-600'
              "
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
              :class="
                isYearly ? 'text-primary font-semibold' : 'text-black-600'
              "
            >
              {{ $t('data.plans.bill_annually') }} <br>
              {{ $t('data.plans.bill_annually_desc') }}
            </p>
          </button>
        </div>
      </div>
      <!-- Step title end-->

      <!-- Plans -->
      <div
        class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-6 gap-y-3"
      >
        <div
          v-for="item in plans"
          :key="item.id"
          :class="{
            'mt-[38px]': !isPopularPlan(item)
          }"
          class="border border-black-100 rounded-xl overflow-hidden relative flex flex-col bg-white"
        >
          <div v-if="isPopularPlan(item)" class="text-center gradient-bg py-2">
            <p class="text-white font-semibold tracking-wide">
              {{ $t('data.plans.most_popular').toUpperCase() }}
            </p>
          </div>

          <div
            v-if="item.alias !== 'pm_free' && selectedPeriod === 'yearly'"
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
              </div>
              <!-- Plan name end -->

              <!-- Price -->
              <div
                v-if="item.price && item.yearly_price"
                class="mb-4 mt-2 text-primary"
              >
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
                      >${{
                        (item.yearly_price.usd / 12) | formatNumber
                      }}</span>

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
                <p
                  v-if="isYearly && item.alias != 'pm_free'"
                  class="text-black"
                >
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
                v-if="item.alias === 'pm_free' && selectedPeriod === 'yearly'"
              >
              <!-- Description end -->

              <!-- Features -->
              <div class="mb-8 flex-grow">
                <div
                  v-for="feature in visibleFeatures"
                  :key="feature"
                  class="flex"
                >
                  <i
                    v-if="blockedFeatures[item.alias].includes(feature)"
                    class="text-danger el-icon-close !font-bold mt-1.5"
                  />
                  <i
                    v-else
                    class="text-primary el-icon-check !font-bold mt-1.5"
                  />
                  <div class="ml-2">
                    <p>
                      {{ getFeatureText(item, feature).title }}
                    </p>
                    <p class="text-[12px] text-black-600 mb-2">
                      {{ getFeatureText(item, feature).desc }}
                    </p>
                  </div>
                </div>
              </div>
              <!-- Features end -->
            </div>
            <!-- Info end -->

            <div>
              <div class="mb-3 text-center">
                <a
                  v-if="!isExpanded"
                  class="text-info font-semibold hover:text-info"
                  @click.prevent="isExpanded = true"
                >
                  {{ $t('common.see_more') }} <i class="el-icon-bottom" />
                </a>
              </div>

              <!-- Button -->
              <el-button
                type="primary"
                class="w-full"
                @click="choosePlan(item.alias)"
              >
                {{ item.alias === 'pm_free' ? $t('common.sign_up') : $t('data.plans.purchase_now') }}
              </el-button>
              <!-- Button end -->
            </div>
          </div>
        </div>
      </div>
      <!-- Plans end -->
    </div>
  </section>
</template>
<script>
import { PlanPeriod } from '../../../constants'

export default {
  props: {
    plans: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      isExpanded: false,
      selectedPeriod: PlanPeriod.YEARLY,
      features: [
        'sync_devices',
        'auto_fill',
        'authenticator',
        'password_generator',
        'quick_share',
        'private_email',
        'unlimited_storage',
        'share_passwords',
        'password_health',
        'data_breach',
        'emergency_access',
        'family_members'
      ],
      blockedFeatures: {
        pm_free: [
          'unlimited_storage',
          'share_passwords',
          'password_health',
          'data_breach',
          'emergency_access',
          'family_members'
        ],
        pm_premium: ['family_members'],
        pm_family: []
      }
    }
  },

  computed: {
    isMonthly () {
      return this.selectedPeriod === PlanPeriod.MONTHLY
    },
    isYearly () {
      return this.selectedPeriod === PlanPeriod.YEARLY
    },
    visibleFeatures () {
      if (this.isExpanded) {
        return this.features
      }
      return this.features.slice(0, 3)
    }
  },

  methods: {
    discountPercentage (plan) {
      if (!plan.price || !plan.yearly_price) {
        return 0
      }
      const fullPrice = plan.price.usd * 12
      const discount = fullPrice - plan.yearly_price.usd
      const discountPercentage = (discount * 100) / fullPrice
      if (!Number.isNaN(discountPercentage)) {
        return Math.round(discountPercentage)
      }
      return 0
    },

    switchToMonthly () {
      this.selectedPeriod = PlanPeriod.MONTHLY
    },

    switchToYearly () {
      this.selectedPeriod = PlanPeriod.YEARLY
    },

    isPopularPlan (plan) {
      return (
        plan.alias === 'pm_premium' && this.selectedPeriod === PlanPeriod.YEARLY
      )
    },

    getFeatureText (plan, key) {
      const realKey =
        ['private_email', 'sync_devices'].includes(key) &&
        plan.alias !== 'pm_free'
          ? key + '_unlimited'
          : key
      return this.$t(`plan.header.features.${realKey}`)
    },

    choosePlan (alias) {
      if (alias === 'pm_free') {
        this.$router.push(this.localeRoute({ path: '/register' }))
      } else {
        this.$router.push(
          this.localeRoute(
            `/purchase?plan=${alias}&period=${this.selectedPeriod}`
          )
        )
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.gradient-text {
  background: -webkit-linear-gradient(67.94deg, #34e98d 15.01%, #4c9aff 85.93%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.gradient-bg {
  background: linear-gradient(67.94deg, #34e98d 15.01%, #4c9aff 85.93%);
}
#plans-header {
  background-image: url(~assets/images/landing/plan/header-cover.svg);
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: center top;
}
@media screen and (max-width: 960px) {
  #plans-header {
    background-size: auto 50%;
  }
}
</style>
