<template>
  <div id="doanh-nghiep">
    <!-- Header -->
    <section id="header" class="pt-10">
      <div class="relative w-full">
        <div class="relative z-10 flex max-w-9xl mx-auto px-6 flex-wrap">
          <div class="lg:w-1/2 w-full lg:max-w-[46rem] text-center flex flex-col items-center lg:items-start lg:text-left">
            <div class="logo-container">
              <a href="/" target="_blank">
                <img
                  class="h-12"
                  src="~/assets/images/logo/logo_black_with_text.svg"
                >
              </a>
            </div>

            <h1 class="font-semibold font-sans text-black landing-font-81 mb-8" v-html="$t('sme.header.title')" />
            <p class="landing-font-22 mb-8">
              {{ $t('sme.header.desc') }}
            </p>

            <div class="btn-container flex flex-wrap items-center mb-16 justify-center lg:justify-start">
              <a href="#contact" class="bg-primary rounded-full px-9 py-3 mb-3 text-white hover:text-white font-semibold landing-font-21 cursor-pointer hover:opacity-70 transition-opacity">
                {{ $t('sme.header.btn') }}
              </a>
              <a href="https://locker.io/vi/business/register" target="_blank" class="text-primary font-medium ml-4 mb-3 landing-font-21">
                {{ $t('sme.header.trial') }}
                <i class="el-icon-arrow-right" />
              </a>
            </div>
          </div>
        </div>

        <div class="hidden lg:flex w-11/12 absolute z-0 right-0 bottom-0">
          <div ref="animationHero" />
        </div>
      </div>

      <!-- Slider -->
      <div class="relative flex full-width bg-primary text-white py-4 landing-font-24">
        <div class="opacity-layer-left" />
        <div class="opacity-layer-right" />
        <running-text>
          <p
            v-for="(item, index) in $t('sme.header.sliders')"
            :key="index"
            v-html="item"
          />
        </running-text>
      </div>
      <!-- Slider end -->
    </section>
    <!-- Header end -->

    <!-- Customers -->
    <section class="py-20 max-w-9xl mx-auto px-6">
      <div class="md:w-10/12 w-full mx-auto bg-[#FAFAFA] rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4 p-12 md:py-20 md:px-24">
        <div class="md:pr-4">
          <h2 class="text-black landing-font-54 font-semibold mb-8">
            {{ $t('sme.customers.title') }}
          </h2>
          <div
            v-for="(item, index) in $t('sme.customers.descs')"
            :key="index"
            class="flex items-center border-black-50 py-3"
            :class="{ 'border-t': index !== 0 }"
          >
            <img
              class="h-12 mr-3"
              :src="require(`~/assets/images/pages/sme/customers/desc-${index + 1}.svg`)"
            >
            <p class="landing-font-21">
              {{ item }}
            </p>
          </div>
        </div>

        <!-- Logos -->
        <div class="flex flex-col items-center mt-6 md:mt-0">
          <div class="flex items-center justify-between overflow-y-auto mb-10">
            <img
              v-for="(item, index) in customers"
              :key="item"
              class="h-10 transition-opacity grayscale cursor-pointer"
              :class="{ 'opacity-50': item !== currentCustomer, 'ml-3': index !== 0 }"
              :src="require(`~/assets/images/pages/sme/customers/${item}.svg`)"
              @click="selectCustomer(item)"
              @mouseover="selectCustomer(item)"
            >
          </div>
          <div class="relative w-full h-[200px]">
            <img
              v-for="item in customers"
              :key="item"
              class="w-full absolute transition-opacity max-h-[200px]"
              :class="{ 'opacity-0': item !== currentCustomer }"
              :src="require(`~/assets/images/pages/sme/customers/${item}.svg`)"
            >
          </div>
          <p class="italic text-center">
            {{ $t('sme.customers.logo_desc') }}
          </p>
        </div>
        <!-- Logos end -->
      </div>
    </section>
    <!-- Customers end -->

    <!-- Features -->
    <section id="features" class="py-20 max-w-9xl mx-auto px-6">
      <h2 class="landing-font-81 text-black font-semibold max-w-[51rem] mb-8">
        {{ $t('sme.features.title') }}
      </h2>

      <!-- Buttons -->
      <div class="flex justify-between items-center flex-wrap mb-16">
        <!-- Group -->
        <div class="flex items-center flex-wrap">
          <div
            class="flex items-center cursor-pointer px-6 py-4 my-2 rounded-full bg-[#FFC069] mr-3 min-w-[270px]"
            :class="{ 'opacity-20': currentFeatureGroup !== 'staff' }"
            @click="selectFeatureGroup('staff')"
          >
            <img
              class="h-6 mr-3 text-black"
              src="~/assets/images/pages/sme/features/staff-icon.svg"
            >
            <p class="landing-font-21 font-semibold text-black">
              {{ $t('sme.features.staff.btn') }}
            </p>
          </div>

          <div
            class="flex items-center cursor-pointer px-6 py-4 rounded-full bg-[#69C0FF] min-w-[270px] my-2"
            :class="{ 'opacity-20': currentFeatureGroup !== 'admin' }"
            @click="selectFeatureGroup('admin')"
          >
            <img
              class="h-6 mr-3 text-black"
              src="~/assets/images/pages/sme/features/admin-icon.svg"
            >
            <p class="landing-font-21 font-semibold text-black">
              {{ $t('sme.features.admin.btn') }}
            </p>
          </div>
        </div>
        <!-- Group end -->
      </div>
      <!-- Buttons end -->

      <!-- Carousel -->
      <carousel
        :per-page-custom="[
          [0, 1],
          [480, 1],
          [768, 2],
          [1024, 3],
          [1280, 4]
        ]"
        pagination-active-color="#268334"
        autoplay
        loop
        :pagination-enabled="false"
        :autoplay-timeout="3000"
        :scroll-per-page="false"
      >
        <slide v-for="(item, index) in $t(`sme.features.${currentFeatureGroup}.items`)" :key="index">
          <div
            class="border rounded border-black-50 py-6 px-6 h-full flex text-center mx-4"
            :class="{ 'ml-0': index === 0 }"
          >
            <div class="flex flex-col items-center">
              <img
                class="h-16"
                :src="require(`~/assets/images/pages/sme/features/${currentFeatureGroup}-${index + 1}.svg`)"
              >
              <h3 class="font-semibold text-black landing-font-22 my-3">
                {{ item.title }}
              </h3>
              <p class="text-black landing-font-16 flex-1">
                {{ item.desc }}
              </p>
            </div>
          </div>
        </slide>
      </carousel>
      <!-- Carousel end -->
    </section>
    <!-- Features end -->

    <!-- Hero -->
    <section class="bg-[#FAFAFA]">
      <div class="flex max-w-9xl mx-auto px-6 py-10 items-center justify-between flex-wrap">
        <div class="lg:w-7/12 w-full mb-8 lg:mb-0 text-center lg:text-left">
          <h2 class="landing-font-81 text-black font-semibold max-w-[48rem] mb-6 mr-0 md:mr-6 md:mb-0">
            {{ $t('sme.hero.title') }}
          </h2>
        </div>
        <div class="flex lg:w-5/12 w-full">
          <div class="w-1/2 flex flex-col h-[500px] overflow-hidden relative">
            <div class="opacity-layer-top" />
            <div class="opacity-layer-bottom" />
            <running-text :vertical="true">
              <div
                v-for="(item, index) in $t('sme.hero.items')"
                :key="index"
                class="bg-white rounded-2xl p-6 flex flex-col items-center mb-6 mr-3"
              >
                <img
                  class="h-16 mb-3"
                  :src="require(`~/assets/images/pages/sme/hero/item-${index + 1}.svg`)"
                >
                <p class="font-medium text-black landing-font-22 text-center">
                  {{ item }}
                </p>
              </div>
            </running-text>
          </div>
          <div class="w-1/2 flex flex-col h-[500px] overflow-hidden relative">
            <div class="opacity-layer-top" />
            <div class="opacity-layer-bottom" />
            <running-text :vertical="true" :inverted="true">
              <div
                v-for="(item, index) in $t('sme.hero.items2')"
                :key="index"
                class="bg-white rounded-2xl p-6 flex flex-col items-center mb-6 ml-3"
              >
                <img
                  class="h-16 mb-3"
                  :src="require(`~/assets/images/pages/sme/hero/item2-${index + 1}.svg`)"
                >
                <p class="font-medium text-black landing-font-22 text-center">
                  {{ item }}
                </p>
              </div>
            </running-text>
          </div>
        </div>
      </div>
    </section>
    <!-- Hero end -->

    <!-- News -->
    <section class="py-20 max-w-9xl mx-auto px-6">
      <div class="md:w-10/12 w-full mx-auto rounded-2xl border border-primary flex flex-wrap overflow-hidden">
        <!-- Content -->
        <div class="md:w-7/12 w-full flex flex-col items-start justify-center p-12 md:py-20 md:px-24">
          <h2 class="text-[2.25rem] leading-[3rem] font-semibold text-black mb-8">
            {{ $t('sme.news.title') }}
          </h2>
          <p class="mb-8 landing-font-16">
            {{ $t('sme.news.desc') }}
          </p>
          <div>
            <a
              href="https://cystack.net/vi/customers/vincss-decoding-tenacious-roadmap-to-passwordless-with-locker-password-manager"
              target="_blank"
            >
              <div class="border border-primary rounded-full py-2 px-6 cursor-pointer">
                <p class="text-primary font-medium landing-font-21">
                  {{ $t('sme.news.btn') }} &nbsp; <i class="el-icon-arrow-right" />
                </p>
              </div>
            </a>
          </div>
        </div>
        <!-- Content end -->

        <!-- Img -->
        <div class="md:w-5/12 w-full">
          <img
            src="~/assets/images/pages/sme/news.png"
            class="w-full h-full object-cover"
          >
        </div>
        <!-- Img end -->

        <!-- Slider -->
        <div class="w-full relative flex bg-primary py-6 text-white landing-font-54 font-semibold">
          <div class="opacity-layer-left" />
          <div class="opacity-layer-right" />
          <running-text>
            <div class="flex items-center">
              <div
                v-for="(item, index) in $t('sme.news.items')"
                :key="index"
                class="flex items-center mx-4"
              >
                <div class="h-12 w-12 rounded-full bg-white flex items-center justify-center mr-4">
                  <i
                    class="text-primary el-icon-right"
                  />
                </div>
                <p>
                  {{ item }}
                </p>
              </div>
            </div>
          </running-text>
        </div>
        <!-- Slider end -->
      </div>
    </section>
    <!-- News end -->

    <!-- Process -->
    <section class="max-w-9xl lg:max-w-full mx-auto px-6 lg:px-0">
      <div ref="animationProcess" class="hidden lg:flex" />
      <div class="flex flex-col lg:hidden py-20">
        <h2 class="landing-font-54 font-semibold text-black mb-6">
          {{ $t('sme.process.title') }}
        </h2>
        <div
          v-for="(item, index) in $t('sme.process.items')"
          :key="index"
          class="rounded-2xl border border-primary flex flex-col items-center text-center p-5 mt-6"
        >
          <img
            class="h-16 mb-4"
            :src="require(`~/assets/images/pages/sme/process/process-${index + 1}.svg`)"
          >
          <h3 class="font-semibold text-black landing-font-21 mb-4">
            {{ item.title }}
          </h3>
          <p class="text-black landing-font-16">
            {{ item.desc }}
          </p>
        </div>
      </div>
    </section>
    <!-- Process end -->

    <!-- Why -->
    <section class="py-20 max-w-9xl mx-auto px-6">
      <h2 class="landing-font-54 font-semibold text-black max-w-[800px] mb-6">
        {{ $t('sme.why.title') }}
      </h2>

      <div class="overflow-y-scroll">
        <table style="min-width: 500px; width: 100%">
          <tbody>
            <tr class="text-center">
              <td />
              <td class="py-8 bg-[#E9FFEC] rounded-tl-2xl rounded-tr-2xl px-6">
                <p class="landing-font-24 font-semibold text-black">
                  Locker Password Manager
                </p>
              </td>
              <td class="pr-4" />
              <td class="py-8 bg-[#F5F5F5] rounded-tl-2xl rounded-tr-2xl px-6">
                <p class="landing-font-24 font-semibold text-black">
                  {{ $t('sme.why.table.other_pm') }}
                </p>
              </td>
            </tr>
            <tr
              v-for="(item, index) in $t('sme.why.table.items')"
              :key="index"
              class=" border-black-50"
              :class="{'border-t': index !== 0}"
            >
              <td class="text-black py-3 pr-4 landing-font-18 font-medium">
                {{ item }}
              </td>
              <td
                class="landing-font-21 bg-[#E9FFEC] text-center"
                :class="index === $t('sme.why.table.items').length - 1 ? 'rounded-bl-2xl rounded-br-2xl' : ''"
              >
                <i class="el-icon-success text-primary" />
              </td>
              <td class="pr-4" />
              <td
                class="landing-font-21 bg-[#F5F5F5] text-center"
                :class="index === $t('sme.why.table.items').length - 1 ? 'rounded-bl-2xl rounded-br-2xl' : ''"
              >
                <i class="el-icon-error text-danger" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <!-- Why end -->

    <!-- Contact -->
    <section id="contact" class="py-20 max-w-9xl mx-auto px-6">
      <div class="rounded-2xl bg-[#FAFAFA] flex overflow-hidden items-start">
        <div class="w-7/12 hidden lg:flex">
          <div ref="animationContact" />
        </div>
        <div class="lg:w-5/12 w-full flex flex-col items-center p-10 text-center lg:text-left">
          <h2 class="landing-font-81 font-semibold text-black mb-3">
            {{ $t('sme.contact.title') }}
          </h2>
          <p class="landing-font-16 mb-4">
            {{ $t('sme.contact.desc') }}
          </p>

          <sme-contact-form />
        </div>
      </div>
    </section>
    <!-- Contact end -->

    <!-- Questions -->
    <section id="faq" class="py-20 mb-20 max-w-9xl mx-auto px-6 border-black-50 border-t border-b">
      <div class="flex flex-wrap">
        <div class="md:w-1/2 w-full mb-6 md:mb-0">
          <h2 class="landing-font-54 font-semibold text-black">
            {{ $t('sme.questions.title') }}
          </h2>
        </div>
        <div class="md:w-1/2 w-full">
          <el-collapse accordion>
            <el-collapse-item
              v-for="(item, index) in $t('sme.questions.items')"
              :key="index"
              :name="index"
            >
              <template slot="title">
                <h3 class="landing-font-24 text-black font-semibold">
                  <i class="text-primary el-icon-plus" />
                  <i class="text-primary el-icon-minus" /> &nbsp;
                  {{ item.title }}
                </h3>
              </template>
              <p class="landing-font-16 md:pl-14 mt-4">
                {{ item.desc }}
              </p>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </section>
    <!-- Questions end -->

    <!-- CTA -->
    <section id="cta" class="pt-20 pb-6 bg-primary px-6">
      <div class="max-w-9xl mx-auto px-6 rounded-2xl flex flex-col items-center mb-12 py-24">
        <h2 class="landing-font-81 font-semibold text-white max-w-[658px] text-center mb-6 mt-16">
          {{ $t('sme.cta.title') }}
        </h2>
        <div class="flex flex-wrap items-center justify-center mb-12">
          <a href="#contact" class="bg-primary rounded-full px-9 py-3 mb-3 text-white hover:text-white font-semibold landing-font-21 cursor-pointer hover:opacity-90 transition-opacity">
            {{ $t('sme.cta.btn') }}
          </a>
          <a href="https://locker.io/vi/business/register" target="_blank" class="text-white font-medium ml-4 mb-3 landing-font-21 hover:text-white">
            {{ $t('sme.header.trial') }}
            <i class="el-icon-arrow-right" />
          </a>
        </div>
      </div>

      <div
        class="md:flex md:items-centerlanding-font-12 text-white max-w-9xl mx-auto px-6"
      >
        <div class="flex items-center">
          <div v-if="locale === 'vi'">Một sản phẩm của</div>
          <div v-else>A product of</div>
          <a
            :href="
              locale === 'vi' ? 'https://cystack.net/vi' : 'https://cystack.net'
            "
            target="_blank"
          >
            <img
              class="h-4 ml-2 mr-3"
              src="~/assets/images/logo/cystack_white.svg"
              alt="CyStack"
            >
          </a>
        </div>
        <p class="!break-normal">
          Copyright © {{ currentYear }} Locker.io · All rights reserved.
        </p>
        <div class="flex-grow md:text-right">
          <nuxt-link
            :to="localePath(`/terms`)"
            class="mr-4 text-white hover:text-white"
          >
            {{ $t('landing_footer.terms') }}
          </nuxt-link>
          <nuxt-link
            :to="localePath(`/privacy`)"
            class="text-white hover:text-white"
          >
            {{ $t('landing_footer.policy') }}
          </nuxt-link>
        </div>
      </div>
    </section>
    <!-- CTA end -->
  </div>
