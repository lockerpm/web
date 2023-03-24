<template>
  <section class="full-width bg-[#EEF4ED] py-16 overflow-hidden">
    <div class="flex flex-row items-start max-w-6xl mx-auto px-6 md:pt-8">
      <!-- Left -->
      <div class="w-full md:w-1/2">
        <!-- Intro -->
        <div>
          <h1 class="font-bold text-[48px] leading-[58px] text-primary mb-4">
            {{
              $t('lifetime.redeem_page.intro.title', {
                service: 'PitchGround'
              })
            }}
          </h1>
          <p class="font-bold text-[20px] mb-4">
            {{
              $t('lifetime.redeem_page.intro.desc', {
                service: 'PitchGround'
              })
            }}
          </p>
          <ol class="list-decimal ml-4 mb-4">
            <li
              v-for="(item, index) in $t(
                'lifetime.redeem_page.intro.instructions'
              )"
              :key="index"
            >
              {{ item.replaceAll('{service}', 'PitchGround') }}
            </li>
          </ol>
        </div>
        <!-- Intro end -->

        <!-- Form -->
        <RedeemForm :countries="countries" service="PitchGround" />
        <!-- Form end -->
      </div>
      <!-- Left end -->

      <!-- Right -->
      <div class="w-1/2 hidden md:flex relative">
        <img
          class="w-[80vw] max-w-[80vw] absolute -top-6"
          src="~/assets/images/landing/lifetime/intro.png"
        >
      </div>
      <!-- Right end -->
    </div>
  </section>
</template>

<script>
import RedeemForm from '../../../components/pages/lifetime/RedeemForm.vue'
export default {
  components: { RedeemForm },

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
