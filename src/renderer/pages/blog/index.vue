<template>
  <div />
</template>

<script>
export default {
  layout: 'landing',

  fetch ({ route, redirect }) {
    redirect(301, `https://locker.io${route.fullPath}`)
  }
}
</script>

<style>
</style>