</template>
<script>
import RunningText from '../components/landing/RunningText.vue'
import SmeContactForm from '../components/pages/sme/SmeContactForm.vue'

export default {
  components: {
    RunningText,
    SmeContactForm
  },
  layout: 'authenticate',
  middleware: ['onlyVi'],
  auth: false,

  data () {
    return {
      currentCustomer: 'vingroup',
      currentFeatureGroup: 'staff',
      intervalCustomer: null
    }
  },

  head () {
    const title = this.$t('sme.title')
    const desc = this.$t('sme.desc')
    return {
      title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: title
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: title
        },
        {
          hid: 'description',
          name: 'description',
          content: desc
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: desc
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: desc
        }
      ]
    }
  },

  computed: {
    customers () {
      return ['vingroup', 'vincss', 'antsomi', 'vntrip', 'agribank', 'onemount']
    },
    currentYear () {
      return new Date().getFullYear()
    }
  },

  mounted () {
    this.autoSelectCustomer()
    this.loadAnimation()
    this.$i18n.setLocale('vi')
  },

  beforeDestroy () {
    clearInterval(this.intervalCustomer)
  },

  methods: {
    selectCustomer (val) {
      this.currentCustomer = val
      clearInterval(this.intervalCustomer)
      this.autoSelectCustomer()
    },

    autoSelectCustomer () {
      this.intervalCustomer = setInterval(() => {
        const index = this.customers.findIndex(i => i === this.currentCustomer)
        this.currentCustomer = this.customers[(index + 1) % this.customers.length]
      }, 3000)
    },

    loadAnimation () {
      this.$lottie.loadAnimation({
        container: this.$refs.animationHero,
        path: '/img/animation/hero.json'
      })
      this.$lottie.loadAnimation({
        container: this.$refs.animationProcess,
        path: '/img/animation/process.json'
      })
      this.$lottie.loadAnimation({
        container: this.$refs.animationContact,
        path: '/img/animation/contact.json'
      })
    },

    selectFeatureGroup (val) {
      this.currentFeatureGroup = val
    }
  }
}
</script>
<style lang="scss" scoped>
.max-w-9xl {
  max-width: 105rem;
}
.opacity-layer-left {
  position: absolute;
  top: 0;
  left: 0;
  width: 10%;
  height: 100%;
  z-index: 100;
  background: linear-gradient(to right, rgba(38, 131, 52, 1), rgba(38, 131, 52, 0));
}
.opacity-layer-right {
  position: absolute;
  top: 0;
  right: 0;
  width: 10%;
  height: 100%;
  z-index: 100;
  background: linear-gradient(to right, rgba(38, 131, 52, 0), rgba(38, 131, 52, 1));
}
.opacity-layer-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 15%;
  z-index: 100;
  background: linear-gradient(to bottom, rgba(250, 250, 250, 1), rgba(250, 250, 250, 0));
}
.opacity-layer-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 15%;
  z-index: 100;
  background: linear-gradient(to bottom, rgba(250, 250, 250, 0), rgba(250, 250, 250, 1));
}
.landing-font-81 {
  font-size: 4.9rem;
  line-height: 6rem;
}
.landing-font-54 {
  font-size: 3rem;
  line-height: 4rem;
}
.landing-font-24 {
  font-size: 24px;
  line-height: 32px;
}
.landing-font-22 {
  font-size: 1.38rem;
  line-height: 2rem;
}
.landing-font-21 {
  font-size: 1.3rem;
  line-height: 2rem;
}
@media only screen and (max-width: 768px) {
  .landing-font-81 {
    font-size: 48px;
    line-height: 60px;
  }
  .landing-font-54 {
    font-size: 32px;
    line-height: 44px;
  }
}
#header {
  .logo-container {
    margin-bottom: 5rem;
  }
  .btn-container {
    margin-bottom: 5rem;
  }
}
@media only screen and (min-width: 1581px) {
  #header {
    .logo-container {
      margin-bottom: 8rem;
    }
    .btn-container {
      margin-bottom: 8rem;
    }
  }
}
#cta > div:first-of-type {
  background-image: url(~assets/images/pages/sme/cta-bg.png);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>
<style lang="scss">
#faq {
  .el-collapse-item__header {
    height: auto !important;
    padding-top: 16px;
    padding-bottom: 16px;
  }
  .el-collapse-item__arrow {
    display: none !important;
  }
  .el-icon-plus {
      display: inline-block;
    }
    .el-icon-minus {
      display: none;
    }
  .is-active {
    .el-icon-plus {
      display: none;
    }
    .el-icon-minus {
      display: inline-block;
    }
  }
}
#doanh-nghiep {
  * {
    font-family: "SVN-Avenir Next", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
}
</style>
