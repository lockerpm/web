<template>
  <div>
    <!-- Header -->
    <section class="w-full">
      <div class="md:pt-[186px] pt-28 flex flex-row items-center">
        <!-- Left -->
        <div class="w-full md:w-1/2">
          <!-- Intro -->
          <div>
            <h1>Redeem your AppSumo Code for Locker's Lifetime Package</h1>
            <p>
              If you have already had an AppSumo Code for Locker Password
              Manager, use the Code to redeem for Locker's services now.
            </p>
          </div>
          <!-- Intro end -->

          <!-- Form -->
          <RedeemForm :countries="countries" />
          <!-- Form end -->
        </div>
        <!-- Left end -->
      </div>
    </section>
    <!-- Header end -->
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
  }
}
</script>

<style scoped></style>
