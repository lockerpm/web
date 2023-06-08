<template>
  <div class="md:pt-[180px] pt-36 pb-20">
    <h1 class="text-center font-bold text-black landing-font-50 mb-20">
      Unsubscribe Successfully!
    </h1>
    <div class="flex max-w-lg items-center justify-between mx-auto">
      <nuxt-link to="/" class="text-primary font-semibold">
        <i class="fas fa-angle-double-left" />
        Back to Homepage
      </nuxt-link>
      <a
        v-loading="isSubscribing"
        class="text-primary font-semibold"
        @click.prevent="reSubscribe"
      >
        Subscribe again
        <i class="fas fa-angle-double-right" />
      </a>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'landing',

  scrollToTop: true,

  data () {
    return {
      isSubscribing: false
    }
  },

  fetch ({ route, $axios }) {
    const { eid, service } = route.query
    if (eid) {
      $axios
        .put('https://tracking.cystack.net/v1/email/subscription', {
          eid,
          service,
          subscribed: false
        })
        .catch(e => {
          console.log(e)
        })
    }
  },

  methods: {
    async reSubscribe () {
      const { eid, service } = this.$route.query
      if (!eid) {
        this.notify(this.$t('errors.something_went_wrong'), 'warning')
        return
      }

      this.isSubscribing = true

      try {
        await this.handleEmailSubscription(eid, true, service)
        this.notify(
          'Subscribe successfully! Thank you for signing up to receive news from us.',
          'success'
        )
      } catch (e) {
        let message = this.$t('errors.something_went_wrong')
        if (e.response && e.response.data && e.response.data.message) {
          message = e.response.data.message
        }
        this.notify(message, 'warning')
      }

      this.isSubscribing = false
    },

    handleEmailSubscription (eid, isSubscribed, service) {
      return this.$axios.put(
        'https://tracking.cystack.net/v1/email/subscription',
        {
          eid,
          service,
          subscribed: isSubscribed
        }
      )
    }
  }
}
</script>

<style scoped></style>
