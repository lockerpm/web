<template>
  <div>
    <div class="bg-welcome bg-[#EDF4ED] full-width h-auto">
      <img src="~/assets/images/landing/promotion/logo.png" class="m-auto w-[137px] h-[38px] mt-[19px]">
    </div>
    <div class="bg-welcome full-width h-auto pt-[76px] pb-[50px] bg-center bg-cover bg-no-repeat" :style="{backgroundImage: `url(${require(`~/assets/images/landing/promotion/bg_welcome.png`)})`}">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid md:grid-cols-2 grid-cols-1 items-center gap-x-[10px] md:gap-y-0 gap-y-[40px]">
          <div>
            <div class="text-[#161922] font-bold landing-font-48 mb-[14px]">
              {{ $t('promotion.welcome.title') }}
            </div>
            <div class="absolute left-0">
              <div class="relative">
                <img class="lg:h-[62px] md:h-[50px] h-[62px]" src="~/assets/images/landing/promotion/img_limited.png">
                <div class="landing-font-22 text-[#FFFFFF] font-bold absolute lg:top-[8px] md:top-[5px] top-[8px] right-[72px]">
                  {{ $t('promotion.welcome.text_limit') }}
                </div>
              </div>
            </div>
            <div class="mt-[80px]">
              <div v-for="(item, index) in $t('promotion.welcome.list_subtitle')" :key="index" class="flex items-center">
                <img src="~/assets/images/landing/promotion/icon-success.png" style="width:12px; height: 12px">
                <div class="landing-font-16 color-[#000000] font-normal ml-3">
                  {{ item }}
                </div>
              </div>
            </div>
            <div class="mt-[36px]">
              <nuxt-link
                :to="localePath($t('promotion.btn_signup.link'))"
                class="hover:no-underline text-[#FFFFFF] font-semibold landing-btn-signup"
              >
                {{ $t('promotion.btn_signup.text') }}
              </nuxt-link>
            </div>
          </div>
          <div>
            <img src="~/assets/images/landing/promotion/img_welcome.png">
          </div>
        </div>
      </div>
    </div>
    <div class="introduce_locker">
      <div class="pt-[120px] pb-[100px]">
        <div class="landing-font-48 font-bold text-[#000000] mb-6 text-center">
          {{ $t('promotion.introduce_locker.fail.title') }}
        </div>
        <div class="text-center">
          <img src="~/assets/images/landing/promotion/img_line.png" class="m-auto w-[290px]">
        </div>
        <div class="mt-16 grid md:grid-cols-2 grid-cols-1 items-center md:gap-x-[118px] gap-x-0 md:gap-y-0 gap-y-[60px]">
          <div>
            <div v-for="(item, index) in $t('promotion.introduce_locker.fail.content_fail')" :key="index" class="flex flex-wrap mb-5">
              <div>
                <img src="~/assets/images/landing/promotion/icon-fail.svg" class="mt-[10px] w-[24px] h-[24px]" >
              </div>
              <div class="landing-font-20 text-[#000000] font-normal ml-[14px] w-4/5">
                {{ item }}
              </div>
            </div>
          </div>
          <div>
            <img src="~/assets/images/landing/promotion/img_fail.png">
          </div>
        </div>
        <div class="text-center mt-[100px]">
          <nuxt-link
            :to="localePath($t('promotion.btn_signup.link'))"
            class="hover:no-underline text-[#FFFFFF] font-semibold landing-btn-signup m-auto"
          >
            {{ $t('promotion.btn_signup.text') }}
          </nuxt-link>
        </div>
      </div>
      <div class="pt-[120px] pb-[240px]">
        <div class="font-bold landing-font-48 text-[#000000] mb-6 text-center">
          {{ $t('promotion.introduce_locker.goods.title') }}
        </div>
        <div class="text-center">
          <img src="~/assets/images/landing/promotion/img_line.png" class="m-auto w-[290px]">
        </div>
        <div class="mt-16 grid md:grid-cols-2 grid-cols-1 items-center md:gap-x-[118px] gap-x-0 md:gap-y-0 gap-y-[60px]">
          <div>
            <img src="~/assets/images/landing/promotion/img_goods.png">
          </div>
          <div>
            <div v-for="(item, index) in $t('promotion.introduce_locker.goods.content_goods')" :key="index" class="flex mb-5 flex-wrap">
              <div>
                <img src="~/assets/images/landing/promotion/icon-success.png" class="mt-[10px] w-[24px] h-[24px]">
              </div>
              <div class="landing-font-20 text-[#000000] font-normal ml-[14px] w-4/5">
                {{ item }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="relative mb-[120px]">
      <div class="full-width h-auto bg-[#F5F6F7] py-[120px]">
        <div class="max-w-6xl mx-auto px-6">
          <div class="landing-font-48 font-bold text-center text-[#000000] mb-[48px]">
            {{ $t('promotion.locker_super.title') }}
          </div>
          <div class="grid md:grid-cols-2 grid-cols-1 md:gap-x-[80px] gap-x-0 md:gap-y-[24px] gap-y-[40px]">
            <div v-for="(item, index) in $t('promotion.locker_super.content')" :key="index" class="flex flex-wrap">
              <div>
                <img src="~/assets/images/landing/promotion/icon-success.png" class="w-[24px] h-[24px] mt-[5px]">
              </div>
              <div class="ml-[14px] text-[#000000] landing-font-20 font-normal w-4/5">
                {{ item }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center">
        <nuxt-link
          :to="localePath($t('promotion.btn_signup.link'))"
          class="hover:no-underline text-[#FFFFFF] font-semibold landing-btn-signup text-center absolute bottom-[-30px] md:ml-[-100px] ml-[-125px]"
        >
          {{ $t('promotion.btn_signup.text') }}
        </nuxt-link>
      </div>
    </div>
    <div class="py-[120px] support-devices">
      <div class="landing-font-48 font-bold text-[#000000] mb-[71px] text-center">
        {{ $t('promotion.support_devices.title') }}
      </div>
      <div class="text-center">
        <img src="~/assets/images/landing/promotion/img_line.png" class="m-auto w-[290px]">
      </div>
      <div class="grid md:grid-cols-3 grid-cols-2 lg:gap-x-[200px] md:gap-x-[120px] gap-x-[80px] mt-5 md:gap-y-[72px] gap-y-[40px]">
        <div v-for="(item, index) in $t('promotion.support_devices.list_devices')" :key="index" class="flex items-center">
          <div>
            <img :src="require(`~/assets/images/landing/promotion/${item.img}`)" class="h-[80px] w-[80px]">
          </div>
          <div class="text-[#000000] landing-font-20 font-semibold ml-5">
            {{ item.device }}
          </div>
        </div>
      </div>
    </div>
    <div class="py-[120px]">
      <div class="landing-font-48 font-bold text-[#000000] mb-6 text-center">
        {{ $t('promotion.goods_security.title') }}
      </div>
      <div class="text-center mb-[56px]">
        <img src="~/assets/images/landing/promotion/img_line.png" class="m-auto w-[290px]">
      </div>
      <div class="grid md:grid-cols-3 grid-cols-1 lg:gap-x-[100px] md:gap-x-[50px] gap-x-0 md:gap-y-0 gap-y-[50px]">
        <div v-for="(item, index) in $t('promotion.goods_security.items')" :key="index">
          <div>
            <img :src="require(`~/assets/images/landing/promotion/${item.icon}`)">
          </div>
          <div class="landing-font-20 text-[#000000] mt-[28px]">
            {{ item.desc }}
          </div>
        </div>
      </div>
    </div>
    <div class="customer-said py-[120px]">
      <div class="text-[#161922] landing-font-45 font-bold">
        {{ $t('promotion.customer_said.title') }}
      </div>
      <div class="mt-5 mb-6">
        <img src="~/assets/images/landing/promotion/line-customer.png" class="w-1/2">
      </div>
      <el-carousel indicator-position="outside" :autoplay="false" height="250px">
        <el-carousel-item v-for="(item, index) in $t('promotion.customer_said.comments')" :key="index.toString()">
          <div class="text-[#161922] landing-font-20 font-normal mb-3">{{ item.desc }}</div>
          <div>
            <div class="landing-font-20 text-[#161922] font-bold">
              {{ item.author }}
            </div>
            <div class="landing-font-20 text-[#161922] font-bold">
              {{ item.date_comment }}
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="locker-absolutely py-[120px]">
      <div class="text-[#000000] landing-font-48 font-bold">
        {{ $t('promotion.locker_absolutely.title') }}
      </div>
      <div class="text-center mt-6 mb-[54px]">
        <img src="~/assets/images/landing/promotion/img_line.png" class="m-auto w-[290px]">
      </div>
      <div class="grid md:grid-cols-2 grid-cols-1 gap-x-[29px] items-center">
        <div>
          <div v-for="(item, index) in $t('promotion.locker_absolutely.items')" class="flex mb-6 flex-wrap" :key="index">
            <div>
              <img src="~/assets/images/landing/promotion/icon-success.png" class="mt-[5px] w-[24px] h-[24px]" >
            </div>
            <div class="ml-[14px] text-[#000000] landing-font-20 font-normal w-4/5">
              {{ item }}
            </div>
          </div>
        </div>
        <div>
          <img src="~/assets/images/landing/promotion/img_absolutely.png">
        </div>
      </div>
    </div>
    <div class="cta py-[120px]">
      <div class="bg-[#F5F6F7] md:px-[166px] px-[20px] py-16">
        <div class="text-[#161922] landing-font-38 font-bold text-center">
          {{$t('promotion.cta.title')}}
        </div>
        <div class="mt-8 text-center">
          <nuxt-link
            :to="localePath($t('promotion.btn_signup.link'))"
            class="hover:no-underline text-[#FFFFFF] font-semibold landing-btn-signup"
          >
            {{ $t('promotion.btn_signup.text') }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'white',
  data () {
    return ({
      activeName: 'first'
    })
  }
}
</script>
<style lang="scss">
.landing-btn-signup {
  @apply hover:no-underline transition duration-200 ease-in-out text-white hover:text-white hover:bg-green-hover;
  display: inline-block;
  padding: 18px 68px;
  min-width: 229px;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  border-radius: 5px;
  background-color: #268334;
  &:disabled {
   background-color: #268334;
      &:hover {
       background-color: #268334;
      }
  }
}
.customer-said{
  .el-carousel__arrow--right,.el-carousel__arrow--left{
    display: none;
  }
  .el-carousel__button{
    border-radius: 4px;
    width: 77px;
    height: 6px;
    margin:0px 20px;
  }
  .el-carousel__indicator.is-active button{
    background: #008800;
  }
}
.line_customer{
  //background: #008800;
  border-radius: 4px;
  width: 77px;
  height: 6px;
}
</style>
