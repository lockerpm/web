<template>
  <div>
    <!-- Header -->
    <section class="pt-10">
      <div class="relative w-full">
        <div class="flex max-w-7xl mx-auto px-6 flex-wrap">
          <div class="lg:w-1/2 w-full">
            <div style="margin-bottom: 70px">
              <a href="/" target="_blank">
                <img
                  class="h-12"
                  src="~/assets/images/logo/logo_black_with_text.svg"
                >
              </a>
            </div>

            <h1 class="font-semibold font-sans text-black landing-font-81 mb-8" v-html="$t('sme.header.title')" />
            <p class="landing-font-20 mb-8">
              {{ $t('sme.header.desc') }}
            </p>

            <div class="flex flex-wrap items-center mb-16">
              <div class="bg-primary rounded-full px-9 py-3 text-white font-semibold landing-font-21 cursor-pointer hover:opacity-70 transition-opacity">
                {{ $t('sme.header.btn') }}
              </div>
              <a href="#" class="text-primary font-medium ml-4 landing-font-21">
                {{ $t('sme.header.trial') }}
                <i class="el-icon-arrow-right" />
              </a>
            </div>
          </div>
        </div>

        <div class="hidden lg:flex w-11/12 max-w-7xl absolute right-0 bottom-0">
          <div ref="animationHero" />
        </div>
      </div>

      <!-- Slider -->
      <div class="full-width bg-primary text-white py-4 landing-font-24">
        <p v-for="(item, index) in $t('sme.header.sliders')" :key="index" v-html="item" />
      </div>
      <!-- Slider end -->
    </section>
    <!-- Header end -->

    <!-- Customers -->
    <section class="py-20 max-w-7xl mx-auto px-6">
      <div class="w-10/12 mx-auto bg-[#FAFAFA] rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4 p-12">
        <div class="md:pr-4">
          <h2 class="text-black landing-font-54 font-semibold mb-8">
            {{ $t('sme.customers.title') }}
          </h2>
          <div
            v-for="(item, index) in $t('sme.customers.descs')"
            :key="index"
            class="flex items-center border-black-50 py-3"
            :class="{ 'border-t': index !== 0 }"
          >
            <img
              class="h-12 mr-3"
              :src="require(`~/assets/images/pages/sme/customers/desc-${index + 1}.svg`)"
            >
            <p class=" landing-font-18">
              {{ item }}
            </p>
          </div>
        </div>

        <!-- Logos -->
        <div class="flex flex-col items-center">
          <div class="flex items-center justify-between overflow-y-auto mb-10">
            <img
              v-for="(item, index) in customers"
              :key="item"
              class="h-10 transition-all grayscale cursor-pointer"
              :class="{ 'grayscale-[50%]': item === currentCustomer, 'ml-3': index !== 0 }"
              :src="require(`~/assets/images/pages/sme/customers/${item}.png`)"
              @click="currentCustomer = item"
            >
          </div>
          <img
            class="w-full max-h-[200px] mb-10 transition-all object-cover"
            :src="require(`~/assets/images/pages/sme/customers/${currentCustomer}.png`)"
          >
          <p class="italic text-center">
            {{ $t('sme.customers.logo_desc') }}
          </p>
        </div>
        <!-- Logos end -->
      </div>
    </section>
    <!-- Customers end -->

    <!-- Features -->
    <section class="py-20 max-w-7xl mx-auto px-6">
      <h2 class="landing-font-81 text-black font-semibold max-w-[600px] mb-8">
        {{ $t('sme.features.title') }}
      </h2>

      <!-- Buttons -->
      <div class="flex justify-between items-center flex-wrap mb-16">
        <div class="flex items-center">
          <div
            class="flex items-center cursor-pointer px-6 py-4 rounded-full bg-[#FFC069] mr-3"
            :class="{ 'opacity-80': currentFeatureGroup !== 'staff' }"
            @click="currentFeatureGroup = 'staff'"
          >
            <img
              class="h-6 mr-3 text-black"
              src="~/assets/images/pages/sme/features/staff-icon.svg"
            >
            <p class="landing-font-20 font-semibold text-black">
              {{ $t('sme.features.staff.btn') }}
            </p>
          </div>

          <div
            class="flex items-center cursor-pointer px-6 py-4 rounded-full bg-[#69C0FF]"
            :class="{ 'opacity-20': currentFeatureGroup !== 'admin' }"
            @click="currentFeatureGroup = 'admin'"
          >
            <img
              class="h-6 mr-3 text-black"
              src="~/assets/images/pages/sme/features/admin-icon.svg"
            >
            <p class="landing-font-20 font-semibold text-black">
              {{ $t('sme.features.admin.btn') }}
            </p>
          </div>
        </div>
      </div>
      <!-- Buttons end -->

      <!-- Carousel -->
      <carousel
        :per-page-custom="[
          [0, 1],
          [480, 1],
          [768, 2],
          [1024, 3],
          [1280, 4]
        ]"
        :pagination-enabled="false"
        navigation-enabled
      >
        <slide v-for="(item, index) in $t(`sme.features.${currentFeatureGroup}.items`)" :key="index">
          <div
            class="border rounded border-black-50 py-6 px-6 h-full flex flex-col items-center text-center"
            :class="{ 'ml-8': index !== 0 }"
          >
            <img
              class="h-16"
              :src="require(`~/assets/images/pages/sme/features/${currentFeatureGroup}-${index + 1}.svg`)"
            >
            <h3 class="font-semibold text-black landing-font-24 my-3">
              {{ item.title }}
            </h3>
            <p class="text-black flex-1">
              {{ item.desc }}
            </p>
          </div>
        </slide>
      </carousel>
      <!-- Carousel end -->
    </section>
    <!-- Features end -->

    <!-- Hero -->
    <section class="bg-[#FAFAFA]">
      <div class="flex max-w-7xl mx-auto px-6 py-10 items-center justify-between flex-wrap">
        <div class="w-1/2">
          <h2 class="landing-font-81 text-black font-semibold max-w-[600px]">
            {{ $t('sme.hero.title') }}
          </h2>
        </div>
        <div class="w-1/2" />
      </div>
    </section>
    <!-- Hero end -->

    <!-- News -->
    <section class="py-20 max-w-7xl mx-auto px-6">
      <div class="w-10/12 mx-auto rounded-2xl border border-primary flex flex-wrap overflow-hidden">
        <div class="w-7/12 flex flex-col p-6 items-start">
          <h2 class="text-[36px] leading-[48px] font-semibold text-black mb-8">
            {{ $t('sme.news.title') }}
          </h2>
          <p class="mb-8">
            {{ $t('sme.news.desc') }}
          </p>
          <div>
            <div class="border border-primary rounded-full py-2 px-6 cursor-pointer">
              <p class="text-primary font-medium">
                {{ $t('sme.news.btn') }} &nbsp; <i class="el-icon-arrow-right" />
              </p>
            </div>
          </div>
        </div>

        <div class="w-5/12">
          <img
            src="~/assets/images/pages/sme/news.png"
            class="w-full h-full object-cover"
          >
        </div>
      </div>
    </section>
    <!-- News end -->

    <!-- Process -->
    <section class="max-w-7xl mx-auto px-6">
      <div ref="animationProcess" class="hidden lg:flex" />
      <div class="flex flex-col lg:hidden">
        <h2 class="landing-font-54 font-semibold text-black mb-6">
          {{ $t('sme.process.title') }}
        </h2>
        <div
          v-for="(item, index) in $t('sme.process.items')"
          :key="index"
          class="rounded-2xl border border-primary flex flex-col items-center text-center p-5 mt-6"
        >
          <img
            class="h-16 mb-4"
            :src="require(`~/assets/images/pages/sme/process/process-${index + 1}.svg`)"
          >
          <h3 class="font-semibold text-black landing-font-21 mb-4">
            {{ item.title }}
          </h3>
          <p class="text-black">
            {{ item.desc }}
          </p>
        </div>
      </div>
    </section>
    <!-- Process end -->

    <!-- Why -->
    <section class="py-20 max-w-7xl mx-auto px-6">
      <h2 class="landing-font-54 font-semibold text-black max-w-[800px] mb-6">
        {{ $t('sme.why.title') }}
      </h2>

      <table>
        <tbody>
          <tr class="text-center">
            <td />
            <td class="py-8 bg-[#E9FFEC] rounded-tl-2xl rounded-tr-2xl px-6">
              <p class="landing-font-24 font-semibold text-black">
                Locker Password Manager
              </p>
            </td>
            <td class="pr-4" />
            <td class="py-8 bg-[#F5F5F5] rounded-tl-2xl rounded-tr-2xl px-6">
              <p class="landing-font-24 font-semibold text-black">
                {{ $t('sme.why.table.other_pm') }}
              </p>
            </td>
          </tr>
          <tr
            v-for="(item, index) in $t('sme.why.table.items')"
            :key="index"
            class=" border-black-50"
            :class="{'border-t': index !== 0}"
          >
            <td class="text-black py-3 pr-4 landing-font-16">
              {{ item }}
            </td>
            <td
              class="landing-font-21 bg-[#E9FFEC] text-center"
              :class="index === $t('sme.why.table.items').length - 1 ? 'rounded-bl-2xl rounded-br-2xl' : ''"
            >
              <i class="el-icon-success text-primary" />
            </td>
            <td class="pr-4" />
            <td
              class="landing-font-21 bg-[#F5F5F5] text-center"
              :class="index === $t('sme.why.table.items').length - 1 ? 'rounded-bl-2xl rounded-br-2xl' : ''"
            >
              <i class="el-icon-error text-danger" />
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <!-- Why end -->

    <!-- Contact -->
    <section class="py-20 max-w-7xl mx-auto px-6">
      <div class="rounded-2xl bg-[#FAFAFA] flex items-center">
        <div class="w-1/2 hidden lg:flex">
          <div ref="animationContact" />
        </div>
        <div class="lg:w-1/2 w-full flex flex-col items-center p-10">
          <h2 class="landing-font-81 font-semibold text-black mb-3">
            {{ $t('sme.contact.title') }}
          </h2>
          <p class="landing-font-16 mb-8">
            {{ $t('sme.contact.desc') }}
          </p>

          <div class="border rounded-2xl border-black-50 p-12 bg-white mb-8 w-full" />

          <el-button type="primary" round class="w-full">
            {{ $t('common.send') }}
          </el-button>
        </div>
      </div>
    </section>
    <!-- Contact end -->

    <!-- Questions -->
    <section id="faq" class="py-20 mb-20 max-w-7xl mx-auto px-6 border-black-50 border-t border-b">
      <div class="flex flex-wrap">
        <div class="w-1/2">
          <h2 class="landing-font-54 font-semibold text-black">
            {{ $t('sme.questions.title') }}
          </h2>
        </div>
        <div class="w-1/2">
          <el-collapse accordion>
            <el-collapse-item
              v-for="(item, index) in $t('sme.questions.items')"
              :key="index"
              :name="index"
            >
              <template slot="title">
                <h3 class="landing-font-24 text-black font-semibold">
                  <i class="text-primary el-icon-plus" />
                  <i class="text-primary el-icon-minus" /> &nbsp;
                  {{ item.title }}
                </h3>
              </template>
              <p class="landing-font-16 pl-14">
                {{ item.desc }}
              </p>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </section>
    <!-- Questions end -->

    <!-- CTA -->
    <section id="cta" class="pt-20 pb-6 bg-primary">
      <div class="max-w-7xl mx-auto px-6 rounded-2xl flex flex-col items-center mb-12 py-20">
        <h2 class="landing-font-81 font-semibold text-white max-w-[658px] text-center mb-6">
          {{ $t('sme.cta.title') }}
        </h2>
        <div class="flex flex-wrap items-center">
          <div class="bg-primary rounded-full px-9 py-3 text-white font-semibold landing-font-21 cursor-pointer hover:opacity-90 transition-opacity">
            {{ $t('sme.cta.btn') }}
          </div>
          <a href="#" class="text-white font-medium ml-4 landing-font-21 hover:text-white">
            {{ $t('sme.header.trial') }}
            <i class="el-icon-arrow-right" />
          </a>
        </div>
      </div>

      <div
        class="md:flex md:items-centerlanding-font-12 text-white max-w-7xl mx-auto px-6"
      >
        <div class="flex items-center">
          <div v-if="locale === 'vi'">Một sản phẩm của</div>
          <div v-else>A product of</div>
          <a
            :href="
              locale === 'vi' ? 'https://cystack.net/vi' : 'https://cystack.net'
            "
            target="_blank"
          >
            <img
              class="h-4 ml-2 mr-3"
              src="~/assets/images/logo/cystack_white.svg"
              alt="CyStack"
            >
          </a>
        </div>
        <p class="!break-normal">
          Copyright © {{ currentYear }} Locker.io · All rights reserved.
        </p>
        <div class="flex-grow md:text-right">
          <nuxt-link
            :to="localePath(`/terms`)"
            class="mr-4 text-white hover:text-white"
          >
            {{ $t('landing_footer.terms') }}
          </nuxt-link>
          <nuxt-link
            :to="localePath(`/privacy`)"
            class="text-white hover:text-white"
          >
            {{ $t('landing_footer.policy') }}
          </nuxt-link>
        </div>
      </div>
    </section>
    <!-- CTA end -->
  </div>
