<template>
  <div>
    <Header />
    <div class="max-w-6xl mx-auto mb-36">
      <div class="w-full px-6">
        <nuxt />
      </div>
    </div>
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

<style>
.landing-btn {
  @apply hover:no-underline transition duration-200 ease-in-out text-white hover:text-white;
  display: inline-block;
  padding: 13px 20px;
  min-width: 160px;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  border-radius: 5px;
}
.landing-font-50 {
  font-size: 50px;
  line-height: 56px;
}
.landing-font-38 {
  font-size: 38px;
  line-height: 42px;
}
.landing-font-32 {
  font-size: 32px;
  line-height: 36px;
}
.landing-font-28 {
  font-size: 28px;
  line-height: 32px;
}
.landing-font-20 {
  font-size: 20px;
}
.landing-font-18 {
  font-size: 18px;
}
.landing-font-16 {
  font-size: 16px;
  line-height: 26px;
}
.landing-font-14 {
  font-size: 14px;
}
.landing-font-12 {
  font-size: 12px;
  line-height: 26px;
}
.landing-bg-green {
  background-color: #00A893;
}
</style>
