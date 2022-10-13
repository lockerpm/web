<template>
  <div>
    <div class="text-center mb-[20px]">
      {{ currentUser ? currentUser.email : '' }}
    </div>
    <div class="text-center pt-[50px]">
      <a :href="`lockerApp://auth?action=login&status=done&token=${token}`">Click here to launch the app</a>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'authenticate',
  mounted () {
    this.token = this.$route.query.token
  },
  data () {
    return {
      token: null
    }
  }
}
</script>

<style scoped>

</style>
