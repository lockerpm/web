<template>
  <BusyOverlay />
</template>
<script>
import BusyOverlay from '@/components/BusyOverlay'

export default {
  components: {
    BusyOverlay
  },
  layout: 'authenticate',
  asyncData ({ redirect, store, isDev, route }) {
    const environment = isDev ? 'dev_web' : process.env.environment

    // (On premise) Navigate to /lock if has user else to to login as usual
    if (store.state.isOnPremise && store.state.isLoggedIn) {
      redirect(302, '/lock')
      return
    }

    const url = `${process.env.idUrl}/login?SERVICE_URL=${
      route.query.SERVICE_URL
        ? encodeURIComponent(route.query.SERVICE_URL)
        : store.state.currentPath !== '/'
          ? encodeURIComponent(`${store.state.currentPath}`)
          : '/vault'
    }&SERVICE_SCOPE=pwdmanager&lang=${store.state.user.language}${
      environment ? `&ENVIRONMENT=${environment}` : ''
    }`

    let isIframe = false
    try {
      if (window) {
        isIframe = !!window.sessionStorage.getItem('isIframe')
      }
    } catch (error) {
      isIframe = route.query.mode === 'iframe'
    }

    if (!isIframe) {
      redirect(302, url)
    } else {
      return {
        url,
        isIframe
      }
    }
  },
  data () {
    return {
      isIframe: false,
      url: '',
      interval: null
    }
  },
  mounted () {
    this.postMessage()
    this.interval = setInterval(this.postMessage, 1000)
  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  methods: {
    postMessage () {
      if (this.isIframe && this.url) {
        this.postIframeMessage('external', this.url)
        this.$router.back()
      }
    }
  }
}
</script>
