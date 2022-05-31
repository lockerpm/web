<template>
  <div class="mt-[70px]">
    <section class="bg-welcome full-width py-[92px] h-auto" :style="{backgroundImage: `url(${require(`~/assets/images/landing/refer-friend/bg-welcome.png`)})`}" style="background-size: 100% 100%; background-repeat: no-repeat">
      <div class="max-w-6xl mx-auto px-6">
        <div class="md:landing-font-60 landing-font-48 text-white font-bold md:w-2/3" v-html="$t('refer_friend.welcome.title')" />
        <div class="landing-font-20 text-white font-normal mt-12 md:w-2/3" v-html=" $t('refer_friend.welcome.subtitle')" />
        <div class="mt-12">
          <nuxt-link :to="localeRoute($t('refer_friend.welcome.btn_refer.link'))" class="md:!inline-block !hidden landing-btn landing-font-20" style="align-self: center">
            {{ $t('refer_friend.welcome.btn_refer.text') }}
          </nuxt-link>
          <div class="md:!hidden block landing-btn landing-font-20" @click="checkMobile">{{ $t('refer_friend.welcome.btn_refer.text') }}</div>
        </div>
      </div>
    </section>
    <section class="py-[120px] referral-friend">
      <div class="landing-font-48 font-bold text-black text-center">
        {{ $t('refer_friend.how_referral_works.title') }}
      </div>
      <div class="mt-[80px]">
        <div class="grid md:grid-cols-7 grid-cols-1 xl:gap-x-[180px] lg:gap-x-[70px] md:gap-x-0 md:gap-y-0 gap-y-[80px] items-center">
          <div class="md:col-span-4 md:order-first order-last">
            <ul>
              <li v-for="(item, index) in $t('refer_friend.how_referral_works.list_referral')" :key="index" :class="index !== 0 ? 'mt-[72px]': ''">
                <div class="flex">
                  <div>
                    <div class="btn-number" :style="index === 0 ? 'color: #FFFFFF;background: #268334;' : 'color: #000000;'">
                      {{ index + 1 }}
                    </div>
                  </div>
                  <div class="ml-[22px]">
                    <div class="landing-font-24 font-bold text-black">
                      {{ item.title }}
                    </div>
                    <div v-if="index === 0" class="landing-font-16 font-normal mt-6 text-black" v-html="item.desc" />
                    <div v-else class="landing-font-16 font-normal mt-6 text-black">
                      {{ item.desc }}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="md:col-span-3">
            <img src="~/assets/images/landing/refer-friend/img-referral.png">
          </div>
        </div>
      </div>
    </section>
    <section class="py-[120px]">
      <div class="font-bold landing-font-48 text-black text-center">
        {{ $t('refer_friend.why_upgrade_premium.title') }}
      </div>
      <div class="mt-9 landing-font-16 text-black font-normal text-center">
        {{ $t('refer_friend.why_upgrade_premium.subtitle') }}
      </div>
      <div class="grid md:grid-cols-3 grid-cols-1 md:gap-x-8 md:gap-y-0 gap-y-8 mt-[142px]">
        <div
          v-for="(item, index) in $t('refer_friend.why_upgrade_premium.list_reason')"
          :key="index"
          class="bg-white px-9 py-[43px]"
          style="border: 1px solid #DFDFDF;box-shadow: 0px 64px 100px rgba(0, 0, 0, 0.05);border-radius: 10px;"
        >
          <img :src="require(`~/assets/images/landing/refer-friend/${item.icon}`)">
          <div class="landing-font-22 text-black font-bold mt-8">
            {{ item.title }}
          </div>
          <div class="landing-font-14 mt-3 text-black font-normal">
            {{ item.desc }}
          </div>
        </div>
      </div>
    </section>
    <section class="py-[120px] full-width h-auto questions">
      <div class="landing-font-38 font-bold text-center mb-[72px]">
        {{ $t('refer_friend.frequently_question.title') }}
      </div>
      <div class="max-w-6xl mx-auto">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item v-for="(item, index) in $t('refer_friend.frequently_question.list_questions')" :key="index" :name="(index+1).toString()">
            <template slot="title">
              <div class="font-bold landing-font-22 text-black question">
                {{ item.question }}
              </div>
            </template>
            <div class="answer font-normal landing-font-18 pl-[58px] md:pr-[80px] pr-[50px] md:py-[38px] py-[15px]">
              {{ item.answer }}
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </section>
    <section class="py-[120px] full-width h-auto" style="background-color: #f5f6f7">
      <div class="max-w-6xl mx-auto px-6">
        <div class="font-bold landing-font-48 text-black text-center">
          {{ $t('refer_friend.cta.title') }}
        </div>
        <div class="mt-9 landing-font-16 text-black font-normal text-center">
          {{ $t('refer_friend.cta.subtitle') }}
        </div>
        <div class="mt-12 text-center">
          <nuxt-link :to="localeRoute($t('refer_friend.welcome.btn_refer.link'))" class="md:!inline-block !hidden landing-btn landing-font-20" style="align-self: center">
            {{ $t('refer_friend.welcome.btn_refer.text') }}
          </nuxt-link>
          <div class="md:!hidden block landing-btn landing-font-20" @click="checkMobile">{{ $t('refer_friend.welcome.btn_refer.text') }}</div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  layout: 'landing',
  data () {
    return {
      activeName: '1'
    }
  },
  methods: {
    checkMobile () {
      if (navigator.userAgent.toLowerCase().includes('android')) {
        window.location.replace('com.cystack.locker://')

        setTimeout(() => {
          window.location.replace('https://play.google.com/store/apps/details?id=com.cystack.locker')
        }, 1000)
      }
      if (navigator.userAgent.toLowerCase().includes('iphone')) {
        window.location.replace('com.cystack.locker://')
        setTimeout(() => {
          window.location.replace('https://apps.apple.com/us/app/locker-password-manager/id1586927301')
        }, 1000)
      }
    }
  }
}
</script>
<style>
.bg-welcome span{
  color:#3FAF49;
}
.referral-friend .btn-number{
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 29px;
  border-radius: 4px;
  padding: 5px 15px;
  border: 1px solid #268334;
}
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