</template>
<script>
export default {
  layout: 'authenticate',
  auth: false,
  data () {
    return {
      currentCustomer: 'vingroup',
      currentFeatureGroup: 'staff'
    }
  },
  computed: {
    customers () {
      return ['vingroup', 'vincss', 'antsomi', 'vntrip', 'agribank', 'onemount']
    },
    currentYear () {
      return new Date().getFullYear()
    }
  },
  mounted () {
    this.$lottie.loadAnimation({
      container: this.$refs.animationHero,
      path: '/img/animation/hero.json'
    })
    this.$lottie.loadAnimation({
      container: this.$refs.animationProcess,
      path: '/img/animation/process.json'
    })
    this.$lottie.loadAnimation({
      container: this.$refs.animationContact,
      path: '/img/animation/contact.json'
    })
  }
}
</script>
<style scoped>
.landing-font-81 {
  font-size: 64px;
  line-height: 80px;
}
.landing-font-54 {
  font-size: 48px;
  line-height: 60px;
}
.landing-font-24 {
  font-size: 20px;
  line-height: 26px;
}
.landing-font-21 {
  font-size: 18px;
  line-height: 24px;
}
#cta > div:first-of-type {
  background-image: url(~assets/images/pages/sme/cta-bg.png);
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
<style lang="scss">
#faq {
  .el-collapse-item__arrow {
    display: none !important;
  }
  .el-icon-plus {
      display: inline-block;
    }
    .el-icon-minus {
      display: none;
    }
  .is-active {
    .el-icon-plus {
      display: none;
    }
    .el-icon-minus {
      display: inline-block;
    }
  }
}
</style>
