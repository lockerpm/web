<template>
  <div>
    <!-- Content -->
    <div class="max-w-7xl mx-auto">
      <div class="w-full px-6">
        <nuxt />
      </div>
    </div>
    <!-- Content end -->
  </div>
</template>
<script>
export default {

}
</script>
<style lang="scss">
* {
  font-family: 'Avenir Next', 'SVN-Avenir Next', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.landing-font-81 {
  font-size: 4.8rem;
  line-height: 6rem;
}
.landing-font-54 {
  font-size: 3rem;
  line-height: 4rem;
}
.landing-font-36 {
  font-size: 36px;
  line-height: 48px;
}
.landing-font-24 {
  font-size: 1.5rem;
  line-height: 2rem;
}
.landing-font-21 {
  font-size: 1.3rem;
  line-height: 2rem;
}
.landing-font-18 {
  font-size: 18px;
  line-height: 32px;
}
.landing-font-16 {
  font-size: 16px;
  line-height: 24px;
}
.full-width {
  width: calc(100vw - 4px);
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  overflow-x: hidden;
}

.bg-block {
  background-color: #FAFAFA;
}
.bg-gray {
  background-color: #F5F5F5;
}
.text-secondary-45 {
  color: #858585;
}
.text-secondary-65 {
  color: #555555;
}

// p {
//   color: #555555;
// }

@media only screen and (max-width: 768px) {
  .landing-font-81 {
    font-size: 48px;
    line-height: 60px;
  }
  .landing-font-54 {
    font-size: 32px;
    line-height: 44px;
  }
}

.primary-btn {
  @apply bg-primary rounded-full hover:bg-primary-HOVER text-white font-semibold py-3 px-9 transition-colors cursor-pointer;
  font-size: 1.3rem;
  line-height: 2rem;
}
.primary-btn-outline {
  @apply bg-white rounded-full hover:bg-primary hover:text-white text-primary font-semibold py-3 px-9 transition-colors cursor-pointer border border-primary;
  font-size: 1.3rem;
  line-height: 2rem;
}
.btn-small {
  @apply py-2 px-6;
}
</style>
