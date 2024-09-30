<template>
  <div><nuxt /></div>
</template>
<script>
export default {
  head () {
    return {
      link: [{ rel: 'canonical', href: `https://locker.io${this.$route.path}` }]
    }
  }
}
</script>
