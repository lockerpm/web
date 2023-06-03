<template>
  <div />
</template>
<script>
export default {
  fetch ({ error }) {
    error({ errorCode: 404 })
  }
}
</script>
