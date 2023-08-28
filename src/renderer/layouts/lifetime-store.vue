<template>
  <div>
    <!-- Logo -->
    <section class="full-width bg-[#EEF4ED]">
      <div class="flex justify-center">
        <a href="/" target="_blank">
          <img
            class="h-12 my-4 px-6"
            src="~/assets/images/logo/logo_black_with_text.svg"
          >
        </a>
      </div>
    </section>
    <!-- Logo end -->

    <!-- Intro + form -->
    <nuxt />
    <!-- Intro + form end -->

    <!-- Benefits -->
    <section class="w-full py-[80px] max-w-6xl mx-auto px-6">
      <div class="w-full flex flex-row items-center justify-center mb-[80px]">
        <h2 class="text-black font-bold text-[48px] leading-[58px]">
          {{ $t('lifetime.redeem_page.benefits.title') }}
        </h2>
        <img
          class="h-14 ml-2.5"
          src="~/assets/images/landing/lifetime/success.png"
        >
      </div>

      <div
        class="sm:grid md:grid-cols-4 sm:grid-cols-2 flex flex-col gap-x-6 gap-y-6"
      >
        <div
          v-for="(item, index) in $t('lifetime.redeem_page.benefits.items')"
          :key="index"
        >
          <img
            class="h-16 mb-6"
            :src="
              require(`~/assets/images/landing/lifetime/benefits/${
                index + 1
              }.svg`)
            "
          >
          <p class="font-bold text-[20px] mb-3">
            {{ item.title }}
          </p>
          <p>
            {{ item.desc }}
          </p>
        </div>

        <div
          class="col-span-2 md:px-6 flex flex-col items-start justify-center"
        >
          <img
            class="h-16 mb-6"
            src="~/assets/images/landing/lifetime/benefits/more.svg"
          >
          <p class="font-bold text-[20px]">
            {{ $t('lifetime.redeem_page.benefits.more_features') }}
          </p>
        </div>
      </div>
    </section>
    <!-- Benefits end -->

    <!-- Footer -->
    <promo-footer />
    <!-- Footer end -->
  </div>
</template>

<script>
import PromoFooter from '~/components/landing/PromoFooter.vue'

export default {
  components: { PromoFooter }
}
</script>

<style scoped></style>
