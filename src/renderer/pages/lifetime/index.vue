<template>
  <div>
    <!-- Testimonials -->
    <section class="md:mt-36 mt-24">
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
    <section class="mt-24">
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

    <!-- Benefits -->
    <section class="w-full py-[80px] max-w-6xl mx-auto px-6">
      <div class="w-full flex flex-row items-center justify-center mb-[80px]">
        <h2 class="text-black font-bold text-[48px] leading-[58px]">
          {{ $t('lifetime.redeem_page.benefits.title') }}
        </h2>
        <img
          class="h-14 ml-2.5"
          src="~/assets/images/landing/lifetime/success.png"
        >
      </div>

      <div
        class="sm:grid md:grid-cols-4 sm:grid-cols-2 flex flex-col gap-x-6 gap-y-6"
      >
        <div
          v-for="(item, index) in $t('lifetime.redeem_page.benefits.items')"
          :key="index"
        >
          <img
            class="h-16 mb-6"
            :src="
              require(`~/assets/images/landing/lifetime/benefits/${
                index + 1
              }.svg`)
            "
          >
          <p class="font-bold text-[20px] mb-3">
            {{ item.title }}
          </p>
          <p>
            {{ item.desc }}
          </p>
        </div>

        <div
          class="col-span-2 md:px-6 flex flex-col items-start justify-center"
        >
          <img
            class="h-16 mb-6"
            src="~/assets/images/landing/lifetime/benefits/more.svg"
          >
          <p class="font-bold text-[20px]">
            {{ $t('lifetime.redeem_page.benefits.more_features') }}
          </p>
        </div>
      </div>
    </section>
    <!-- Benefits end -->

    <!--Devices-->
    <section class="full-width h-auto" style="background: #ffffff">
      <div
        class="hidden lg:flex w-full h-auto text-center pt-10 mb-24 justify-items-end justify-center gap-x-6 overflow-hidden"
      >
        <img
          id="mobile"
          :src="
            require(`~/assets/images/landing/index/${$t(
              'landing.section1.image'
            )}`)
          "
          class="inline self-end"
          style="width: 40%"
        >
      </div>
    </section>
    <!-- Devices end -->

    <!-- Platforms -->
    <section class="mt-7">
      <div class="w-full lg:w-8/12 mx-auto mb-[100px]">
        <h2 class="text-center font-bold text-black landing-font-38 mb-[14px]">
          {{ $t('landing.platform.title') }}
        </h2>
        <p
          class="text-center text-black-600 leading-[26px] landing-font-18 mx-auto mb-[42px]"
        >
          {{ $t('landing.platform.desc') }}
        </p>
      </div>
      <div
        class="w-full lg:w-8/12 mx-auto align-start grid sm:grid-cols-3 grid-cols-2"
      >
        <div
          v-for="(item, index) in $t('landing.platform.platforms')"
          :key="index"
          class="opacity-90 mb-[80px]"
        >
          <a
            v-if="!!item.href"
            :href="item.href || '#'"
            :target="item.href ? '_blank' : '_self'"
            class="flex sm:flex-row flex-col justify-center items-center"
          >
            <div
              class="rounded-full shadow-md w-[80px] h-[80px] justify-center items-center flex sm:mr-5 mr-0 mb-5 sm:mb-0"
            >
              <img
                :src="require(`~/assets/images/landing/index/${item.img}`)"
                :alt="item.name"
                class="mx-auto self-center max-w-[42px] max-h-[42px]"
              >
            </div>

            <p
              class="landing-font-16 font-semibold text-black self-center sm:mt-0 mt-2 w-[70px] text-center sm:text-left"
            >
              {{ item.name }}
            </p>
          </a>
        </div>
      </div>
    </section>
    <!-- Platforms end -->
  </div>
</template>

<script>
export default {
  layout: 'landing',

  data () {
    return {
      testimonials: []
    }
  },

  mounted () {
    this.getTestimonials()
  },

  methods: {
    async getTestimonials () {
      try {
        const res = await this.$axios.get(
          `${process.env.baseUrl}/api/testimonials`
        )
        if (!res.data?.data) {
          return {
            testimonials: []
          }
        }
        this.testimonials = res.data.data
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
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped></style>
