<template>
  <div class="mb-36">
    <div class="max-w-[600px] mx-auto mt-32 text-center">
      <h1 class="landing-font-42 font-semibold">
        {{ $t('business_plan.title') }}
      </h1>
    </div>
    <div class="mt-9 overflow-auto">
      <table class="w-full">
        <thead>
          <tr>
            <th class="w-1/2 text-left pl-6 landing-font-18" />
            <th class="h-[250px] w-1/4 rounded-t-xl h-1/4">
              <div class="px-4 py-6 font-medium">
                <div class="landing-font-24 font-semibold mb-5">Business</div>
                <div class="flex justify-center gap-4">
                  <div>
                    <span class="landing-font-28 font-semibold">{{
                      $t('business.plans.price1_1')
                    }}</span>
                    <br>
                    <span
                      v-if="locale === 'en'"
                      class="landing-font-16 font-semibold"
                    >
                      {{ $t('business.plans.per_month') }}
                    </span>
                    <span v-else class="landing-font-12 font-semibold">
                      {{ $t('business.plans.per_month') }}
                    </span>
                    <br>
                    <span
                      class="landing-font-14 text-black-500 lowercase whitespace-nowrap"
                    >{{ $t('business.plans.monthly_pack') }}</span>
                  </div>
                  <div>
                    <span class="landing-font-28 font-semibold">{{
                      $t('business.plans.price1_2')
                    }}</span>
                    <br>
                    <span
                      v-if="locale === 'en'"
                      class="landing-font-16 font-semibold"
                    >
                      {{ $t('business.plans.per_month') }}
                    </span>
                    <span v-else class="landing-font-12 font-semibold">
                      {{ $t('business.plans.per_month') }}
                    </span>
                    <br>
                    <span
                      class="landing-font-14 text-black-500 lowercase whitespace-nowrap"
                    >{{ $t('business.plans.yearly_pack') }}</span>
                  </div>
                </div>
                <nuxt-link
                  :to="localeRoute('/business/register')"
                  class="landing-btn mt-8 !font-medium"
                >
                  {{ $t('business.welcome.start') }}
                </nuxt-link>
                <p class="mt-3">
                  {{ $t('business.plans.or') }}
                  <span>
                    <a :href="`${enterpriseUrl}/purchase`" class="text-info">
                      {{ $t('business.plans.do_it') }}
                    </a>
                  </span>
                </p>
              </div>
            </th>
            <th class="h-[250px] w-1/4 h-1/4">
              <div class="px-8 py-6 font-medium h-full">
                <div class="landing-font-24 font-semibold mb-9">Enterprise</div>
                <div
                  class="uppercase text-black-500"
                  v-html="$t('business.plans.variable_price')"
                />
                <div class="mt-12">
                  <button
                    class="landing-btn !text-black !bg-[#E8E8E9] !hover:bg-[#E8E8E9] !font-medium"
                    @click="openChat"
                  >
                    {{ $t('business.plans.contact_us') }}
                  </button>
                </div>
                <p class="text-black-500 mt-3">
                  {{ $t('business.plans.more_inf') }}
                </p>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(feature, index) in $t('business_plan.table')">
            <tr :key="index">
              <td
                class="py-[18px] pl-6 text-green font-semibold landing-font-16 uppercase"
                style="background-color: #fbfaf3"
              >
                {{ feature.title }}
              </td>
              <td style="background-color: #fbfaf3" />
              <td style="background-color: #fbfaf3" />
            </tr>
            <tr :key="index">
              <td class="pb-5" />
              <td />
              <td />
            </tr>
            <tr v-for="(item, idx) in feature.features" :key="idx">
              <td
                class="pl-6 landing-font-16 pb-5 font-semibold"
                style="color: #5a6176"
              >
                {{ item.label }}
              </td>
              <td
                v-for="(plan, ind) in item.plans"
                :key="ind"
                class="text-center pb-5"
              >
                <img
                  v-if="plan === true"
                  class="mx-auto"
                  src="~/assets/images/landing/plan/true.svg"
                >
                <img
                  v-else-if="plan === false"
                  class="mx-auto"
                  src="~/assets/images/landing/plan/false.svg"
                >
                <p v-else v-html="plan" />
              </td>
            </tr>
          </template>
          <tr>
            <td />
            <td class="rounded-b-xl">
              <div class="text-center py-8">
                <nuxt-link
                  class="landing-btn !font-medium"
                  :to="localePath('/business/register')"
                >
                  {{ $t('business.welcome.start') }}
                </nuxt-link>
                <p class="mt-3">
                  {{ $t('business.plans.or') }}
                  <span>
                    <a :href="`${enterpriseUrl}/purchase`" class="text-info">
                      {{ $t('business.plans.do_it') }}
                    </a>
                  </span>
                </p>
              </div>
            </td>
            <td>
              <div class="text-center">
                <button
                  class="landing-btn !text-black !bg-[#E8E8E9] !hover:bg-[#E8E8E9] !font-medium"
                  @click="openChat"
                >
                  {{ $t('business.plans.contact_us') }}
                </button>
                <p class="text-black-500 mt-3">
                  {{ $t('business.plans.more_inf') }}
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'landing'
}
</script>

<style lang="scss" scoped>
td:nth-child(2),
th:nth-child(2) {
  background-color: #f4f9f5;
}
</style>
