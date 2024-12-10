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

  mounted () {
    const { eid } = this.$route.query
    if (eid) {
      this.handleEmailSubscription(eid, false)
    }
  },

  methods: {
    async reSubscribe () {
      const { eid } = this.$route.query
      if (!eid) {
        this.notify(this.$t('errors.something_went_wrong'), 'warning')
        return
      }

      this.isSubscribing = true

      try {
        await this.handleEmailSubscription(eid, true)
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

    handleEmailSubscription (email, isSubscribe) {
      return this.$axios.post(
        'https://api.cystack.net/portal/v1/mail/locker/unsubscribe',
        {
          email,
          subscribe: isSubscribe
        }
      )
    }
  }
}
</script>

<style scoped></style>
