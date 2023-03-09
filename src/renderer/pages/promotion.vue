<template>
  <div>
    <div class="bg-welcome bg-[#EDF4ED] full-width h-auto">
      <img src="~/assets/images/landing/promotion/logo.png" class="m-auto w-[137px] h-[38px] mt-[19px]">
    </div>
    <div class="bg-welcome full-width h-auto pt-[40px] pb-[50px] bg-center bg-cover bg-no-repeat" :style="{backgroundImage: `url(${require(`~/assets/images/landing/promotion/bg_welcome.png`)})`}">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-[#161922] font-bold landing-font-60 mb-5 text-center">
          {{ $t('promotion.welcome.title') }}
        </div>
        <iframe
          class="mx-auto pb-4"
          width="848"
          height="480"
          src="https://www.youtube.com/embed/kAutqE2ATfU"
        />
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
      <div class="w-full text-center">
        <h2
          class="font-bold landing-font-48 mx-auto mb-[60px]"
          v-html="$t('promotion.warning.what_if')"
        />
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-3 gap-x-16 justify-items-center">
            <div
              v-for="(item, index) in $t('promotion.warning.consequences')"
              :key="index"
              class="items-center"
            >
              <img :src="require(`~/assets/images/landing/crypto/${item.image}`)" class="h-[51px] mb-5">
            </div>
            <div
              v-for="(item, index) in $t('promotion.warning.consequences')"
              :key="index"
              class="landing-font-18 font-normal mb-20"
              v-html="item.conq"
            />
          </div>
          <a
            class="landing-btn mb-24"
            href="https://buy.stripe.com/cN26s3gbefi1c92fYZ"
            style="align-self: center"
          >
            {{ $t('promotion.warning.btn_text1') }}
          </a>
        </div>
      </div>
    </section>

    <section class="sale-pitch full-width">
      <h1
        class="w-full text-center font-semibold landing-font-48 mx-auto mt-28 mb-20"
        v-html="$t('promotion.sale_pitch.title')"
      />
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-[100px]">
          <div v-if="locale==='en'" class="max-w-[516px]">
            <h2
              class="font-semibold landing-font-38 mb-10"
              v-html="$t('promotion.sale_pitch.overall.title')"
            />
            <div class="font-normal landing-font-18 max-w-[450px]">
              {{ $t('promotion.sale_pitch.overall.desc') }}
            </div>
          </div>
          <div v-else class="max-w-[570px]">
            <h2
              class="font-semibold landing-font-32y mb-10"
              v-html="$t('promotion.sale_pitch.overall.title')"
            />
            <div class="font-normal landing-font-18 max-w-[450px]">
              {{ $t('promotion.sale_pitch.overall.desc') }}
            </div>
          </div>
          <img
            src="~/assets/images/landing/crypto/red-shirt-gray-laptop.png"
            class="max-w-[345px]"
          >
        </div>

        <div class="w-full text-center font-semibold landing-font-48 mx-auto mb-20">
          {{ $t('promotion.sale_pitch.common_reason.title') }}
        </div>

        <div class="flex justify-between items-center">
          <img
            src="~/assets/images/landing/crypto/green-pants-grey-laptop.png"
            class="max-w-[345px]"
          >
          <div>
            <div
              v-for="(item, index) in $t('crypto.sale_pitch.common_reason.reason')"
              :key="index"
              class="items-center"
            >
              <div class="flex max-w-[560px] mb-[52px]">
                <img :src="require(`~/assets/images/landing/crypto/XCircle.svg`)" class="h-[32px] mr-[10px]">
                <div class="landing-font-18 font-normal">
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sale-pitch-hard-sol full-width bg-[#F5F7F9]">
      <div class="max-w-6xl mx-auto mt-16">
        <div class="flex justify-between">
          <div class="">
            <h2
              v-if="locale==='en'"
              class="font-semibold landing-font-48 mb-10 max-w-[750px]"
              v-html="$t('promotion.sale_pitch.hard_sol.title')"
            />
            <h2
              v-else
              class="font-semibold landing-font-48 mb-10 max-w-[840px]"
              v-html="$t('promotion.sale_pitch.hard_sol.title')"
            />
            <div v-if="locale==='en'" class="font-normal landing-font-18 max-w-[640px] mb-20">
              {{ $t('promotion.sale_pitch.hard_sol.desc') }}
            </div>
            <div v-else class="font-normal landing-font-18 max-w-[720px] mb-20">
              {{ $t('promotion.sale_pitch.hard_sol.desc') }}
            </div>
            <a
              class="landing-btn mb-24"
              href="https://buy.stripe.com/cN26s3gbefi1c92fYZ"
              style="align-self: center"
            >
              {{ $t('promotion.warning.btn_text1') }}
            </a>
          </div>
          <img
            src="~/assets/images/landing/crypto/red-shirt-despair.png"
            class="max-w-[340px]"
          >
        </div>
      </div>
    </section>

    <div class="mt-[135px] text-center">
      <div
        class="landing-font-48 font-bold mb-6"
        v-html="$t('promotion.simplified.title')"
      />
      <img class="mx-auto" src="~/assets/images/landing/promotion/line-check.svg">
      <div class="mt-[70px]">
        <div class="grid md:grid-cols-3 grid-cols-1 gap-x-[120px] gap-y-6">
          <div v-for="(item, index) in $t('promotion.simplified.items').slice(0,3)" :key="index">
            <img class="mx-auto mb-[6px]" :src="require(`~/assets/images/landing/promotion/icon-simplified-${index+1}.svg`)"></img>
            <div class="landing-font-20 font-semibold mb-2">{{ item.title }}</div>
            <div>{{ item.desc }}</div>
          </div>
        </div>
        <div class="grid md:grid-cols-2 grid-cols-1 gap-y-6 mt-14">
          <div v-for="(item, index) in $t('promotion.simplified.items').slice(3)" :key="index" class="max-w-[340px] mx-auto">
            <img class="mx-auto mb-[6px]" :src="require(`~/assets/images/landing/promotion/icon-simplified-${index+4}.svg`)"></img>
            <div class="landing-font-20 font-semibold mb-2">{{ item.title }}</div>
            <div>{{ item.desc }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-[160px]">
      <div class="font-bold landing-font-48 text-[#000000] mb-6 text-center">
        {{ $t('promotion.safest.title') }}
      </div>
      <img class="mx-auto" src="~/assets/images/landing/promotion/line-check.svg">
      <div class="mt-16 grid md:grid-cols-2 grid-cols-1 items-center md:gap-x-[118px] gap-x-0 md:gap-y-0 gap-y-[60px]">
        <div>
          <img src="~/assets/images/landing/promotion/img_goods.png">
        </div>
        <div>
          <div v-for="(item, index) in $t('promotion.safest.items')" :key="index" class="mb-7">
            <div class="flex mb-3 items-center">
              <div>
                <img src="~/assets/images/landing/promotion/icon-success.png" class="w-[24px] h-[24px]">
              </div>
              <div class="landing-font-20 text-[#000000] font-normal ml-[14px] w-4/5">
                {{ item.title }}
              </div>
            </div>
            <div>
              {{ item.desc }}
            </div>
          </div>
        </div>
      </div>
      <div class="text-center">
        <button class="landing-btn mt-[60px] mx-auto" @click="claimOffer">
          Buy now
        </button>
      </div>
    </div>
    <div class="mt-[160px]">
      <div class="font-bold landing-font-28 text-[#000000] mb-6 text-center">
        {{ $t('promotion.leading.title') }}
      </div>
      <img class="mx-auto" src="~/assets/images/landing/promotion/line-check.svg">
      <div class="mt-14 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8">
        <div
          v-for="(item, index) in $t('promotion.leading.items')"
          :key="index"
          class="landing-transition px-[30px] pt-11 bg-white rounded-lg shadow-xl"
        >
          <img
            :src="require(`~/assets/images/landing/promotion/icon-leading-${index+1}.svg`)"
            :alt="item.title"
            class="h-[40px] mb-[16px]"
          >
          <h3 class="mb-[12px] font-bold text-black landing-font-18">
            {{ item.title }}
          </h3>
          <p class="lg:max-w-[265px] mb-[40px] landing-font-14">
            {{ item.desc }}
          </p>
        </div>
      </div>
    </div>
    <section class="full-width py-[100px] bg-[#F8F9FA] mt-[100px]">
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
              <p>{{ item }}</p>
            </div>
          </div>
          <div class="col-span-4">
            <div
              v-for="item in $t('promotion.locker_offers.content').filter((value, index) => index %2 !== 0)"
              :key="item"
              class="flex gap-[14px] mb-5"
            >
              <img src="~/assets/images/landing/promotion/icon-success.png" class="h-6 w-6">
              <p>{{ item }}</p>
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
    <div class="py-16 mt-20 rounded-xl shadow-2xl text-center">
      <div class="landing-font-48 font-bold mb-3">
        {{ $t('promotion.special_offer.title') }}
      </div>
      <p class="landing-font-20">
        Get 1-year Locker Premium at only <span class="text-[#D8D8D8] line-through">$15.48</span> <span class="text-primary">$7.74</span> with our promotion code <span class="text-primary">LKPERSONAL50</span>.
        <br>Limited time only.
      </p>
      <button class="landing-btn mt-[60px]" @click="claimOffer">
        <i class="fas fa-shopping-cart" /> Claim this offer
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
    <section class="mt-[100px]">
      <div class="w-8/12 mx-auto">
        <h2 class="text-center font-bold text-black landing-font-38 mb-[14px]">
          {{ $t('landing.platform.title') }}
        </h2>
        <p class=" text-center text-black-600 leading-[26px] landing-font-18 mx-auto mb-[42px] md:max-w-[540px]">
          {{ $t('landing.platform.desc') }}
        </p>
      </div>
      <div class="w-full mx-auto md:justify-between justify-center align-start grid sm:grid-cols-3 grid-cols-2 justify-items-center">
        <div
          v-for="(item, index) in $t('landing.platform.platforms')"
          :key="index"
          class="opacity-90 mb-9"
        >
          <a :href="item.href || '#'" :target="item.href? '_blank' : '_self'" class="sm:flex flex-flex-nowrap text-center">
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
          </a>
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
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item v-for="(item, index) in $t('promotion.faq.items')" :key="index" :name="(index+1).toString()">
              <template slot="title">
                <div class="font-bold landing-font-22 text-black question">
                  {{ index + 1 }}. {{ item.q }}
                </div>
              </template>
              <div class="answer font-normal landing-font-18 pl-[58px] md:pr-[80px] pr-[50px] md:py-[38px] py-[15px]" v-html="item.a" />
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </section>
    <div class="cta mt-[100px]">
      <div class="relative banner-cta">
        <div>
          <img src="~/assets/images/landing/promotion/banner-cta.png" class="w-full lg:block hidden">
        </div>
        <div class="landing-font-34 font-bold text-center lg:absolute xl:bottom-[50px] lg:bottom-[20px] text-white lg:w-[84%] w-full lg:left-[90px] text-center text-desc" v-html="$t('promotion.cta.title')" />
      </div>
    </div>
    <div class="py-16 rounded-xl shadow-2xl text-center my-[120px]">
      <div class="landing-font-48 font-bold mb-3">
        {{ $t('promotion.special_offer.title') }}
      </div>
      <p class="landing-font-20">
        Get 1-year Locker Premium at only <span class="text-[#D8D8D8] line-through">$15.48</span> <span class="text-primary">$7.74</span> with our promotion code <span class="text-primary">LKPERSONAL50</span>.
        <br>Limited time only.
      </p>
      <button class="landing-btn mt-[60px]" @click="claimOffer">
        <i class="fas fa-shopping-cart" /> Claim this offer
      </button>
      <!-- <div class="my-2 landing-font-20">
        {{ $t('promotion.special_offer.money_back') }}
      </div> -->
      <div
        class="max-w-6xl mx-auto py-[40px] px-[122px]"
      >
        <div class="flex justify-between items-center max-w-[865px]">
          <img
            src="~/assets/images/landing/crypto/guarantee.svg"
            class="h-[250px]"
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
      activeName: '1',
      lockerPlans: [],
      plans: ''
    })
  },
  methods: {
    choosePlan (alias) {
      this.$cookies.set('trial_plan', alias)
      this.$cookies.set('is_trial_promotion', true)
      if (this.$store.state.isLoggedIn) {
        this.$router.replace(this.localePath('/manage-plans'))
      } else {
        this.$router.replace(this.localePath('/register?utm_source=plans-promotion'))
      }
    },
    claimOffer () {
      window.open(process.env.stripePayment || 'https://buy.stripe.com/test_aEU4jYbbud6D8wwbII?prefilled_promo_code=LKPERSONAL50')
    }
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
</style>
