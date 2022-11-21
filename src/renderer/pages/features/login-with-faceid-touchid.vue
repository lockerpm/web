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
            <div class="w-full max-w-[700px] font-bold landing-font-48 text-[#161922] mb-[20px] mx-auto">
              {{ $t('features.login_with_faceid_touchid.title') }}
            </div>
            <div class=" w-full landing-font-20 text-[#3A3A3A] mb-[20px] mx-auto">
              {{ $t('features.login_with_faceid_touchid.subtitle') }}
            </div>
            <div class="max-w-[356px] pt-10 mx-auto">
              <img src="~/assets/images/landing/features/detail/log_in_with_FaceID.svg" width="w-full">
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Intro end -->

    <!-- Detail start -->
    <section class="max-w-[938px] mx-auto px-6 md:pl-[49px] md:pr-[24px]">
      <div class="w-full pt-[20px]">
        <div class="w-full md:mb-0 order-1">
          <div class="w-full font-bold landing-font-38 text-[#161922] mb-[20px] mx-auto">
            {{ $t('features.login_with_faceid_touchid.destails[0].detail_title') }}
          </div>
          <div class="w-full landing-font-16 text-[#5A6176] mx-auto">
            {{ $t('features.login_with_faceid_touchid.destails[0].detail_desc') }}
          </div>

          <div class="w-full pt-[40px] font-bold landing-font-38 text-[#161922] mb-[20px] mx-auto">
            {{ $t('features.login_with_faceid_touchid.destails[1].detail_title') }}
          </div>

          <div class="w-full landing-font-16 text-black  mx-auto" style="color: #5A6176;">
            <div v-html="$t('features.login_with_faceid_touchid.destails[1].detail_desc1')" />
            <ul
              v-for="(step, index) in $t('features.login_with_faceid_touchid.destails[1].detail_ul')"
              :key="index"
              class="w-full landing-font-16 text-black list-disc mx-auto"
            >
              <li class="ml-[27px]">
                {{ $t(step) }}
              </li>
            </ul>
            <div v-html="$t('features.login_with_faceid_touchid.destails[1].detail_desc2')" />
          </div>

          <div class="w-full font-bold landing-font-38 pt-[40px] text-[#161922] mb-[20px] mx-auto">
            {{ $t('features.login_with_faceid_touchid.destails[2].detail_title') }}
          </div>
          <div class="max-w-[729px] w-full landing-font-16 text-[#5A6176]">
            {{ $t('features.login_with_faceid_touchid.destails[2].detail_desc') }}
          </div>
        </div>
      </div>
    </section>
    <!-- Detail end -->

    <!-- CTA start -->
    <section
      class="full-width bg-[#EDF4ED] h-[310px] mt-[165px]"
      :style="{backgroundImage: `url(${require(`~/assets/images/landing/features/detail/Group.png`)}), url(${require(`~/assets/images/landing/features/detail/Group-2.png`)})`}"
      style="background-position: left bottom, right top; background-repeat: no-repeat, no-repeat"
    >
      <div class="w-full text-center order-1 py-16">
        <div class=" w-full font-bold landing-font-38 text-[#161922] mb-[20px] mx-auto">
          {{ $t('features.login_with_faceid_touchid.CTA.title') }}
        </div>
        <div class="w-full landing-font-18 text-[#5A6176] mb-[20px] mx-auto">
          {{ $t('features.login_with_faceid_touchid.CTA.subtitle') }}
        </div>
        <div class="w-full">
          <nuxt-link
            class="mx-auto landing-btn"
            :to="localePath('/download')"
            style="align-self: center"
          >
            {{ $t('features.login_with_faceid_touchid.CTA.button_text') }}
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
  middleware: ['blockProduction'],
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
