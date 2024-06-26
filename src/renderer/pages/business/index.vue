<template>
  <div>
    <!-- HERO BANNER -->
    <section class="full-width h-auto">
      <div class="pt-20 mx-auto pb-10">
        <div class="w-full flex flex-wrap justify-end pl-6">
          <div
            class="lg:max-w-[570px] max-h-[485px] md:w-1/2 order-1 mb-8 md:mb-0 self-center"
          >
            <h1
              class="text-left font-bold text-black landing-font-50 mb-[24px]"
            >
              {{ $t('business.welcome.title') }}
            </h1>
            <p
              class="max-w-[476px] text-left font-normal text-black-600 landing-font-20 mt-6"
              v-html="$t('business.welcome.desc')"
            />

            <div
              v-if="locale === 'vi'"
              class="mt-4"
            >
              <a
                :href="$t('business.welcome.datasheet.url')"
                target="_blank"
                class="landing-font-18 font-semibold text-primary"
              >
                {{ $t('business.welcome.datasheet.title') }}
              </a>
            </div>

            <div class="max-w-xs mx-auto sm:max-w-none sm:flex mt-8">
              <div class="mb-4 sm:mb-0">
                <nuxt-link :to="localePath('/business/register')" class="landing-btn w-full sm:w-auto mb-1">
                  {{ $t('business.welcome.start') }}
                </nuxt-link>
              </div>
              <div>
                <a
                  class="landing-btn2 w-full sm:w-auto sm:ml-4"
                  :href="`${enterpriseUrl}/purchase`"
                >
                  {{ $t('business.welcome.purchase_now') }}
                </a>
              </div>
            </div>
          </div>
          <!-- Right -->
          <div class="hidden md:block md:w-1/2 order-2 pr-0 justify-self-end">
            <img
              v-if="locale === 'en'"
              :src="require(`~/assets/images/business/en/bg-welcome.png`)"
              alt=""
            >
            <img
              v-else
              :src="require(`~/assets/images/business/vi/bg-welcome.png`)"
              alt=""
            >
          </div>
          <div class="w-full md:hidden order-2 mt-24">
            <img
              v-if="locale === 'en'"
              :src="require(`~/assets/images/business/en/bg-welcome.png`)"
              alt=""
            >
            <img
              v-else
              :src="require(`~/assets/images/business/vi/bg-welcome.png`)"
              alt=""
            >
          </div>
          <!-- Right end -->
        </div>
      </div>
      <div class="max-w-6xl mx-auto px-6 mb-16 md:flex block gap-8">
        <div class="landing-font-16 text-black-500 mb-8">
          {{ $t('business.welcome.trusted_by') }}
        </div>
        <div class="md:flex grid grid-cols-2 gap-12">
          <img class="h-8" src="~/assets/images/business/vingroup.png">
          <img class="h-8" src="~/assets/images/business/vincss.png">
          <img class="h-8" src="~/assets/images/business/cystack.png">
          <img class="h-8" src="~/assets/images/business/whitehub.svg">
        </div>
      </div>
    </section>
    <!-- HERO BANNER END -->

    <!-- BENEFITS -->
    <section class="mt-5 pt-20">
      <div
        v-for="(item, index) in $t('business.benefits.list_item')"
        :key="index"
      >
        <div class="flex flex-wrap mb-20 gap-y-8">
          <div
            class="md:w-1/2 w-full"
            :class="
              index % 2 === 0
                ? 'md:pr-20 pr-0 order-1'
                : 'md:pl-20 pl-0 order-2'
            "
          >
            <h3 class="landing-font-38 font-semibold mb-6">{{ item.title }}</h3>
            <p class="landing-font-16 mb-8" v-html="item.desc" />
            <div>
              <a
                href="#register-section"
                class="landing-btn w-full sm:w-auto mb-1"
              >
                {{ $t('business.welcome.start') }}
              </a>
            </div>
          </div>
          <div
            class="md:w-1/2 w-full"
            :class="index % 2 === 0 ? 'order-2' : 'md:order-1 order-3'"
          >
            <img
              v-if="locale === 'en'"
              :src="require(`~/assets/images/business/en/${item.image}`)"
              :alt="item.title"
            >
            <img
              v-else
              :src="require(`~/assets/images/business/vi/${item.image}`)"
              :alt="item.title"
            >
          </div>
        </div>
      </div>
    </section>
    <!-- BENEFITS END -->

    <!-- TOP PRIORITY -->
    <section class="py-20">
      <h2 class="landing-font-42 font-semibold">
        {{ $t('business.top_priority.title') }}
      </h2>
      <div class="mt-8 grid md:grid-cols-3 grid-cols-1 gap-8">
        <div
          v-for="(item, index) in $t('business.top_priority.list_item')"
          :key="index"
        >
          <div class="w-full h-[180px] mb-6">
            <img
              class="mx-auto"
              :src="require(`~/assets/images/business/${item.image}`)"
            >
          </div>
          <div class="landing-font-24 font-semibold mb-6">{{ item.title }}</div>
          <div class="landing-font-16">{{ item.desc }}</div>
        </div>
      </div>
    </section>
    <!-- TOP PRIORITY END-->

    <!-- FEATURES -->
    <section class="py-20">
      <h3 class="landing-font-42 font-semibold">
        {{ $t('business.features.title') }}
      </h3>
      <div class="w-max landing-font-20 font-semibold my-8 border-b pb-3">
        {{ $t('business.features.for_members') }}
      </div>
      <div class="grid sm:grid-cols-2 grid-cols-1 gap-8">
        <div
          v-for="(item, index) in $t('business.features.member_features')"
          :key="index"
          class="border border-[#E8E8E9] rounded-xl py-16 px-8"
        >
          <img :src="require(`~/assets/images/business/${item.icon}`)">
          <div class="landing-font-24 font-semibold mt-3 mb-6">
            {{ item.title }}
          </div>
          <div class="landing-font-16">{{ item.desc }}</div>
        </div>
      </div>
      <div class="w-max landing-font-20 font-semibold my-8 border-b pb-3">
        {{ $t('business.features.for_admin') }}
      </div>
      <div class="grid sm:grid-cols-2 grid-cols-1 gap-8">
        <div
          v-for="(item, index) in $t('business.features.admin_features')"
          :key="index"
          class="border border-[#E8E8E9] rounded-xl py-16 px-8"
        >
          <img :src="require(`~/assets/images/business/${item.icon}`)">
          <div class="landing-font-24 font-semibold mt-3 mb-6">
            {{ item.title }}
          </div>
          <div class="landing-font-16">{{ item.desc }}</div>
        </div>
      </div>
    </section>
    <!-- FEATURES END -->

    <!-- PLANS -->
    <section class="py-20">
      <div class="flex flex-wrap mb-8 gap-y-6">
        <div class="md:w-1/2 w-full md:text-left text-center">
          <h2 class="landing-font-42 font-semibold">
            {{ $t('business.plans.title') }}
          </h2>
        </div>
        <div class="md:w-1/2 w-full md:text-right text-center self-center">
          <nuxt-link :to="localePath('/business/pricing')" class="landing-btn">
            {{ $t('business.plans.learn_more') }}
          </nuxt-link>
        </div>
      </div>
      <div class="grid sm:grid-cols-2 grid-cols-1 gap-8 mb-8 text-center">
        <div class="border border-[#E8E8E9] rounded-xl p-8">
          <div class="px-6 py-6 font-medium">
            <div class="h-[50px] landing-font-24 font-semibold">Business</div>
            <div class="h-[100px]">
              <div class="flex justify-center gap-12">
                <div>
                  <span class="landing-font-28 font-semibold">{{
                    $t('business.plans.price1_1')
                  }}</span>
                  <br>
                  <span class="landing-font-16 font-semibold">
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
                  <span class="landing-font-16 font-semibold">
                    {{ $t('business.plans.per_month') }}
                  </span>
                  <br>
                  <span
                    class="landing-font-14 text-black-500 lowercase whitespace-nowrap"
                  >{{ $t('business.plans.yearly_pack') }}</span>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <a
                href="#register-section"
                class="landing-btn w-full sm:w-auto mb-1"
              >
                {{ $t('business.welcome.start') }}
              </a>
            </div>
            <p class="mt-3">
              {{ $t('business.plans.or') }}
              <span>
                <a :href="`${enterpriseUrl}/purchase`" class="text-info">
                  {{ $t('business.plans.do_it') }}
                </a>
              </span>
            </p>
          </div>
          <p class="landing-font-16">{{ $t('business.plans.desc1') }}</p>
        </div>
        <div class="border border-[#E8E8E9] rounded-xl p-8">
          <div class="px-8 py-6 font-medium">
            <div class="h-[50px] landing-font-24 font-semibold">Enterprise</div>
            <div
              class="h-[100px] uppercase text-black-500 flex items-center justify-center"
              v-html="$t('business.plans.variable_price')"
            />
            <div class="mt-4">
              <a
                :href="`mailto: ${$t('landing_affiliate.help_box.email')}`"
                target="_blank"
              >
                <button
                  class="landing-btn !text-black !bg-[#E8E8E9] !hover:bg-[#E8E8E9] !font-medium"
                >
                  {{ $t('business.plans.contact_us') }}
                </button>
              </a>
            </div>
            <p class="text-black-500 mt-3">
              {{ $t('business.plans.more_inf') }}
            </p>
          </div>
          <p class="landing-font-16">{{ $t('business.plans.desc2') }}</p>
        </div>
      </div>
      <div
        class="p-6 bg-[#E4F0E6] rounded-xl flex justify-between landing-font-20 font-semibold"
      >
        <div class="flex-grow">{{ $t('business.plans.more_options') }}</div>
        <a
          :href="`mailto: ${$t('landing_affiliate.help_box.email')}`"
          target="_blank"
        >{{ $t('business.plans.contact_us') }}</a>
      </div>
    </section>

    <!-- FORM -->
    <div id="register-section" class="bg-[#69A757] py-20 full-width">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center text-white mb-10">
          <h2 class="landing-font-42 font-semibold mb-4">
            {{ $t('business.get_started.title') }}
          </h2>
          <p class="landing-font-16">{{ $t('business.get_started.desc') }}</p>
        </div>
        <div class="w-full md:w-1/2 mx-auto">
          <BusinessRegistrationForm />
        </div>
      </div>
    </div>

    <!-- FAQs -->
    <section class="py-20 questions">
      <div class="landing-font-38 font-bold text-center mb-[72px]">
        {{ $t('business.faqs.title') }}
      </div>
      <div class="max-w-6xl mx-auto">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item
            v-for="(item, index) in $t('business.faqs.list_item')"
            :key="index"
            :name="(index + 1).toString()"
          >
            <template slot="title">
              <div class="font-bold landing-font-22 text-black question">
                {{ item.title }}
              </div>
            </template>
            <div
              class="answer font-normal landing-font-18 pl-[58px] md:pr-[80px] pr-[50px] md:py-[38px] py-[15px]"
              v-html="item.desc"
            />
          </el-collapse-item>
        </el-collapse>
      </div>
    </section>

    <div
      class="bg-[#69A757] rounded-2xl md:py-16 py-8 md:px-[94px] px-8 flex flex-col md:flex-row flex-wrap items-center mb-16"
    >
      <div class="text-white landing-font-42 font-semibold flex-1 md:w-auto md:mr-8 text-center md:text-left">
        {{ $t('business.cta.title') }}
      </div>
      <div class="mt-8 md:mt-0">
        <button
          class="landing-btn !bg-white !text-primary"
          style="min-width: 170px"
          @click="openChat"
        >
          {{ $t('business.cta.button') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import BusinessRegistrationForm from '~/components/landing/BusinessRegistrationForm'
export default {
  components: {
    BusinessRegistrationForm
  },
  layout: 'landing',
  data () {
    return {
      activeName: '1'
    }
  },
  methods: {
    goto (id) {
      if (process.client) {
        const el = document.getElementById(id)
        if (el) {
          console.log(el.g)
          window.scroll({
            top: el.offsetTop,
            left: 0,
            behavior: 'smooth'
          })
        }
      }
    },
    isViLocale () {
      return this.$router.history.current.path.includes('/vi/')
    }
  }
}
</script>

<style lang="scss" scoped></style>
