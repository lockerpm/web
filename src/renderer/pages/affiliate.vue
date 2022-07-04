<template>
  <div>
    <section
      class="full-width h-auto bg-no-repeat bg-cover"
      :style="{backgroundImage: `url(${require(`~/assets/images/landing/affiliate/cover-bg.png`)})`}"
    >
      <div class="md:pt-[140px] pt-28 mx-auto pl-6">
        <div class="w-full flex flex-wrap justify-end">
          <div class="lg:max-w-[610px] max-h-[500px] md:w-1/2 order-1 mb-8 md:mb-0 z-10">
            <h1 class="text-left font-bold text-black landing-font-50 md:whitespace-nowrap whitespace-normal">
              {{ $t('landing_affiliate.banner.title') }}
            </h1>
            <h1 class="text-left font-bold text-black landing-font-50 md:whitespace-nowrap whitespace-normal">
              {{ $t('landing_affiliate.banner.title2') }}
            </h1>
            <p
              class="max-w-[540px] text-left font-normal text-black-600 landing-font-20 mt-4"
              v-html="$t('landing_affiliate.banner.desc')"
            />
            <div class="mt-9">
              <nuxt-link :to="localePath($t('landing_affiliate.banner.link'))" class="landing-btn">
                {{ $t('landing_affiliate.banner.button.text') }}
              </nuxt-link>
            </div>
          </div>
          <!-- Right -->
          <div class="hidden md:block md:w-[48%] order-2 justify-self-end top-[173px] pr-0">
            <img
              :src="require(`~/assets/images/landing/affiliate/cover-img_${locale}.png`)"
              alt=""
              style="max-width: 120%; margin-left: 24px; max-height: 500px;"
              class="translate-x-[-120px]"
            >
          </div>
          <div class="w-full md:hidden order-2 mt-4">
            <img
              :src="require(`~/assets/images/landing/affiliate/cover-img_${locale}.png`)"
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
          {{ $t('landing_affiliate.why.title') }}
        </h2>
        <img
          src="~/assets/images/landing/index/boundary2.svg"
          alt=""
          class="mx-auto"
        >
        <div class="mt-16 grid md:grid-cols-2 grid-cols-1 md:gap-x-20 gap-x-0 gap-y-12">
          <div
            v-for="(item, index) in $t('landing_affiliate.why.reasons')"
            :key="index"
            class="bg-white px-9 py-[54px]"
            style="border: 1px solid #DFDFDF;box-shadow: 0px 64px 100px rgba(0, 0, 0, 0.05);border-radius: 10px;"
          >
            <img :src="require(`~/assets/images/landing/affiliate/${item.icon}`)">
            <div class="landing-font-22 font-bold mt-6">
              {{ item.title }}
            </div>
            <div class="landing-font-16 mt-2 text-black font-normal">
              {{ item.desc }}
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="py-[120px]">
      <div class="w-full">
        <h2 class="w-full font-bold landing-font-48 text-black text-center mb-6">
          {{ $t('landing_affiliate.steps.title') }}
        </h2>
        <img
          src="~/assets/images/landing/index/boundary2.svg"
          alt=""
          class="mx-auto"
        >
        <div class="mt-16 grid md:grid-cols-8 grid-cols-1">
          <template v-for="(item, index) in $t('landing_affiliate.steps.details')">
            <div
              :key="index"
              class="col-span-2"
            >
              <div class="w-full text-right text-[#62AD56] text-[85px] leading-[104px] font-bold opacity-[33%]">0{{ index + 1 }}</div>
              <img :src="require(`~/assets/images/landing/affiliate/${item.icon}`)" class="mx-auto">
              <div class="landing-font-22 font-bold mt-[18px] text-center">
                {{ item.title }}
              </div>
              <div class="landing-font-16 mt-8 text-black font-normal text-center">
                {{ item.desc }}
              </div>
            </div>
            <div v-if="index!==2" :key="`arrow-${index}`" class="md:col-span-1 md:block hidden self-center">
              <img src="~/assets/images/landing/affiliate/arrow.svg" class="mx-auto">
            </div>
            <div v-if="index!==2" :key="`arrow-${index}`" class="w-full h-6 md:hidden block mt-4">
              <img class="rotate-90 mx-auto" src="~/assets/images/landing/affiliate/arrow.svg"></img>
            </div>
          </template>
        </div>
      </div>
    </section>
    <section class="py-[120px]">
      <div class="bg-[#f5f6f7] px-6 py-16">
        <div class="font-bold landing-font-38 text-black text-center">
          {{ $t('landing_affiliate.cta.title') }}
        </div>
        <div class="mt-4 landing-font-18 text-black font-normal text-center">
          {{ $t('landing_affiliate.cta.desc') }}
        </div>
        <div class="mt-8 text-center">
          <nuxt-link :to="localePath($t('landing_affiliate.cta.button.link'))" class="landing-btn landing-font-16" style="align-self: center">
            {{ $t('landing_affiliate.cta.button.text') }}
          </nuxt-link>
        </div>
      </div>
    </section>
    <section class="py-[120px] full-width h-auto questions">
      <div class="landing-font-38 font-bold text-center mb-[72px]">
        {{ $t('landing_affiliate.faqs.title') }}
      </div>
      <div class="max-w-6xl px-6 mx-auto">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item v-for="(item, index) in $t('landing_affiliate.faqs.details')" :key="index" :name="(index+1).toString()">
            <template slot="title">
              <div class="font-bold landing-font-22 text-black question">
                {{ item.q }}
              </div>
            </template>
            <div class="answer font-normal landing-font-18 pl-[58px] md:pr-[80px] pr-[50px] md:py-[38px] py-[15px]">
              {{ item.a }}
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </section>
    <div class="mb-[90px] py-6 px-8 bg-[#E8E8E9] flex gap-x-6 rounded">
      <img src="~/assets/images/landing/master-password/help.svg">
      <div class="font-semibold max-w-4/5 overflow-hidden overflow-ellipsis">
        <div class="landing-font-20">
          {{ $t('landing_affiliate.help_box.title') }}
        </div>
        <div class="landing-font-16">
          {{ $t('landing_affiliate.help_box.detail') }} <span><a :href="`mailto: ${$t('landing_affiliate.help_box.email')}`" target="_blank">{{ $t('landing_affiliate.help_box.email') }}</a></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'landing',
  data () {
    return {
      activeName: '1'
    }
  }
}
</script>

<style>
.questions .el-collapse{
  background: #FFFFFF;
  border: 1px solid #DFDFDF;
  box-shadow: 0px 64px 100px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}
.questions .el-collapse-item__header {
  padding: 46px 80px 46px 58px;
  border-bottom: 1px solid #DFDFDF !important;
}
.questions .el-collapse-item__content{
  border-bottom: 1px solid #DFDFDF !important;
  border-top: 0 !important;
  border-right: 0 !important;
  border-left: 0 !important;
}
.questions .el-collapse-item__header i.el-collapse-item__arrow{
  display: block !important;
  color: black !important;
  font-weight: bold;
}

@media screen and (max-width: 640px){
  .bg-welcome{
    background-size: cover !important;
  }
  .questions .question{
    font-size: 16px;
  }
  .questions .answer{
    font-size: 14px;
  }
}
</style>
