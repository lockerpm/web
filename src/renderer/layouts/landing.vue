<template>
  <div>
    <Header />
    <nuxt />
    <Footer />
  </div>
</template>

<script>
import Header from '../components/landing/Header'
import Footer from '../components/landing/Footer'

export default {
  components: {
    Header,
    Footer
  }
}
</script>

<style scoped>

</style>
