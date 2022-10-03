<template>
  <div>
    <!-- HERO BANNER -->
    <section
      class="full-width h-auto"
    >
      <div class="pt-20 mx-auto pb-10">
        <div class="w-full flex flex-wrap justify-end pl-6">
          <div class="lg:max-w-[570px] max-h-[485px] md:w-1/2 order-1 mb-8 md:mb-0 self-center">
            <h1 class="text-left font-bold text-black landing-font-50 mb-[24px]">
              {{ $t('business.welcome.title') }}
            </h1>
            <p
              class="max-w-[476px] text-left font-normal text-black-600 landing-font-20 mb-8 mt-6"
              v-html="$t('business.welcome.desc')"
            />
            <div class="max-w-xs mx-auto sm:max-w-none sm:flex">
              <div class="mb-4 sm:mb-0">
                <a
                  class="landing-btn w-full sm:w-auto mb-1"
                  @click.prevent="goto('register-section')"
                >
                  {{ $t('business.welcome.start') }}
                </a>
                <p class="italic w-full landing-font-14 mt-1">
                  {{ $t('landing.section1.btn[0].note') }}
                </p>
              </div>
              <div>
                <a
                  class="landing-btn2 w-full sm:w-auto sm:ml-4"
                  :href="`${enterpriseUrl}/admin/billing`"
                >
                  {{ $t('business.welcome.purchase_now') }}
                </a>
              </div>
            </div>
          </div>
          <!-- Right -->
          <div class="hidden md:block md:w-1/2 order-2 pr-0 justify-self-end">
            <img
              src="~/assets/images/business/bg-welcome.png"
              alt=""
            >
          </div>
          <div class="w-full md:hidden order-2 mt-24">
            <img
              src="~/assets/images/business/bg-welcome.png"
              alt=""
            >
          </div>
          <!-- Right end -->
        </div>
      </div>
      <div class="max-w-6xl mx-auto px-6 mb-16 md:flex block gap-8">
        <div class="landing-font-16 text-black-500 mb-8">{{ $t('business.welcome.trusted_by') }}</div>
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
      <div v-for="(item, index) in $t('business.benefits.list_item')" :key="index">
        <div class="flex flex-wrap mb-20 gap-y-8">
          <div class="md:w-1/2 w-full" :class="index%2===0?'md:pr-20 pr-0 order-1':'md:pl-20 pl-0 order-2'">
            <h3 class="landing-font-38 font-semibold mb-6">{{ item.title }}</h3>
            <p class="landing-font-16 mb-8" v-html="item.desc" />
            <div class="">
              <a class="landing-btn" @click.prevent="goto('register-section')">Start a free trial</a>
            </div>
          </div>
          <div class="md:w-1/2 w-full" :class="index%2===0?'order-2':'md:order-1 order-3'">
            <img :src="require(`~/assets/images/business/${item.image}`)" :alt="item.title">
          </div>
        </div>
      </div>
    </section>
    <!-- BENEFITS END -->

    <!-- TOP PRIORITY -->
    <section
      class="py-20"
    >
      <h2 class="landing-font-42 font-semibold">{{ $t('business.top_priority.title') }}</h2>
      <div class="mt-8 grid md:grid-cols-3 grid-cols-1 gap-8">
        <div v-for="(item, index) in $t('business.top_priority.list_item')" :key="index">
          <div class="w-full h-[180px] mb-6">
            <img class="mx-auto" :src="require(`~/assets/images/business/${item.image}`)">
          </div>
          <div class="landing-font-24 font-semibold mb-6">{{ item.title }}</div>
          <div class="landing-font-16">{{ item.desc }}</div>
        </div>
      </div>
    </section>
    <!-- TOP PRIORITY END-->

    <!-- FEATURES -->
    <section class="py-20">
      <h3 class="landing-font-42 font-semibold">{{ $t('business.features.title') }}</h3>
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
          <div class="landing-font-24 font-semibold mt-3 mb-6">{{ item.title }}</div>
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
          <div class="landing-font-24 font-semibold mt-3 mb-6">{{ item.title }}</div>
          <div class="landing-font-16">{{ item.desc }}</div>
        </div>
      </div>
    </section>
    <!-- FEATURES END -->

    <!-- CLIENTS SAY -->
    <!-- <section
      class="py-20 bg-[#F5F5F5] full-width"
    >
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="landing-font-42 font-semibold">{{ $t('business.clients_say.title') }}</h2>
        <div class="mt-8 grid md:grid-cols-3 grid-cols-1 gap-8">
          <div
            v-for="(item, index) in $t('business.clients_say.list_item')"
            :key="index"
            class="bg-white rounded-xl py-8 px-6"
          >
            <div class="landing-font-20 font-semibold mb-10">{{ item.quote }}</div>
            <div class="landing-font-14 font-bold">{{ item.name }}</div>
            <div>{{ item.job_title }}</div>
            <hr class="text-black-200 my-5">
            <div class="flex justify-between items-center">
              <img class="h-7" :src="require(`~/assets/images/business/${item.logo}`)">
              <img :src="require(`~/assets/images/business/${item.avatar}`)">
            </div>
          </div>
        </div>
      </div>
    </section> -->
    <!-- CLIENTS SAY END-->

    <!-- PLANS -->
    <section class="py-20">
      <div class="flex flex-wrap mb-8 gap-y-6">
        <div class="md:w-1/2 w-full md:text-left text-center">
          <h2 class="landing-font-42 font-semibold">{{ $t('business.plans.title') }}</h2>
        </div>
        <div class="md:w-1/2 w-full md:text-right text-center self-center">
          <nuxt-link :to="localePath('/business/plans')" class="landing-btn">
            {{ $t('business.plans.learn_more') }}
          </nuxt-link>
        </div>
      </div>
      <div class="grid sm:grid-cols-2 grid-cols-1 gap-8 mb-8">
        <!-- <div
          v-for="(item, index) in $t('business.plans.list_item')"
          :key="index"
          class="border border-[#E8E8E9] rounded-xl p-8"
        >
          <div class="landing-font-24 font-semibold mb-3">{{ item.title }}</div>
          <p class="landing-font-16">{{ item.desc }}</p>
        </div> -->
        <div class="border border-[#E8E8E9] rounded-xl p-8 text-center">
          <div class="landing-font-24 font-semibold mb-5">Business</div>
          <div class="flex justify-center gap-16">
            <div>
              <span class="landing-font-28 font-semibold">$5</span>
              <br>
              <span class="landing-font-20 text-black-500">{{ $t('plan.monthly') }}</span>
            </div>
            <div>
              <span class="landing-font-28 font-semibold">$8</span>
              <br>
              <span class="landing-font-20 text-black-500">{{ $t('plan.annually') }}</span>
            </div>
          </div>
          <a class="landing-btn mt-8" @click.prevent="goto('register-section')">
            {{ $t('business.welcome.start') }}
          </a>
          <p class="mt-3">or <span><a :href="`${enterpriseUrl}/admin/billing`" class="text-info">Purchase now</a></span></p>
        </div>
        <div class="border border-[#E8E8E9] rounded-xl p-8 text-center">
          <div class="landing-font-24 font-semibold mb-9">Enterprise</div>
          <div class="uppercase text-black-500">
            PRICE IS SUBJECT TO <br> CUSTOM TERMS
          </div>
          <div class="mt-9">
            <button class="landing-btn !text-black !bg-[#E8E8E9] !hover:bg-[#E8E8E9]" @click="openIntercom">
              {{ $t('business.plans.contact_us') }}
            </button>
          </div>
        </div>
      </div>
      <div class="p-6 bg-[#E4F0E6] rounded-xl flex justify-between landing-font-20 font-semibold">
        <div class="flex-grow">{{ $t('business.plans.more_options') }}</div>
        <div class="text-primary cursor-pointer" @click="openIntercom">{{ $t('business.plans.contact_us') }}</div>
      </div>
    </section>

    <!-- FORM -->
    <div id="register-section" class="bg-[#69A757] py-20 full-width">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center text-white mb-10">
          <h2 class="landing-font-42 font-semibold mb-4">{{ $t('business.get_started.title') }}</h2>
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
          <el-collapse-item v-for="(item, index) in $t('business.faqs.list_item')" :key="index" :name="(index+1).toString()">
            <template slot="title">
              <div class="font-bold landing-font-22 text-black question">
                {{ item.title }}
              </div>
            </template>
            <div class="answer font-normal landing-font-18 pl-[58px] md:pr-[80px] pr-[50px] md:py-[38px] py-[15px]" v-html="item.desc" />
          </el-collapse-item>
        </el-collapse>
      </div>
    </section>
    <div class="bg-[#69A757] rounded-2xl md:py-16 py-8 md:px-[94px] px-8 md:flex block justify-between mb-16">
      <div class="text-white landing-font-42 font-semibold flex-grow">{{ $t('business.cta.title') }}</div>
      <div class="self-center">
        <button class="landing-btn !bg-white !text-primary" @click="openIntercom">{{ $t('business.cta.button') }}</button>
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
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
