<template>
  <div />
</template>
<script>
export default {
  layout: 'authenticate',
  middleware: 'preventToUser',
  fetch ({ redirect, store, isDev, $ua, $cookies }) {
    const environment = isDev ? 'dev' : process.env.environment
    const query = `?SERVICE_URL=${store.state.currentPath !== '/' ? encodeURIComponent(`${store.state.currentPath}`) : '/vault'}&SERVICE_SCOPE=pwdmanager&lang=${store.state.user.language}${environment ? `&ENVIRONMENT=${environment}` : ''}`
    const url = `${process.env.idUrl}/register${query}`
    if ($ua.isFromSmartphone()) {
      const utmSource = $cookies.get('utm_source')
      const deeplink = utmSource ? `${url}&utm_source=${utmSource}` : url
      const dynamicLink = `https://lockerio.page.link/?link=${encodeURIComponent(deeplink)}&apn=com.cystack.locker&afl=${encodeURIComponent(url)}&isi=1586927301&ibi=com.cystack.lockerapp&ifl=${encodeURIComponent(url)}${utmSource ? '&utm_source=' + utmSource : ''}`
      redirect(302, dynamicLink)
    } else {
      redirect(302, url)
    }
  }
}
</script>
