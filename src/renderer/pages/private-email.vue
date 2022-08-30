<template>
  <div class="landing-font-16">
    <section
      class="full-width h-auto bg-no-repeat bg-cover"
      :style="{backgroundImage: `url(${require(`~/assets/images/landing/affiliate/cover-bg.png`)})`}"
    >
      <div class="md:pt-[140px] py-28 mx-auto pl-6 text-center">
        <h1 class="landing-font-50 font-bold mb-8">
          {{ $t('private_email.welcome.title') }}
        </h1>
        <img class="mx-auto" src="~/assets/images/landing/private-email/boundary.svg">
        <p class="my-8 landing-font-20" v-html="$t('private_email.welcome.desc')" />
        <button class="landing-btn">
          {{ $t('private_email.button') }}
        </button>
      </div>
    </section>
    <div class="grid md:grid-cols-4 grid-cols-2 items-center py-9">
      <div v-for="(logo, index) in $t('private_email.company_logos')" :key="index">
        <img class="mx-auto" :src="require(`~/assets/images/landing/private-email/${logo}`)" :alt="logo" :title="logo.split('.')[0]">
      </div>
    </div>
    <section class="py-[120px] text-center">
      <h2 class="landing-font-48 font-bold mb-8">{{ $t('private_email.feature.title') }}</h2>
      <img class="mx-auto" src="~/assets/images/landing/private-email/section-line.svg">
      <p class="mt-12 landing-font-20">{{ $t('private_email.feature.desc') }}</p>
      <div class="mt-14 grid md:grid-cols-3 grid-cols-1 gap-8 text-left">
        <div
          v-for="(item, index) in $t('private_email.feature.items').slice(0,3)"
          :key="index"
          class="border border-black-200 rounded-xl py-12 px-9"
        >
          <img :src="require(`~/assets/images/landing/private-email/feature-${index+1}.svg`)">
          <div class="mt-6 landing-font-22 font-bold">{{ item.title }}</div>
          <div class="mt-4">{{ item.desc }}</div>
        </div>
      </div>
      <div class="mt-16 grid md:grid-cols-2 grid-cols-1 gap-16 text-left">
        <div
          v-for="(item, index) in $t('private_email.feature.items').slice(3)"
          :key="index+3"
          class="border border-black-200 rounded-xl py-12 px-9"
        >
          <img :src="require(`~/assets/images/landing/private-email/feature-${index+4}.svg`)">
          <div class="mt-6 landing-font-22 font-bold">{{ item.title }}</div>
          <div class="mt-4">{{ item.desc }}</div>
        </div>
      </div>
    </section>
    <section class="py-[120px] text-center">
      <h2 class="landing-font-48 font-bold mb-8">{{ $t('private_email.how_it_works.title') }}</h2>
      <img class="mx-auto" src="~/assets/images/landing/private-email/section-line.svg">
      <div class="grid md:grid-cols-2 grid-cols-1 mt-16">
        <div class="md:order-first order-last text-left">
          <ul>
            <li v-for="(item, index) in $t('private_email.how_it_works.steps')" :key="index" :class="index !== 0 ? 'mt-[72px]': ''">
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
        <div class="self-center">
          <img class="mx-auto" src="~/assets/images/landing/private-email/email.png">
        </div>
      </div>
    </section>
    <section class="py-[120px] text-center">
      <h2 class="landing-font-48 font-bold mb-8">{{ $t('private_email.benefit.title') }}</h2>
      <img class="mx-auto" src="~/assets/images/landing/private-email/section-line.svg">
      <div class="mt-14 grid md:grid-cols-4 grid-cols-2 text-left">
        <div v-for="(item, index) in $t('private_email.benefit.items')" :key="index" class="">
          <div class="px-6 py-5 bg-[#FBFAF3] landing-font-24 font-bold">
            {{ item.title }}
          </div>
          <div class="px-6 py-5" v-html="item.desc" />
        </div>
      </div>
    </section>
    <div class="py-[120px] text-center">
      <div class="bg-[#F5F6F7] p-16">
        <h2 class="landing-font-38 font-bold">{{ $t('private_email.cta.title') }}</h2>
        <p class="text-black-600 mt-4 landing-font-18">{{ $t('private_email.cta.desc') }}</p>
        <button class="landing-btn mt-8">
          {{ $t('private_email.button') }}
        </button>
      </div>
    </div>
    <section class="py-[120px] text-center">
      <h2 class="landing-font-48 font-bold mb-8">{{ $t('private_email.feedback.title') }}</h2>
      <img class="mx-auto" src="~/assets/images/landing/private-email/section-line.svg">
      <div class="mt-16 grid md:grid-cols-2 grid-cols-1 gap-20 text-left">
        <div
          v-for="(item, index) in $t('private_email.plans')"
          :key="index"
          class="border border-black-200 rounded-xl py-12 px-9 flex flex-col justify-between"
        >
          <div>
            <div class="landing-font-24 font-bold mb-5">{{ item.title }}</div>
            <div
              v-for="feature in item.features"
              :key="feature"
              class="flex gap-4 mb-3"
            >
              <img src="~/assets/images/landing/private-email/check.svg"></img>
              <div>{{ feature }}</div>
            </div>
          </div>
          <div class="mt-6 text-center">
            <button class="landing-btn">
              {{ $t('private_email.button') }}
            </button>
          </div>
        </div>
      </div>
    </section>
    <section class="py-[120px] full-width h-auto questions">
      <div class="landing-font-38 font-bold text-center mb-[72px]">
        {{ $t('private_email.faq.title') }}
      </div>
      <div class="max-w-6xl mx-auto">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item v-for="(item, index) in $t('private_email.faq.items')" :key="index" :name="(index+1).toString()">
            <template slot="title">
              <div class="font-bold landing-font-22 text-black question">
                {{ item.q }}
              </div>
            </template>
            <div class="answer font-normal landing-font-18 pl-[58px] md:pr-[80px] pr-[50px] md:py-[38px] py-[15px]" v-html="item.a" />
          </el-collapse-item>
        </el-collapse>
      </div>
    </section>
    <div class="full-width my-[120px] py-[66px] text-center bg-[#F5F6F7]">
      <h2 class="landing-font-38 font-bold">{{ $t('private_email.protect_your_email') }}</h2>
      <div class="mt-8">
        <button class="landing-btn">
          {{ $t('private_email.button') }}
        </button>
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
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>

</style>
