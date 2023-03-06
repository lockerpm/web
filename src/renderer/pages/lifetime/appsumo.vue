<template>
  <div>
    <!-- Header -->
    <section class="w-full">
      <img class="h-8 mx-auto" src="~/assets/images/logo/logo_white.svg">
    </section>
    <!-- Header end -->

    <!-- Intro + form -->
    <section class="w-full">
      <div class="flex flex-row items-center">
        <!-- Left -->
        <div class="w-full md:w-1/2">
          <!-- Intro -->
          <div>
            <h1>{{ $t('lifetime.redeem_page.intro.title') }}</h1>
            <p>
              {{ $t('lifetime.redeem_page.intro.desc') }}
            </p>
            <ol>
              <li
                v-for="(item, index) in $t(
                  'lifetime.redeem_page.intro.instructions'
                )"
                :key="index"
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
      </div>
    </section>
    <!-- Intro + form end -->

    <!-- Benefits -->
    <section class="w-full">
      <h2>{{ $t('lifetime.redeem_page.benefits.title') }}</h2>
      <div class="grid grid-cols-4 gap-x-2 gap-y-2">
        <div
          v-for="(item, index) in $t('lifetime.redeem_page.benefits.items')"
          :key="index"
        >
          <img
            class="h-8"
            :src="
              require(`~/assets/images/landing/lifetime/benefits/${
                index + 1
              }.svg`)
            "
          >
          <p class="text-bold">
            {{ item.title }}
          </p>
          <p>
            {{ item.desc }}
          </p>
        </div>

        <div class="col-span-2">
          <img
            class="h-8"
            src="~/assets/images/landing/lifetime/benefits/more.svg"
          >
          <p class="text-bold">
            {{ $t('lifetime.redeem_page.benefits.more_features') }}
          </p>
        </div>
      </div>
    </section>
    <!-- Benefits end -->

    <!-- Footer -->
    <div
      class="md:flex md:items-center py-3 border-t border-black-200 landing-font-12 text-black-600"
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

  layout: 'white',

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
