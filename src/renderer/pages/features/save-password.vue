<template>
  <div>
    <!-- Feature -->
    <section
      class="full-width w-full h-auto md:pb-[118px] pb-20"
      style="background-color: #f5f6f7"
    >
      <div class="max-w-6xl mx-auto px-6">
        <div class="w-full flex flex-wrap">
          <div class="w-full md:mb-0 md:pt-[115px] pt-20 text-center order-1">
            <h2 class=" w-full font-bold landing-font-38 text-black mb-[20px] max-w-[650px] mx-auto">
              {{ $t('landing.section2.title') }}
            </h2>
            <img
              src="~/assets/images/landing/index/boundary2.svg"
              alt=""
              class="mx-auto"
            >
          </div>
          <div
            class="w-full mt-[45px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-[45px] lg:gap-x-[30px] gap-y-[45px] order-2"
          >
            <div
              v-for="(item, index) in $t('landing.section2.features')"
              :key="index"
              class="landing-transition px-[30px] pt-11 bg-white rounded-lg hover:shadow-xl"
            >
              <img
                :src="require(`~/assets/images/landing/index/${item.img}`)"
                :alt="item.title"
                class="h-[40px] mb-[16px]"
              >
              <h3 class="mb-[12px] font-bold text-black landing-font-20">
                {{ item.title }}
              </h3>
              <p class="lg:max-w-[265px] mb-[40px] landing-font-14">
                {{ item.desc }}
              </p>
            </div>
          </div>
          <div class="max-w-xs mx-auto sm:max-w-none order-3 mt-[60px]">
            <div class="mb-4 sm:mb-0">
              <nuxt-link
                class="landing-btn bg-green w-full sm:w-auto mb-1"
                :to="localeRoute({name: $t('landing.section2.btn.link')})"
              >
                {{ $t('landing.section2.btn.text') }}
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Feature end -->
    <!-- Start -->
    <div
      class="full-width w-full h-auto pb-[105px] md:mt-[150px] mt-24"
      style="background-color: #f5f6f7"
    >
      <section class="max-w-6xl mx-auto px-6">
        <div class="w-full flex flex-wrap">
          <div class="w-full md:mb-0 md:pt-[115px] pt-20 text-center order-1">
            <h2 class="w-full font-bold landing-font-38 text-black mb-[45px] max-w-[790px] mx-auto">
              {{ $t('landing.start.title') }}
            </h2>
          </div>
          <div class="w-full md:w-10/12 mx-auto flex flex-wrap order-2 gap-x-[30px] gap-y-[45px] justify-center">
            <div
              v-for="(item, index) in $t('landing.start.options')"
              :key="index"
              class=" landing-transition p-12 w-full md:w-[380px] bg-white relative z-10 rounded-xl hover:shadow-xl"
            >
              <img
                :src="require(`~/assets/images/landing/index/${item.img}`)"
                :alt="item.title"
                class="mb-[20px] h-[100px] w-auto mx-auto"
              >

              <h3 class="text-center landing-font-20 font-bold mb-[11px]">
                {{ item.title }}
              </h3>

              <p class="text-center text-black-600 landing-font-16 mb-[40px]">
                {{ item.desc }}
              </p>

              <div class="w-full flex">
                <nuxt-link
                  :class="index === 0 ? 'landing-btn' : 'landing-btn2'"
                  class="mx-auto"
                  :to="localePath(item.btn.link)"
                  style="align-self: center"
                >
                  {{ item.btn.text }}
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <!-- Start end -->
  </div>
</template>
<script>
export default {
  layout: 'landing',
  data () {
    return {
    }
  },
  methods: {
    register () {
      const environment = process.env.environment
      window.location.href = `${process.env.idUrl}/register?SERVICE_URL=${this.$store.state.currentPath !== '/' ? encodeURIComponent(`${this.$store.state.currentPath}`) : '/vault'}&SERVICE_SCOPE=pwdmanager&lang=${this.store.state.user.language}${environment ? `&ENVIRONMENT=${environment}` : ''}`
    }
  }
}
</script>
  <style>
  </style>
