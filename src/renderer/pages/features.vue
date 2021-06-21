<template>
  <div>
    <section class="pt-[180px]">
      <h1 class="text-left font-bold text-black feature-font-50">
        Khám phá các tính năng của Locker
        <br>
        Password Manager
      </h1>
      <div class="mt-16">
        <h2 class="text-left font-bold text-black feature-font-38 "> Quản lý mật khẩu </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[95px] gap-y-[45px] mt-[46px]">
          <div
            v-for="(item, index) in feature1"
            :key="index"
            class="flex flex-col items-start"
          >
            <img :src="item.img">
            <div>
              <p class="text-black font-bold feature-font-22 mt-[16px]">{{ item.tittle }}</p>
              <p class="text-black feature-font-14 mt-[13px]">{{ item.desc }}</p>
            </div>
          </div>
        </div>
        <div class="landing-font-18 align-top mt-[45px]">
          <a
            href=""
            class="hover:no-underline text-green font-semibold"
          >
            Bắt đầu ngay <i class="el-icon-right" />
          </a>
        </div>
      </div>
      <div class="mt-[150px]">
        <h2 class="text-left font-bold text-black feature-font-38 "> Lưu trữ dữ liệu quan trọng </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[95px] gap-y-[45px] mt-[46px]">
          <div
            v-for="(item, index) in feature2"
            :key="index"
            class="flex flex-col items-start"
          >
            <img :src="item.img">
            <div>
              <p class="text-black font-bold feature-font-22 mt-[16px]">{{ item.tittle }}</p>
              <p class="text-black feature-font-14 mt-[13px]">{{ item.desc }}</p>
            </div>
          </div>
        </div>
        <div class="landing-font-18 align-top mt-[45px]">
          <a
            href=""
            class="hover:no-underline text-green font-semibold"
          >
            Bắt đầu ngay <i class="el-icon-right" />
          </a>
        </div>
      </div>
      <div class="mt-[150px]">
        <h2 class="text-left font-bold text-black feature-font-38 "> Tính năng bảo mật </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[95px] gap-y-[45px] mt-[46px]">
          <div
            v-for="(item, index) in feature3"
            :key="index"
            class="flex flex-col items-start"
          >
            <img :src="item.img">
            <div>
              <p class="text-black font-bold feature-font-22 mt-[16px]">{{ item.tittle }}</p>
              <p class="text-black feature-font-14 mt-[13px]">{{ item.desc }}</p>
            </div>
          </div>
        </div>
        <div class="landing-font-18 align-top mt-[45px]">
          <a
            href=""
            class="hover:no-underline text-green font-semibold"
          >
            Tạo tài khoản <i class="el-icon-right" />
          </a>
        </div>
      </div>
      <div class="mt-[150px] mb-[110px]">
        <h2 class="text-left font-bold text-black feature-font-38 "> Tính năng cho doanh nghiệp </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[95px] gap-y-[45px] mt-[46px]">
          <div
            v-for="(item, index) in feature4"
            :key="index"
            class="flex flex-col items-start"
          >
            <img :src="item.img">
            <div>
              <p class="text-black font-bold feature-font-22 mt-[16px]">{{ item.tittle }}</p>
              <p class="text-black feature-font-14 mt-[13px]">{{ item.desc }}</p>
            </div>
          </div>
        </div>
        <div class="landing-font-18 align-top mt-[45px]">
          <a
            href=""
            class="hover:no-underline text-green font-semibold"
          >
            Locker for business <i class="el-icon-right" />
          </a>
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
      feature1: [
        {
          img: require('~/assets/images/landing/features/feature1_1.png'),
          tittle: 'Lưu mật khẩu',
          desc: 'Khi bạn đăng nhập một website hoặc ứng dụng lần đầu tiên, Locker giúp bạn lưu thông tin đăng nhập chỉ với 1 click'
        },
        {
          img: require('~/assets/images/landing/features/feature1_2.png'),
          tittle: 'Tự động đăng nhập',
          desc: 'Locker giúp bạn tự động đăng nhập các website và ứng dụng yêu thích mà không cần phải điền mật khẩu.'
        },
        {
          img: require('~/assets/images/landing/features/feature1_3.png'),
          tittle: 'Nhập dữ liệu',
          desc: 'Bạn có thể nhập dữ liệu vào Locker từ trình duyệt (Chrome, Firefox) hoặc từ các trình quản lý mật khẩu khác.'
        },
        {
          img: require('~/assets/images/landing/features/feature1_4.png'),
          tittle: 'Đồng bộ hóa',
          desc: 'Dữ liệu của bạn được đồng bộ hóa trên mọi thiết bị, bạn có thể truy cập Locker từ mọi nền tảng và hệ điều hành phổ biến!'
        },
        {
          img: require('~/assets/images/landing/features/feature1_5.png'),
          tittle: 'Đăng nhập với FaceID',
          desc: 'Nếu điện thoại của bạn hỗ trợ sinh trắc, bạn có thể tự động đăng nhập website bằng FaceID hoặc TouchID.'
        }
      ],
      feature2: [
        {
          img: require('~/assets/images/landing/features/feature2_1.png'),
          tittle: 'Lưu trữ dữ liệu quan trọng',
          desc: 'Chúng tôi không giới hạn số lượng mật khẩu bạn có thể lưu trữ trong Locker, ngay cả với gói cước miễn phí!'
        },
        {
          img: require('~/assets/images/landing/features/feature2_2.png'),
          tittle: 'Lưu trữ ghi chú quan trọng',
          desc: 'Bạn có thể lưu trữ các ghi chú quan trọng hoặc bí mật trong Locker và truy cập bất cứ khi nào.'
        },
        {
          img: require('~/assets/images/landing/features/feature2_3.png'),
          tittle: 'Lưu thông tin thẻ tín dụng',
          desc: 'Locker cho phép lưu trữ thông tin thẻ tín dụng, thẻ ghi nợ, thẻ thanh toán phát hành bởi mọi đơn vị.'
        },
        {
          img: require('~/assets/images/landing/features/feature2_4.png'),
          tittle: 'Lưu và tự động điền thông tin cá nhân',
          desc: 'Locker giúp bạn lưu các profile thông tin cá nhân để tự động điền vào các mẫu đơn đăng ký.'
        },
        {
          img: require('~/assets/images/landing/features/feature2_5.png'),
          tittle: 'Sắp xếp theo thư mục',
          desc: 'Bạn có thể quản lý dữ liệu của mình theo các hạng mục (category) và thư mục (folder).'
        }
      ],
      feature3: [
        {
          img: require('~/assets/images/landing/features/feature3_1.png'),
          tittle: 'Tạo mật khẩu mạnh',
          desc: 'Công cụ Password Generator giúp bạn tạo mật khẩu mạnh và lưu trữ nhanh chóng.'
        },
        {
          img: require('~/assets/images/landing/features/feature3_2.png'),
          tittle: 'Mã hóa AES-256bit',
          desc: 'Dữ liệu mật khẩu của bạn được mã hóa tiêu chuẩn quân đội AES-256bit'
        },
        {
          img: require('~/assets/images/landing/features/feature3_3.png'),
          tittle: 'Mã hóa Zero-knowledge',
          desc: 'Không ai có thể xem mật khẩu của bạn, kể cả đội ngũ Locker.'
        },
        {
          img: require('~/assets/images/landing/features/feature3_4.png'),
          tittle: 'Cảnh báo tài khoản bị lộ',
          desc: 'Quét và cảnh báo các tài khoản bị lộ trong các cuộc tấn công đánh cắp dữ liệu.'
        },
        {
          img: require('~/assets/images/landing/features/feature3_5.png'),
          tittle: 'Cảnh báo mật khẩu yếu',
          desc: 'Phần mềm cảnh báo các mật khẩu yếu giúp bạn cải thiện bảo mật cho mọi tài khoản online.'
        }
      ],
      feature4: [
        {
          img: require('~/assets/images/landing/features/feature4_1.png'),
          tittle: 'Bảng điều khiển',
          desc: 'Truy cập vào bảng điều khiển dành riêng cho doanh nghiệp và các nhóm làm việc.'
        },
        {
          img: require('~/assets/images/landing/features/feature4_2.png'),
          tittle: 'Chia sẻ mật khẩu',
          desc: 'Chia sẻ mật khẩu với nhóm làm việc của bạn một cách nhanh chóng, bảo mật & an toàn. '
        },
        {
          img: require('~/assets/images/landing/features/feature4_3.png'),
          tittle: 'Quản lý thành viên',
          desc: 'Thêm thành viên vào nhóm, điều chỉnh quyền hạn của các thành viên hoặc nhóm.'
        },
        {
          img: require('~/assets/images/landing/features/feature4_4.png'),
          tittle: 'Báo cáo bảo mật',
          desc: 'Giúp bạn nắm được mức độ bảo mật của từng thành viên trong nhóm làm việc.'
        },
        {
          img: require('~/assets/images/landing/features/feature4_5.png'),
          tittle: 'Chính sách mật khẩu',
          desc: 'Hỗ trợ áp dụng chính sách mật khẩu giúp tăng cường bảo mật cho tổ chức.'
        },
        {
          img: require('~/assets/images/landing/features/feature4_6.png'),
          tittle: 'Giám sát rò rỉ dữ liệu',
          desc: 'Phát hiện khi có mật khẩu doanh nghiệp bị lộ ra ngoài hoặc phát tán trên các trang web đen của hacker.'
        }
      ]
    }
  },
  methods: {

  }
}
</script>
<style>
.feature-font-50 {
  font-size: 50px;
  line-height: 66px;
}
.feature-font-38 {
  font-size: 38px;
  line-height: 45px;
}
.feature-font-22 {
  font-size: 22px;
  line-height: 26px;
}
.feature-font-14 {
  font-size: 14px;
  line-height: 24px;
}
</style>
