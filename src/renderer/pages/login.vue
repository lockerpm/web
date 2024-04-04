<template>
  <div />
</template>
<script>
export default {
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
        isIframe = window.isIframe
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
  mounted () {
    if (this.isIframe && this.url) {
      this.postIframeMessage('external', this.url)
    }
  }
}
</script>
