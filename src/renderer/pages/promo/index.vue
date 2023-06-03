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
    <nuxt-child />
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
    <div
      class="md:flex md:items-center py-3 border-t border-black-200 landing-font-12 text-black-600 max-w-6xl mx-auto px-6"
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
            src="~/assets/images/logo/CyStack.png"
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
          class="mr-4 text-black-600 hover:no-underline hover:text-green"
        >
          {{ $t('landing_footer.terms') }}
        </nuxt-link>
        <nuxt-link
          :to="localePath(`/privacy`)"
          class="text-black-600 hover:no-underline hover:text-green"
        >
          {{ $t('landing_footer.policy') }}
        </nuxt-link>
      </div>
    </div>
    <!-- Footer end -->
  </div>
</template>

<script>
export default {
  layout: 'authenticate',

  computed: {
    currentYear () {
      return new Date().getFullYear()
    }
  }
}
</script>

<style scoped></style>
