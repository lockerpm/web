<template>
  <section class="full-width bg-[#EEF4ED] pb-16 md:pt-16 pt-8 overflow-hidden">
    <div class="flex flex-row items-start max-w-6xl mx-auto px-6 md:pt-8">
      <!-- Left -->
      <div class="w-full md:w-7/12">
        <!-- Intro -->
        <div>
          <h1 class="font-medium text-[48px] leading-[58px] text-primary">
            Redeem your <br>
            Deal Mirror Code for <br>
          </h1>

          <div class="relative">
            <div
              class="bg-primary absolute z-0 w-[100vw] h-full right-0 rounded-full hidden md:block"
            />
            <p
              class="text-primary md:text-white font-medium md:font-bold text-[48px] leading-[58px] z-10 relative"
            >
              Locker's Lifetime Package
            </p>
          </div>

          <p class="font-semibold text-[20px] mb-4 mt-4">
            {{
              $t('lifetime.redeem_page.intro.desc', { service: 'Deal Mirror' })
            }}
          </p>
          <ol class="list-decimal ml-4 mb-4">
            <li
              v-for="(item, index) in $t(
                'lifetime.redeem_page.intro.instructions'
              )"
              :key="index"
            >
              {{ item.replaceAll('{service}', 'Deal Mirror') }}
            </li>
          </ol>
        </div>
        <!-- Intro end -->

        <!-- Form -->
        <RedeemForm :countries="countries" service="Deal Mirror" />
        <!-- Form end -->
      </div>
      <!-- Left end -->

      <!-- Right -->
      <div class="w-5/12 hidden md:flex relative">
        <img
          class="w-[40vw] max-w-[40vw] absolute ml-[5vw] -top-16"
          src="~/assets/images/landing/lifetime/intro.png"
        >
      </div>
      <!-- Right end -->
    </div>
  </section>
</template>

<script>
import RedeemForm from '~/components/pages/lifetime/RedeemForm.vue'
export default {
  components: { RedeemForm },

  layout: 'lifetime-store',

  asyncData ({ $axios }) {
    return $axios
      .$get('/resources/countries')
      .then(res => {
        if (typeof res === 'object' && res.length) {
          return {
            countries: res
          }
        }
        return {
          countries: []
        }
      })
      .catch(() => {
        return {
          countries: []
        }
      })
  }
}
</script>

<style scoped></style>
