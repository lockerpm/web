<template>
  <div>
    <section
      class="full-width h-auto bg-no-repeat bg-cover"
      :style="{backgroundImage: `url(${require(`~/assets/images/landing/master-password/cover-bg.png`)})`}"
    >
      <div class="md:pt-[141px] pt-28 mx-auto pl-6">
        <div class="w-full flex flex-wrap justify-end">
          <div class="lg:max-w-[610px] max-h-[500px] md:w-1/2 order-1 mb-8 md:mb-0 md:pt-[70px] pt-5">
            <h1 class="text-left font-bold text-black landing-font-50 mb-4">
              {{ $t('landing_master_password.banner.title') }}
            </h1>
            <img
              src="~/assets/images/landing/index/boundary.svg"
              alt=""
            >
            <p
              class="text-left font-normal text-black-600 landing-font-20 mx-auto mt-4"
              v-html="$t('landing_master_password.banner.desc')"
            />
          </div>
          <!-- Right -->
          <div class="hidden md:block md:w-[48%] order-2 justify-self-end top-[173px] pr-0">
            <img
              :src="require(`~/assets/images/landing/master-password/cover-img_${locale}.png`)"
              alt=""
              style="max-width: 120%; margin-left: 24px; max-height: 500px;"
            >
          </div>
          <div class="w-full md:hidden order-2 mt-4">
            <img
              :src="require(`~/assets/images/landing/master-password/cover-img_${locale}.png`)"
              alt=""
            >
          </div>
          <!-- Right end -->
        </div>
      </div>
    </section>
    <section class="py-[120px]">
      <div class="w-full">
        <h2 class="w-full font-bold landing-font-48 text-black text-center mb-6">
          {{ $t('landing_master_password.what_is_mp.title') }}
        </h2>
        <img
          src="~/assets/images/landing/index/boundary2.svg"
          alt=""
          class="mx-auto"
        >
        <div class="text-black landing-font-20 mt-8">
          {{ $t('landing_master_password.what_is_mp.desc') }}
        </div>
      </div>
    </section>
    <section class="py-[120px]">
      <div class="w-full">
        <h2 class="w-full font-bold landing-font-48 text-black text-center mb-6">
          {{ $t('landing_master_password.how_it_works.title') }}
        </h2>
        <img
          src="~/assets/images/landing/index/boundary2.svg"
          alt=""
          class="mx-auto"
        >
        <div class="text-black landing-font-20 mt-8">
          {{ $t('landing_master_password.how_it_works.desc') }}
        </div>
        <div class="text-black landing-font-20 mt-5">
          {{ $t('landing_master_password.how_it_works.desc2') }}
        </div>
      </div>
    </section>
    <section
      class="full-width h-auto md:py-[120px] pt-28"
    >
      <div class="max-w-6xl mx-auto">
        <h2 class="w-full font-bold landing-font-48 text-black text-center mb-6">
          {{ $t('landing_master_password.how_to_create.title') }}
        </h2>
        <img
          src="~/assets/images/landing/index/boundary2.svg"
          alt=""
          class="mx-auto"
        >
      </div>
      <div class="mx-auto pl-6 mt-8">
        <div class="w-full flex flex-wrap justify-end">
          <div class="lg:max-w-[570px] max-h-[500px] md:w-1/2 order-1 mb-8 md:mb-0 self-center">
            <div class="landing-font-20 text-black">
              {{ $t('landing_master_password.how_to_create.title_instruction') }}
            </div>
            <ul>
              <li v-for="(item, index) in $t('landing_master_password.how_to_create.instructions')" :key="index" class="mt-9">
                <div class="flex">
                  <div>
                    <div class="bg-primary text-white font-bold px-[15px] py-[5px] text-head-5 rounded">
                      {{ index + 1 }}
                    </div>
                  </div>
                  <div class="ml-[22px]">
                    <div class="landing-font-24 font-semibold text-black">
                      {{ item }}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- Right -->
          <div class="hidden md:block md:w-1/2 order-2 justify-self-end top-[173px] pr-0">
            <img
              :src="require(`~/assets/images/landing/index/bg-img_${locale}.png`)"
              alt=""
              style="max-width: 120%; margin-left: 24px; max-height: 500px;"
            >
          </div>
          <div class="w-full md:hidden order-2 mt-4">
            <img
              :src="require(`~/assets/images/landing/index/bg-img_${locale}.png`)"
              alt=""
            >
          </div>
          <!-- Right end -->
        </div>
      </div>
    </section>
    <section class="py-[120px]">
      <div class="w-full">
        <h2 class="w-full font-bold landing-font-48 text-black text-center mb-6">
          {{ $t('landing_master_password.notice.title') }}
        </h2>
        <img
          src="~/assets/images/landing/index/boundary2.svg"
          alt=""
          class="mx-auto"
        >
        <div class="text-black landing-font-20 mt-8">
          {{ $t('landing_master_password.notice.desc') }}
        </div>
        <div class="grid md:grid-cols-3 grid-cols-1 md:gap-x-8 md:gap-y-0 gap-y-8 mt-16">
          <div
            v-for="(item, index) in $t('landing_master_password.notice.notices')"
            :key="index"
            class="bg-white px-9 py-[54px]"
            style="border: 1px solid #DFDFDF;box-shadow: 0px 64px 100px rgba(0, 0, 0, 0.05);border-radius: 10px;"
          >
            <img :src="require(`~/assets/images/landing/master-password/${item.icon}`)" class="mx-auto">
            <div class="landing-font-16 mt-6 text-black font-normal">
              {{ item.text }}
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="my-[90px] py-6 px-8 bg-[#E8E8E9] flex gap-x-6 rounded">
      <img src="~/assets/images/landing/master-password/help.svg">
      <div class="font-semibold max-w-4/5 overflow-hidden overflow-ellipsis">
        <div class="landing-font-20">
          {{ $t('landing_master_password.help_box.title') }}
        </div>
        <div class="landing-font-16">
          {{ $t('landing_master_password.help_box.detail') }} <span><a :href="$t('landing_master_password.help_box.link')" target="_blank">{{ $t('landing_master_password.help_box.link') }}</a></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'landing'
}
</script>

<style lang="scss" scoped>
</style>
