<template>
  <div class="md:pt-[180px] pt-36">
    <h1 class="text-left font-bold text-black landing-font-50 lg:w-[980px]">
      Locker giúp bạn tận hưởng cuộc sống online an toàn và liền mạch
    </h1>
    <section class="md:mt-[75px] mt-8">
      <div class="w-full flex flex-wrap">
        <div class="w-full md:mb-0 mt-3 md:w-2/5 pr-0 md:pl-[110px] md:order-2 self-center order-1">
          <h2 class="w-full font-bold landing-font-38 text-black mb-[20px]">
            {{ hiw1.title }}
          </h2>
          <p class="landing-font-18">{{ hiw1.desc }}</p>
        </div>
        <!-- Right end -->
        <!-- Left -->
        <div class="w-full md:w-1/2 pl-0 md:pl-4 flexalign-middle justify-centerorder-1 ">
          <img
            :src="hiw1.img"
            alt=""
            style="align-self: center"
          >
        </div>
        <!-- Left end -->
      </div>
    </section>
    <section class="md:mt-[70px] mt-8">
      <div class="w-full flex flex-wrap">
        <div class="w-full md:mb-0 mt-3 md:w-1/3 self-center pr-0 order-1">
          <h2 class="w-full font-bold landing-font-38 text-black mb-[20px]">
            {{ hiw2.title }}
          </h2>
          <p class="landing-font-18">{{ hiw2.desc }}</p>
        </div>
        <!-- Left end -->
        <!-- Right -->
        <div class="w-full md:w-2/3 pl-0 md:pl-4 flex align-middle justify-center order-2">
          <img
            :src="hiw2.img"
            alt=""
            style="align-self: center"
          >
        </div>
        <!-- Right end -->
      </div>
    </section>
    <section class="md:mt-[111px] mt-14">
      <div class="w-full flex flex-wrap">
        <div class="w-full md:mb-0 mt-3 md:w-2/5 pr-0 md:pl-[110px] md:order-2 self-center order-1">
          <h2 class="w-full font-bold landing-font-38 text-black mb-[20px]">
            {{ hiw3.title }}
          </h2>
          <p class="landing-font-18">{{ hiw3.desc }}</p>
        </div>
        <!-- Left end -->
        <!-- Right -->
        <div class=" w-full md:w-1/2 pl-0 md:pl-4 mt-4 md:mt-0 flex align-middle justify-center order-1">
          <img
            :src="hiw3.img"
            alt=""
            style="align-self: center"
          >
        </div>
        <!-- Right end -->
      </div>
    </section>
    <section class="full-width w-full bg-how-it-works1 h-auto">
      <div class=" mt-[111px] max-w-6xl mx-auto px-6 md:pt-[100px] md:pb-20 pt-12 pb-12">
        <div class="w-full flex flex-wrap">
          <div class="w-full md:mb-0 md:w-1/3 pr-0 self-center order-1">
            <h2 class="w-full font-bold landing-font-38 text-black mb-[20px]">
              {{ hiw4.title }}
            </h2>
            <div
              v-for="(item, index) in hiw4.desc"
              :key="index"
              :class="index === 0 ? 'vertical-line' : 'opacity-50 pl-[30px]'"
            >
              <h3 class="font-bold text-black landing-font-20 mb-[12px]">
                {{ item.title }}
              </h3>
              <p class="text-black-600 landing-font-16 mb-9">
                {{ item.desc }}
              </p>
            </div>
            <div class="landing-font-18 align-top ml-[30px] mt-9">
              <a
                href=""
                class="hover:no-underline text-green font-semibold"
              >
                Xem tất cả tính năng <i class="el-icon-right" />
              </a>
            </div>
          </div>
          <!-- Left end -->
          <!-- Right -->
          <div class=" w-full md:w-2/3 pl-0 md:pl-4 flex align-middle justify-center order-2">
            <img
              :src="hiw4.img"
              alt=""
              style="align-self: center"
            >
          </div>
          <!-- Right end -->
        </div>
      </div>
    </section>
    <section class=" full-width w-full bg-how-it-works2 h-auto md:pt-[115px] pt-12 md:pb-[111px] pb-12">
      <div class="max-w-6xl mx-auto px-6">
        <div class="w-full flex flex-wrap">
          <div class="w-full md:mb-0 text-center order-1">
            <h2 class="w-full font-bold landing-font-38 text-black mb-[20px] max-w-[514px] mx-auto">
              {{ hiw5.title }}
            </h2>
            <img
              :src="hiw5.img"
              alt=""
              class="mx-auto"
            >
          </div>
          <div class=" w-full mt-[45px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-[45px] lg:gap-x-[30px] gap-y-[45px] order-2">
            <div
              v-for="(item, index) in hiw5.desc"
              :key="index"
              class="landing-transition px-[30px] pt-11 bg-white rounded-md hover:shadow-xl"
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
          <div class="w-full landing-font-18 mt-[60px] text-center order-3">
            <a
              href=""
              class="hover:no-underline text-green font-semibold"
            >
              Xem thêm cách chúng tôi bảo vệ dữ liệu của bạn
              <i class="el-icon-right" />
            </a>
          </div>
          <div class="w-full landing-font-18 mt-3 text-center order-4">
            <a
              href=""
              class="hover:no-underline text-green font-semibold"
            >
              Các tính năng bảo mật trong ứng dụng <i class="el-icon-right" />
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  layout: 'landing',
  data () {
    return {
      hiw1: {
        img: require('~/assets/images/landing/how-it-works/save_password.png'),
        title: 'Lưu mật khẩu khi bạn đăng nhập',
        desc: 'Ngay khi bạn đăng nhập một website lần đầu tiên, Locker sẽ giúp bạn lưu mật khẩu để sử dụng cho lần đăng nhập sau.'
      },
      hiw2: {
        img: require('~/assets/images/landing/how-it-works/auto_login.png'),
        title: 'Tự động đăng nhập chỉ với 1 click',
        desc: 'Locker tự động điền mật khẩu và đăng nhập vào các trang web và ứng dụng yêu thích trên PC, smartphone, tablet.'
      },
      hiw3: {
        img: require('~/assets/images/landing/how-it-works/access_anytime.png'),
        title: 'Truy cập mật khẩu mọi lúc, mọi nơi',
        desc: 'Bạn có thể truy cập mật khẩu của mình mọi lúc, mọi nơi, ngay cả khi đang không có kết nối mạng.'
      },
      hiw4: {
        img: require('~/assets/images/landing/how-it-works/save_time.png'),
        title: 'Tiết kiệm thời gian và công sức',
        desc: [
          {
            title: 'Đăng nhập nhanh hơn',
            desc: 'Tự động điền thông tin đăng nhập và mật khẩu các trang web mà bạn sử dụng chỉ với 1 click, có thể sử dụng FaceID và TouchID.'
          },
          {
            title: 'Lướt web và mua sắm dễ dàng',
            desc: 'Tự động điền thông tin thẻ thanh toán VISA/Mastercard khi bạn mua hàng online trên các trang thương mại điện tử.'
          },
          {
            title: 'Điền tờ khai nhanh chóng',
            desc: 'Bạn có thể lưu thông tin cá nhân bao gồm tên, tuổi, địa chỉ, mã ZIP,... để tự động điền vào các mẫu tờ khai trực tuyến chỉ trong 3s.'
          }
        ]
      },
      hiw5: {
        img: require('~/assets/images/landing/how-it-works/boundary.svg'),
        title: 'Dữ liệu của bạn được bảo vệ an toàn và bí mật',
        desc: [
          {
            img: require('~/assets/images/landing/how-it-works/master_password.svg'),
            title: 'Master password',
            desc: 'Mật khẩu chính là mật khẩu duy nhất bạn cần nhớ để truy cập vào mọi dữ liệu khác trong Locker.'
          },
          {
            img: require('~/assets/images/landing/how-it-works/zero_knowledge.svg'),
            title: 'Zero-knowledge',
            desc: 'Không ai có thể xem được dữ liệu của bạn, kể cả đội ngũ nhân viên Locker. Bạn là người duy nhất có thể truy cập vào dữ liệu Locker của riêng bạn.'
          },
          {
            img: require('~/assets/images/landing/how-it-works/protect.svg'),
            title: 'Bảo vệ trước tin tặc',
            desc: 'Ứng dụng được kiểm tra bảo mật định kì bởi các kĩ sư bảo mật có trình độ cao.'
          },
          {
            img: require('~/assets/images/landing/how-it-works/encryption.svg'),
            title: 'Mã hóa đầu cuối',
            desc: 'Tất cả dữ liệu được mã hóa đầu cuối khi truyền tải giữa các ứng dụng khách.'
          }
        ]
      }
    }
  }
}
</script>
<style>
.full-width {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.vertical-line {
  border-left: 3px solid #268334;
  height: 100%;
  padding-left: 27px;
}

.bg-how-it-works1 {
  background-color: #fbfaf3;
}

.bg-how-it-works2 {
  background-color: #f5f6f7;
}
</style>
