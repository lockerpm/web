<template>
  <div />
</template>
<script>
export default {
  layout: 'authenticate',
  fetch ({ redirect, store, isDev, route }) {
    const environment = isDev ? 'dev_web' : process.env.environment

    // (On premise) Navigate to /lock if has user else to to login as usual
    if (store.state.isOnPremise && store.state.isLoggedIn) {
      redirect(302, '/lock')
      return
    }

    redirect(
      302,
      `${process.env.idUrl}/login?SERVICE_URL=${
        route.query.SERVICE_URL
          ? encodeURIComponent(route.query.SERVICE_URL)
          : store.state.currentPath !== '/'
            ? encodeURIComponent(`${store.state.currentPath}`)
            : '/vault'
      }&SERVICE_SCOPE=pwdmanager&lang=${store.state.user.language}${
        environment ? `&ENVIRONMENT=${environment}` : ''
      }`
    )
  }
}
</script>
