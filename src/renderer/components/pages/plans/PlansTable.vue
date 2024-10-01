<template>
  <section class="py-16 w-full">
    <div class="border-b border-primary text-center mb-10">
      <i
        class="el-icon-success text-primary bg-white translate-y-5 text-[32px]"
      />
    </div>

    <div class="w-full overflow-x-scroll md:overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="w-3/12 text-left pl-6 pb-5 landing-font-18">
              {{ $t('common.features') }}
            </th>
            <th class="w-3/12 pb-5 landing-font-18">Free</th>
            <th class="w-3/12 pb-5 landing-font-18">Premium</th>
            <th class="w-3/12 pb-5 landing-font-18">Family</th>
          </tr>
        </thead>

        <tbody>
          <!-- Features -->
          <template v-for="(feature, index) in $t('plan.plan_table.table')">
            <tr :key="`${index}_col_1`" style="background-color: #fbfaf3">
              <td
                colspan="100%"
                class="py-[18px] pl-6 text-green font-semibold landing-font-16"
              >
                {{ feature.title }}
              </td>
            </tr>
            <tr :key="`${index}_col_2`">
              <td colspan="100%" class="pb-5" />
            </tr>
            <tr
              v-for="(item, idx) in feature.features"
              :key="`${index}_${idx}`"
            >
              <td class="pl-6 landing-font-16 pb-5" style="color: #5a6176">
                {{ item.label }}
              </td>
              <td
                v-for="(plan, ind) in item.plans"
                :key="ind"
                class="text-center pb-5"
              >
                <div
                  v-if="plan === true"
                  class="mx-auto rounded-full bg-green-50 h-6 w-6"
                >
                  <i class="text-primary el-icon-check !font-bold" />
                </div>
                <div
                  v-else-if="plan === false"
                  class="mx-auto rounded-full bg-[#F5F6F7] h-6 w-6"
                >
                  <i class="text-danger el-icon-close !font-bold" />
                </div>
                <p v-else v-html="plan" />
              </td>
            </tr>
          </template>
          <!-- Features -->

          <!-- Price -->
          <tr style="background-color: #fbfaf3">
            <td class="py-[18px] pl-6 text-green landing-font-16 font-semibold">
              {{ $t('common.price') }}
            </td>
            <td class="py-[18px] text-green landing-font-16 text-center">
              ${{ getMonthlyPrice(plans[0]) | formatNumber }}
            </td>
            <td class="py-[18px] text-green landing-font-16 text-center">
              ${{ getMonthlyPrice(plans[1]) | formatNumber }}/{{
                $tc('common.month', 1)
              }}
            </td>
            <td class="py-[18px] text-green landing-font-16 text-center">
              ${{ getMonthlyPrice(plans[2]) | formatNumber }}/{{
                $tc('common.month', 1)
              }}/<br>6 {{ $tc('common.accounts', 6) }}
            </td>
          </tr>
          <!-- Price end -->

          <!-- Buttons -->
          <tr>
            <td />
            <td
              class="pt-5 items-center flex flex-col"
              style="vertical-align: top"
            >
              <el-button type="primary" @click="choosePlan('pm_free')">
                {{ $t('plan.plan_table.create_account') }}
              </el-button>
            </td>
            <td class="pt-5">
              <div class="flex flex-col items-center">
                <el-button type="primary" @click="choosePlan('pm_premium')">
                  {{ $t('plan.plan_table.buy_premium') }}
                </el-button>
                <a
                  class="mt-3 text-info font-semibold hover:text-info text-center"
                  @click.prevent="startTrialPlan('pm_premium')"
                >
                  {{ $t('plan.plan_table.start_trial') }}
                </a>
              </div>
            </td>
            <td class="pt-5">
              <div class="flex flex-col items-center">
                <el-button type="primary" @click="choosePlan('pm_family')">
                  {{ $t('plan.plan_table.buy_family') }}
                </el-button>
                <a
                  class="mt-3 text-info font-semibold hover:text-info text-center"
                  @click.prevent="startTrialPlan('pm_family')"
                >
                  {{ $t('plan.plan_table.start_trial') }}
                </a>
              </div>
            </td>
          </tr>
          <!-- Buttons end -->
        </tbody>
      </table>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    plans: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    getMonthlyPrice (plan) {
      return (plan?.yearly_price?.usd || 0) / 12
    },
    startTrialPlan (alias) {
      this.$cookies.set('trial_plan', alias, {
        domain: '.locker.io',
        path: '/',
        maxAge: 3600 * 24
      })
      this.$router.push(this.localeRoute({ path: '/register' }))
    },
    choosePlan (alias) {
      if (alias === 'pm_free') {
        this.$router.push(this.localeRoute({ path: '/register', query: { isFree: 1 } }))
      } else {
        this.$router.push(this.localeRoute(`/payment?plan=${alias}`))
      }
    }
  }
}
</script>
