<template>
  <div>
    <div class="max-w-6xl mx-auto">
      <div class="w-full px-6">
        <nuxt />
      </div>
    </div>
  </div>
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
