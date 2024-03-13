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
                  :alt="item.Source"
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
    <section v-if="!hideRatings" class="mt-14">
      <div class="mx-auto">
        <h2 class="text-center font-bold text-black landing-font-38 mb-8">
          {{ $t('landing.testimonials.we_are_on') }}
        </h2>
      </div>

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
  </div>
</template>
<script>
export default {
  props: {
    hideRatings: {
      type: Boolean,
      default: () => false
    }
  },

  data () {
    return {
      testimonials: []
    }
  },

  head () {
    return {
      script: [
        {
          src: '//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js',
          async: true
        }
      ]
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
