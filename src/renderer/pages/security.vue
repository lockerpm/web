<template>
  <div class="md:pt-[180px] pt-36">
    <section>
      <h1 class="max-w-[792px] mx-auto text-center font-bold text-black landing-font-50">
        {{ header.title }}
      </h1>
      <div class="w-full text-center mt-[45px]">
        <a
          class="mx-auto landing-btn w-auto"
          :href="header.btn.link"
        >
          {{ header.btn.text }}
        </a>
      </div>
    </section>
    <section class="mb-36">
      <div class="md:mt-[150px] mt-16">
        <div class="w-full flex flex-wrap">
          <div class="w-full max-w-[530px] mt-3 md:w-1/2 pr-0 pl-4 md:order-2 self-center order-1">
            <h2 class="w-full font-bold landing-font-38 text-black mb-[20px]">
              {{ security1.title }}
            </h2>
            <p class="landing-font-18">{{ security1.desc }}</p>
          </div>
          <!-- Right end -->
          <!-- Left -->
          <div class="w-full md:w-1/2 flex align-middle justify-center order-1 mt-4 md:mt-0">
            <img
              :src="require(`~/assets/images/landing/security/${security1.img}`)"
              alt=""
              style="align-self: center"
            >
          </div>
          <!-- Left end -->
        </div>
      </div>
      <div class="md:mt-[70px] mt-8">
        <div class="w-full flex flex-wrap">
          <div class="w-full md:mb-0 mt-3 md:w-1/2 self-center md:pr-12 pr-0 order-1 md:pl-10">
            <h2 class="w-full font-bold landing-font-38 text-black mb-[20px]">
              {{ security2.title }}
            </h2>
            <p class="landing-font-18">{{ security2.desc }}</p>
          </div>
          <!-- Left end -->
          <!-- Right -->
          <div class="w-full md:w-1/2 pl-0 flex align-middle justify-center mt-4 md:mt-0 order-2">
            <img
              :src="require(`~/assets/images/landing/security/${security2.img}`)"
              alt=""
              style="align-self: center"
            >
          </div>
          <!-- Right end -->
        </div>
      </div>
      <div class="md:mt-[111px] mt-14">
        <div class="w-full flex flex-wrap">
          <div class="w-full mt-3 md:w-2/5 pr-0 md:order-2 self-center order-1">
            <h2 class="w-full font-bold landing-font-38 text-black mb-[20px]">
              {{ security3.title }}
            </h2>
            <p class="landing-font-18">{{ security3.desc }}</p>
          </div>
          <!-- Left end -->
          <!-- Right -->
          <div class="w-full md:w-1/2 flex align-middle justify-center order-1 mt-4 md:mt-0">
            <img
              :src="require(`~/assets/images/landing/security/${security3.img}`)"
              alt=""
            >
          </div>
          <!-- Right end -->
        </div>
      </div>
      <div class="md:mt-[70px] mt-8">
        <div class="w-full flex flex-wrap">
          <div class="w-full mt-3 md:w-1/2 self-center pr-10 order-1 md:pl-10">
            <h2 class="w-full font-bold landing-font-38 text-black mb-[20px]">
              {{ security4.title }}
            </h2>
            <p class="landing-font-18">{{ security4.desc }}</p>
          </div>
          <!-- Left end -->
          <!-- Right -->
          <div class="w-full md:w-1/2 pl-0 md:pl-4 flex align-middle justify-center mt-4 md:mt-0 order-2">
            <img
              :src="require(`~/assets/images/landing/security/${security4.img}`)"
              alt=""
              style="align-self: center"
            >
          </div>
          <!-- Right end -->
        </div>
      </div>
    </section>

    <section
      class="full-width w-full h-auto md:pt-[115px] pt-12 md:pb-[111px] pb-12"
      style="background: #F5F6F7;"
    >
      <div class="max-w-6xl mx-auto px-6">
        <div class="w-full flex flex-wrap">
          <div class="w-full md:mb-0 text-center order-1">
            <h2 class="w-full font-bold landing-font-38 text-black mb-[20px] mx-auto">
              {{ personal.title }}
            </h2>
            <img
              src="~/assets/images/landing/security/boundary.svg"
              alt=""
              class="mx-auto"
            >
          </div>
          <div
            class="w-full mt-[45px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-[45px] lg:gap-x-[30px] gap-y-[45px] order-2"
          >
            <div
              v-for="(item, index) in personal.features"
              :key="index"
              class="landing-transition px-[30px] pt-11 bg-white rounded-md hover:shadow-xl"
            >
              <img
                :src="require(`~/assets/images/landing/security/${item.img}`)"
                :alt="item.title"
                class="h-[40px] mb-[16px]"
              >
              <h3 class="mb-[12px] font-bold text-black landing-font-20">
                {{ item.title }}
              </h3>
              <p class="lg:max-w-[265px] mb-[40px]">
                {{ item.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="max-w-6xl mx-auto px-6 md:mt-[150px] mt-16">
        <div class="w-full flex flex-wrap">
          <div class="w-full md:mb-0 text-center order-1">
            <h2 class="w-full font-bold landing-font-38 text-black mb-[20px] mx-auto">
              {{ business.title }}
            </h2>
            <img
              src="~/assets/images/landing/security/boundary.svg"
              alt=""
              class="mx-auto"
            >
          </div>
          <div
            class="w-full mt-[45px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-[45px] lg:gap-x-[30px] gap-y-[45px] order-2"
          >
            <div
              v-for="(item, index) in business.features"
              :key="index"
              class="landing-transition px-[30px] pt-11 bg-white rounded-md hover:shadow-xl"
            >
              <img
                :src="require(`~/assets/images/landing/security/${item.img}`)"
                :alt="item.title"
                class="h-[40px] mb-[16px]"
              >
              <h3 class="mb-[12px] font-bold text-black landing-font-20">
                {{ item.title }}
              </h3>
              <p class="lg:max-w-[265px] mb-[40px]">
                {{ item.desc }}
              </p>
            </div>
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
      header: {
        title: 'Locker được xây dựng với triết lý bảo mật là ưu tiên hàng đầu',
        btn: {
          link: '#',
          text: 'Whitepaper'
        }
      },
      security1: {
        img: 'img1.png',
        title: 'Mã hóa tiêu chuẩn quân đội',
        desc: 'Locker sử dụng chuẩn mã hóa cao cấp AES-256bit. Đây là bộ mã được Cơ quan An ninh Quốc gia Hoa Kỳ (NSA) sử dụng để bảo vệ các thông tin tuyệt mật. Mã hóa AES-256 cũng được sử dụng bởi các ngân hàng và trung tâm tài chính lớn. Locker sử dụng mã hóa AES-256 để bảo mật dữ liệu của bạn tốt nhất trước những cuộc tấn công mạng phức tạp.'
      },
      security2: {
        img: 'img2.png',
        title: 'Không ai có thể xem được dữ liệu của bạn, ngoại trừ chính bạn',
        desc: 'Locker sử dụng kết hợp mã hóa đầu cuối kết hợp mã hóa không thông tin Zero-knowledge. Bằng cách này, dữ liệu của bạn được mã hóa và giải mã ngay tại thiết bị mà bạn sử dụng Locker, máy chủ chỉ đóng vai trò cầu nối trung chuyển và đồng bộ hóa thông tin đã được mã hóa. Điều này đảm bảo rằng không một ai, kể cả máy chủ CyStack, có thể giải mã để xem được dữ liệu bí mật này, ngoại trừ chính bạn.'
      },
      security3: {
        img: 'img3.png',
        title: 'Hạ tầng lưu trữ dữ liệu',
        desc: 'Chúng tôi hiện sử dụng hạ tầng mạng của các nhà cung cấp dịch vụ hàng đầu thế giới (AWS, Digital Ocean) để lưu trữ dữ liệu của bạn; điều này giúp đảm bảo hệ thống luôn được vận hành an toàn và ổn định. Ngoài ra, chúng tôi cố gắng đảm bảo bạn có thể quản lý và truy cập dữ liệu bí mật của mình bất cứ khi nào và bất cứ nơi nào bạn cần một cách tin cậy và an toàn, kể cả khi bạn đang ngoại tuyến.'
      },
      security4: {
        img: 'img4.png',
        title: 'Kiểm tra an ninh định kỳ',
        desc: 'Locker được triển khai chương trình Bug Bounty cho các nhà nghiên cứu hàng đầu thế giới đánh giá và kiểm thử xâm nhập ứng dụng liên tục. Bên cạnh đó, đội ngũ chuyên gia bảo mật của CyStack cũng trực tiếp đánh giá và phân tích các rủi ro cho hệ thống định kỳ để đảm bảo Locker luôn trong tình trạng an ninh tốt nhất. Các sự kiện bảo mật của Locker được công bố rộng rãi trên blog của chúng tôi.'
      },
      personal: {
        title: 'Tính năng bảo mật cho người dùng',
        features: [
          {
            img: 'icon1.svg',
            title: 'Master Password',
            desc: 'Mật khẩu chính là chìa khóa duy nhất bạn cần để mở khóa dữ liệu bảo mật trong Locker của bạn.'
          },
          {
            img: 'icon2.svg',
            title: 'Mở khóa sinh trắc học',
            desc: 'Hỗ trợ mở khóa Locker và tự động điền mật khẩu bằng FaceID hoặc TouchID trên iOS và Android.'
          },
          {
            img: 'icon3.svg',
            title: 'Đánh giá mật khẩu',
            desc: 'Locker đánh giá mức độ chống chịu của mật khẩu của bạn trước các cuộc tấn công.'
          },
          {
            img: 'icon4.svg',
            title: 'Cảnh báo rò rỉ dữ liệu',
            desc: 'Giúp bạn biết khi nào mật khẩu của mình bị lộ hoặc rò rỉ trên mạng internet.'
          }
        ]
      },
      business: {
        title: 'Tính năng bảo mật cho doanh nghiệp',
        features: [
          {
            img: 'icon5.svg',
            title: 'Quản lý thành viên',
            desc: 'Bạn có thể quản lý quyền xem và chỉnh sửa mật khẩu được chia sẻ cho tổ chức của các thành viên và các nhóm làm việc.'
          },
          {
            img: 'icon6.svg',
            title: 'Chia sẻ mật khẩu an toàn',
            desc: 'Bạn có thể nhanh chóng chia sẻ mật khẩu cho nhóm làm việc với 3 tùy chỉnh: chỉ sử dụng - không xem, được xem, được chỉnh sửa.'
          },
          {
            img: 'icon7.svg',
            title: 'Xem báo cáo bảo mật',
            desc: 'Xem trạng thái bảo mật của từng thành viên, mức độ an toàn của mật khẩu, tần suất và mức độ sử dụng Locker để đăng nhập.'
          },
          {
            img: 'icon8.svg',
            title: 'Nâng cao khả năng tuân thủ',
            desc: 'Thiết lập chính sách mật khẩu và nâng cao khả năng tuân thủ các tiêu chuẩn bảo mật toàn cầu như NIST 800-63B, HIPAA, GPDR.'
          }
        ]
      }
    }
  }
}
</script>

<style scoped>
.full-width {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}
</style>
