<template>
  <div />
</template>
<script>
export default {
  layout: 'white',
  fetch ({ route, redirect }) {
    console.log(route.name)
    redirect(302, route.fullPath.replace('/quick-share-item', ''))
  }
}
</script>
<style scoped></style>
