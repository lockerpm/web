<template>
  <div>
    <!-- Header -->
    <section
      class="full-width w-full h-auto relative overflow-hidden header-bg md:mt-16"
    >
      <div class="px-6 md:pr-0 py-20 relative z-10">
        <div class="flex flex-wrap">
          <div class="w-full lg:w-[55%] mt-10 text-center lg:text-left">
            <h1
              class="text-[51px] leading-[62px] font-semibold mb-6"
              v-html="$t('education.header.title')"
            />
            <p class="landing-font-18 mb-3">
              {{ $t('education.header.desc') }}
            </p>
            <p class="landing-font-18 font-semibold gradient-text mb-12">
              {{ $t('education.header.desc2') }}
            </p>
            <el-button type="primary" @click="goToForm">
              {{ $t('education.header.btn') }} <i class="el-icon-right" />
            </el-button>
          </div>
          <img
            src="~assets/images/pages/education/header-img.png"
            alt="Locker"
            class="md:w-[45%] hidden lg:flex"
          >
        </div>
      </div>
    </section>
    <!-- Header end -->

    <!-- Form -->
    <section v-show="showForm" id="form" class="py-14">
      <education-pack-form ref="form" @close="showForm = false" />
    </section>
    <!-- Form end -->

    <!-- Questions -->
    <section class="pt-20">
      <div class="flex flex-wrap items-center mb-16">
        <div class="w-full md:w-7/12 md:pr-16 mb-6 md:mb-0">
          <h2 class="landing-font-28 font-semibold mb-8">
            {{ $t('education.questions.q1.title') }}
          </h2>
          <p class="mb-4 landing-font-18">
            {{ $t('education.questions.q1.desc') }}
          </p>
          <p class="landing-font-18">
            {{ $t('education.questions.q1.desc2') }}
          </p>
        </div>
        <div class="w-full md:w-5/12">
          <img
            src="~assets/images/pages/education/question-0.svg"
            alt="CTA"
            class="w-full"
          >
        </div>
      </div>

      <div class="flex flex-wrap items-center mb-16">
        <div class="w-full md:w-7/12 md:pl-16 md:order-1 mb-6 md:mb-0">
          <h2 class="landing-font-28 font-semibold mb-8">
            {{ $t('education.questions.q2.title') }}
          </h2>
          <p class="mb-4 landing-font-18">
            {{ $t('education.questions.q2.desc') }}
          </p>
          <p class="landing-font-18">
            {{ $t('education.questions.q2.desc2') }}
          </p>
        </div>
        <div class="w-full md:w-5/12">
          <img
            src="~assets/images/pages/education/question-1.svg"
            alt="CTA"
            class="w-full"
          >
        </div>
      </div>

      <div class="full-width w-full h-auto bg-[#FAFAFA]">
        <div class="max-w-4xl mx-auto px-6 py-16">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-[120px]">
            <div>
              <img
                src="~assets/images/pages/education/question-2.svg"
                alt="CTA"
                class="w-full mb-8 max-h-[320px] mt-10"
              >
              <p class="landing-font-24 font-semibold text-center">
                {{ $t('education.questions.q3.title') }}
              </p>
            </div>
            <div>
              <img
                src="~assets/images/pages/education/question-3.svg"
                alt="CTA"
                class="w-full mb-8 max-h-[360px]"
              >
              <p class="landing-font-24 font-semibold text-center">
                {{ $t('education.questions.q4.title') }}
              </p>
            </div>
          </div>

          <div class="mt-14 flex justify-center">
            <el-button type="primary" @click="goToForm">
              {{ $t('education.questions.btn') }} <i class="el-icon-right" />
            </el-button>
          </div>
        </div>
      </div>
    </section>
    <!-- Questions end -->

    <!-- Features -->
    <section class="py-20">
      <div class="relative mb-6">
        <div class="z-10 relative">
          <h2 class="landing-font-38 font-semibold text-center bg-white">
            {{ $t('education.features.title') }}
          </h2>
        </div>
        <hr class="top-6 border-b border-primary z-0 full-width !absolute">
      </div>
      <p class="text-center landing-font-18 mb-3">
        {{ $t('education.features.desc') }}
      </p>
      <p class="landing-font-28 text-primary font-semibold mb-20 text-center">
        {{ $t('education.features.subtitle') }}
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
        <div
          v-for="(item, index) in $t('education.features.items')"
          :key="index"
        >
          <div class="mb-4 flex items-center">
            <img
              :src="
                require(`~/assets/images/pages/education/feature-${index}.svg`)
              "
              :alt="item.title"
              class="h-[55px] mr-4"
            >
            <p class="landing-font-18 font-semibold">
              {{ item.title }}
            </p>
          </div>
          <p v-for="(desc, i) in item.desc" :key="i" class="mb-2">
            {{ desc }}
          </p>
        </div>
      </div>

      <div class="mt-14 flex justify-center">
        <el-button type="primary" @click="goToForm">
          {{ $t('education.features.btn') }} <i class="el-icon-right" />
        </el-button>
      </div>
    </section>
    <!-- Features end -->

    <!-- CTA -->
    <section class="full-width w-full h-auto bg-[#FAFAFA]">
      <div class="max-w-6xl mx-auto px-6 py-20">
        <div class="flex flex-wrap items-center">
          <div
            class="w-full md:w-1/2 text-center md:text-left pr-0 md:pr-5 mb-6 md:mb-0"
          >
            <h2
              class="font-semibold landing-font-38 mb-6"
              v-html="$t('education.cta.title')"
            />
            <p class="mb-6">
              {{ $t('education.cta.desc') }}
            </p>
            <el-button type="primary" @click="goToForm">
              {{ $t('education.cta.btn') }} <i class="el-icon-right" />
            </el-button>
          </div>

          <div class="w-full md:w-1/2">
            <img
              src="~assets/images/pages/education/cta.png"
              alt="CTA"
              class="w-full"
            >
          </div>
        </div>
      </div>
    </section>
    <!-- CTA end -->
  </div>
</template>
<script>
import EducationPackForm from '../../components/pages/education/EducationPackForm.vue'
export default {
  components: { EducationPackForm },
  layout: 'landing',
  data () {
    return {
      showForm: false
    }
  },
  head () {
    const title = this.$t('education.title')
    const desc = this.$t('education.desc')
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
  methods: {
    goToForm () {
      if (!this.showForm) {
        this.showForm = true
        this.$refs.form.reset()
      }
      setTimeout(() => {
        const element = document.getElementById('form')
        element.scrollIntoView({ behavior: 'smooth' })
      }, 0)
    }
  }
}
</script>
<style>
.gradient-text {
  background: -webkit-linear-gradient(90deg, #34e98d 0%, #4c9aff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.header-bg {
  background-image: url(~assets/images/pages/education/header-bg.png);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top left;
}
@media (min-width: 1166px) {
  .header-bg > div {
    margin-left: calc(50vw - 36rem);
  }
}
</style>
