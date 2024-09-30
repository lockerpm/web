<template>
  <div>
    <section v-if="dialogVisible">
      <div class="modal" @click="toggleVideo">
        <div class="modal-content">
          <youtube :video-id="videoId" player-width="960" player-height="540" :player-vars="{autoplay: 0}" />
        </div>
      </div>
    </section>

    <div class="bg-welcome bg-[#EDF4ED] full-width h-auto">
      <img src="~/assets/images/landing/promotion/logo.png" class="m-auto w-[137px] h-[38px] mt-[19px] max-w-full">
    </div>
    <div class="bg-welcome full-width h-auto pt-[40px] pb-[50px] bg-center bg-cover bg-no-repeat" :style="{backgroundImage: `url(${require(`~/assets/images/landing/promotion/bg_welcome.png`)})`}">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-[#161922] font-bold landing-font-60 mb-[54px] text-center max-w-[642px] mx-auto">
          {{ $t('promotion_new.title') }}
        </div>
        <img
          class="mx-auto"
          src="~/assets/images/landing/promotion-new/laptop.svg"
          alt=""
        >
      </div>
    </div>

    <section class="py-10 full-width h-auto bg-[#F5F7F9]">
      <a href="#warning-section">
        <img
          src="~/assets/images/landing/crypto/CaretDoubleDown.svg"
          class="mx-auto mt-5 mb-6 h-9"
        >
      </a>
    </section>

    <span id="warning-section" class="anchor" />
    <section class="warning py-10 full-width h-auto bg-[#F5F7F9]">
      <div class="max-w-6xl mx-auto p-5">
        <div class="items-center mb-[70px] flex flex-col sm:flex-row sm:justify-between md:gap-[54px]">
          <img
            src="~/assets/images/landing/promotion-new/step1.svg"
            class="max-w-[356px] mx-auto"
          >
          <div>
            <h2 class="font-bold landing-font-32 mb-[5px]">
              {{ $t('promotion_new.section1.step1.step') }}
            </h2>
            <h2 class="font-bold landing-font-32 mb-[24px]">
              {{ $t('promotion_new.section1.step1.title') }}
            </h2>
            <div class="font-normal landing-font-16">
              {{ $t('promotion_new.section1.step1.subtitle') }}
            </div>
          </div>
        </div>
        <div class="items-center mb-[70px] flex flex-col-reverse sm:flex-row sm:justify-between md:gap-[54px]">
          <div>
            <h2 class="font-bold landing-font-32 mb-[5px]">
              {{ $t('promotion_new.section1.step2.step') }}
            </h2>
            <h2 class="font-bold landing-font-32 mb-[24px]">
              {{ $t('promotion_new.section1.step2.title') }}
            </h2>
            <div class="font-normal landing-font-16 mb-[24px]">
              {{ $t('promotion_new.section1.step2.subtitle') }}
            </div>
            <a
              href="#notes"
              class="landing-btn3"
            >
              {{ $t('promotion_new.section1.step2.btn_text') }}
            </a>
          </div>
          <img
            src="~/assets/images/landing/promotion-new/step2.svg"
            class="max-w-[356px] mx-auto"
          >
        </div>
        <div class="items-center mb-[70px] flex flex-col sm:flex-row sm:justify-between md:gap-[54px]">
          <img
            src="~/assets/images/landing/promotion-new/step3.svg"
            class="max-w-[356px] mx-auto"
          >
          <div>
            <h2 class="font-bold landing-font-32 mb-[5px]">
              {{ $t('promotion_new.section1.step3.step') }}
            </h2>
            <h2 class="font-bold landing-font-32 mb-[24px]">
              {{ $t('promotion_new.section1.step3.title') }}
            </h2>
            <div class="font-normal landing-font-16 mb-[24px]">
              {{ $t('promotion_new.section1.step3.subtitle') }}
            </div>
            <a
              :href="linkClaimOffer"
              class="landing-btn"
            >
              {{ $t('promotion_new.section1.step3.btn_text') }}
            </a>
          </div>
        </div>
        <div class="items-center mb-[70px] flex flex-col-reverse sm:flex-row sm:justify-between md:gap-[54px]">
          <div>
            <h2 class="font-bold landing-font-32 mb-[5px]">
              {{ $t('promotion_new.section1.step4.step') }}
            </h2>
            <h2 class="font-bold landing-font-32 mb-[24px]">
              {{ $t('promotion_new.section1.step4.title') }}
            </h2>
            <div
              class="font-normal landing-font-16 mb-[24px]"
              v-html="$t('promotion_new.section1.step4.subtitle')"
            />
            <a
              :href="linkClaimOffer"
              class="landing-btn"
            >
              {{ $t('promotion_new.section1.step4.btn_text') }}
            </a>
          </div>
          <img
            src="~/assets/images/landing/promotion-new/step4.svg"
            class="max-w-[356px] mx-auto"
          >
        </div>
      </div>
    </section>

    <section class="sale-pitch full-width">
      <div class="mt-[135px] text-center">
        <div id="notes" class="landing-font-48 font-bold mb-6">
          {{ $t('promotion_new.section2.title') }}
        </div>
        <img class="mx-auto" src="~/assets/images/landing/promotion/line-check.svg">
      </div>
      <div class="max-w-6xl mx-auto mt-[100px] mb-[140px] px-5">
        <div class="flex flex-col gap-9 items-center mb-[100px] md:flex-row md:justify-between lg:gap-[150px]">
          <img
            src="~/assets/images/landing/promotion-new/password.svg"
            class="max-w-[530px] w-2/3 md:w-1/2"
          >
          <div>
            <h2 class="font-bold landing-font-28 mb-[24px]">
              {{ $t('promotion_new.section2.detail1.title') }}
            </h2>
            <div class="landing-font-16 font-normal text-justify">
              <span>{{ $t('promotion_new.section2.detail1.content1') }}</span>
              <br>
              <br>
              <span>{{ $t('promotion_new.section2.detail1.content2') }}</span>
              <span class="text-[#268334]">{{ $t('promotion_new.section2.detail1.link1') }}</span>
              <span>{{ $t('promotion_new.section2.detail1.content3') }}</span>
              <span class="text-[#268334]">{{ $t('promotion_new.section2.detail1.link2') }}</span>
              <span>{{ $t('promotion_new.section2.detail1.content4') }}</span>
            </div>
            <a
              :href="linkClaimOffer"
              class="landing-btn mt-[45px]"
            >
              {{ $t('promotion_new.section2.detail1.btn_text') }}
            </a>
          </div>
        </div>
      </div>
      <div class="relative">
        <img
          src="~/assets/images/landing/promotion-new/image-bg-1.svg"
          class="absolute z-0 top-[110px]"
        >
        <img
          src="~/assets/images/landing/promotion-new/image-bg-2.svg"
          class="absolute z-0 bottom-[-50px] right-0"
        >
        <div class="max-w-6xl mx-auto mt-[100px] px-5">
          <div class="flex flex-col-reverse gap-9 items-center mb-[100px] relative z-10 md:flex-row md:justify-between lg:gap-[150px]">
            <div>
              <h2 class="font-bold landing-font-28 mb-[24px]">
                {{ $t('promotion_new.section2.detail2.title') }}
              </h2>
              <div class="landing-font-16 font-normal text-justify">
                <span v-html="$t('promotion_new.section2.detail2.content')" />
                <br>
                <br>
                <ul>
                  <li
                    v-for="(item, index) in $t('promotion_new.section2.detail2.list')"
                    :key="index"
                    class="list-disc ml-[25px]"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>
              <a
                :href="linkClaimOffer"
                class="landing-btn mt-[45px]"
              >
                {{ $t('promotion_new.section2.detail2.btn_text') }}
              </a>
            </div>
            <img
              src="~/assets/images/landing/promotion-new/account.svg"
              class="max-w-[530px] w-2/3 md:w-1/2"
            >
          </div>
        </div>
      </div>
      <div class="mt-[160px] relative">
        <img
          src="~/assets/images/landing/promotion-new/image-bg-3.svg"
          class="absolute top-[80px]"
        >
        <div class="max-w-6xl mx-auto mt-[100px] relative">
          <div class="font-bold landing-font-48 text-[#000000] mb-[24px] text-center">
            {{ $t('promotion_new.section3.title') }}
          </div>
          <div class="font-normal landing-font-22 text-[#000000] mb-[40px] text-center max-w-[1049px]">
            {{ $t('promotion_new.section3.subtitle') }}
          </div>
          <img class="mx-auto" src="~/assets/images/landing/promotion/line-check.svg">
          <div class="mt-14 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 mb-[100px] px-5">
            <div
              v-for="(item, index) in $t('promotion.leading.items')"
              :key="index"
              :to="localePath('/')"
              class="landing-transition px-[25px] py-[30px] bg-white rounded-lg shadow-lg"
            >
              <div>
                <div class="h-[114px] w-[114px] mx-auto flex">
                  <img
                    :src="require(`~/assets/images/landing/promotion/icon-leading-${index+1}.svg`)"
                    :alt="item.title"
                    class="mx-auto max-h-[88px] max-w-[100px] self-center"
                  >
                </div>
                <h3 class="mb-[12px] font-bold text-black landing-font-18 text-center">
                  {{ item.title }}
                </h3>
                <p class="lg:max-w-[265px] landing-font-16 text-center">
                  {{ item.desc }}
                </p>
              </div>
              <!--
              <nuxt-link
                v-if="(item.static === false && item.link)"
                :to="localePath(`${item.link}`)"
              >
                <div class="h-[114px] w-[114px] mx-auto flex">
                  <img
                    :src="require(`~/assets/images/landing/promotion/icon-leading-${index+1}.svg`)"
                    :alt="item.title"
                    class="mx-auto max-h-[88px] max-w-[100px] self-center"
                  >
                </div>
                <h3 class="mb-[12px] font-bold text-black landing-font-18 text-center">
                  {{ item.title }}
                </h3>
                <p class="lg:max-w-[265px] landing-font-16 text-center">
                  {{ item.desc }}
                </p>
              </nuxt-link>

              <a
                v-if="(item.static === true && item.link)"
                :href="`${item.link}`"
              >
                <div class="h-[114px] w-[114px] mx-auto flex">
                  <img
                    :src="require(`~/assets/images/landing/promotion/icon-leading-${index+1}.svg`)"
                    :alt="item.title"
                    class="mx-auto max-h-[88px] max-w-[100px] self-center"
                  >
                </div>
                <h3 class="mb-[12px] font-bold text-black landing-font-18 text-center">
                  {{ item.title }}
                </h3>
                <p class="lg:max-w-[265px] landing-font-16 text-center">
                  {{ item.desc }}
                </p>
              </a> -->
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="full-width py-[100px] bg-[#F8F9FA] mt-[37px]">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid md:grid-cols-2 grid-cols-1 md:gap-x-[116px] md:gap-y-0 gap-y-[40px] items-center">
          <div>
            <div class="mb-6 font-bold landing-font-48 text-black">
              {{ $t('promotion.locker_team.title') }}
            </div>
            <div class="text-black mb-5">
              {{ $t('promotion.locker_team.desc1') }}
            </div>
            <div class="text-black">
              {{ $t('promotion.locker_team.desc2') }}
            </div>
          </div>
          <div>
            <div class="grid grid-cols-2 gap-x-12 gap-y-6">
              <div v-for="(item, index) in $t('promotion.locker_team.items')" :key="index">
                <div class="landing-font-32 font-bold text-[#3DB249] mb-3">{{ item.title }}</div>
                <div class="landing-font-16 font-bold text-black">{{ item.desc }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="max-w-[1100px] mt-[100px] mb-[30px] hidden md:flex px-4 order-2 justify-center items-center top-[180px]">
      <img
        src="~/assets/images/landing/promotion-new/youtube.png"
        class="w-full max-h-[550px] cursor-pointer"
        @click="toggleVideo"
      >
    </div>

    <div class="customer-said pt-[100px]">
      <div class="text-[#161922] landing-font-45 font-bold">
        {{ $t('promotion.customer_said.title') }}
      </div>
      <div class="mt-5 mb-6">
        <img src="~/assets/images/landing/promotion/line-customer.png" class="w-1/2">
      </div>
      <el-carousel indicator-position="outside" :autoplay="false">
        <el-carousel-item v-for="(item, index) in $t('promotion.customer_said.comments')" :key="index.toString()">
          <div v-if="index === 2" class="text-[#161922] landing-font-20 font-normal mb-3 desc-customer-said" v-html="item.desc" />
          <div v-else class="text-[#161922] landing-font-20 font-normal mb-3">{{ item.desc }}</div>
          <div>
            <div class="landing-font-20 text-[#161922] font-bold">
              {{ item.author }}
            </div>
            <!-- <div class="landing-font-20 text-[#161922] font-bold">
              {{ item.date_comment }}
            </div> -->
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="mt-[100px]">
      <div class="font-bold landing-font-48 text-[#000000] mb-6 text-center">
        {{ $t('promotion.locker_offers.title') }}
      </div>
      <img class="mx-auto" src="~/assets/images/landing/promotion/line-check.svg">
      <div class="mt-12 mx-auto max-w-3xl rounded-xl shadow-xl p-8">
        <div class="grid md:grid-cols-10 gap-x-10">
          <div class="col-span-6">
            <div
              v-for="item in $t('promotion.locker_offers.content').filter((value, index) => index %2 === 0)"
              :key="item"
              class="flex gap-[14px] mb-5"
            >
              <img src="~/assets/images/landing/promotion/icon-success.png" class="h-6 w-6">
              <p class="landing-font-18">{{ item }}</p>
            </div>
          </div>
          <div class="col-span-4">
            <div
              v-for="item in $t('promotion.locker_offers.content').filter((value, index) => index %2 !== 0)"
              :key="item"
              class="flex gap-[14px] mb-5"
            >
              <img src="~/assets/images/landing/promotion/icon-success.png" class="h-6 w-6">
              <p class="landing-font-18">{{ item }}</p>
            </div>
          </div>
        </div>
        <div class="text-center">
          <button class="landing-btn mt-[60px] mx-auto" @click="claimOffer">
            Buy now
          </button>
        </div>
      </div>
    </div>
    <div class="py-16 px-5 mt-[134px] rounded-xl shadow-2xl text-center">
      <div class="landing-font-48 font-bold mb-3">
        {{ $t('promotion.special_offer.title') }}
      </div>
      <p class="landing-font-20">
        Get 1-year Locker Premium at only <span class="text-[#D8D8D8] line-through">$15.48</span> <span class="text-primary">$7.74</span> with our promotion code <span class="text-primary">LKPERSONAL50</span>.
        <br>Limited time only.
      </p>
      <button class="landing-btn4 landing-font-32 py- mt-[60px] text-center" @click="claimOffer">
        <i class="fas fa-shopping-cart mr-[10px]" /> Claim this offer
      </button>
      <div class="my-2 landing-font-20">
        {{ $t('promotion.special_offer.money_back') }}
      </div>
      <div class="flex items-center justify-center landing-font-18">
        <span class="mr-3">{{ $t('promotion.special_offer.compatible_with') }}:</span>
        <div class="p-2">
          <img class="h-4" src="~/assets/images/landing/promotion/icon-android.svg">
        </div>
        <div class="p-2">
          <img class="h-4" src="~/assets/images/landing/promotion/icon-window.svg">
        </div>
        <div class="p-2">
          <img class="h-4" src="~/assets/images/landing/promotion/icon-ios.svg">
        </div>
        <div class="p-2">
          <img class="h-4" src="~/assets/images/landing/promotion/icon-linux.svg">
        </div>
        <div class="p-2">
          <img class="h-4" src="~/assets/images/landing/promotion/icon-chrome.svg">
        </div>
        <div class="p-2">
          <img class="h-4" src="~/assets/images/landing/promotion/icon-macos.svg">
        </div>
      </div>
    </div>
    <!-- Platforms -->
    <section class="mt-[127px]">
      <div class="w-8/12 mx-auto">
        <h2 class="text-center font-bold text-black landing-font-48 mb-[14px]">
          {{ $t('landing.platform.title') }}
        </h2>
        <p class="text-center font-normal text-black leading-[26px] landing-font-16 mx-auto mb-[42px] md:max-w-[540px]">
          {{ $t('landing.platform.desc') }}
        </p>
      </div>
      <div class="w-full mx-auto md:justify-between justify-center align-start grid sm:grid-cols-3 grid-cols-2 justify-items-center">
        <div
          v-for="(item, index) in $t('landing.platform.platforms')"
          :key="index"
          class="opacity-90 mb-9"
        >
          <div class="sm:flex flex-flex-nowrap text-center">
            <div class="circle sm:mx-5 mx-auto">
              <img
                :src="require(`~/assets/images/landing/index/${item.img}`)"
                :alt="item.name"
                class="mx-auto self-center max-w-[42px] max-h-[42px]"
              >
            </div>
            <p class="landing-font-16 font-semibold text-black self-center sm:mt-0 mt-2">
              {{ item.name }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <!-- Platforms end -->
    <section class="full-width py-[100px] bg-[#F8F9FA] mt-[100px] questions-transparent">
      <div class="max-w-6xl mx-auto px-6">
        <div class="landing-font-48 font-bold mb-[72px]">
          {{ $t('promotion.faq.title') }}
        </div>
        <div class="max-w-6xl mx-auto">
          <div class="max-w-[900px]">
            <el-collapse v-model="activeName" accordion>
              <el-collapse-item v-for="(item, index) in $t('promotion.faq.items')" :key="index" :name="(index+1).toString()">
                <template slot="title">
                  <div class="font-bold landing-font-22 text-black question">
                    {{ index + 1 }}. {{ item.q }}
                  </div>
                </template>
                <div class="answer font-normal landing-font-18 pl-[58px] md:pr-[80px] pr-[50px] md:py-[38px] py-[15px] mr-[70px]" v-html="item.a" />
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </section>
    <div class="cta mt-[100px]">
      <div class="relative banner-cta">
        <div>
          <img src="~/assets/images/landing/promotion/banner-cta.png" class="w-full lg:block hidden">
        </div>
        <div class="landing-font-32 font-bold lg:absolute xl:bottom-[50px] lg:bottom-[20px] text-white lg:w-[84%] w-full lg:left-[90px] text-center text-desc" v-html="$t('promotion.cta.title')" />
      </div>
    </div>
    <div class="py-16 px-5 rounded-xl shadow-2xl text-center my-[120px]">
      <div class="landing-font-48 font-bold mb-3">
        {{ $t('promotion.special_offer.title') }}
      </div>
      <p class="landing-font-20">
        Get 1-year Locker Premium at only <span class="text-[#D8D8D8] line-through">$15.48</span> <span class="text-primary">$7.74</span> with our promotion code <span class="text-primary">LKPERSONAL50</span>.
        <br>Limited time only.
      </p>
      <button class="landing-btn4 landing-font-32 py- mt-[60px] text-center" @click="claimOffer">
        <i class="fas fa-shopping-cart" /> Claim this offer
      </button>
      <!-- <div class="my-2 landing-font-20">
        {{ $t('promotion.special_offer.money_back') }}
      </div> -->
      <div
        class="max-w-6xl mx-auto py-[40px] px-8 mt-[30px] sm:px-[100px]"
      >
        <div class="flex flex-col sm:flex-row sm:justify-between items-center max-w-[865px] gap-7">
          <img
            src="~/assets/images/landing/crypto/guarantee.svg"
            class="sm:w-2/5"
          >
          <div class="max-w-[540px]">
            <div
              class="landing-font-18 !leading-6 font-normal text-left"
              v-html="$t('crypto.trial.desc')"
            />
          </div>
        </div>
      </div>
      <div class="flex items-center justify-center landing-font-18">
        <span class="mr-3">{{ $t('promotion.special_offer.compatible_with') }}:</span>
        <div class="p-2">
          <img class="h-4" src="~/assets/images/landing/promotion/icon-android.svg">
        </div>
        <div class="p-2">
          <img class="h-4" src="~/assets/images/landing/promotion/icon-window.svg">
        </div>
        <div class="p-2">
          <img class="h-4" src="~/assets/images/landing/promotion/icon-ios.svg">
        </div>
        <div class="p-2">
          <img class="h-4" src="~/assets/images/landing/promotion/icon-linux.svg">
        </div>
        <div class="p-2">
          <img class="h-4" src="~/assets/images/landing/promotion/icon-chrome.svg">
        </div>
        <div class="p-2">
          <img class="h-4" src="~/assets/images/landing/promotion/icon-macos.svg">
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
      linkClaimOffer: 'https://buy.stripe.com/cN26s3gbefi1c92fYZ',
      videoId: 'uDXM-R-_MW8',
      dialogVisible: false,
      activeName: '1',
      lockerPlans: [],
      plans: '',
      body: ''
    })
  },
  methods: {
    choosePlan (alias) {
      this.$cookies.set('trial_plan', alias, {
        domain: 'locker.io',
        maxAge: 3600 * 24
      })
      this.$cookies.set('is_trial_promotion', true, {
        domain: 'locker.io',
        maxAge: 3600 * 24
      })
      if (this.$store.state.isLoggedIn) {
        this.$router.replace(this.localePath('/manage-plans'))
      } else {
        this.$router.replace(this.localePath('/register?utm_source=plans-promotion'))
      }
    },
    claimOffer () {
      window.open(process.env.stripePayment || 'https://buy.stripe.com/cN26s3gbefi1c92fYZ')
    },
    toggleVideo () {
      if (this.dialogVisible) {
        this.dialogVisible = false
      } else {
        this.dialogVisible = true
      }
      if (this.body.classList.contains('stop-scrolling')) {
        this.body.classList.remove('stop-scrolling')
      } else {
        this.body.classList.add('stop-scrolling')
      }
    }

  }
}
</script>
<style lang="scss">
.stop-scrolling {
  height: 100%;
  overflow: hidden;
}
.landing-btn3 {
  @apply hover:no-underline hover:bg-green transition duration-200 ease-in-out text-green hover:text-white;
  display: inline-block;
  padding: 18px 73.5px;
  min-width: 160px;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  border-radius: 5px;
  border: 2px solid #268334;
}
.landing-btn4 {
  @apply hover:no-underline transition duration-200 ease-in-out text-white hover:text-white hover:bg-green-hover;
  display: inline-block;
  padding: 20px 114px;
  min-width: 240px;
  text-align: center;
  font-weight: bold;
  border-radius: 5px;
  background-color: #268334;
  &:disabled {
    background-color: #268334;
    &:hover {
      background-color: #268334;
    }
  }
}
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
  .desc-customer-said span{
    color: red;
    font-weight: bold;
  }
  .el-carousel__arrow--right,.el-carousel__arrow--left{
    display: none;
  }
  .el-carousel__button{
    border-radius: 4px;
    width: 77px;
    height: 6px;
    margin:0px 20px;
  }
  .el-carousel__item{
    height: 250px;
  }
  .el-carousel__indicator.is-active button{
    background: #008800;
  }
}
.cta span{
  color: #f5d63a;
}
@media screen and (max-width: 768px) {
  .customer-said{
    .el-carousel__container{
      height: 500px;
    }
    .el-carousel__button{
      margin: 0 10px;
    }
    .el-carousel__item{
      height: 500px;
    }
  }
  .landing-btn-signup{
    padding: 18px 40px;
  }
}
@media screen and (max-width: 1023px){
  .cta .banner-cta{
    background-color: #2d3349;
    border: 2px solid #525145;
    background-image: none;
    padding: 2% 1%;
    .text-desc{
      font-size: 28px !important;
    }
  }
}
.circle {
  height: 75px;
  width: 75px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 50%;
  display: flex;
}
.modal {
  display: inline-block;
  position: fixed;
  z-index: 1000000;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: hidden; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
}
.modal-content {
  position: relative;
  background-color: #fefefe;
  margin: 12% auto; /* 15% from the top and centered */
  border: 1px solid #888;
  max-width: 960px;
}
</style>
