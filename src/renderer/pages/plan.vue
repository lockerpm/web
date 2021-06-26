<template>
  <div>
    <section
      class="full-width h-auto pt-40"
      style="background-color: #f5f6f7"
    >
      <h1 class="max-w-[700px] font-bold landing-font-50 text-center mx-auto">Simple, transparent pricing</h1>
      <div class="mt-[100px] pb-[140px] max-w-6xl mx-auto px-6">
        <div class="w-full flex flex-wrap  gap-x-[30px] gap-y-[30px] justify-center">
          <div
            v-for="(plan, index) in plans"
            :key="index"
            class="landing-transition px-10 py-14 w-full md:w-[445px] bg-white relative z-10 rounded-xl relative"
          >
            <p
              v-if="index===2"
              class="bg-black text-white w-[100px] text-center absolute right-6 top-6 rounded-sm"
            >
              TIẾT KIỆM 17%
            </p>
            <p class="landing-font-20 text-green">{{ plan.title }}</p>
            <p class="mt-4">
              <span class="font-bold landing-font-50">{{ plan.price }}</span> <span class="landing-font-18">{{ plan.price_detail }}</span>
            </p>
            <ul class="ml-3 my-[30px]">
              <li
                v-for="(detail, ind) in plan.desc"
                :key="ind"
                class="landing-font-14 mb-[10px] relative"
                style="color: #5A6176"
              >
                {{ detail }}
                <span
                  v-if="detail==='Thiết lập Liên hệ Khẩn cấp'"
                  class="info"
                >
                  <i class="fa fa-info-circle" />
                  <span
                    class="tooltiptext"
                    style="font-size: 11px"
                  >Liên hệ khẩn cấp giúp bạn truy cập vào dữ liệu của mình trong trường hợp quên mật khẩu chính của tài khoản.</span>
                </span>
              </li>
            </ul>
            <p
              v-for="(item, ind) in plan.note"
              :key="ind"
              class="landing-font-12"
              style="color: #5A6176"
            >
              {{ item }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="mt-[140px] mb-[150px]">
      <div class="max-w-6xl mx-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th class="w-3/12 text-left pl-6 pb-5">Tính năng</th>
              <th class="w-1/12 pb-5">Free</th>
              <th class="w-8/36 pb-5">Premium</th>
              <th class="w-8/36 pb-5">Family</th>
              <th class="w-8/36 pb-5">Business</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(feature, index) in feature_plan">
              <tr
                :key="index"
                style="background-color: #FBFAF3;"
              >
                <td
                  colspan="100%"
                  class="py-[18px] pl-6 text-green font-semibold"
                >
                  {{ feature.title }}
                </td>
              </tr>
              <tr :key="index">
                <td
                  colspan="100%"
                  class="pb-5"
                />
              </tr>
              <tr
                v-for="(item, idx) in feature.features"
                :key="idx"
              >
                <td
                  class="pl-6 landing-font-16 pb-5"
                  style="color: #5A6176"
                >
                  {{ item.label }}
                </td>
                <td
                  v-for="(plan, ind) in item.plans"
                  :key="ind"
                  class="text-center pb-5"
                >
                  <img
                    v-if="plan===true"
                    class="mx-auto"
                    src="~/assets/images/landing/plan/true.svg"
                  >
                  <img
                    v-else-if="plan===false"
                    class="mx-auto"
                    src="~/assets/images/landing/plan/false.svg"
                  >
                  <p
                    v-else
                    v-html="plan"
                  />
                </td>
              </tr>
            </template>
            <tr style="background-color: #FBFAF3;">
              <td class="py-[18px] pl-6 text-green font-semibold">GIÁ CƯỚC</td>
              <td class="py-[18px] pl-6 text-green text-center">0đ</td>
              <td class="py-[18px] pl-6 text-green text-center">19,000đ/tháng</td>
              <td class="py-[18px] pl-6 text-green text-center">79,000đ/tháng/<br>5 tài khoản</td>
              <td class="py-[18px] pl-6 text-green text-center">39,000đ/tháng/<br>tài khoản</td>
            </tr>
            <tr>
              <td />
              <td
                v-for="(button, index) in subscription_button"
                :key="index"
                class="pt-5"
              >
                <div class="text-center">
                  <a
                    class="landing-btn2 w-full sm:w-auto sm:ml-4"
                    href="#"
                  >
                    {{ button }}
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Feature -->
    <section
      class="full-width w-full h-auto md:pb-[140px] pb-20"
      style="background-color: #f5f6f7"
    >
      <div class="max-w-6xl mx-auto px-6">
        <div class="w-full flex flex-wrap">
          <div class="w-full md:mb-0 md:pt-[115px] pt-20 text-center order-1">
            <h2
              class="
                w-full
                font-bold
                landing-font-38
                text-black
                mb-[20px]
                max-w-[589px]
                mx-auto
              "
            >
              Lưu trữ mật khẩu của bạn tại một không gian bảo mật duy nhất
            </h2>
            <img
              src="~/assets/images/landing/index/boundary2.svg"
              alt=""
              class="mx-auto"
            >
          </div>
          <div
            class="
              w-full
              mt-[45px]
              grid grid-cols-1
              md:grid-cols-2
              lg:grid-cols-4
              gap-x-[45px]
              lg:gap-x-[30px]
              gap-y-[45px]
              order-2
            "
          >
            <div
              v-for="(item, index) in features"
              :key="index"
              class="landing-transition px-[30px] pt-11 bg-white rounded-lg hover:shadow-xl"
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
      </div>
    </section>
    <!-- Feature end -->

    <!--    Questions-->
    <section
      class="full-width h-auto py-[130px]"
      style="background-color: #FBFAF3"
    >
      <div class="max-w-6xl mx-auto px-6">
        <div class="w-8/12 mx-auto">
          <h2 class="landing-font-38 font-bold mb-[35px]">{{ question.title }}</h2>
          <div
            v-for="(qa, index) in question.question_list"
            :key="index"
            class="mb-[70px]"
          >
            <h3 class="landing-font-22 font-bold mb-3">{{ qa.question }}</h3>
            <p
              class="landing-font-14"
              style="color: #5A6176"
            >
              {{ qa.answer }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <!--    Questions end-->
  </div>
</template>

<script>
export default {
  layout: 'landing',
  data () {
    return {
      plans: [
        {
          title: 'Free',
          price: '0đ',
          price_detail: '',
          desc: [
            'Lưu trữ mật khẩu an toàn và & dụng trên mọi thiết bị',
            'Tự động đăng nhập website và ứng dụng',
            'Lưu thông tin thẻ thanh toán, ghi chú bí mật, thông tin cá nhân',
            'Tự động điền thông tin thẻ thanh toán khi mua sắm online',
            'Tự động điền tờ khai sử dụng mẫu thông tin cá nhân lưu sẵn',
            'Đăng nhập với FaceID hoặc TouchID',
            'Công cụ tạo mật khẩu mạnh ngẫu nhiên'
          ],
          note: []
        },
        {
          title: 'Premium',
          price: '19,000đ',
          price_detail: '/tháng*',
          desc: [
            'Tất cả tính năng của gói miễn phí',
            'Lưu trữ không giới hạn mật khẩu, thông tin cá nhân, thẻ tín dụng, ghi chú bí mật',
            'Đánh giá sức khỏe tất cả mật khẩu của bạn. Cảnh báo mật khẩu có mức độ bảo mật kém',
            'Công cụ dò quét và cảnh báo lộ dữ liệu tài khoản, mật khẩu trên internet',
            'Thiết lập Liên hệ Khẩn cấp'
          ],
          note: ['*Áp dụng nếu thanh toán theo năm. Giá gốc 49,000đ/tháng.']
        },
        {
          title: 'Family & Friends',
          price: '79,000đ',
          price_detail: '/tháng/tài khoản*',
          desc: [
            'Tất cả tính năng của gói miễn phí',
            'Lưu trữ không giới hạn mật khẩu, thông tin cá nhân, thẻ tín dụng, ghi chú bí mật',
            'Đánh giá sức khỏe tất cả mật khẩu của bạn. Cảnh báo mật khẩu có mức độ bảo mật kém',
            'Công cụ dò quét và cảnh báo lộ dữ liệu tài khoản, mật khẩu trên internet',
            'Thiết lập Liên hệ Khẩn cấp',
            'Chia sẻ mật khẩu an toàn**'
          ],
          note: ['*Áp dụng nếu thanh toán theo năm. Giá gốc 129,000đ/tháng.', '**Chỉ chia sẻ với những thành viên thuộc tổ chức.']
        },
        {
          title: 'Organization & Business',
          price: '39,000đ',
          price_detail: '/tháng/tài khoản*',
          desc: [
            'Mỗi tài khoản thuộc doanh nghiệp đều nhận được tất cả tính năng của gói Premium',
            'Chia sẻ mật khẩu cho nhóm làm việc**',
            'Bảng điều khiển quản trị viên',
            'Phân quyền truy cập theo nhóm',
            'Tổng hợp báo cáo bảo mật các thành viên nhóm',
            'Hỗ trợ triển khai chính sách mật khẩu',
            'Nhật ký hoạt động thành viên'
          ],
          note: ['*Áp dụng nếu thanh toán theo năm. Giá gốc 89,000đ/tháng/tài khoản.', '**Chỉ chia sẻ với những thành viên thuộc tổ chức.']
        }
      ],
      feature_plan: [
        {
          title: 'LƯU TRỮ',
          features: [
            {
              label: 'Mật khẩu',
              plans: ['&le; 100', 'Không giới hạn', 'Không giới hạn', 'Không giới hạn']
            },
            {
              label: 'Thông tin cá nhân',
              plans: ['&le; 3', 'Không giới hạn', 'Không giới hạn', 'Không giới hạn']
            },
            {
              label: 'Ghi chú bí mật',
              plans: ['&le; 100', 'Không giới hạn', 'Không giới hạn', 'Không giới hạn']
            },
            {
              label: 'Thẻ thanh toán',
              plans: ['&le; 10', 'Không giới hạn', 'Không giới hạn', 'Không giới hạn']
            }
          ]
        },
        {
          title: 'TIỆN ÍCH',
          features: [
            {
              label: 'Tự động điền mật khẩu, thẻ thanh toán, thông tin cá nhân',
              plans: [true, true, true, true]
            },
            {
              label: 'Đăng nhập với FaceID và Touch ID trên smartphone',
              plans: [true, true, true, true]
            },
            {
              label: 'Sử dụng trên nhiều thiết bị',
              plans: [true, true, true, true]
            },
            {
              label: 'Truy cập dữ liệu khi ngoại tuyến',
              plans: [true, true, true, true]
            },
            {
              label: 'URL loại trừ',
              plans: [true, true, true, true]
            },
            {
              label: 'Tạo mật khẩu mạnh',
              plans: [true, true, true, true]
            },
            {
              label: 'Cảnh báo rò rỉ dữ liệu',
              plans: [false, true, true, true]
            },
            {
              label: 'Kiểm tra sức khỏe mật khẩu',
              plans:
                [false, true, true, true]
            },
            {
              label: 'Liên hệ khẩn cấp',
              plans:
                [false, true, true, true]
            },
            {
              label: 'Chia sẻ mật khẩu',
              plans:
                [false, false, 'Tối đa 5 tài khoản', 'Không giới hạn']
            }
          ]
        },
        {
          title: 'QUẢN LÝ',
          features: [
            {
              label: 'Quản lý bằng thư mục',
              plans:
                [true, true, true, true]
            },
            {
              label: 'Quản lý theo danh mục',
              plans:
                [true, true, true, true]
            },
            {
              label: 'Quản lý thành viên nhóm',
              plans:
                [false, false, false, true]
            },
            {
              label: 'Bảng điều khiển dành cho quản lý',
              plans:
                [false, false, false, true]
            },
            {
              label: 'Nhật ký hoạt động thành viên',
              plans:
                [false, false, false, true]
            },
            {
              label: 'Báo cáo bảo mật cho nhóm',
              plans:
                [false, false, false, true]
            },
            {
              label: 'Chính sách mật khẩu',
              plans:
                [false, false, false, true]
            }
          ]
        }
      ],
      subscription_button: [
        'Đăng ký', 'Dùng thử 7 ngày', 'Mua', 'Dùng thử 10 ngày'
      ],
      features: [
        {
          img: require('~/assets/images/landing/plan/icon1.svg'),
          title: 'Mã hóa dữ liệu',
          desc: 'Locker mã hóa dữ liệu của bạn theo tiêu chuẩn quân đội AES-256, kết hợp thuật toán khởi tạo cặp khóa PBDKF2 và RSA.'
        },
        {
          img: require('~/assets/images/landing/plan/icon2.svg'),
          title: 'Zero-knowledge',
          desc: 'Mã hóa đầu cuối và Zero-knowledge đảm bảo rằng không ai xem được dữ liệu của bạn, kể cả đội ngũ phát triển Locker.'
        },
        {
          img: require('~/assets/images/landing/plan/icon3.svg'),
          title: 'Hạ tầng an toàn',
          desc: 'Chúng tôi sử dụng hạ tầng máy chủ của các nhà cung cấp hàng đầu thế giới như AWS, DigitalOcean.'
        },
        {
          img: require('~/assets/images/landing/plan/icon4.svg'),
          title: 'Kiểm thử bảo mật',
          desc: 'Được kiểm thử an ninh bởi cộng đồng 1500+ chuyên gia bảo mật trên nền tảng WhiteHub Bug Bounty.'
        }
      ],
      question: {
        title: 'Những câu hỏi thường gặp',
        question_list: [
          {
            question: 'Tài khoản miễn phí có an toàn không?',
            answer: 'Tất cả các tài khoản Locker đều được bảo mật như nhau, không có sự khác biệt nào về mức độ bảo mật giữa các gói tài khoản, dù là trả phí hay miễn phí. Dữ liệu được mã hóa cấp quân đội, kết hợp các thuật toán mã hóa và biện pháp bảo vệ tốt nhất để bảo mật dữ liệu và tính riêng tư của người dùng. Ngoài ra, chính đội ngũ xây dựng Locker cũng không thể xem dữ liệu của bạn. Khám phá thêm tại trang bảo mật.'
          },
          {
            question: 'Có những hình thức thanh toán nào?',
            answer: 'Bạn có thể thanh toán bằng thẻ thanh toán quốc tế Visa, Mastercard. Nếu bạn ở Việt Nam và sử dụng VND là tiền tệ, bạn có thể thanh toán bằng hình thức chuyển khoản ngân hàng với mức giá tốt hơn.'
          },
          {
            question: 'Làm sao để biết tôi có cần gói Premium hay không?',
            answer: 'Mỗi tài khoản miễn phí đều đi kèm 7 ngày dùng thử Premium. Bạn có thể sử dụng đầy đủ các tính năng của tài khoản trả phí và đưa ra quyết định.'
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

ul {
  list-style: none;
}

ul li::before {
  content: "\2022";
  color: #268334;
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}

.info:hover .tooltiptext {
  visibility: visible;
}

.tooltiptext {
  visibility: hidden;
  width: 305px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 5px;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  transform: translateY(-60px) translateX(-150px);
}
</style>
