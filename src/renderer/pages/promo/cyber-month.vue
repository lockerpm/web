<template>
  <div>
    <!-- Nav -->
    <div
      class="flex flex-col md:flex-row justify-between items-center px-12 py-4"
    >
      <nuxt-link to="/">
        <img
          src="~assets/images/logo/logo_black_with_text.svg"
          alt="Locker Logo"
          class="h-12 mb-4 md:mb-0"
        >
      </nuxt-link>
      <div class="flex">
        <nuxt-link to="/lifetime" class="nav-btn">
          {{ $t('promo.cyber_month.nav.btn') }} <i class="el-icon-right" />
        </nuxt-link>
      </div>
    </div>
    <!-- Nav end -->

    <!-- Header -->
    <section id="header" class="relative">
      <div class="flex flex-wrap items-center pt-5 py-14 px-12">
        <div class="w-full lg:w-1/2 text-center lg:text-left">
          <h1
            class="text-black font-semibold text-[44px] lg:text-[51px] leading-[130%] mb-8"
            v-html="$t('promo.cyber_month.header.title')"
          />

          <div
            id="header-price"
            class="mb-8 px-12 py-6 rounded-tl-2xl rounded-br-2xl relative mx-auto lg:mx-0"
          >
            <img
              src="~assets/images/pages/promo/cyber-month/header-limited.png"
              alt="Limited-time offer"
              class="absolute h-auto w-[90px]"
              style="top: -9px; left: -10px"
            >
            <p class="text-white landing-font-18 font-semibold mb-2">
              {{ $t('promo.cyber_month.header.price_desc') }}
            </p>
            <p class="text-white">
              {{ $t('promo.cyber_month.header.just_from') }}
              <span class="text-[#82A884] line-through"> ($360) </span>
              <span class="font-semibold">$69.99</span>
            </p>
          </div>

          <div class="mb-1 flex justify-center lg:justify-start">
            <nuxt-link to="/lifetime" class="nav-btn">
              {{ $t('promo.cyber_month.header.btn') }}
              <i class="el-icon-right" />
            </nuxt-link>
          </div>

          <p class="text-xs italic text-[#858585]">
            {{ $t('promo.cyber_month.header.desc') }}
          </p>
        </div>

        <div class="w-full lg:w-1/2 mt-12 lg:mt-0">
          <img
            src="~assets/images/pages/promo/cyber-month/header-img.png"
            alt="Locker Vault"
            class="w-full md:translate-x-6"
          >
        </div>
      </div>
    </section>
    <!-- Header end -->

    <!-- Figures -->
    <div class="full-width bg-[#0A3614] px-12 py-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="(item, index) in $t('promo.cyber_month.figures.items')"
          :key="index"
          class="text-center text-white border-white my-6"
          :class="{ 'lg:border-l': index > 0 }"
        >
          <p class="landing-font-38 font-semibold mb-2">
            {{ item.title }}
          </p>
          <p class="landing-font-16">
            {{ item.desc }}
          </p>
        </div>
      </div>
    </div>
    <!-- Figures end -->

    <!-- Security -->
    <div class="p-12">
      <div class="text-center mb-16">
        <h2 class="font-semibold landing-font-38 mb-2">
          {{ $t('promo.cyber_month.security.title') }}
        </h2>
        <a
          :href="
            locale === 'vi'
              ? 'https://locker.io/vi/whitepaper/Locker-Password-Manager-e875ff4abf2d4cf5a2b59a4c7667eafb'
              : 'https://locker.io/whitepaper/What-is-Locker-Password-Manager-715b7495e91344cf9cffe420c1912ade'
          "
          target="_blank"
          class="text-primary font-semibold landing-font-18"
        >
          {{ $t('promo.cyber_month.security.link') }}
          <i class="el-icon-right" />
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
        <div
          v-for="(item, index) in $t('promo.cyber_month.security.items')"
          :key="index"
          v-view="e => securityItemViewHandler(index, e)"
          class="flex flex-col items-center text-center"
        >
          <img
            :src="
              require(`~/assets/images/pages/promo/cyber-month/security-${
                index + 1
              }.svg`)
            "
            :alt="item.title"
            class="h-20 w-20 mb-6"
          >
          <h3 class="font-semibold landing-font-24 mb-6 text-primary">
            {{ item.title }}
          </h3>
          <p class="landing-font-16">
            {{ item.desc }}
          </p>
        </div>
      </div>
    </div>
    <!-- Security end -->

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

    <!-- Smooth life -->
    <div class="flex flex-wrap px-12 py-[112px] items-center">
      <div class="w-full md:w-1/2 md:order-2">
        <h2 class="landing-font-38 font-semibold mb-4">
          {{ $t('promo.cyber_month.smooth_life.title') }}
        </h2>

        <div
          v-for="(item, index) in $t('promo.cyber_month.smooth_life.items')"
          :key="index"
          class="py-12 border-[#BFBFBF] flex"
          :class="{ 'border-t': index > 0 }"
        >
          <img
            :src="
              require(`~/assets/images/pages/promo/cyber-month/smooth-${1}.svg`)
            "
            class="h-10 w-10 mr-5"
          >
          <div>
            <h3 class="landing-font-24 font-semibold mb-2">
              {{ item.title }}
            </h3>
            <p class="landing-font-16">
              {{ item.desc }}
            </p>
          </div>
        </div>
      </div>

      <div class="w-full md:order-1 md:w-1/2 md:pr-[10%] mt-8 md:mt-0">
        <img
          src="~/assets/images/pages/promo/cyber-month/smooth-img.png"
          alt="Smooth digital life"
          class="w-full"
        >
      </div>
    </div>
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
  padding: 12px 32px;
  border-radius: 64px;
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
  background-image: url(~assets/images/pages/promo/cyber-month/header-bg.png);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top right;
}
#header-price {
  background: radial-gradient(
    50.1% 100% at 50.1% -0.1%,
    #0a7c1f 0%,
    #0d5219 100%
  );
  max-width: 500px;
}
</style>
