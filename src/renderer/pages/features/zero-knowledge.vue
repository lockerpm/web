<template>
  <div>
    <!-- Intro -->
    <section class="full-width w-full h-auto md:pb-[0px] pb-14">
      <div class="max-w-7xl mx-auto px-6">
        <div class="w-full flex flex-wrap">
          <div class="w-full md:mb-0 md:pt-[140px] pt-20 text-center order-1">
            <div class="w-full font-bold landing-font-48 text-[#161922] mb-[20px] mx-auto">
              {{ $t('features.zero_knowledge.title') }}
            </div>
            <div class="w-full landing-font-20 text-[#3A3A3A] mb-[20px] mx-auto">
              {{ $t('features.zero_knowledge.subtitle') }}
            </div>
            <div class="mx-auto max-w-[820px]">
              <img v-if="locale==='en'" src="~/assets/images/landing/features/detail/en/zero_knowledge.png">
              <img v-else src="~/assets/images/landing/features/detail/vi/zero_knowledge.png">
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Intro end -->

    <!-- Detail start -->
    <section class="max-w-[860px] mx-auto px-6">
      <div class="w-full">
        <div
          v-for="(detail, index) in $t('features.zero_knowledge.details')"
          :key="index"
          class="w-full md:mb-0 md:pt-[40px] pt-40[px] order-1 max-w-[860px]"
        >
          <div class="w-full font-bold landing-font-38 text-[#161922] mb-[20px]">
            {{ detail.detail_title }}
          </div>
          <div
            class="w-full landing-font-16"
            style="color: #5A6176;"
            v-html="detail.detail_desc"
          />
        </div>
        <div class="flex">
          <div
            class="w-full landing-font-16 mx-auto pt-[26px] flex"
            style="color: #5A6176;"
          >
            {{ $t('features.zero_knowledge.more_info') }}
            <p class="landing-font-16">
              <span class="text-green">
                <a v-if="locale==='en'" href="https://locker.io/blog/can-locker-access-and-read-your-data">
                  &nbsp;here
                </a>
                <a v-else href="https://locker.io/blog/can-locker-access-and-read-your-data">
                  &nbsp;tại đây
                </a>
              </span>
            </p>
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
          {{ $t('features.common_cta.title') }}
        </div>
        <div class=" w-full landing-font-18 text-[#5A6176] mb-[20px] mx-auto">
          {{ $t('features.common_cta.subtitle') }}
        </div>
        <div class="w-full">
          <nuxt-link
            class="mx-auto landing-btn"
            :to="localePath('/download')"
            style="align-self: center"
          >
            {{ $t('features.common_cta.button_text') }}
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
  <style>
  </style>
