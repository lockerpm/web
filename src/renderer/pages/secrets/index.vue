<template>
  <div>
    <!-- Header -->
    <section id="header" class="full-width py-20">
      <div class="max-w-7xl px-6 mx-auto flex items-center flex-wrap">
        <!-- Left -->
        <div class="lg:w-6/12 w-full mb-8 lg:mb-0">
          <!-- News -->
          <div class="flex items-center bg-gray rounded-full w-full py-3 px-6">
            <div class="h-4 w-4 rounded-full bg-primary border-4 border-green-100 mr-2" />
            <p class="font-semibold text-primary">
              {{ $t('new_landing.secrets.header.news.label') }}
            </p>
            <p class="text-secondary-45 mx-3 flex-1">
              {{ $t('new_landing.secrets.header.news.content') }}
            </p>
            <i class="el-icon-right text-primary landing-font-18" />
          </div>
          <!-- News end -->

          <h1 class="my-6 font-bold landing-font-54" style="max-width: 550px">
            {{ $t('new_landing.secrets.header.title') }}
          </h1>
          <p class="landing-font-18 mb-6">
            {{ $t('new_landing.secrets.header.desc') }}
          </p>
          <div>
            <div class="primary-btn">
              {{ $t('new_landing.secrets.header.btn') }}
            </div>
          </div>
        </div>
        <!-- Left end -->

        <!-- Right -->
        <div class="lg:w-6/12 w-full" />
        <!-- Right end -->
      </div>
    </section>
    <!-- Header end -->

    <!-- Customers -->
    <section class="full-width py-12 bg-block">
      <div class="max-w-7xl px-6 mx-auto">
        <div class="w-10/12 mx-auto">
          <p class="landing-font-21 font-semibold w-full text-center mb-6">
            {{ $t('new_landing.secrets.customers.title') }}
          </p>

          <div class="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12">
            <div v-for="(item) in customers" :key="item">
              <img
                class="w-full grayscale hover:filter-none transition-all"
                :src="require(`~/assets/images/pages/sme/customers/${item}.svg`)"
              >
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Customers end -->

    <!-- Next gen -->
    <section class="my-20 bg-block rounded-3xl py-20 flex items-center flex-wrap">
      <!-- Left -->
      <div class="w-1/2 lg:w-full px-[12rem] mb-8 lg:mb-0 relative">
        <img
          class="h-20 w-20 left-0 top-0 -translate-y-1/2 absolute"
          :src="require('~/assets/images/pages/secrets/next-gen/cert.svg')"
        >
        <h2 class="landing-font-36 font-semibold mb-6">
          {{ $t('new_landing.secrets.next_gen.title') }}
        </h2>
        <p class="landing-font-18">
          {{ $t('new_landing.secrets.next_gen.desc') }}
        </p>
      </div>
      <!-- Left end -->

      <!-- Right -->
      <div class="w-1/2 lg:w-full flex overflow-hidden relative">
        <div class="opacity-layer-left" />
        <div class="opacity-layer-right" />
        <running-text>
          <div
            v-for="(item, index) in 6"
            :key="index"
            class="mx-5"
            style="height: 180px"
          >
            <img
              class="h-full"
              :src="require(`~/assets/images/pages/secrets/next-gen/item-${index}.svg`)"
            >
          </div>
        </running-text>
      </div>
      <!-- Right end -->
    </section>
    <!-- Next gen end -->

    <!-- Features -->
    <section class="py-80">
      <h2 class="landing-font-54 font-semibold mb-16">
        {{ $t('new_landing.secrets.features.title') }}
      </h2>

      <!-- Slider -->
      <div>
        <carousel
          :per-page-custom="[
            [0, 1],
            [480, 1],
            [768, 2],
            [1024, 3],
          ]"
          pagination-active-color="#268334"
          autoplay
          loop
          :pagination-enabled="false"
          :autoplay-timeout="3000"
          :scroll-per-page="false"
        >
          <slide v-for="(item, index) in $t('new_landing.secrets.features.items')" :key="index">
            <div
              class="border rounded-3xl border-black-50 p8 h-full flex text-center mx-3 relative"
              :class="{ 'ml-0': index === 0 }"
            >
              <div v-if="item.comming" class="border rounded-3xl border-black-50 absolute left-0 top-0 -translate-y-1/2 bg-green-50 px-4 py-2.5">
                <p class="text-primary">
                  {{ $t('new_landing.secrets.features.comming') }}
                </p>
              </div>
              <div class="flex flex-col items-center" :class="{ 'opacity-60': !!item.comming }">
                <img
                  class="h-20"
                  :src="require(`~/assets/images/pages/secrets/features/item-${index}.svg`)"
                >
                <h3 class="font-medium text-black landing-font-24 my-3">
                  {{ item.title }}
                </h3>
                <p class=" landing-font-18 flex-1">
                  {{ item.desc }}
                </p>
              </div>
            </div>
          </slide>
        </carousel>
      </div>
      <!-- Slider end -->

      <div class="primary-btn-outline mx-auto">
        <p>
          {{ $t('new_landing.secrets.features.btn') }}
        </p>
      </div>
    </section>
    <!-- Features end -->

    <!-- Use cases -->
    <!-- Use cases end -->

    <!-- Cool things -->
    <!-- Cool things end -->

    <!-- How it work -->
    <!-- How it work end -->

    <!-- Best choice -->
    <!-- Best choice end -->

    <!-- CTA -->
    <!-- CTA end -->
  </div>
</template>
<script>
import RunningText from '~/components/landing/RunningText.vue'

export default {
  components: {
    RunningText
  },

  layout: 'new-landing',

  computed: {
    customers () {
      return ['vingroup', 'vincss', 'antsomi', 'vntrip', 'agribank', 'onemount']
    }
  }
}
</script>
<style lang="scss" scoped>
#header {
  background: radial-gradient(50% 50% at 50% 50%, #F0FFF1 0%, rgba(240, 255, 241, 0.00) 100%);
}
.opacity-layer-left {
  position: absolute;
  top: 0;
  left: 0;
  width: 10%;
  height: 100%;
  z-index: 100;
  background: linear-gradient(to right, rgba(250, 250, 250, 1), rgba(250, 250, 250, 0));
}
.opacity-layer-right {
  position: absolute;
  top: 0;
  right: 0;
  width: 10%;
  height: 100%;
  z-index: 100;
  background: linear-gradient(to right, rgba(250, 250, 250, 0), rgba(250, 250, 250, 1));
}
</style>
