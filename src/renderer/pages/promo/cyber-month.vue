<template>
  <div>
    <!-- Nav -->
    <div
      class="bg-black-300 flex flex-col md:flex-row justify-between items-center px-12 py-6"
    >
      <img
        src="~assets/images/logo/logo_black_with_text.svg"
        alt="Locker Logo"
        class="h-12 mb-4 md:mb-0"
      >
      <div>
        <nuxt-link to="/lifetime" class="nav-btn">
          {{ $t('promo.cyber_month.nav.btn') }} <i class="el-icon-right" />
        </nuxt-link>
      </div>
    </div>
    <!-- Nav end -->

    <!-- Header -->
    <div id="header" class="flex flex-wrap items-center pt-5 pb-16 px-12">
      <div class="w-full lg:w-1/2 text-center lg:text-left">
        <h1
          class="text-black font-semibold text-[38px] md:text-[44px] lg:text-[51px] leading-[130%] mb-3"
        >
          <span class="text-primary">{{
            $t('promo.cyber_month.header.title_1')
          }}</span>
          <br>
          {{ $t('promo.cyber_month.header.title_2') }}
        </h1>

        <div class="mb-8">
          <p class="text-xs font-semibold text-black">
            {{ $t('common.total') }}
          </p>
          <p class="text-black font-semibold landing-font-24">
            $69.99 / {{ $t('common.user') }}
          </p>
          <p class="text-info landing-font-16">
            {{ $t('promo.cyber_month.header.price_family') }}
          </p>
        </div>

        <nuxt-link to="/lifetime" class="nav-btn">
          {{ $t('promo.cyber_month.header.btn') }} <i class="el-icon-right" />
        </nuxt-link>
      </div>

      <div class="w-full lg:w-1/2 mt-12 lg:mt-0">
        <img
          src="~assets/images/pages/promo/cyber-month/header-img.png"
          alt="Locker product"
          class="w-full md:translate-x-6"
        >
      </div>
    </div>
    <!-- Header end -->

    <!-- Figures -->
    <div class="full-width bg-[#F1FFEF] p-12">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12"
      >
        <div
          v-for="(item, index) in $t('promo.cyber_month.figures.items')"
          :key="index"
          class="text-center"
        >
          <p class="landing-font-38 font-semibold text-[#165C23] mb-2">
            {{ item.title }}
          </p>
          <p class="landing-font-16">
            {{ item.desc }}
          </p>
        </div>
      </div>
    </div>
    <!-- Figures end -->

    <!-- Features -->
    <div class="full-width px-4 py-12">
      <h2 class="font-bold landing-font-38 text-center mb-16">
        {{ $t('promo.cyber_month.features.title') }}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        <div
          v-for="(item, index) in $t('promo.cyber_month.features.items')"
          :key="index"
          class="bg-black-300 px-12 pt-9 flex flex-col justify-between"
        >
          <div class="mb-4 text-center md:text-left">
            <h3 class="font-semibold text-primary landing-font-24 mb-2">
              {{ item.title }}
            </h3>
            <p class="landing-font-18">
              {{ item.desc }}
            </p>
          </div>
          <img
            :src="
              require(`~/assets/images/pages/promo/cyber-month/feature-${
                index + 1
              }.png`)
            "
            :alt="item.title"
            class="w-full h-auto"
          >
        </div>
      </div>

      <div class="w-full flex justify-center">
        <nuxt-link to="/lifetime" class="nav-btn">
          <i class="el-icon-shopping-cart-2" />
          {{ $t('promo.cyber_month.features.btn') }}
        </nuxt-link>
      </div>
    </div>
    <!-- Features end -->

    <!-- Customers -->
    <div class="w-full bg-black-300 py-16">
      <h2 class="font-bold landing-font-38 text-center mb-16">
        {{ $t('promo.cyber_month.customers.title') }}
      </h2>
    </div>
    <!-- Customers end -->

    <!-- Security -->
    <div class="pt-[118px] pb-[94px] flex flex-wrap px-12">
      <div class="w-full md:w-1/2">
        <h2 class="font-bold landing-font-38 mb-4 max-w-[467px]">
          {{ $t('promo.cyber_month.security.title') }}
        </h2>

        <div
          v-for="(item, index) in $t('promo.cyber_month.security.items')"
          :key="index"
          class="py-12 flex border-[#BFBFBF]"
          :class="{ 'border-t': index > 0 }"
        >
          <img
            :src="
              require(`~/assets/images/pages/promo/cyber-month/security-${
                index + 1
              }.svg`)
            "
            :alt="item.title"
            class="h-11 w-11"
          >
          <div class="ml-5">
            <h3 class="font-semibold landing-font-24 mb-2">
              {{ item.title }}
            </h3>
            <p class="landing-font-16">
              {{ item.desc }}
            </p>
          </div>
        </div>
      </div>

      <div class="hidden md:flex w-1/2 pl-[20%] py-20 flex-col">
        <div
          v-for="item in [1, 2, 3, 4]"
          :key="item"
          class="py-8 rounded-3xl illus-gradient-bg"
          style="margin-bottom: 50vh"
        >
          <img
            :src="
              require(`~/assets/images/pages/promo/cyber-month/security-illus-${item}.png`)
            "
            class="w-full"
          >
        </div>
      </div>

      <div class="w-full flex justify-center mt-6">
        <nuxt-link to="/lifetime" class="nav-btn">
          <i class="el-icon-shopping-cart-2" />
          {{ $t('promo.cyber_month.security.btn') }}
        </nuxt-link>
      </div>
    </div>
    <!-- Security end -->

    <!-- Smooth life -->
    <!-- Smooth life end -->

    <!-- Team collab -->
    <!-- Team collab end -->

    <!-- CTA 1 -->
    <!-- CTA 1 end -->

    <!-- Ratings -->
    <!-- Ratings end -->

    <!-- Testimonials -->
    <!-- Testimonials end -->

    <!-- Platforms -->
    <!-- Platforms end -->

    <!-- CTA 2 -->
    <!-- CTA 2 end -->

    <!-- Footer -->
    <!-- Footer end -->
  </div>
</template>
<script>
export default {
  layout: 'authenticate'
}
</script>
<style scoped>
.nav-btn {
  padding: 8px 24px;
  border-radius: 4px;
  background-color: #268334;
  font-weight: 600;
  font-size: 18px;
  color: white;
  line-height: 26px;
}
.nav-btn i {
  font-weight: bold;
}
#header {
  background-image: url(~assets/images/pages/promo/cyber-month/header-bg.svg);
  background-repeat: no-repeat;
  background-size: 70% auto;
  background-position: top right;
}
.illus-gradient-bg {
  background: linear-gradient(180deg, #5f9c64 0%, #24712a 100%), #f5f5f5;
}
</style>
