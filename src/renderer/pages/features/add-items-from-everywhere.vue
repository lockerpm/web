<template>
  <div>
    <!-- Intro -->
    <section
      class="full-width w-full h-auto"
      style="background-color: #FFFFFF"
    >
      <div class="max-w-6xl mx-auto px-6">
        <div class="w-full flex flex-wrap">
          <div class="w-full md:mb-0 md:pt-[140px] pt-20 text-center order-1">
            <div class=" w-full font-bold landing-font-48 text-[#161922] mb-[20px] mx-auto">
              {{ $t('features.add_items.title') }}
            </div>
            <div class=" w-full landing-font-20 text-[#3A3A3A] mb-[20px] mx-auto">
              {{ $t('features.add_items.subtitle') }}
            </div>
            <div class="max-w-[700px] mx-auto mt-[40px]">
              <img src="~/assets/images/landing/features/detail/import_password.svg" width="w-full">
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Intro end -->

    <!-- Detail start -->
    <section class="max-w-[888px] mx-auto px-6">
      <div class="w-full pt-[10px]">
        <div class="w-full md:mb-0 order-1 max-w-[860px]">
          <div class="w-full font-bold landing-font-38 text-[#161922] mb-[20px] mx-auto">
            {{ $t('features.add_items.detail_title') }}
          </div>
          <div
            class="w-full landing-font-16 text-[#5A6176] mx-auto"
          >
            {{ $t('features.add_items.detail_desc') }}
          </div>
        </div>
        <div class="w-full md:mb-0 md:pt-[40px] pt-40[px] order-1 max-w-[860px]">
          <div class="w-full font-bold landing-font-38 text-[#161922] mb-[20px] mx-auto">
            {{ $t('features.add_items.details_title2') }}
          </div>
          <div class="w-full landing-font-16 text-black  mx-auto" style="color: #5A6176;">
            {{ $t('features.add_items.guide.desc1') }}<br>
            <br>
            <div v-html="$t('features.add_items.guide.desc2')" />
            <br>
            <ul
              v-for="(step, index) in $t('features.add_items.guide.list1')"
              :key="index"
              class="w-full landing-font-16 text-black list-disc mx-auto"
            >
              <li class="ml-[27px]" v-html="step" />
            </ul>
            <br>
            {{ $t('features.add_items.guide.desc3') }}<br>
            <br>
            <ul
              v-for="(step, index) in $t('features.add_items.guide.list2')"
              :key="index"
              class="w-full landing-font-16 text-black list-disc mx-auto"
            >
              <li class="ml-[27px]" v-html="step" />
            </ul>
            <br>
            {{ $t('features.add_items.guide.desc4') }}
          </div>
        </div>
      </div>
    </section>
    <!-- Detail end -->

    <!-- CTA start -->
    <section
      class="full-width bg-[#EDF4ED] h-[310px] mt-[100px]"
      :style="{backgroundImage: `url(${require(`~/assets/images/landing/features/detail/Group.png`)}), url(${require(`~/assets/images/landing/features/detail/Group-2.png`)})`}"
      style="background-position: left bottom, right top; background-repeat: no-repeat, no-repeat"
    >
      <div class="w-full text-center order-1 py-16">
        <div class=" w-full font-bold landing-font-38 text-[#161922] mb-[20px] mx-auto">
          {{ $t('features.add_items.CTA.title') }}
        </div>
        <div class=" w-full landing-font-18 text-[#5A6176] mb-[20px] mx-auto">
          {{ $t('features.add_items.CTA.subtitle') }}
        </div>
        <div class="w-full">
          <nuxt-link
            class="mx-auto landing-btn"
            :to="localePath('/download')"
            style="align-self: center"
          >
            {{ $t('features.add_items.CTA.button_text') }}
          </nuxt-link>
        </div>
      </div>
    </section>
    <!--CTA end -->
  </div>
  <!-- Start end -->
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
<style scoped>
  img {
    width: -webkit-fill-available;
  }
  ul {
    color: #5A6176;
  }
</style>
