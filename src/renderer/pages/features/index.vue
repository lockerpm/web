<template>
  <div class="md:pt-[180px] pt-36">
    <h1 class="text-left font-bold text-black landing-font-50 max-w-[890px]">
      {{ $t('features.title') }}
    </h1>
    <section class="md:mt-16 mt-12">
      <h2 class="text-left font-bold text-black landing-font-38 "> {{ $t('features.feature1.title') }} </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[95px] gap-y-[45px] mt-[46px]">
        <div
          v-for="(item, index) in $t('features.feature1.details')"
          :key="index"
          class="flex flex-col items-start"
        >
          <div class="h-[35px]">
            <img :src="require(`~/assets/images/landing/features/${item.img}`)">
          </div>
          <nuxt-link
            class="text-black font-bold landing-font-22 my-[13px] cursor-pointer"
            :to="localePath(item.link)"
          >
            {{ item.title }}</nuxt-link>
          <p class="text-black landing-font-14">{{ item.desc }}</p>
        </div>
      </div>
      <div class="landing-font-18 align-top mt-[45px]">
        <nuxt-link
          class="hover:no-underline text-green font-semibold"
          :to="localePath('/register')"
        >
          {{ $t('features.feature1.btn.text') }} <i class="el-icon-right" />
        </nuxt-link>
      </div>
    </section>
    <section class="md:mt-[150px] mt-16">
      <h2 class="text-left font-bold text-black landing-font-38 "> {{ $t('features.feature2.title') }} </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[95px] gap-y-[45px] mt-[46px]">
        <div
          v-for="(item, index) in $t('features.feature2.details')"
          :key="index"
          class="flex flex-col items-start"
        >
          <div class="h-[35px]">
            <img :src="require(`~/assets/images/landing/features/${item.img}`)">
          </div>
          <nuxt-link
            class="text-black font-bold landing-font-22 my-[13px] cursor-pointer"
            :to="localePath(item.link)"
          >
            {{ item.title }}</nuxt-link>
          <p class="text-black landing-font-14">{{ item.desc }}</p>
        </div>
      </div>
      <div class="landing-font-18 align-top mt-[45px]">
        <nuxt-link
          :to="localePath('/register')"
          class="hover:no-underline text-green font-semibold"
        >
          {{ $t('features.feature2.btn.text') }} <i class="el-icon-right" />
        </nuxt-link>
      </div>
    </section>
    <section class="md:mt-[150px] mt-16">
      <h2 class="text-left font-bold text-black landing-font-38 "> {{ $t('features.feature3.title') }} </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[95px] gap-y-[45px] mt-[46px]">
        <div
          v-for="(item, index) in $t('features.feature3.details')"
          :key="index"
          class="flex flex-col items-start"
        >
          <div class="h-[35px]">
            <img :src="require(`~/assets/images/landing/features/${item.img}`)">
          </div>
          <nuxt-link
            class="text-black font-bold landing-font-22 my-[13px] cursor-pointer"
            :to="localePath(item.link)"
          >
            {{ item.title }}</nuxt-link>
          <p class="text-black landing-font-14">{{ item.desc }}</p>
        </div>
      </div>
      <div class="landing-font-18 align-top mt-[45px]">
        <nuxt-link
          :to="localePath('/register')"
          class="hover:no-underline text-green font-semibold"
        >
          {{ $t('features.feature3.btn.text') }} <i class="el-icon-right" />
        </nuxt-link>
      </div>
    </section>
    <section id="locker-business" class="md:mt-[150px] mt-16 mb-[110px]">
      <h2 class="text-left font-bold text-black landing-font-38 "> {{ $t('features.feature4.title') }} </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[95px] gap-y-[45px] mt-[46px]">
        <div
          v-for="(item, index) in $t('features.feature4.details')"
          :key="index"
          class="flex flex-col items-start space-y-[15px]"
        >
          <div class="h-[35px]">
            <img :src="require(`~/assets/images/landing/features/${item.img}`)">
          </div>
          <nuxt-link
            class="text-black font-bold landing-font-22 my-[13px] cursor-pointer"
            :to="localePath(item.link)"
          >
            {{ item.title }}</nuxt-link>
          <p class="text-black landing-font-14">{{ item.desc }}</p>
        </div>
      </div>
      <div class="landing-font-18 align-top mt-[45px]">
        <nuxt-link
          :to="localePath($t('features.feature4.btn.link'))"
          class="hover:no-underline text-green font-semibold"
        >
          {{ $t('features.feature4.btn.text') }} <i class="el-icon-right" />
        </nuxt-link>
      </div>
    </section>
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
