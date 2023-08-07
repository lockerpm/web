<template>
  <div>
    <!-- Header -->
    <section class="full-width h-auto" style="background: #fbfaf3">
      <div class="md:pt-[186px] pt-28 max-w-6xl px-6 mx-auto md:pb-32 pb-20">
        <div class="w-full flex flex-wrap">
          <!-- Left -->
          <div class="md:w-1/2 mb-8 md:mb-0 md:pr-4">
            <h1
              class="text-center sm:text-left font-bold text-black landing-font-50 mb-[24px]"
            >
              {{ $t('landing.section1.title') }}
            </h1>
            <img
              src="~/assets/images/landing/index/boundary.svg"
              class="hidden sm:block"
            >
            <img
              src="~/assets/images/landing/index/boundary2.svg"
              class="mx-auto block sm:hidden"
            >
            <p
              class="text-center sm:text-left font-normal text-black-600 landing-font-20 mx-auto mb-[50px] mt-[18px]"
              v-html="$t('landing.section1.desc')"
            />
            <div class="max-w-xs mx-auto sm:max-w-none sm:flex">
              <div class="mb-4 sm:mb-0">
                <nuxt-link
                  class="landing-btn w-full sm:w-auto mb-1"
                  :to="localePath('/register')"
                >
                  {{ $t('landing.section1.btn[0].text') }}
                </nuxt-link>
              </div>
            </div>
          </div>
          <!-- Left end -->

          <!-- Right -->
          <div class="hidden md:block md:w-1/2">
            <button @click="dialogVisible = true">
              <img
                :src="require(`~/assets/images/landing/intro-thumbnail.png`)"
              >
            </button>
          </div>
          <!-- Right end -->
        </div>
      </div>
    </section>
    <!-- Header end -->

    <!-- Video intro -->
    <section>
      <div v-if="dialogVisible" class="modal" @click="dialogVisible = false">
        <div class="modal-content">
          <youtube
            :video-id="videoId"
            player-width="960"
            player-height="540"
            :player-vars="{ autoplay: 0 }"
          />
        </div>
      </div>
    </section>
    <!-- Video intro end -->

    <!-- Feature -->
    <section
      class="full-width w-full h-auto md:pb-[118px] pb-20"
      style="background-color: #f5f6f7"
    >
      <div class="max-w-6xl mx-auto px-6">
        <div class="w-full flex flex-wrap">
          <div class="w-full md:mb-0 md:pt-[115px] pt-20 text-center order-1">
            <h2
              class="w-full font-bold landing-font-38 text-black mb-[20px] max-w-[650px] mx-auto"
            >
              {{ $t('landing.section2.title') }}
            </h2>
            <img
              src="~/assets/images/landing/index/boundary2.svg"
              alt=""
              class="mx-auto"
            >
          </div>
          <div
            class="w-full mt-[45px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-[45px] lg:gap-x-[30px] gap-y-[45px] order-2"
          >
            <div
              v-for="(item, index) in $t('landing.section2.features')"
              :key="index"
              class="landing-transition bg-white rounded-lg hover:shadow-xl"
            >
              <div
                v-if="!item.link"
                class="flex flex-col text-center items-center md:items-start md:text-left px-[30px] pt-11 h-full"
              >
                <img
                  :src="require(`~/assets/images/landing/index/${item.img}`)"
                  :alt="item.title"
                  class="h-[40px] mb-[16px]"
                >
                <h3 class="mb-[12px] font-bold text-black landing-font-20">
                  {{ item.title }}
                </h3>
                <p class="lg:max-w-[265px] mb-[40px] landing-font-14">
                  {{ item.desc }}
                </p>
              </div>
              <nuxt-link
                v-if="!item.static && item.link"
                :to="localePath(`${item.link}`)"
                class="flex flex-col text-center items-center md:items-start md:text-left px-[30px] pt-11 h-full"
              >
                <img
                  :src="require(`~/assets/images/landing/index/${item.img}`)"
                  :alt="item.title"
                  class="h-[40px] mb-[16px]"
                >
                <h3 class="mb-[12px] font-bold text-black landing-font-20">
                  {{ item.title }}
                </h3>
                <p class="lg:max-w-[265px] mb-[40px] landing-font-14">
                  {{ item.desc }}
                </p>
              </nuxt-link>
              <a
                v-if="item.static && item.link"
                :href="`${item.link}`"
                class="flex flex-col text-center items-center md:items-start md:text-left px-[30px] pt-11 h-full"
              >
                <img
                  :src="require(`~/assets/images/landing/index/${item.img}`)"
                  :alt="item.title"
                  class="h-[40px] mb-[16px]"
                >
                <h3 class="mb-[12px] font-bold text-black landing-font-20">
                  {{ item.title }}
                </h3>
                <p class="lg:max-w-[265px] mb-[40px] landing-font-14">
                  {{ item.desc }}
                </p>
              </a>
            </div>
          </div>
          <div class="max-w-xs mx-auto sm:max-w-none order-3 mt-[60px]">
            <div class="mb-4 sm:mb-0">
              <nuxt-link
                class="landing-btn bg-green w-full sm:w-auto mb-1"
                :to="localeRoute({ name: $t('landing.section2.btn.link') })"
              >
                {{ $t('landing.section2.btn.text') }}
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Feature end -->

    <!-- Benefits -->
    <section>
      <div
        v-for="(item, index) in $t('landing.benefits')"
        :key="index"
        :class="index % 2 ? 'mt-[75px]' : 'mt-[70px]'"
      >
        <div class="w-full flex flex-wrap">
          <!-- Left -->
          <div
            class="w-full md:mb-0 mt-3 md:w-1/2 self-center md:px-10 lg:px-24 order-1"
            :class="index % 2 ? 'md:order-2' : ''"
          >
            <h2 class="w-full font-bold landing-font-38 text-black mb-[20px]">
              {{ item.title }}
            </h2>
            <p class="landing-font-18">{{ item.desc }}</p>
          </div>
          <!-- Left end -->

          <!-- Right -->
          <div
            class="w-full md:w-1/2 pl-0 md:pl-4 pt-6 md:pt-0 flex align-middle justify-end order-2"
            :class="index % 2 ? 'md:order-1' : ''"
          >
            <img
              :src="require(`~/assets/images/landing/index/${item.img}`)"
              :alt="item.title"
              style="align-self: center"
            >
          </div>
          <!-- Right end -->
        </div>
      </div>
    </section>
    <!-- Benefits end -->

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

    <!-- CTA 1 -->
    <section class="md:mt-36 mt-24">
      <div
        class="w-full rounded py-[40px] px-[65px] flex justify-between align-middle md:flex-row flex-col"
        style="background-color: #f5f6f7"
      >
        <p
          class="md:max-w-[490px] md:text-left md:mb-0 md:mr-4 mr-0 landing-font-28 font-semibold max-w-max text-center mb-6"
        >
          {{ $t('landing.cta1.title') }}
        </p>

        <nuxt-link
          class="landing-btn"
          :to="localeRoute({ name: $t('landing.cta1.btn.link') })"
          style="align-self: center"
        >
          {{ $t('landing.cta1.btn.text') }}
        </nuxt-link>
      </div>
    </section>
    <!-- CTA 1 end -->

    <!--Devices-->
    <section class="full-width h-auto" style="background: #ffffff">
      <div
        class="hidden lg:flex w-full h-auto text-center pt-32 mb-24 justify-items-end justify-center gap-x-6 overflow-hidden"
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
    <section class="mt-8">
      <div class="w-8/12 mx-auto">
        <h2 class="text-center font-bold text-black landing-font-38 mb-[14px]">
          {{ $t('landing.platform.title') }}
        </h2>
        <p
          class="text-center text-black-600 leading-[26px] landing-font-18 mx-auto mb-[42px] md:max-w-[540px]"
        >
          {{ $t('landing.platform.desc') }}
        </p>
      </div>
      <div
        class="w-full mx-auto md:justify-between justify-center align-start grid sm:grid-cols-3 grid-cols-2 justify-items-center"
      >
        <div
          v-for="(item, index) in $t('landing.platform.platforms')"
          :key="index"
          class="opacity-90 mb-9"
        >
          <a
            v-if="!!item.href"
            :href="item.href || '#'"
            :target="item.href ? '_blank' : '_self'"
            class="sm:flex flex-flex-nowrap text-center"
          >
            <div class="circle sm:mx-5 mx-auto">
              <img
                :src="require(`~/assets/images/landing/index/${item.img}`)"
                :alt="item.name"
                class="mx-auto self-center max-w-[42px] max-h-[42px]"
              >
            </div>

            <p
              class="landing-font-16 font-semibold text-black self-center sm:mt-0 mt-2"
            >
              {{ item.name }}
            </p>
          </a>
        </div>
      </div>
    </section>
    <!-- Platforms end -->

    <!-- Why -->
    <section class="md:mt-36 mt-20">
      <div class="w-full mb-14 text-center">
        <h2
          class="font-bold landing-font-32 text-black mx-auto md:max-w-[950px]"
        >
          {{ $t('landing.why.title') }}
        </h2>
        <img
          src="~/assets/images/landing/index/boundary3.svg"
          alt="dots"
          class="mx-auto mt-5"
        >
      </div>

      <div class="w-full relative">
        <div class="w-full bg-white relative z-10">
          <table class="w-full">
            <tbody>
              <tr class="hidden md:table-row">
                <td />
                <td
                  class="landing-font-22 font-bold text-black px-8 py-4 align-top"
                >
                  {{ $t('landing.why.column_labels[0]') }}
                </td>
                <td
                  class="landing-font-22 font-bold text-black px-8 py-4 align-top"
                >
                  {{ $t('landing.why.column_labels[1]') }}
                </td>
              </tr>
              <template v-for="(label, index) in $t('landing.why.labels')">
                <tr :key="index" class="hidden md:hidden sm:table-row">
                  <td
                    colspan="2"
                    class="landing-font-18 font-bold p-4 text-center"
                    style="background-color: #f6f7f8"
                  >
                    {{ label }}
                  </td>
                </tr>
                <tr :key="`${index}_0`" class="sm:hidden">
                  <td
                    class="landing-font-18 font-bold p-4 text-center"
                    style="background-color: #f6f7f8"
                  >
                    {{ label }}
                  </td>
                </tr>
                <tr
                  :key="`${index}_1`"
                  :style="index % 2 === 0 ? 'background-color: #FBFAF3' : ''"
                >
                  <td
                    class="lg:min-w-[200px] min-w-[120px] landing-font-16 font-semibold px-9 py-4 align-top hidden md:table-cell"
                  >
                    {{ label }}
                  </td>
                  <td
                    class="landing-font-16 text-black-600 px-8 py-4 align-top hidden sm:table-cell"
                  >
                    <div class="flex flex-flex-nowrap items-start">
                      <img
                        class="mt-[6px] mr-3"
                        src="~/assets/images/landing/index/unchecked_icon.svg"
                      >

                      <p>{{ $t(`landing.why.browser[${index}]`) }}</p>
                    </div>
                  </td>
                  <td class="landing-font-16 px-8 py-4 align-top">
                    <div class="flex flex-flex-nowrap items-start">
                      <img
                        class="mt-[6px] mr-3"
                        src="~/assets/images/landing/index/checked_icon.svg"
                      >
                      {{ $t(`landing.why.locker[${index}]`) }}
                    </div>
                  </td>
                </tr>
              </template>

              <tr class="md:border-b-0">
                <td class="hidden md:table-cell" />
                <td class="hidden sm:table-cell" />
                <td
                  class="landing-font-18 px-8 py-4 align-top font-semibold text-center sm:text-left"
                >
                  <nuxt-link
                    :to="localeRoute({ name: $t('landing.why.btn.link') })"
                    class="hover:no-underline text-green"
                  >
                    {{ $t('landing.why.btn.text') }} <i class="el-icon-right" />
                  </nuxt-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <!-- Why end -->

    <!-- Start -->
    <section
      class="full-width w-full h-auto pb-[105px] md:mt-[150px] mt-24"
      style="background-color: #f5f6f7"
    >
      <div class="max-w-6xl mx-auto px-6">
        <div class="w-full flex flex-wrap">
          <div class="w-full md:mb-0 md:pt-[115px] pt-20 text-center order-1">
            <h2
              class="w-full font-bold landing-font-38 text-black mb-[45px] max-w-[790px] mx-auto"
            >
              {{ $t('landing.start.title') }}
            </h2>
          </div>
          <div
            class="w-full md:w-10/12 mx-auto flex flex-wrap order-2 gap-x-[30px] gap-y-[45px] justify-center"
          >
            <div
              v-for="(item, index) in $t('landing.start.options')"
              :key="index"
              class="landing-transition p-12 w-full md:w-[380px] bg-white relative z-10 rounded-xl hover:shadow-xl"
            >
              <img
                :src="require(`~/assets/images/landing/index/${item.img}`)"
                :alt="item.title"
                class="mb-[20px] h-[100px] w-auto mx-auto"
              >

              <h3 class="text-center landing-font-20 font-bold mb-[11px]">
                {{ item.title }}
              </h3>

              <p class="text-center text-black-600 landing-font-16 mb-[40px]">
                {{ item.desc }}
              </p>

              <div class="w-full flex">
                <nuxt-link
                  :class="index === 0 ? 'landing-btn' : 'landing-btn2'"
                  class="mx-auto"
                  :to="localePath(item.btn.link)"
                  style="align-self: center"
                >
                  {{ item.btn.text }}
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Start end -->

    <!-- Blogs -->
    <section class="mt-20 mb-20">
      <div class="w-full mb-14">
        <h2 class="font-bold landing-font-32 text-black">
          {{ $t('landing.blogs.title') }}
        </h2>
      </div>

      <div
        v-if="posts.length"
        class="blog-container w-full grid grid-cols-1 md:grid-cols-3 gap-x-[30px] gap-y-[30px]"
      >
        <div v-for="(item, index) in posts" :key="index">
          <Post :post="item" type="blog" />
        </div>
      </div>

      <div class="w-full text-center mt-14">
        <nuxt-link
          :to="localeRoute('/blog')"
          class="text-black font-semibold transition-colors text-[16px]"
        >
          {{ $t('blog.read_more') }} <i class="el-icon-right" />
        </nuxt-link>
      </div>
    </section>
    <!-- Blogs end -->
  </div>
