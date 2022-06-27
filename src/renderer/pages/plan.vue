<template>
  <div>
    <section
      class="full-width h-auto pt-40"
      style="background-color: #f5f6f7"
    >
      <h1 class="max-w-[700px] font-bold landing-font-50 text-center mx-auto">{{ title }}</h1>
      <div class="mt-[100px] pb-[140px] max-w-6xl mx-auto px-6">
        <div class="flex">
          <button
            class="btn-round btn-left-round !border-[#d8d8d9]"
            :class="periodSwitch?'text-black':'text-primary'"
            @click="periodSwitch=false"
          >
            {{ monthly }}
          </button>
          <button
            class="btn-round btn-right-round !border-[#d8d8d9]"
            :class="periodSwitch?'text-primary':'text-black'"
            @click="periodSwitch=true"
          >
            {{ annually }} <br> {{ $t('data.plans.bill_annually_desc') }}
          </button>
        </div>
        <div v-if="$t('plan.money_vi') != null" class="relative h-6">
          <div class="absolute top-0 right-1 italic landing-font-14 font-normal" style="color: #5A6176">
            {{ $t('plan.money_vi') }}
          </div>
        </div>
        <div class="w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-[30px] gap-y-[30px]">
          <div
            v-for="(plan, index) in plans"
            :key="index"
            class="landing-transition px-9 py-14 bg-white relative z-10 rounded-xl hover:shadow-xl"
          >
            <!-- <p
              v-if="index===2"
              class="bg-black uppercase text-white w-[100px] text-center absolute right-6 top-6 rounded-sm"
            >
              {{ save17 }}
            </p> -->
            <p class="landing-font-20 text-green">{{ plan.title }}</p>
            <p class="mt-4">
              <span v-if="!(plan.alias==='pm_free'&&periodSwitch)" :class="periodSwitch?'line-through landing-font-16 text-black':'font-bold landing-font-50'">${{ plan.price.usd }}</span>
              <span
                v-if="periodSwitch && plan.yearly_price"
                class="font-bold landing-font-50"
              >${{ (plan.yearly_price.usd / 12) | formatNumber }}</span>
              <span v-if="plan.duration" class="landing-font-16">/{{ plan.duration }}</span><span v-if="plan.accounts" class="landing-font-16">/{{ plan.accounts }}</span>
            </p>
            <div
              v-if="periodSwitch"
              class="flex items-center mt-1"
            >
              <div v-if="plan.alias != 'pm_free'">
                {{ $t('data.plans.price_12months') }} ${{ plan.yearly_price.usd }} <span class="py-[1px] px-2 bg-primary text-white rounded-[20px]">{{ $t('data.plans.save') }} {{ discountPercentage(plan) }}%</span>
              </div>
            </div>
            <ul class="ml-3 my-[30px]">
              <li
                v-for="(detail, ind) in plan.desc"
                :key="ind"
                class="landing-font-14 mb-[10px] relative"
                style="color: #5A6176"
              >
                {{ detail }}
                <span
                  v-if="['Thiết lập Liên hệ Khẩn cấp', 'Emergency access'].includes(detail)"
                  class="info"
                >
                  <i class="fa fa-info-circle" />
                  <span
                    class="tooltiptext"
                    style="font-size: 11px"
                  >{{ contact_info }}</span>
                </span>
              </li>
            </ul>
            <!-- <template v-if="periodSwitch">
              <p
                v-for="(item, ind) in plan.note"
                :key="ind"
                class="landing-font-12"
                style="color: #5A6176"
              >
                {{ item }}
              </p>
            </template> -->
            <div class="mt-10">
              <div class="text-center absolute bottom-5 left-6 right-12">
                <a
                  v-if="plan.button.external_link"
                  class="landing-btn !w-full sm:w-auto sm:ml-4"
                  style="font-weight: 600"
                  :href="plan.button.external_link"
                >
                  {{ plan.button.text }}
                </a>
                <nuxt-link
                  v-else
                  class="landing-btn2 !w-full sm:w-auto sm:ml-4"
                  style="font-weight: 600"
                  :to="localeRoute({name: plan.button.link})"
                >
                  {{ plan.button.text }}
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="mt-[140px] mb-[150px]">
      <div class="max-w-6xl mx-auto">
        <div class="w-full overflow-auto">
          <table class="w-full">
            <thead>
              <tr>
                <th class="w-3/12 text-left pl-6 pb-5 landing-font-18">{{ $t('plan.feature') }}</th>
                <th class="w-1/12 pb-5 landing-font-18">Free</th>
                <th class="w-8/36 pb-5 landing-font-18">Premium</th>
                <th class="w-8/36 pb-5 landing-font-18">Family</th>
                <!-- <th class="w-8/36 pb-5 landing-font-18">Business</th> -->
              </tr>
            </thead>
            <tbody>
              <template v-for="(feature, index) in feature_plan">
                <tr
                  :key="index"
                  style="background-color: #FBFAF3;"
                >
                  <td
                    colspan="100%"
                    class="py-[18px] pl-6 text-green font-semibold landing-font-16"
                  >
                    {{ feature.title }}
                  </td>
                </tr>
                <tr :key="index">
                  <td
                    colspan="100%"
                    class="pb-5"
                  />
                </tr>
                <tr
                  v-for="(item, idx) in feature.features"
                  :key="idx"
                >
                  <td
                    class="pl-6 landing-font-16 pb-5"
                    style="color: #5A6176"
                  >
                    {{ item.label }}
                  </td>
                  <td
                    v-for="(plan, ind) in item.plans"
                    :key="ind"
                    class="text-center pb-5"
                  >
                    <img
                      v-if="plan===true"
                      class="mx-auto"
                      src="~/assets/images/landing/plan/true.svg"
                    >
                    <img
                      v-else-if="plan===false"
                      class="mx-auto"
                      src="~/assets/images/landing/plan/false.svg"
                    >
                    <p
                      v-else
                      v-html="plan"
                    />
                  </td>
                </tr>
              </template>
              <tr style="background-color: #FBFAF3;">
                <td class="py-[18px] pl-6 text-green landing-font-16 font-semibold">{{ $t('plan.price') }}</td>
                <td class="py-[18px] pl-6 text-green landing-font-16 text-center">${{ plans[0].yearly_price.usd/12 | formatNumber }}</td>
                <td class="py-[18px] pl-6 text-green landing-font-16 text-center">${{ plans[1].yearly_price.usd/12 | formatNumber }}/{{ $t('plan.plans[1].duration') }}</td>
                <td class="py-[18px] pl-6 text-green landing-font-16 text-center">${{ plans[2].yearly_price.usd/12 | formatNumber }}/{{ $t('plan.plans[2].duration') }}/<br>{{ $t('plan.plans[2].accounts') }}</td>
                <!-- <td class="py-[18px] pl-6 text-green landing-font-16 text-center">{{ $t('plan.plans[3].price') }}</td> -->
              </tr>
              <tr>
                <td />
                <td
                  v-for="(button, index) in subscription_button"
                  :key="index"
                  class="pt-5"
                >
                  <div class="text-center" style="margin: 0 5px;">
                    <a
                      v-if="button.external_link"
                      class="landing-btn !w-full sm:w-auto sm:ml-4"
                      style="font-weight: 600"
                      :href="button.external_link"
                    >
                      {{ button.text }}
                    </a>
                    <nuxt-link
                      v-else
                      class="landing-btn2 w-full sm:w-auto sm:ml-4"
                      style="font-weight: 600"
                      :to="localeRoute({name: button.link})"
                    >
                      {{ button.text }}
                    </nuxt-link>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Feature -->
    <section
      class="full-width w-full h-auto md:pb-[140px] pb-20"
      style="background-color: #f5f6f7"
    >
      <div class="max-w-6xl mx-auto px-6">
        <div class="w-full flex flex-wrap">
          <div class="w-full md:mb-0 md:pt-[115px] pt-20 text-center order-1">
            <h2
              class="
                w-full
                font-bold
                landing-font-38
                text-black
                mb-[20px]
                max-w-[589px]
                mx-auto
              "
            >
              {{ features.title }}
            </h2>
            <img
              src="~/assets/images/landing/index/boundary2.svg"
              alt=""
              class="mx-auto"
            >
          </div>
          <div
            class="
              w-full
              mt-[45px]
              grid grid-cols-1
              md:grid-cols-2
              lg:grid-cols-4
              gap-x-[45px]
              lg:gap-x-[30px]
              gap-y-[45px]
              order-2
            "
          >
            <div
              v-for="(item, index) in features.details"
              :key="index"
              class="landing-transition px-[30px] pt-11 bg-white rounded-lg hover:shadow-xl"
            >
              <img
                :src="require(`~/assets/images/landing/plan/${item.img}`)"
                :alt="item.title"
                class="h-[40px] mb-[16px]"
              >
              <h3 class="mb-[12px] font-bold text-black landing-font-20">
                {{ item.title }}
              </h3>
              <p class="lg:max-w-[265px] mb-[40px]">
                {{ item.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Feature end -->

    <!--    Questions-->
    <section
      class="full-width h-auto py-[130px]"
      style="background-color: #FBFAF3"
    >
      <div class="max-w-6xl mx-auto px-6">
        <div class="w-8/12 mx-auto">
          <h2 class="landing-font-38 font-bold mb-[35px]">{{ question.title }}</h2>
          <div
            v-for="(qa, index) in question.question_list"
            :key="index"
            class="mb-[35px]"
          >
            <h3 class="landing-font-22 font-bold mb-3">{{ qa.question }}</h3>
            <p
              class="landing-font-14"
              style="color: #5A6176"
            >
              {{ qa.answer }}
            </p>
            <hr v-if="index!==question.question_list.length-1" class="opacity-50 mt-[35px]" style="color: #CFD6E4">
          </div>
        </div>
      </div>
    </section>
    <!--    Questions end-->
  </div>
</template>

<script>
import numeral from 'numeral'
export default {
  layout: 'landing',
  data () {
    return {
      ...this.$t('plan'),
      periodSwitch: true,
      lockerPlans: []
    }
  },
  async mounted () {
    this.lockerPlans = await this.$axios.$get('resources/cystack_platform/pm/plans') || []
    this.plans = this.plans.map(item => {
      const plan = this.lockerPlans.find(el => el.alias === item.alias)
      return {
        ...item,
        price: plan?.price,
        yearly_price: plan?.yearly_price
      }
    })
  },
  methods: {
    discountPercentage (plan) {
      const fullPrice = plan.price.usd * 12
      const discount = fullPrice - plan.yearly_price.usd
      const discountPercentage = discount * 100 / fullPrice
      if (!Number.isNaN(discountPercentage)) {
        return numeral(discountPercentage).format('0,0')
      }
      return 0
    }
  }
}
</script>

<style scoped>
ul {
  list-style-image: url('~/assets/images/landing/plan/list_bullet.svg');
}

/* ul li::before {
  content: "\2022";
  color: #268334;
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
} */

.info:hover .tooltiptext {
  visibility: visible;
}

.tooltiptext {
  visibility: hidden;
  width: 305px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 5px;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  transform: translateY(-60px) translateX(-150px);
}
</style>
