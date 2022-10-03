<template>
  <div />
</template>
<script>
export default {
  layout: 'authenticate',
  middleware: 'preventToUser',
  fetch ({ redirect, store, isDev, route }) {
    const environment = isDev ? 'dev' : process.env.environment
    redirect(302, `${process.env.idUrl}/login?SERVICE_URL=${route.query.SERVICE_URL ? encodeURIComponent(route.query.SERVICE_URL) : store.state.currentPath !== '/' ? encodeURIComponent(`${store.state.currentPath}`) : '/vault'}&SERVICE_SCOPE=pwdmanager&lang=${store.state.user.language}${environment ? `&ENVIRONMENT=${environment}` : ''}`)
  }
}
</script>