</template>

<script>
import axios from 'axios'
import cheerio from 'cheerio'
import Post from '~/components/landing/blog/Post'

export default {
  components: { Post },

  layout: 'landing',

  async asyncData ({ store, $axios }) {
    // Get blogs
    const _getBlogs = async () => {
      const language = store.state.i18n.locale
      let tagId
      try {
        const posts = []
        const result = await axios.get(
          `${process.env.blogUrl}/tags?slug=${language}`
        )
        tagId = result.data[0].id
        const responses = await Promise.all([
          axios.get(
            `${process.env.blogUrl}/posts?_embed=1&per_page=3&tags=${tagId}&categories=8,13,18,54,25`
          ),
          axios.get(`${process.env.blogUrl}/users`)
        ])
        const { data } = responses[0]
        const userArray = responses[1].data
        data.forEach(async post => {
          let featuredImage = ''
          try {
            featuredImage = post._embedded['wp:featuredmedia']['0'].source_url
          } catch (error) {}
          if (!featuredImage) {
            const $ = cheerio.load(post.content.rendered)
            const images = $('img').attr('src')
            if (images) {
              featuredImage = images.replace(/-[0-9]+x[0-9]+/g, '')
            }
          }
          const $_ = cheerio.load(post.excerpt.rendered)
          const desc = $_('p').text()

          posts.push({
            ...post,
            user: userArray.find(author => author.id === post.author),
            featured_image: featuredImage,
            desc
          })
        })
        return {
          posts
        }
      } catch (error) {
        // console.log(error)
      }
    }

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

    const [blogRes, testimonialRes] = await Promise.all([
      _getBlogs(),
      _getTestimonials()
    ])

    return {
      ...blogRes,
      ...testimonialRes
    }
  },

  data () {
    return {
      videoId: 'kAutqE2ATfU',
      dialogVisible: false,
      posts: [],
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
  }
}
</script>

<style scoped>
.circle {
  height: 75px;
  width: 75px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 50%;
  display: flex;
}
.modal {
  display: inline-block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1000000; /* Sit on top */
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: hidden; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.7); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-content {
  position: relative;
  background-color: #fefefe;
  margin: 12% auto; /* 15% from the top and centered */
  border: 1px solid #888;
  width: 960px;
}
</style>
<style>
.VueCarousel-dot--active {
  width: 20px !important;
  border-radius: 16px !important;
}
.VueCarousel-dot {
  transition: all 0.2s ease;
}
</style>
