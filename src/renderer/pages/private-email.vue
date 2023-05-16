<template>
  <div class="landing-font-16">
    <section
      class="full-width h-auto bg-no-repeat bg-cover"
      :style="{
        backgroundImage: `url(${require(`~/assets/images/landing/affiliate/cover-bg.png`)})`
      }"
    >
      <div class="md:pt-[140px] py-28 mx-auto pl-6 text-center">
        <h1 class="landing-font-50 font-bold mb-8">
          {{ $t('private_email.welcome.title') }}
        </h1>
        <img
          class="mx-auto"
          src="~/assets/images/landing/private-email/boundary.svg"
        >
        <p class="my-8 landing-font-20 max-w-[700px] mx-auto">
          {{ $t('private_email.welcome.desc') }}
          <nuxt-link :to="localePath('/')">Locker Password Manager</nuxt-link>
        </p>
        <nuxt-link :to="localePath('/register')" class="landing-btn">
          {{ $t('private_email.button') }}
        </nuxt-link>
      </div>
    </section>
    <div
      class="grid lg:grid-cols-8 md:grid-cols-4 grid-cols-2 gap-4 items-center pt-9"
    >
      <div
        v-for="(logo, index) in $t('private_email.company_logos')"
        :key="index"
      >
        <img
          class="mx-auto"
          :src="require(`~/assets/images/landing/private-email/${logo}`)"
          :alt="logo"
          :title="logo.split('.')[0]"
        >
      </div>
    </div>
    <section class="py-[120px] text-center">
      <h2 class="landing-font-48 font-bold mb-8">
        {{ $t('private_email.feature.title') }}
      </h2>
      <img
        class="mx-auto"
        src="~/assets/images/landing/private-email/section-line.svg"
      >
      <p class="mt-12 landing-font-20">
        {{ $t('private_email.feature.desc') }}
      </p>
      <div class="mt-14 grid md:grid-cols-3 grid-cols-1 gap-8 text-left">
        <div
          v-for="(item, index) in $t('private_email.feature.items').slice(0, 3)"
          :key="index"
          class="border border-black-200 rounded-xl py-12 px-9"
        >
          <img
            :src="
              require(`~/assets/images/landing/private-email/feature-${
                index + 1
              }.svg`)
            "
          >
          <div class="mt-6 landing-font-22 font-bold">{{ item.title }}</div>
          <div class="mt-4">{{ item.desc }}</div>
        </div>
      </div>
      <div class="mt-16 grid md:grid-cols-2 grid-cols-1 gap-16 text-left">
        <div
          v-for="(item, index) in $t('private_email.feature.items').slice(3)"
          :key="index + 3"
          class="border border-black-200 rounded-xl py-12 px-9"
        >
          <img
            :src="
              require(`~/assets/images/landing/private-email/feature-${
                index + 4
              }.svg`)
            "
          >
          <div class="mt-6 landing-font-22 font-bold">{{ item.title }}</div>
          <div class="mt-4">{{ item.desc }}</div>
        </div>
      </div>
    </section>
    <section class="py-[120px] text-center">
      <h2 class="landing-font-48 font-bold mb-8">
        {{ $t('private_email.how_it_works.title') }}
      </h2>
      <img
        class="mx-auto"
        src="~/assets/images/landing/private-email/section-line.svg"
      >
      <div class="grid md:grid-cols-2 grid-cols-1 mt-16">
        <div class="md:order-first order-last text-left">
          <ul>
            <li
              v-for="(item, index) in $t('private_email.how_it_works.steps')"
              :key="index"
              :class="index !== 0 ? 'mt-[72px]' : ''"
            >
              <div class="flex">
                <div>
                  <div
                    class="btn-number"
                    :style="
                      index === 0
                        ? 'color: #FFFFFF;background: #268334;'
                        : 'color: #000000;'
                    "
                  >
                    {{ index + 1 }}
                  </div>
                </div>
                <div class="ml-[22px]">
                  <div class="landing-font-24 font-bold text-black">
                    {{ item.title }}
                  </div>
                  <div
                    v-if="index === 0"
                    class="landing-font-16 font-normal mt-6 text-black"
                    v-html="item.desc"
                  />
                  <div
                    v-else
                    class="landing-font-16 font-normal mt-6 text-black"
                  >
                    {{ item.desc }}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="self-center">
          <img
            class="mx-auto"
            src="~/assets/images/landing/private-email/email.png"
          >
        </div>
      </div>
    </section>
    <section class="py-[120px] text-center">
      <h2 class="landing-font-48 font-bold mb-8">
        {{ $t('private_email.benefit.title') }}
      </h2>
      <img
        class="mx-auto"
        src="~/assets/images/landing/private-email/section-line.svg"
      >
      <div class="mt-14 grid md:grid-cols-4 grid-cols-2 text-left">
        <div
          v-for="(item, index) in $t('private_email.benefit.items')"
          :key="index"
          class=""
        >
          <div class="px-6 py-5 bg-[#FBFAF3] landing-font-24 font-bold">
            {{ item.title }}
          </div>
          <div class="px-6 py-5" v-html="item.desc" />
        </div>
      </div>
    </section>
    <div class="py-[120px] text-center">
      <h2 class="landing-font-38 font-bold mb-8">
        {{ $t('private_email.cta.title') }}
      </h2>
      <img
        class="mx-auto mb-8"
        src="~/assets/images/landing/private-email/boundary.svg"
      >
      <p class="text-black-600 landing-font-18 mb-16">
        {{ $t('private_email.cta.desc') }}
      </p>
      <div
        class="rounded-xl text-left max-w-[870px] mx-auto border-[#DFDFDF] border bg-black-700 text-white mb-[72px]"
      >
        <div>
          <pre class="overflow-x-scroll pr-6">
            <code>
              <span class="token tag">curl --location --request</span> <span class="token key">POST</span> <span class="token value">'https://api.locker.io/v3/relay/addresses'</span> \
              <span class="token tag">--header</span> '<span class="token key">Authorization</span>: <span class="token value">Bearer  {your_api_key}</span>' \
              --data-raw ''
            </code>
          </pre>
        </div>
        <div class="bg-black-600 p-4">Example Response</div>
        <div>
          <pre class="overflow-x-scroll pr-6">
            <code>
            {
              <span class="token key">"id"</span>: <span class="token value">88</span>,
              <span class="token key">"address"</span>: <span class="token value">"example"</span>,
              <span class="token key">"enabled"</span>: <span class="token value">true</span>,
              <span class="token key">"description"</span>: <span class="token value">""</span>,
              <span class="token key">"created_time"</span>: <span class="token value">1662042581.0</span>,
              <span class="token key">"updated_time"</span>: <span class="token value">null</span>,
              <span class="token key">"num_forwarded"</span>: <span class="token value">0</span>,
              <span class="token key">"num_blocked"</span>: <span class="token value">0</span>,
              <span class="token key">"num_replied"</span>: <span class="token value">0</span>,
              <span class="token key">"num_spam"</span>: <span class="token value">0</span>,
              <span class="token key">"domain"</span>: <span class="token value">"maily.org"</span>,
              <span class="token key">"subdomain"</span>: <span class="token value">null</span>,
              <span class="token key">"full_address"</span>: <span class="token value">"example@maily.org"</span>
            }
            </code>
          </pre>
        </div>
      </div>
      <nuxt-link
        :to="localePath('/register')"
        class="hover:no-underline text-green font-semibold"
      >
        {{ $t('private_email.button') }} <i class="el-icon-right" />
      </nuxt-link>
    </div>
    <section class="py-[120px] text-center">
      <h2 class="landing-font-48 font-bold mb-8">
        {{ $t('private_email.pick_your_plan') }}
      </h2>
      <p class="text-black-600 landing-font-18 mb-16">
        {{ $t('private_email.pick_plan_desc') }}
      </p>
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
              <img src="~/assets/images/landing/private-email/check.svg">
              <div>{{ feature }}</div>
            </div>
          </div>
          <div class="mt-6 text-center">
            <nuxt-link :to="localePath('/register')" class="landing-btn">
              {{ $t('private_email.button') }}
            </nuxt-link>
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
          <el-collapse-item
            v-for="(item, index) in $t('private_email.faq.items')"
            :key="index"
            :name="(index + 1).toString()"
          >
            <template slot="title">
              <div class="font-bold landing-font-22 text-black question">
                {{ item.q }}
              </div>
            </template>
            <div
              class="answer font-normal landing-font-18 pl-[58px] md:pr-[80px] pr-[50px] md:py-[38px] py-[15px]"
              v-html="item.a"
            />
          </el-collapse-item>
        </el-collapse>
      </div>
    </section>
    <div class="full-width my-[120px] py-[66px] text-center bg-[#F5F6F7]">
      <h2 class="landing-font-38 font-bold">
        {{ $t('private_email.protect_your_email') }}
      </h2>
      <div class="mt-8">
        <nuxt-link :to="localePath('/register')" class="landing-btn">
          {{ $t('private_email.button') }}
        </nuxt-link>
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
  mounted () {},
  methods: {
    choosePlan (alias) {
      localStorage.setItem('trial_plan', alias)
      this.$router.replace(this.localePath('/register'))
    }
  }
}
</script>

<style lang="scss" scoped></style>
