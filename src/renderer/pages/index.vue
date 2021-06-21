<template>
  <div>
    <!-- Header -->
    <section class="bg-white pt-36">
      <div class="w-5/6 mx-auto">
        <h1 class="text-center font-bold text-black landing-font-50 mb-[24px]">
          Tận hưởng trải nghiệm sử dụng internet an toàn và liền mạch
        </h1>

        <p class="text-center font-normal text-black-600 leading-[30px] landing-font-18 max-w-[540px] mx-auto mb-[36px]">
          Locker giúp bạn lưu trữ dữ liệu quan trọng an toàn, quản lý
          mật khẩu trực quan, và tự động đăng nhập trên mọi thiết bị.
        </p>

        <div class="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center">
          <div class="mb-4 sm:mb-0">
            <a
              class="landing-btn landing-bg-green hover:opacity-80 w-full sm:w-auto mb-1"
              href="#"
            >
              Start free trial
            </a>
            <p class="italic w-full text-center landing-font-14">
              Miễn phí vĩnh viễn
            </p>
          </div>
          <div>
            <a
              class="landing-btn bg-black hover:opacity-80 w-full sm:w-auto sm:ml-4"
              href="#"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>

      <div class="w-full mt-[60px]">
        <el-carousel height="440px">
          <el-carousel-item
            v-for="item in 4"
            :key="item"
          >
            <div class="w-full">
              <img
                class="h-full mx-auto"
                src="~/assets/images/landing/demo/header-1.png"
                :alt="item"
              >
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </section>
    <!-- Header end -->

    <!-- Feature -->
    <section
      id="feature"
      class="mt-36"
    >
      <div class="w-8/12 mx-auto py-[170px]">
        <h2 class="md:max-w-[490px] text-black font-bold landing-font-32 mb-10">
          Lưu trữ mật khẩu của bạn tại một không gian bảo mật duy nhất
        </h2>

        <div class="w-full flex flex-wrap">
          <div
            v-for="(item, index) in features"
            :key="index"
            class="w-full md:w-1/2"
          >
            <img
              :src="item.img"
              :alt="item.title"
              class="h-[40px] mb-[16px]"
            >
            <h3 class="mb-[12px] font-bold text-black landing-font-20">
              {{ item.title }}
            </h3>
            <p class="md:max-w-[265px] md:pr-[20px] mb-[40px]">
              {{ item.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <!-- Feature end -->

    <!-- CTA 1 -->
    <section class="mt-36">
      <div
        class="w-full rounded py-[40px] px-[65px] flex justify-between align-middle md:flex-row flex-col"
        style="background-color: #F8F8F9"
      >
        <p class="md:max-w-[490px] md:text-left md:mb-0 landing-font-28 max-w-max text-center mb-6">
          Khám phá công nghệ chúng tôi sử dụng để bảo mật dữ liệu của bạn
        </p>

        <a
          class="landing-btn landing-bg-green hover:opacity-80"
          href="#"
          style="align-self: center"
        >
          Xem thêm
        </a>
      </div>
    </section>
    <!-- CTA 1 end -->

    <!-- Platforms -->
    <section class="mt-36">
      <div class="w-8/12 mx-auto">
        <h2 class="text-center font-bold text-black landing-font-38 mb-[14px]">
          Sử dụng trên mọi thiết bị và nền tảng
        </h2>
        <p class="text-center text-black-600 leading-[26px] landing-font-18 mx-auto mb-[60px]">
          Locker hoạt động trên mọi thiết bị, hệ điều hành, nền tảng phổ biến mà bạn sử dụng!
        </p>
      </div>

      <div class="w-8/12 mx-auto flex align-middle justify-between flex-col md:flex-row">
        <div
          v-for="(item, index) in platforms.slice(0, 4)"
          :key="index"
          class="mb-9"
        >
          <img
            :src="item.imgGray || item.img"
            :alt="item.name"
            class="mx-auto"
            style="height: 70px"
          >
        </div>
      </div>

      <div class="w-11/12 mx-auto flex align-middle justify-between flex-col md:flex-row">
        <div
          v-for="(item, index) in platforms.slice(4, 9)"
          :key="index"
          class="mb-9"
        >
          <img
            :src="item.imgGray || item.img"
            :alt="item.name"
            class="mx-auto"
            style="height: 70px"
          >
        </div>
      </div>

      <div class="w-4/12 mx-auto flex align-middle justify-between flex-col md:flex-row">
        <div
          v-for="(item, index) in platforms.slice(9, 11)"
          :key="index"
          class="mb-9"
        >
          <img
            :src="item.imgGray || item.img"
            :alt="item.name"
            class="mx-auto"
            style="height: 70px"
          >
        </div>
      </div>
    </section>
    <!-- Platforms end -->

    <!-- Benefits -->
    <section class="mt-32">
      <div class="w-full flex flex-wrap">
        <!-- Left -->
        <div class="w-full md:w-1/2 pr-0 md:pr-4">
          <h2 class="font-bold landing-font-32 text-black mb-[30px]">
            Không còn phải stress vì quên mật khẩu. Hãy dành tâm trí cho những việc quan trọng!
          </h2>

          <div
            v-for="(item, index) in benefits"
            :key="index"
          >
            <h3 class="font-bold text-black landing-font-20 mb-[12px]">
              {{ item.title }}
            </h3>
            <p class="text-black-600 landing-font-16 mb-[30px]">
              {{ item.desc }}
            </p>
          </div>
        </div>
        <!-- Left end -->

        <!-- Right -->
        <div class="w-full md:w-1/2 pl-0 md:pl-4 flex align-middle justify-center">
          <img
            src="~/assets/images/landing/demo/benefit-1.png"
            alt=""
            style="align-self: center"
          >
        </div>
        <!-- Right end -->
      </div>
    </section>
    <!-- Benefits end -->

    <!-- CTA 2 -->
    <section class="mt-36">
      <div
        class="w-full rounded py-[40px] px-[65px] flex justify-between align-middle md:flex-row flex-col"
        style="background-color: #F8F8F9"
      >
        <p class="md:max-w-[520px] md:text-left md:mb-0 landing-font-28 max-w-max text-center mb-6">
          Mang lại trải nghiệm internet an toàn hơn, tốt hơn cho tất cả mọi người.
        </p>

        <a
          class="landing-btn landing-bg-green hover:opacity-80"
          href="#"
          style="align-self: center"
        >
          Tìm hiểu lợi ích
        </a>
      </div>
    </section>
    <!-- CTA 2 end -->

    <!-- Why -->
    <section class="mt-36">
      <div class="w-full md:w-9/12 mb-14">
        <h2 class="font-bold landing-font-32 text-black">
          Tại sao sử dụng Locker thay vì trình quản lý mật khẩu của trình duyệt (Chrome, Safari, Firefox)?
        </h2>
      </div>

      <div class="w-full relative">
        <img
          src="~/assets/images/landing/dots.svg"
          alt="dots"
          class="absolute right-8 -top-10 z-0 h-auto w-auto hidden md:block"
        >

        <div class="w-full md:w-11/12 bg-white relative z-10">
          <table class="w-full">
            <tbody>
              <template v-for="(label, index) in why.labels">
                <tr
                  :key="index"
                  class="md:hidden"
                >
                  <td
                    colspan="2"
                    class="landing-font-18 font-bold p-4 text-center border"
                    style="background-color: #F6F7F8"
                  >
                    {{ label }}
                  </td>
                </tr>
                <tr :key="index">
                  <td class="lg:min-w-[200px] min-w-[120px] landing-font-18 pr-4 py-4 align-top hidden md:table-cell">
                    {{ label }}
                  </td>
                  <td class="landing-font-16 text-black-600 px-8 py-4 align-top border-l md:border-l-0">
                    {{ why.browser[index] }}
                  </td>
                  <td class="landing-font-16 px-8 py-4 align-top border-l border-r md:border-r-0">
                    {{ why.locker[index] }}
                  </td>
                </tr>
              </template>

              <tr class="border-b md:border-b-0">
                <td class="hidden md:table-cell" />
                <td class="border-l md:border-l-0" />
                <td class="landing-font-18 px-8 py-4 align-top border-l uppercase border-r md:border-r-0">
                  <a
                    href=""
                    class="hover:no-underline"
                  >
                    Khám phá tính năng <i class="el-icon-right" />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <!-- Why end -->

    <!-- Start -->
    <section class="mt-36">
      <div class="w-full md:w-10/12 mx-auto">
        <h2 class="text-center font-bold landing-font-38 md:mb-20 mb-16">
          Bắt đầu với Locker
        </h2>

        <div class="w-full md:w-10/12 mx-auto flex flex-wrap relative">
          <img
            src="~/assets/images/landing/dots.svg"
            alt="dots"
            class="absolute -left-16 -top-10 z-0 h-auto w-auto hidden md:block"
          >

          <div
            v-for="(item, index) in start"
            :key="index"
            class="p-10 w-full md:w-1/2 bg-white relative z-10"
          >
            <img
              :src="item.img"
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
              <a
                :class="index === 0 ? 'landing-bg-green' : 'bg-black'"
                class="landing-btn hover:opacity-80 mx-auto"
                :href="item.btn.link"
                style="align-self: center"
              >
                {{ item.btn.text }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Start end -->
  </div>
</template>

<script>
export default {
  layout: 'landing',
  data () {
    return {
      features: [
        {
          img: require('~/assets/images/landing/feature-1.svg'),
          title: 'Mã hóa AES-256',
          desc: 'Locker mã hóa dữ liệu của bạn theo tiêu chuẩn quân đội. Không ai có thể giải mã, ngoài bạn.'
        },
        {
          img: require('~/assets/images/landing/feature-2.svg'),
          title: 'Zero-knowledge',
          desc: 'Công nghệ Zero-knowledge giúp phòng chống khả năng hacker tấn công vào hệ thống Locker.'
        },
        {
          img: require('~/assets/images/landing/feature-3.svg'),
          title: 'Security Audit',
          desc: 'Được kiểm tra bảo mật bởi đội ngũ pentester xuất sắc tại CyStack Security.'
        },
        {
          img: require('~/assets/images/landing/feature-4.svg'),
          title: 'Bug Bounty',
          desc: 'Được kiểm thử bảo mật bởi cộng đồng chuyên gia 1500+ thành viên đảm bảo mức độ bảo mật cao nhất.'
        }
      ],
      platforms: [
        {
          name: 'Windows',
          imgGray: require('~/assets/images/landing/logo/windows-gray.png'),
          img: ''
        },
        {
          name: 'MacOS',
          imgGray: require('~/assets/images/landing/logo/mac-gray.png'),
          img: ''
        },
        {
          name: 'Linux',
          imgGray: require('~/assets/images/landing/logo/linux-gray.png'),
          img: ''
        },
        {
          name: 'Ubuntu',
          imgGray: require('~/assets/images/landing/logo/ubuntu-gray.png'),
          img: ''
        },
        {
          name: 'Chrome',
          imgGray: require('~/assets/images/landing/logo/chrome-gray.png'),
          img: ''
        },
        {
          name: 'Safari',
          imgGray: require('~/assets/images/landing/logo/safari-gray.png'),
          img: ''
        },
        {
          name: 'Firefox',
          imgGray: '',
          img: require('~/assets/images/landing/logo/firefox.png')
        },
        {
          name: 'Brave',
          imgGray: require('~/assets/images/landing/logo/brave-gray.png'),
          img: ''
        },
        {
          name: 'Opera',
          imgGray: require('~/assets/images/landing/logo/opera-gray.png'),
          img: ''
        },
        {
          name: 'iOS',
          imgGray: require('~/assets/images/landing/logo/ios-gray.png'),
          img: ''
        },
        {
          name: 'Android',
          imgGray: require('~/assets/images/landing/logo/android-gray.png'),
          img: ''
        }
      ],
      benefits: [
        {
          img: require('~/assets/images/landing/demo/benefit-1.png'),
          title: 'Đăng nhập 1 chạm',
          desc: 'Đăng nhập mọi trang web dễ dàng chỉ với 1-click chuột, đăng nhập bằng FaceID và TouchID trên smartphone. Bạn không cần phải nhớ hay gõ mật khẩu như trước đây!'
        },
        {
          img: require('~/assets/images/landing/demo/benefit-1.png'),
          title: 'Mua sắm online nhanh chóng',
          desc: 'Tự động điền thông tin thẻ thanh toán vào trang mua sắm trực tuyến. Tiết kiệm công sức đọc và điền số thẻ Visa/Mastercard.'
        },
        {
          img: require('~/assets/images/landing/demo/benefit-1.png'),
          title: 'Tiết kiệm thời gian',
          desc: 'Locker giúp bạn tiết kiệm thời gian nhập mật khẩu, điền thông tin thẻ tín dụng, thông tin cá nhân. Giúp bạn dành thời gian cho những việc có ý nghĩa.'
        },
        {
          img: require('~/assets/images/landing/demo/benefit-1.png'),
          title: 'Chia sẻ mật khẩu',
          desc: 'Chia sẻ mật khẩu với nhóm làm việc của bạn một cách an toàn và bảo mật. Hỗ trợ mã hóa đầu cuối và quản lý các mật khẩu chia sẻ của bạn.'
        }
      ],
      why: {
        labels: [
          'Mức độ bảo mật',
          'Khả năng quản lý',
          'Tính năng đa dạng',
          'Sử dụng đa nền tảng'
        ],
        browser: [
          'Trình quản lý mật khẩu của trình duyệt lưu mật khẩu của bạn trên server. Hacker có thể chiếm được mật khẩu của bạn khi chúng hack được tình duyệt.',
          'Trình quản lý mật khẩu mặc định của trình duyệt không có khả năng quản lý mật khẩu theo thư mục.',
          'Trình quản lý mật khẩu của trình duyệt không hỗ trợ các tính năng nâng cao.',
          'Chrome Password Manager chỉ sử dụng được trên trình duyệt Google Chrome.'
        ],
        locker: [
          'Locker sử dụng công nghệ Zero-trust để bảo vệ dữ liệu của bạn. Ngay cả khi hacker xâm nhập được vào phần mềm, chúng cũng không thể xem được mật khẩu và các thông tin quan trọng của bạn.',
          'Locker cho phép quản lý theo thư mục, loại tệp, giúp bạn dễ dàng quản lý trực quan mật khẩu của mình.',
          'Locker cung cấp các tính năng đặc biệt như báo cáo bảo mật, chia sẻ mật khẩu cho gia đình, nhóm làm việc.',
          'Bạn có thể sử dụng Locker trên mọi trình duyệt, hệ điều hành, thiết bị phổ biến thay vì chỉ Google Chrome.'
        ]
      },
      start: [
        {
          img: require('~/assets/images/landing/start-personal.png'),
          title: 'Cá nhân',
          desc: 'Miễn phí vĩnh viễn. Khả năng lưu trữ không giới hạn mật khẩu và đồng bộ hóa nhiều thiết bị.',
          btn: {
            text: 'Đăng ký',
            link: '#'
          }
        },
        {
          img: require('~/assets/images/landing/start-business.png'),
          title: 'Doanh nghiệp',
          desc: 'Dùng thử 7 ngày các tính năng quản lý và thiết lập chính sách mật khẩu cho đội ngũ của bạn.',
          btn: {
            text: 'Xem thêm',
            link: '#'
          }
        }
      ]
    }
  }
}
</script>

<style scoped>
#feature {
  background-image: url("~assets/images/landing/bg/locker-bg.svg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
