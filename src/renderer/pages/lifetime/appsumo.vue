<template>
  <div class="relative overflow-hidden">
    <div
      class="absolute w-[105vw] bg-warning md:flex hidden items-center justify-center py-4 -rotate-6 z-50 top-[70px] right-2 -left-4"
    >
      <p
        class="font-bold text-[32px] leading-[38px] text-white w-[320px] flex-grow-0 flex-shrink-0 text-center"
      >
        Lifetime Package
      </p>
      <img class="h7" src="~/assets/images/landing/lifetime/star-four.svg">
      <p
        class="font-bold text-[32px] leading-[38px] text-white w-[320px] flex-grow-0 flex-shrink-0 text-center"
      >
        Lifetime Package
      </p>
      <img class="h7" src="~/assets/images/landing/lifetime/star-four.svg">
      <p
        class="font-bold text-[32px] leading-[38px] text-white w-[320px] flex-grow-0 flex-shrink-0 text-center"
      >
        Lifetime Package
      </p>
      <img class="h7" src="~/assets/images/landing/lifetime/star-four.svg">
      <p
        class="font-bold text-[32px] leading-[38px] text-white w-[320px] flex-grow-0 flex-shrink-0 text-center"
      >
        Lifetime Package
      </p>
    </div>

    <!-- Logo -->
    <section class="full-width bg-primary md:pb-16">
      <img
        class="h-12 mx-auto my-4"
        src="~/assets/images/logo/logo_white.svg"
      >
    </section>
    <!-- Logo end -->

    <!-- Intro + form -->
    <section class="full-width bg-primary py-16">
      <div class="flex flex-row items-start max-w-6xl mx-auto px-6 md:pt-8">
        <!-- Left -->
        <div class="w-full md:w-1/2">
          <!-- Intro -->
          <div>
            <h1
              class="font-bold text-[48px] leading-[58px] text-[#98FE98] mb-4"
            >
              {{ $t('lifetime.redeem_page.intro.title') }}
            </h1>
            <p class="font-bold text-[20px] text-white mb-4">
              {{ $t('lifetime.redeem_page.intro.desc') }}
            </p>
            <ol class="list-decimal ml-4 mb-4">
              <li
                v-for="(item, index) in $t(
                  'lifetime.redeem_page.intro.instructions'
                )"
                :key="index"
                class="text-white"
              >
                {{ item }}
              </li>
            </ol>
          </div>
          <!-- Intro end -->

          <!-- Form -->
          <RedeemForm :countries="countries" />
          <!-- Form end -->
        </div>
        <!-- Left end -->

        <!-- Right -->
        <div class="w-1/2 hidden md:flex">
          <img
            class="w-full"
            src="~/assets/images/landing/lifetime/intro.png"
          >
        </div>
        <!-- Right end -->
      </div>
    </section>
    <!-- Intro + form end -->

    <!-- Benefits -->
    <section class="w-full py-[80px] max-w-6xl mx-auto px-6">
      <h2 class="text-black font-bold text-center text-[48px] mb-[80px]">
        {{ $t('lifetime.redeem_page.benefits.title') }}
      </h2>
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
      <div class="">
        Copyright © {{ currentYear }} Locker.io · All rights reserved.
      </div>
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
import RedeemForm from '../../components/pages/lifetime/RedeemForm.vue'
export default {
  components: { RedeemForm },

  layout: 'authenticate',

  asyncData ({ $axios }) {
    return $axios
      .$get('/resources/countries')
      .then(res => {
        return {
          countries: res
        }
      })
      .catch(() => {
        return {
          countries: []
        }
      })
  },

  computed: {
    currentYear () {
      return new Date().getFullYear()
    }
  }
}
</script>

<style scoped></style>
