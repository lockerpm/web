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
  asyncData ({ redirect, store, isDev, $ua, $cookies, route }) {
    // Set/delete trial plan
    if (route.query.isFree) {
      $cookies.remove('trial_plan', {
        domain: '.locker.io',
        path: '/'
      })
    } else if (process.client && window?.sessionStorage?.getItem('keepTrialPlan')) {
      // Keep the trial plan if needed
      window.sessionStorage.removeItem('keepTrialPlan')
    } else {
      // Auto set plan to premium
      $cookies.set('trial_plan', 'pm_premium', {
        domain: '.locker.io',
        path: '/'
      })
    }

    // Generate URL for Locker ID
    const environment = isDev ? 'dev' : process.env.environment
    const query = `?SERVICE_URL=${
      store.state.currentPath !== '/'
        ? encodeURIComponent(`${store.state.currentPath}`)
        : '/vault'
    }&SERVICE_SCOPE=pwdmanager&lang=${store.state.user.language}${
      environment ? `&ENVIRONMENT=${environment}` : ''
    }`
    let url = `${process.env.idUrl}/register${query}`

    // Set cookies for utm tracking
    const queryUtmSource = route.query?.utm_source
    if (queryUtmSource) {
      url = `${url}&utm_source=${queryUtmSource}`
      $cookies.set('utm_source', queryUtmSource, {
        domain: '.locker.io',
        path: '/',
        maxAge: 3600 * 24 * 30
      })
      $cookies.set('utm_medium', route.query?.utm_medium || '', {
        domain: '.locker.io',
        path: '/',
        maxAge: 3600 * 24 * 30
      })
    }

    // TODO: deprecating - Google is removing this
    // Open dynamic link if user is using mobile device
    if ($ua.isFromIos() || $ua.isFromAndroidOs()) {
      const utmSource = queryUtmSource ? '' : $cookies.get('utm_source')
      const deeplink = utmSource ? `${url}&utm_source=${utmSource}` : url
      const dynamicLink = `https://lockerio.page.link/?link=${encodeURIComponent(
        deeplink
      )}&apn=com.cystack.locker&afl=${encodeURIComponent(
        url
      )}&isi=1586927301&ibi=com.cystack.lockerapp&ifl=${encodeURIComponent(
        url
      )}${utmSource ? '&utm_source=' + utmSource : ''}&efr=1`
      url = dynamicLink
    }

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
