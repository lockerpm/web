<template>
  <div>
    <!-- Nav -->
    <div
      class="flex flex-col md:flex-row justify-between items-center px-6 max-w-7xl mx-auto py-4"
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
      <div
        class="flex flex-wrap items-center pt-5 py-14 px-6 max-w-7xl mx-auto"
      >
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
    <div class="full-width bg-[#0A3614]">
      <div class="p-6 max-w-7xl mx-auto">
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
    </div>
    <!-- Figures end -->

    <!-- Security -->
    <div class="py-12 mb-20 px-6 max-w-7xl mx-auto">
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
    <div class="py-12 px-6 max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="font-semibold landing-font-38 mb-2">
          {{ $t('promo.cyber_month.features.title') }}
        </h2>
        <a
          :href="
            locale === 'vi'
              ? 'https://locker.io/vi/features'
              : 'https://locker.io/features'
          "
          target="_blank"
          class="text-primary font-semibold landing-font-18"
        >
          {{ $t('promo.cyber_month.features.link') }}
          <i class="el-icon-right" />
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-16">
        <div
          v-for="(item, index) in $t('promo.cyber_month.features.items')"
          :key="index"
        >
          <img
            :src="
              require(`~/assets/images/pages/promo/cyber-month/feature-${
                index + 1
              }.png`)
            "
            :alt="item.title"
            class="w-full h-auto mb-6"
          >
          <h3 class="font-semibold text-primary landing-font-18 mb-3">
            {{ item.title }}
          </h3>
          <p class="landing-font-16">
            {{ item.desc }}
          </p>
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

    <!-- Download -->
    <div class="px-6 max-w-7xl mx-auto pt-20 pb-0">
      <div
        id="download"
        class="rounded-2xl p-6 sm:px-20 sm:py-12 flex flex-wrap items-center"
      >
        <div class="w-full md:w-7/12 text-white">
          <img
            src="~assets/images/logo/logo_white_with_text.svg"
            alt="Locker Logo"
            class="h-12 mb-12"
          >
          <h2 class="font-semibold landing-font-38 mb-3">
            {{ $t('promo.cyber_month.download.title') }}
          </h2>
          <p class="landing-font-16 mb-12">
            {{ $t('promo.cyber_month.download.desc') }}
          </p>
          <div class="flex flex-wrap">
            <a
              href="https://play.google.com/store/apps/details?id=com.cystack.locker&pli=1"
              target="_blank"
            >
              <img
                src="~assets/images/pages/promo/cyber-month/download-android.png"
                alt="Google Play"
                class="w-auto h-14 mr-3 mb-3"
              >
            </a>
            <a
              href="https://apps.apple.com/us/app/locker-password-manager/id1586927301"
              target="_blank"
            >
              <img
                src="~assets/images/pages/promo/cyber-month/download-ios.png"
                alt="App Store"
                class="w-auto h-14 mr-3 mb-3"
              >
            </a>
            <a href="/download" target="_blank">
              <img
                src="~assets/images/pages/promo/cyber-month/download-other.png"
                alt="Other Platforms"
                class="w-auto h-14"
              >
            </a>
          </div>
        </div>
        <div class="w-full md:w-5/12 mt-12 md:mt-0 md:pl-[10%]">
          <img
            src="~assets/images/pages/promo/cyber-month/download-img.png"
            alt="Locker Featuers"
            class="w-full"
          >
        </div>
      </div>
    </div>
    <!-- Download end -->

    <!-- Testimonials -->
    <div class="px-6 max-w-7xl mx-auto mb-12">
      <Testimonials hide-ratings />
    </div>
    <!-- Testimonials end -->

    <!-- CTA -->
    <div class="w-full bg-black-300">
      <div class="max-w-6xl mx-auto py-12 px-12">
        <div class="flex flex-wrap items-center mb-12">
          <div class="w-full sm:w-1/2">
            <h2 class="font-semibold landing-font-38 mb-3">
              {{ $t('promo.cyber_month.cta.title') }}
            </h2>
            <p
              class="landing-font-16 italic mb-6"
              v-html="$t('promo.cyber_month.cta.desc')"
            />
            <div class="flex mb-3 items-center">
              <nuxt-link to="/lifetime" class="nav-btn">
                <i class="el-icon-shopping-cart-2" />
                {{ $t('promo.cyber_month.cta.btn') }}
              </nuxt-link>
              <img
                src="~assets/images/pages/promo/cyber-month/cta-discount.svg"
                alt="Up to 82% off"
                class="w-auto h-10 rotate-12 relative top-2 -left-4"
              >
            </div>
            <div class="flex flex-wrap items-center">
              <p class="text-sm">
                {{ $t('promo.cyber_month.cta.compatible') }}
              </p>
              <div
                v-for="(item, index) in $t('landing.platform.platforms')"
                :key="index"
              >
                <div
                  class="rounded-full bg-white shadow-md w-7 h-7 justify-center items-center flex m-2"
                >
                  <img
                    :src="require(`~/assets/images/landing/index/${item.img}`)"
                    :alt="item.name"
                    class="mx-auto self-center max-w-4 max-h-4"
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="w-full sm:w-1/2 flex justify-end">
            <img
              src="~assets/images/pages/promo/cyber-month/cta-img-1.svg"
              alt="Cyber sale"
              class="w-full sm:w-1/2 mt-12 sm:mt-0 max-w-[264px] mx-auto sm:mx-0"
            >
          </div>
        </div>

        <div class="flex flex-wrap items-center">
          <div class="w-full sm:w-3/4 pl-0 sm:pl-12 sm:order-1">
            <p
              class="landing-font-20"
              v-html="$t('promo.cyber_month.cta.desc2')"
            />
          </div>
          <div class="w-full sm:w-1/4">
            <img
              src="~assets/images/pages/promo/cyber-month/cta-img-2.svg"
              alt="30 days money back"
              class="w-full mt-12 sm:mt-0 max-w-[264px] mx-auto sm:mx-0"
            >
          </div>
        </div>
      </div>
    </div>
    <!-- CTA end -->

    <!-- Footer -->
    <PromoFooter />
    <!-- Footer end -->
  </div>
</template>
<script>
import Testimonials from '~/components/pages/landing/Testimonials.vue'
import PromoFooter from '~/components/landing/PromoFooter.vue'

export default {
  components: { Testimonials, PromoFooter },
  layout: 'authenticate',
  middleware: ['onlyEng']
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
  transition: opacity ease 0.2s;
}
.nav-btn:hover {
  opacity: 0.8;
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
#download {
  background: radial-gradient(
    56.21% 112.71% at 100% 14.71%,
    #1e8230 0%,
    #165c23 100%
  );
}
</style>
