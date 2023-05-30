<template>
  <nuxt-child />
</template>
<script>
export default {
  middleware: ['BlockOnPremise']
}
</script>
