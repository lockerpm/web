<template>
  <nuxt-child />
</template>
<script>
export default {
  mounted () {
    // Tutorial
    if (this.$store.state.tutorial.isActive) {
      this.markDoneStep('browse_items')
    }
  }
}
</script>
