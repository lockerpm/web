<template>
  <nuxt />
</template>

<script>
export default {
  mounted () {
    if (process.client) {
      window.addEventListener('message', this.onMessage)
      if (window.$chatwoot) {
        window.$chatwoot.toggleBubbleVisibility('hide')
      } else if (window.chatwootSettings) {
        window.chatwootSettings.hideMessageBubble = true
      } else {
        window.chatwootSettings = {
          hideMessageBubble: true,
          baseDomain: '.locker.io'
          // darkMode: 'auto'
        }
      }
    }
  },
  beforeDestroy () {
    window.removeEventListener('message', this.onMessage)
  },
  methods: {
    onMessage (e) {
      if (e.data?.event === 'url') {
        let url = e.data?.value
        if (url.startsWith(process.env.baseUrl)) {
          url = url.split(process.env.baseUrl)[1]
        }
        this.$router.push(url)
      }
    }
  }
}
</script>
