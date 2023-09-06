<template>
  <div class="max-w-6xl mx-auto px-6">
    <!-- Logo -->
    <section class="full-width bg-white">
      <div class="flex justify-center">
        <a href="/" target="_blank">
          <img
            class="h-12 my-4 px-6"
            src="~/assets/images/logo/logo_black_with_text.svg"
          >
        </a>
      </div>
    </section>
    <!-- Logo end -->

    <!-- Header -->
    <section id="promo-header" class="full-width py-14">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-8">
          <h1 class="landing-font-50 font-semibold mb-6">
            {{ $t('promo.buy13.header.title') }}
          </h1>
          <p class="landing-font-18" v-html="$t('promo.buy13.header.desc')" />
        </div>

        <div
          class="flex justify-around items-center mb-6 rounded-[36px] py-5 max-w-[736px] mx-auto"
          style="background-color: rgba(255, 255, 255, 0.8)"
        >
          <div
            v-for="key in Object.keys(remainingTime)"
            :key="key"
            class="text-center w-[60px]"
          >
            <p class="landing-font-50 font-bold text-primary">
              {{ remainingTime[key] }}
            </p>
            <p class="landing-font-20 font-semibold">
              {{ $t(`promo.buy13.common.clock.${key}`) }}
            </p>
          </div>
        </div>

        <div class="text-center mb-8 landing-font-18">
          <p>
            {{ $t('promo.buy13.header.desc1') }}
          </p>
          <p>
            {{ $t('promo.buy13.header.desc2') }}
          </p>
        </div>

        <div class="w-full flex justify-center">
          <el-button type="primary" @click="openPayment">
            {{ $t('promo.buy13.common.buy_now') }} <i class="el-icon-right" />
          </el-button>
        </div>
      </div>
    </section>
    <!-- Header end -->

    <!-- Features -->
    <section class="py-20">
      <div class="max-w-[617px] text-center mx-auto mb-20">
        <h2
          class="landing-font-38 font-semibold mb-6"
          v-html="$t('promo.buy13.features.title')"
        />
        <p class="landing-font-18">
          {{ $t('promo.buy13.features.desc') }}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
        <div
          v-for="(item, index) in $t('promo.buy13.features.items')"
          :key="index"
          class="flex flex-col items-center text-center"
        >
          <img
            :src="
              require(`~/assets/images/pages/promo/buy13/features/${
                index + 1
              }.svg`)
            "
            :alt="item.title"
            style="height: 55px"
          >
          <p class="my-6 landing-font-18 font-semibold">
            {{ item.title }}
          </p>
          <p class="landing-font-16">
            {{ item.desc }}
          </p>
        </div>
      </div>

      <div class="w-full flex justify-center mt-20">
        <el-button type="primary" @click="openPayment">
          {{ $t('promo.buy13.common.get_promotion') }}
          <i class="el-icon-right" />
        </el-button>
      </div>
    </section>
    <!-- Features end -->

    <!-- Private email -->
    <section class="py-20">
      <div class="max-w-[617px] text-center mx-auto mb-20">
        <h2
          class="landing-font-38 font-semibold mb-6"
          v-html="$t('promo.buy13.private_email.title')"
        />
        <p
          class="landing-font-18"
          v-html="$t('promo.buy13.private_email.desc')"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-9">
        <div
          v-for="(item, index) in $t('promo.buy13.private_email.items').slice(
            0,
            3
          )"
          :key="`first_${index}`"
          class="rounded border border-black-100 p-7 flex flex-col items-center text-center md:items-start md:text-left"
        >
          <img
            :src="
              require(`~/assets/images/pages/promo/buy13/private-email/${
                index + 1
              }.svg`)
            "
            :alt="item.title"
            style="height: 55px"
          >
          <p class="my-6 landing-font-18 font-semibold">
            {{ item.title }}
          </p>
          <p class="landing-font-16">
            {{ item.desc }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-9 mt-9">
        <div
          v-for="(item, index) in $t('promo.buy13.private_email.items').slice(
            3
          )"
          :key="`second_${index}`"
          class="rounded border border-black-100 p-7 flex flex-col items-center text-center md:items-start md:text-left"
        >
          <img
            :src="
              require(`~/assets/images/pages/promo/buy13/private-email/${
                index + 4
              }.svg`)
            "
            :alt="item.title"
            style="height: 55px"
          >
          <p class="my-6 landing-font-18 font-semibold">
            {{ item.title }}
          </p>
          <p class="landing-font-16">
            {{ item.desc }}
          </p>
        </div>
      </div>

      <div class="w-full flex justify-center mt-20">
        <el-button type="primary" @click="openPayment">
          {{ $t('promo.buy13.common.get_promotion') }}
          <i class="el-icon-right" />
        </el-button>
      </div>
    </section>
    <!-- Private email end -->

    <!-- Testimonials -->
    <section class="py-20">
      <div class="mx-auto">
        <h2 class="text-center font-bold text-black landing-font-38 mb-20">
          {{ $t('landing.testimonials.title') }}
        </h2>
      </div>

      <div v-if="testimonials.length">
        <carousel
          autoplay
          loop
          :autoplay-timeout="5000"
          :per-page-custom="[
            [0, 1],
            [480, 1],
            [768, 2],
            [1024, 3],
            [1280, 4]
          ]"
          pagination-active-color="#268334"
        >
          <slide v-for="(item, index) in testimonials" :key="index">
            <div
              class="border rounded border-black-50 p-7 h-full flex flex-col"
              :class="{ 'ml-6': index !== 0 }"
            >
              <div class="flex items-center justify-between mb-4">
                <p class="text-black-50">
                  <i
                    v-for="i in 5"
                    :key="i"
                    class="el-icon-star-on"
                    :class="{ 'text-warning': i <= item.Rating }"
                  />
                </p>
                <img
                  :src="
                    item.Logo && item.Logo[0]
                      ? item.Logo[0].url
                      : `/img/index/${item.Source.replaceAll(' ', '')}.svg`
                  "
                  alt="item.Source"
                  class="h-6"
                >
              </div>
              <p class="font-semibold text-black text-[16px] mb-2">
                {{ item.Title }}
              </p>
              <p class="text-black mb-9 flex-1">
                {{ locale === 'vi' ? item.Vietnamese : item.English }}
              </p>
              <div class="flex items-center justify-between">
                <p class="text-black text-[12px]">
                  <strong>
                    {{ item.Reviewer }}
                  </strong>
                  &nbsp;
                  {{ item['Updated time'] }}
                </p>
                <span :class="`flag flag-${item.Country.toLowerCase()}`" />
              </div>
            </div>
          </slide>
        </carousel>
      </div>
    </section>
    <!-- Testimonials end -->

    <!-- Ratings -->
    <section class="pb-20">
      <div class="flex flex-wrap items-center justify-center">
        <!-- Trustpilot -->
        <div style="width: 301px" class="mb-4">
          <div
            class="trustpilot-widget"
            data-locale="en-US"
            data-template-id="5419b6a8b0d04a076446a9ad"
            data-businessunit-id="642e5d5bc70cd42f53e01b3e"
            data-style-height="30px"
            data-style-width="100%"
            data-theme="light"
            data-min-review-count="10"
            data-without-reviews-preferred-string-id="1"
            data-style-alignment="center"
          >
            <a
              href="https://www.trustpilot.com/review/locker.io"
              target="_blank"
              rel="noopener"
            >
              <img
                src="~/assets/images/landing/index/Trustpilot.svg"
                alt=""
                style="height: 50px"
                class="mx-auto"
              >
            </a>
          </div>
        </div>
        <!-- Trustpilot end -->

        <!-- GetApp -->
        <div style="width: 160px" class="mb-4">
          <a
            href="https://www.getapp.com/security-software/a/locker-password-manager/"
            target="_blank"
            rel="noopener"
          >
            <img
              src="~/assets/images/landing/index/GetApp.svg"
              alt=""
              style="height: 50px"
              class="mx-auto"
            >
          </a>
        </div>
        <!-- GetApp end -->

        <!-- G2 -->
        <div style="width: 160px" class="mb-4">
          <a
            href="https://www.g2.com/products/locker-password-manager/reviews?utm_source=Iterable&utm_medium=email&utm_campaign=it_txn_claimedprod_rej_1403101"
            target="_blank"
            rel="noopener"
          >
            <img
              src="~/assets/images/landing/index/G2.svg"
              alt=""
              style="height: 50px"
              class="mx-auto"
            >
          </a>
        </div>
        <!-- G2 end -->

        <!-- Google Play -->
        <div style="width: 160px" class="mb-4">
          <a
            href="https://play.google.com/store/apps/details?id=com.cystack.locker&pli=1"
            target="_blank"
            rel="noopener"
          >
            <img
              src="~/assets/images/landing/index/GooglePlay.svg"
              alt=""
              style="height: 50px"
              class="mx-auto"
            >
          </a>
        </div>
        <!--  Google Play end -->

        <!-- AppStore -->
        <div style="width: 160px" class="mb-4">
          <a
            href="https://apps.apple.com/us/app/locker-password-manager/id1586927301"
            target="_blank"
            rel="noopener"
          >
            <img
              src="~/assets/images/landing/index/AppStore.svg"
              alt=""
              style="height: 50px"
              class="mx-auto"
            >
          </a>
        </div>
        <!-- AppStore end -->
      </div>
    </section>
    <!-- Ratings end -->

    <!-- Pricing -->
    <section class="py-20">
      <div class="text-center mb-20">
        <h2 class="landing-font-38 font-semibold mb-6">
          {{ $t('promo.buy13.pricing.title') }}
        </h2>
        <p class="landing-font-18">
          {{ $t('promo.buy13.pricing.desc') }}
        </p>
      </div>

      <div class="flex flex-wrap">
        <!-- Table -->
        <div class="w-full md:w-7/12 pb-8 pr-0 md:pb-0 md:pr-8">
          <h3
            class="landing-font-24 font-semibold mb-6 text-center md:text-left"
          >
            {{ $t('promo.buy13.pricing.table.title') }}
          </h3>

          <div class="rounded border border-black-100 overflow-hidden">
            <table class="w-full">
              <tbody>
                <template
                  v-for="(feature, index) in $t('plan.plan_table.table')"
                >
                  <tr :key="`group_${index}`" style="background-color: #fbfaf3">
                    <td
                      colspan="100%"
                      class="py-[18px] px-6 text-green font-semibold landing-font-16"
                    >
                      {{ feature.title }}
                    </td>
                  </tr>
                  <tr :key="`spacing_${index}`">
                    <td colspan="100%" class="pb-5" />
                  </tr>
                  <tr
                    v-for="(item, idx) in feature.features"
                    :key="`content_${index}_${idx}`"
                  >
                    <td
                      class="px-6 landing-font-16 pb-5"
                      style="color: #5a6176"
                    >
                      {{ item.label }}
                    </td>
                    <td
                      v-for="(plan, ind) in item.plans.slice(1, 2)"
                      :key="ind"
                      class="text-center pb-5 pr-6"
                    >
                      <div
                        v-if="plan === true"
                        class="mx-auto rounded-full bg-green-50 h-6 w-6"
                      >
                        <i class="text-primary el-icon-check !font-bold" />
                      </div>
                      <div
                        v-else-if="plan === false"
                        class="mx-auto rounded-full bg-[#F5F6F7] h-6 w-6"
                      >
                        <i class="text-danger el-icon-close !font-bold" />
                      </div>
                      <p v-else v-html="plan" />
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Table end -->

        <!-- Price -->
        <div class="w-full md:w-5/12">
          <h3
            class="landing-font-24 font-semibold mb-6 text-center md:text-left"
          >
            {{ $t('promo.buy13.pricing.price.title') }}
          </h3>

          <div class="rounded border border-black-100 py-8 px-6 mb-6">
            <p class="landing-font-28 font-semibold mb-2">Premium</p>

            <p class="landing-font-16 font-semibold mb-2">
              ({{ $t('common.only') }} $1.66/{{ $tc('common.month', 1) }})
            </p>

            <p>
              <span class="landing-font-16 text-black-500 line-through">$4.99/{{ $tc('common.month', 1) }}</span>
              <span class="landing-font-34 text-primary font-semibold">
                $4.99
              </span>
              <span class="landing-font-16 text-primary font-semibold">
                / 3 {{ $tc('common.month', 3) }}
              </span>
            </p>

            <div class="mb-6 mt-6 flex-grow">
              <div v-for="feature in features" :key="feature" class="flex">
                <i class="text-primary el-icon-check !font-bold mt-1.5" />
                <div class="ml-2">
                  {{ $t(`data.plans.features.${feature}`) }}
                </div>
              </div>
            </div>

            <el-button type="primary" class="w-full" @click="openPayment">
              {{ $t('promo.buy13.common.buy_now') }} <i class="el-icon-right" />
            </el-button>
          </div>

          <div
            class="flex justify-around items-center mb-6 rounded-lg py-5 border border-primary"
          >
            <div
              v-for="key in Object.keys(remainingTime)"
              :key="key"
              class="text-center w-[55px]"
            >
              <p class="landing-font-42 font-bold text-primary">
                {{ remainingTime[key] }}
              </p>
              <p class="font-semibold">
                {{ $t(`promo.buy13.common.clock.${key}`) }}
              </p>
            </div>
          </div>
        </div>
        <!-- Price end -->
      </div>
    </section>
    <!-- Pricing end -->

    <!-- Questions -->
    <section id="questions" class="py-20">
      <h2 class="landing-font-34 font-bold mb-20">
        {{ $t('promo.buy13.question.title') }}
      </h2>
      <el-collapse accordion>
        <el-collapse-item
          v-for="(qa, index) in $t('promo.buy13.question.question_list')"
          :key="index"
          :name="index"
          class="border-b border-black-100"
        >
          <div slot="title" class="py-6" style="margin-left: -1.25rem">
            <p class="landing-font-18 font-bold text-black">
              {{ qa.question }}
            </p>
          </div>

          <div>
            <p class="landing-font-16 text-black-600" v-html="qa.answer" />
          </div>
        </el-collapse-item>
      </el-collapse>
    </section>
    <!-- Questions end -->

    <!-- Footer -->
    <promo-footer />
    <!-- Footer end -->

    <payment-dialog ref="payment" />
  </div>
