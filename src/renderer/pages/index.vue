<template>
  <div>
    <!-- Header -->
    <section
      class="full-width h-auto"
      style="background: #fbfaf3"
    >
      <div class="md:pt-[186px] pt-28 mx-auto pl-6 md:pb-32 pb-20">
        <div class="w-full flex flex-wrap justify-end">
          <div class="lg:max-w-[570px] max-h-[485px] md:w-1/2 order-1 mb-8 md:mb-0 self-center">
            <h1 class="text-left font-bold text-black landing-font-50 mb-[24px]">
              {{ $t('landing.section1.title') }}
            </h1>
            <img
              src="~/assets/images/landing/index/boundary.svg"
              alt=""
            >
            <p
              class="text-left font-normal text-black-600 landing-font-20 mx-auto mb-[50px] mt-[18px]"
              v-html="$t('landing.section1.desc')"
            />
            <div class="max-w-xs mx-auto sm:max-w-none sm:flex">
              <div class="mb-4 sm:mb-0">
                <nuxt-link
                  class="landing-btn w-full sm:w-auto mb-1"
                  :to="localeRoute({name: $t('landing.section1.btn[0].link')})"
                >
                  {{ $t('landing.section1.btn[0].text') }}
                </nuxt-link>
                <p class="italic w-full landing-font-14 mt-1">
                  {{ $t('landing.section1.btn[0].note') }}
                </p>
              </div>
              <div>
                <nuxt-link
                  class="landing-btn2 w-full sm:w-auto sm:ml-4"
                  :to="localeRoute({name: $t('landing.section1.btn[1].link')})"
                >
                  {{ $t('landing.section1.btn[1].text') }}
                </nuxt-link>
              </div>
            </div>
          </div>
          <!-- Right -->
          <div class="hidden md:block md:w-1/2 order-2 justify-self-end top-[173px] pr-0">
            <img
              src="~/assets/images/landing/index/img_1.png"
              alt=""
              style="max-width: 120%; margin-left: 75px; max-height: 485px;"
            >
          </div>
          <div class="w-full md:hidden order-2">
            <img
              src="~/assets/images/landing/index/img_1.png"
              alt=""
            >
          </div>
          <!-- Right end -->
        </div>
      </div>
    </section>
    <!-- Header end -->

    <!-- Feature -->
    <section
      class="full-width w-full h-auto md:pb-[118px] pb-20"
      style="background-color: #f5f6f7"
    >
      <div class="max-w-6xl mx-auto px-6">
        <div class="w-full flex flex-wrap">
          <div class="w-full md:mb-0 md:pt-[115px] pt-20 text-center order-1">
            <h2 class=" w-full font-bold landing-font-38 text-black mb-[20px] max-w-[650px] mx-auto">
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
              class="landing-transition px-[30px] pt-11 bg-white rounded-lg hover:shadow-xl"
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
          </div>
          <div class="max-w-xs mx-auto sm:max-w-none order-3 mt-[60px]">
            <div class="mb-4 sm:mb-0">
              <nuxt-link
                class="landing-btn bg-green w-full sm:w-auto mb-1"
                :to="localeRoute({name: $t('landing.section2.btn.link')})"
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
    <section class="mt-[70px]">
      <div class="w-full flex flex-wrap">
        <div class="w-full md:mb-0 mt-3 md:w-1/2 self-center md:px-24 order-1">
          <h2 class="w-full font-bold landing-font-38 text-black mb-[20px]">
            {{ $t('landing.benefits[0].title') }}
          </h2>
          <p class="landing-font-18">{{ $t('landing.benefits[0].desc') }}</p>
        </div>
        <!-- Left end -->
        <!-- Right -->
        <div class="w-full md:w-1/2 pl-0 md:pl-4 pt-6 md:pt-0 flex align-middle justify-end order-2">
          <img
            :src="require(`~/assets/images/landing/index/${$t('landing.benefits[0].img')}`)"
            alt=""
            style="align-self: center"
          >
        </div>
        <!-- Right end -->
      </div>
    </section>
    <section class="mt-[75px]">
      <div class="w-full flex flex-wrap">
        <div class=" w-full md:mb-0 mt-3 md:w-1/2 md:px-20 self-center md:order-2 order-1">
          <h2 class="w-full font-bold landing-font-38 text-black mb-[20px]">
            {{ $t('landing.benefits[1].title') }}
          </h2>
          <p class="landing-font-18 md:max-w-[350px]">{{ $t('landing.benefits[1].desc') }}</p>
        </div>
        <!-- Right end -->
        <!-- Left -->
        <div class="w-full md:w-1/2 pl-0 flex order-1">
          <img
            :src="require(`~/assets/images/landing/index/${$t('landing.benefits[1].img')}`)"
            alt=""
            style="align-self: center"
          >
        </div>
        <!-- Left end -->
      </div>
    </section>
    <section class="mt-[70px]">
      <div class="w-full flex flex-wrap">
        <div class="w-full md:mb-0 mt-3 md:w-1/2 self-center md:px-24 order-1">
          <h2 class="w-full font-bold landing-font-38 text-black mb-[20px]">
            {{ $t('landing.benefits[2].title') }}
          </h2>
          <p class="landing-font-18">{{ $t('landing.benefits[2].desc') }}</p>
        </div>
        <!-- Left end -->
        <!-- Right -->
        <div class="w-full md:w-1/2 pl-0 md:pl-4 pt-6 md:pt-0 flex align-middle justify-end order-2">
          <img
            :src="require(`~/assets/images/landing/index/${$t('landing.benefits[2].img')}`)"
            alt=""
            style="align-self: center"
          >
        </div>
        <!-- Right end -->
      </div>
    </section>
    <section class="mt-[75px]">
      <div class="w-full flex flex-wrap">
        <div class="w-full md:mb-0 mt-3 md:w-1/2 md:px-20 self-center md:order-2 order-1">
          <h2 class="w-full font-bold landing-font-38 text-black mb-[20px]">
            {{ $t('landing.benefits[3].title') }}
          </h2>
          <p class="landing-font-18 md:max-w-[350px]">{{ $t('landing.benefits[3].desc') }}</p>
        </div>
        <!-- Right end -->
        <!-- Left -->
        <div class="w-full md:w-1/2 pl-0 flex order-1">
          <img
            :src="require(`~/assets/images/landing/index/${$t('landing.benefits[3].img')}`)"
            alt=""
            style="align-self: center"
          >
        </div>
        <!-- Left end -->
      </div>
    </section>
    <!-- Benefits end -->

    <!-- CTA 1 -->
    <section class="md:mt-36 mt-24">
      <div
        class="w-full rounded py-[40px] px-[65px] flex justify-between align-middle md:flex-row flex-col"
        style="background-color: #f5f6f7"
      >
        <p class=" md:max-w-[490px] md:text-left md:mb-0 landing-font-28 font-semibold max-w-max text-center mb-6 ">
          {{ $t('landing.cta1.title') }}
        </p>

        <nuxt-link
          class="landing-btn"
          :to="localeRoute({name: $t('landing.cta1.btn.link')})"
          style="align-self: center"
        >
          {{ $t('landing.cta1.btn.text') }}
        </nuxt-link>
      </div>
    </section>
    <!-- CTA 1 end -->

    <!--Devices-->
    <section
      class="full-width h-auto"
      style="background: #ffffff"
    >
      <!--      <div class="flex flex-wrap lg:justify-between justify-center xl:transform xl:-translate-y-24">-->
      <!--        <div class="w-2/12 relative">-->
      <!--          <img-->
      <!--            id="mobile"-->
      <!--            src="~/assets/images/landing/index/mobile3x.png"-->
      <!--            class="hidden lg:block pb-6 absolute bottom-0"-->
      <!--            style="width: 100%"-->
      <!--          >-->
      <!--        </div>-->
      <!--        <div class="w-4/12 relative">-->
      <!--          <img-->
      <!--            id="tablet"-->
      <!--            src="~/assets/images/landing/index/tablet3x.png"-->
      <!--            class="hidden lg:block absolute bottom-0 pb-4 right-0"-->
      <!--            style="width: 60%;"-->
      <!--          >-->
      <!--        </div>-->
      <!--        <div class="w-6/12">-->
      <!--          <img-->
      <!--            id="mac"-->
      <!--            src="~/assets/images/landing/index/mac3x.png"-->
      <!--            class="hidden lg:block"-->
      <!--            style="width: 75%; float: right"-->
      <!--          >-->
      <!--        </div>-->
      <!--        <img-->
      <!--          src="~/assets/images/landing/index/mobile_rotated.png"-->
      <!--          class="lg:hidden mx-6 my-12 w-[118px] h-[240px] self-end"-->
      <!--        >-->
      <!--        <img-->
      <!--          src="~/assets/images/landing/index/tablet_rotated.png"-->
      <!--          class="lg:hidden mx-6 my-12 w-[206px] h-[282px] self-end"-->
      <!--        >-->
      <!--        <img-->
      <!--          src="~/assets/images/landing/index/mac_rotated.png"-->
      <!--          class="lg:hidden w-[704px] h-[412px]"-->
      <!--        >-->
      <!--      </div>-->
      <div
        class="hidden lg:inline-block w-full h-auto text-center mt-20 mb-36 justify-center gap-x-6"
      >
        <div class="inline w-2/12">
          <img
            id="mobile"
            src="~/assets/images/landing/index/mobile_rotated.png"
            class="inline self-end transition duration-150 ease-in-out;"
            style="width: 8%; transform: translate3d(-120px, 30px, 0px) rotateZ(28deg);"
          >
        </div>
        <div class="inline w-2/12">
          <img
            id="tablet"
            src="~/assets/images/landing/index/tablet_rotated.png"
            class="inline self-end transition duration-150 ease-in-out;"
            style="width: 14%; transform: translate3d(180px, 50px, 0px) rotateZ(10deg);"
          >
        </div>
        <div class="inline w-8/12">
          <img
            id="mac"
            src="~/assets/images/landing/index/mac_rotated.png"
            class="inline transition duration-150 ease-in-out;"
            style="width: 50%; transform: translate3d(500px, -50px, 0px) rotateZ(-25deg);"
          >
        </div>
      </div>
      <div class="lg:hidden w-full h-[412px] mt-28 mb-16 relative">
        <img
          src="~/assets/images/landing/index/mobile_rotated.png"
          class="lg:hidden mx-6 my-12 w-[118px] h-[240px] self-end"
          style="position: absolute; left: 150px; bottom: 0px; z-index: 3;"
        >
        <img
          src="~/assets/images/landing/index/tablet_rotated.png"
          class="lg:hidden mx-6 my-12 w-[206px] h-[282px] self-end"
          style="position: absolute; z-index: 2; bottom: 0px; left: 200px;"
        >
        <img
          src="~/assets/images/landing/index/mac_rotated.png"
          class="lg:hidden w-[704px] h-[412px]"
          style="position: absolute; bottom: 40px; left: 200px;"
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
        <p class=" text-center text-black-600 leading-[26px] landing-font-18 mx-auto mb-[42px] md:max-w-[540px]">
          {{ $t('landing.platform.desc') }}
        </p>
      </div>
      <div class="w-11/12 mx-auto flex flex-wrap md:justify-between justify-center align-start">
        <div
          v-for="(item, index) in $t('landing.platform.platforms')"
          :key="index"
          class="opacity-90 mb-9 max-w-[234px] h-[75px] w-full"
        >
          <div class="flex flex-flex-nowrap">
            <div class="circle mx-5">
              <img
                :src="require(`~/assets/images/landing/index/${item.img}`)"
                :alt="item.name"
                class="max-h-full mx-auto"
                style="align-self: center; max-width: 55%; max-height: 55%;"
              >
            </div>

            <p class="landing-font-16 font-semibold text-black self-center">
              {{ item.name }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <!-- Platforms end -->

    <!-- Why -->
    <section class="md:mt-36 mt-20">
      <div class="w-full mb-14 text-center">
        <h2 class="font-bold landing-font-32 text-black mx-auto md:max-w-[950px]">
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
                <td class="landing-font-22 font-bold text-black px-8 py-4 align-top">
                  {{ $t('landing.why.column_labels[0]') }}
                </td>
                <td class="landing-font-22 font-bold text-black px-8 py-4 align-top">
                  {{ $t('landing.why.column_labels[1]') }}
                </td>
              </tr>
              <template v-for="(label, index) in $t('landing.why.labels')">
                <tr
                  :key="index"
                  class="md:hidden"
                >
                  <td
                    colspan="2"
                    class="landing-font-18 font-bold p-4 text-center"
                    style="background-color: #f6f7f8"
                  >
                    {{ label }}
                  </td>
                </tr>
                <tr
                  :key="index"
                  :style="index % 2 === 0 ? 'background-color: #FBFAF3' : ''"
                >
                  <td
                    class="lg:min-w-[200px] min-w-[120px] landing-font-16 font-semibold px-9 py-4 align-top hidden md:table-cell"
                  >
                    {{ label }}
                  </td>
                  <td class="landing-font-16 text-black-600 px-8 py-4 align-top">
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
                <td />
                <td class="landing-font-18 px-8 py-4 align-top font-semibold">
                  <nuxt-link
                    :to="localeRoute({name: $t('landing.why.btn.link')})"
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
    <div
      class="full-width w-full h-auto pb-[105px] md:mt-[150px] mt-24"
      style="background-color: #f5f6f7"
    >
      <section class="max-w-6xl mx-auto px-6">
        <div class="w-full flex flex-wrap">
          <div class="w-full md:mb-0 md:pt-[115px] pt-20 text-center order-1">
            <h2 class="w-full font-bold landing-font-38 text-black mb-[45px] max-w-[790px] mx-auto">
              {{ $t('landing.start.title') }}
            </h2>
          </div>
          <div class="w-full md:w-10/12 mx-auto flex flex-wrap order-2 gap-x-[30px] gap-y-[45px] justify-center">
            <div
              v-for="(item, index) in $t('landing.start.options')"
              :key="index"
              class=" landing-transition p-12 w-full md:w-[380px] bg-white relative z-10 rounded-xl hover:shadow-xl"
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
                  :to="localeRoute({name: item.btn.link})"
                  style="align-self: center"
                >
                  {{ item.btn.text }}
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <!-- Start end -->
  </div>
</template>

<script>
export default {
  layout: 'landing',
  data () {
    return {
      section1: {
        title: 'Tận hưởng trải nghiệm sử dụng internet an toàn và liền mạch',
        desc: 'Locker giúp bạn lưu trữ dữ liệu quan trọng <span class="text-green">an toàn</span>, quản lý mật khẩu <span class="text-green">trực quan</span>, và tự động đăng nhập trên mọi thiết bị.',
        btn: [
          {
            text: 'Cá nhân',
            link: '',
            note: 'Miễn phí vĩnh viễn'
          },
          {
            text: 'Doanh nghiệp',
            link: '',
            note: ''
          }
        ]
      },
      section2: {
        title: 'Lưu trữ mật khẩu của bạn tại một không gian bảo mật duy nhất',
        features: [
          {
            img: 'icon1.svg',
            title: 'Mã hóa dữ liệu',
            desc: 'Locker mã hóa dữ liệu của bạn theo tiêu chuẩn quân đội AES-256, kết hợp thuật toán khởi tạo cặp khóa PBKDF2 và RSA.'
          },
          {
            img: 'icon2.svg',
            title: 'Zero-knowledge',
            desc: 'Mã hóa đầu cuối và Zero-knowledge đảm bảo rằng không ai xem được dữ liệu của bạn, kể cả đội ngũ phát triển Locker.'
          },
          {
            img: 'icon3.svg',
            title: 'Hạ tầng an toàn',
            desc: 'Chúng tôi sử dụng hạ tầng máy chủ của các nhà cung cấp hàng đầu thế giới như AWS, DigitalOcean.'
          },
          {
            img: 'icon4.svg',
            title: 'Kiểm thử bảo mật',
            desc: 'Được kiểm thử an ninh bởi cộng đồng 1500+ chuyên gia bảo mật trên nền tảng WhiteHub Bug Bounty.'
          }
        ],
        btn: {
          text: 'Xem thêm',
          link: ''
        }

      },
      platform: {
        title: 'Sử dụng trên mọi thiết bị và nền tảng',
        desc: 'Locker hoạt động trên mọi thiết bị, hệ điều hành, nền tảng phổ biến mà bạn sử dụng!',
        platforms: [
          {
            name: 'Windows',
            img: 'windows.png'
          },
          {
            name: 'MacOS',
            img: 'macos.png'
          },
          {
            name: 'Linux',
            img: 'linux.png'
          },
          {
            name: 'Ubuntu',
            img: 'ubuntu.png'
          },
          {
            name: 'Chrome',
            img: 'chrome.png'
          },
          {
            name: 'Safari',
            img: 'safari.png'
          },
          {
            name: 'Firefox',
            img: 'firefox.png'
          },
          {
            name: 'Microsoft Edge',
            img: 'edge.png'
          },
          {
            name: 'Cốc Cốc',
            img: 'coccoc.png'
          },
          {
            name: 'Opera',
            img: 'opera.png'
          },
          {
            name: 'iOS',
            img: 'ios.png'
          },
          {
            name: 'Android',
            img: 'android.png'
          }
        ]
      },

      benefits: [
        {
          img: 'img1.png',
          title: 'Đăng nhập dễ dàng',
          desc: 'Đăng nhập mọi trang web dễ dàng chỉ với vài click chuột, đăng nhập bằng FaceID và TouchID trên smartphone. Bạn không cần phải nhớ hay gõ mật khẩu như trước đây!'
        },
        {
          img: 'img2.png',
          title: 'Mua sắm online nhanh chóng',
          desc: 'Tự động điền thông tin thẻ thanh toán vào trang mua sắm trực tuyến. Tiết kiệm công sức đọc và điền số thẻ Visa/Mastercard.'
        },
        {
          img: 'img3.png',
          title: 'Tiết kiệm thời gian',
          desc: 'Locker giúp bạn tiết kiệm thời gian nhập mật khẩu, điền thông tin thẻ tín dụng, thông tin cá nhân. Giúp bạn dành thời gian cho những việc có ý nghĩa.'
        },
        {
          img: 'img4.png',
          title: 'Chia sẻ mật khẩu',
          desc: 'Chia sẻ mật khẩu với nhóm làm việc của bạn một cách an toàn và bảo mật. Hỗ trợ mã hóa đầu cuối và quản lý các mật khẩu chia sẻ của bạn.'
        }
      ],
      cta1: {
        title: 'Mang lại trải nghiệm internet an toàn hơn, tốt hơn cho tất cả mọi người.',
        btn: {
          text: 'Tìm hiểu lợi ích',
          link: 'how-it-works'
        }
      },
      why: {
        title: 'Tại sao sử dụng Locker thay vì công cụ quản lý mật khẩu tích hợp trong trình duyệt?',
        column_labels: [
          'Trình quản lý thông thường',
          'Trình quản lý mật khẩu Locker'
        ],
        labels: [
          'Mức độ bảo mật',
          'Khả năng quản lý',
          'Tính năng đa dạng',
          'Sử dụng đa nền tảng'
        ],
        browser: [
          'Công cụ quản lý mật khẩu của trình duyệt lưu mật khẩu của bạn trên server. Hacker có thể chiếm được mật khẩu của bạn khi chúng hack được tình duyệt.',
          'Trình quản lý mật khẩu mặc định của trình duyệt không có khả năng quản lý mật khẩu theo thư mục.',
          'Trình quản lý mật khẩu của trình duyệt không hỗ trợ các tính năng tiện ích.',
          'Công cụ quản lý mật khẩu của trình duyệt giới hạn bạn trong hệ sinh thái của họ.'
        ],
        locker: [
          'Locker sử dụng mã hóa đầu cuối và Zero-knowledge để bảo vệ dữ liệu của bạn. Ngay cả khi hacker xâm nhập được vào phần mềm, chúng cũng không thể xem được dữ liệu.',
          'Locker cho phép quản lý theo thư mục, loại tệp, giúp bạn dễ dàng sắp xếp và tìm kiếm mật khẩu của mình.',
          'Locker cho phép quản lý theo thư mục, loại tệp, giúp bạn dễ dàng sắp xếp và tìm kiếm mật khẩu của mình.',
          'Bạn có thể sử dụng Locker trên mọi trình duyệt, hệ điều hành, thiết bị phổ biến.'
        ],
        btn: {
          text: 'Khám phá tính năng',
          link: ''
        }
      },
      start: {
        title: 'Trải nghiệm internet an toàn hơn, tiện nghi hơn với Locker Password Manager',
        options: [
          {
            img: 'start-personal.png',
            title: 'Cá nhân',
            desc: 'Miễn phí vĩnh viễn. Lưu trữ mật khẩu, thẻ tín dụng, ghi chú cá nhân và sử dụng trên mọi thiết bị.',
            btn: {
              text: 'Đăng ký miễn phí',
              link: ''
            }
          },
          {
            img: 'start-business.png',
            title: 'Doanh nghiệp',
            desc: 'Dùng thử 10 ngày. Chia sẻ mật khẩu an toàn, thiết lập chính sách và quản lý bảo mật cho đơn vị của bạn.',
            btn: {
              text: 'Bắt đầu dùng thử',
              link: ''
            }
          }
        ]
      }

    }
  },
  mounted () {
    const mac = document.getElementById('mac')
    const mobile = document.getElementById('mobile')
    const tablet = document.getElementById('tablet')
    window.onscroll = function () {
      const scrollPos = window.scrollY
      if (scrollPos > 3800 && scrollPos < 4100) {
        scrollRotate()
      } else if (scrollPos > 4100) {
        mac.style.transform = 'translate3d(0px,0px,0px) rotateZ(0deg)'
        tablet.style.transform = 'translate3d(0px,60px,0px) rotateZ(0deg)'
        mobile.style.transform = 'translate3d(0px,80px,0px) rotateZ(0deg)'
      } else {
        mac.style.transform = 'translate3d(500px,-50px,0px) rotateZ(-25deg)'
        mobile.style.transform = 'translate3d(-120px,30px,0px) rotateZ(28deg)'
        tablet.style.transform = 'translate3d(180px,50px,0px) rotateZ(10deg)'
      }
    }

    function scrollRotate () {
      const offset = window.pageYOffset - 3800
      const macXAxis = 480 - Math.ceil(480 * offset / 300)
      const macYAxis = Math.ceil(50 * offset / 300) - 50
      const macZRotate = Math.ceil(25 * offset / 300) - 25
      mac.style.transform = 'translate3d(' + macXAxis + 'px,' + macYAxis + 'px,0px) rotateZ(' + macZRotate + 'deg)'

      const mobileXAxis = Math.ceil(120 * offset / 300) - 120
      const mobileYAxis = 30 - Math.ceil(30 * offset / 300)
      const mobileZRotate = 28 - Math.ceil(28 * offset / 300)
      mobile.style.transform = 'translate3d(' + mobileXAxis + 'px,' + mobileYAxis + 'px,0px) rotateZ(' + mobileZRotate + 'deg)'

      const tabletXAxis = 180 - Math.ceil(180 * offset / 300)
      const tabletYAxis = 50 - Math.ceil(50 * offset / 300)
      const tabletZRotate = 10 - Math.ceil(10 * offset / 300)
      tablet.style.transform = 'translate3d(' + tabletXAxis + 'px,' + tabletYAxis + 'px,0px) rotateZ(' + tabletZRotate + 'deg)'
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
</style>