</template>

<script>
import PromoFooter from '../../components/landing/PromoFooter.vue'
import PaymentDialog from '../../components/pages/promo/PaymentDialog.vue'
export default {
  components: { PromoFooter, PaymentDialog },

  layout: 'authenticate',

  middleware: ['onlyEng'],

  async asyncData ({ $axios }) {
    // Get testimonials
    const _getTestimonials = async () => {
      try {
        const res = await $axios.get(`${process.env.baseUrl}/api/testimonials`)
        if (!res.data?.data) {
          return {
            testimonials: []
          }
        }
        return {
          testimonials: res.data.data
            .filter(t => t.Status === 'Active')
            .map(t => {
              let rating = 5
              try {
                rating = parseInt(t.Rating)
              } catch (error) {
                //
              }
              return {
                ...t,
                Rating: rating
              }
            })
        }
      } catch (error) {
        // console.log(error)
      }
    }

    const testimonialRes = await _getTestimonials()

    return testimonialRes
  },

  data () {
    return {
      testimonials: [],
      features: [
        'unlimited_storage',
        'sync_devices_unlimited',
        'auto_fill',
        'authenticator',
        'password_generator',
        'password_health',
        'data_breach',
        'emergency_access',
        'share_passwords',
        'private_email_unlimited'
      ],
      remainingTime: {
        days: 0,
        hours: 0,
        mins: 0,
        secs: 0
      },
      timeInterval: null
    }
  },

  head () {
    const title = this.$t('promo.buy13.title')
    const desc = this.$t('promo.buy13.desc')
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
      ],
      script: [
        {
          src: '//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js',
          async: true
        },
        { src: 'https://js.stripe.com/v3/' }
      ]
    }
  },

  mounted () {
    this.updateRemainingTime()
    this.timeInterval = setInterval(() => {
      this.updateRemainingTime()
    }, 1000)
  },

  beforeDestroy () {
    clearInterval(this.timeInterval)
  },

  methods: {
    updateRemainingTime () {
      // 15/06/2023
      const endTime = this.$moment(1686762000000)
      const currentTime = this.$moment()
      while (currentTime.diff(endTime) > 0) {
        endTime.add(14, 'days')
      }
      const diff = this.$moment.duration(endTime.diff(currentTime))
      this.remainingTime = {
        days: diff.days(),
        hours: diff.hours(),
        mins: diff.minutes(),
        secs: diff.seconds()
      }
    },

    openPayment () {
      this.$refs.payment.openDialog()
    }
  }
}
</script>

<style>
#questions .el-collapse-item__header {
  height: auto !important;
}
#promo-header {
  background-image: url(~assets/images/pages/promo/buy13/header-cover.png);
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
