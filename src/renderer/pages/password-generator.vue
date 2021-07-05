<template>
  <div class="md:pt-[180px] pt-36">
    <section>
      <h1 class="landing-font-50 text-center font-bold">{{ header.title }}</h1>
      <img
        src="~/assets/images/landing/password-generator/boundary.svg"
        class="mx-auto mt-[15px] mb-5"
      >
      <p class="landing-font-20 max-w-[600px] text-center mx-auto">{{ header.desc }}</p>
      <!--      Tool-->
      <div class="mx-auto h-auto mt-[45px] max-w-[730px] shadow-xl rounded-xl">
        <!--        <img-->
        <!--          :src="require(`~/assets/images/landing/password-generator/${header.img}`)"-->
        <!--        >-->
        <div
          style="background-color: #F5F6F7; border-radius: 10px 10px 0 0;"
          class="h-auto flex flex-wrap pb-5 pr-6"
        >
          <div class="w-11/12 h-auto break-words">
            <p
              id="password"
              class="landing-font-34 font-semibold mt-8 ml-9 max-w-[600px]"
            >
              {{ password }}
            </p>
          </div>
          <div class="w-1/12 self-center pt-6">
            <button @click="regenerate">
              <img
                src="~/assets/images/landing/password-generator/refresh.png"
                style="width: 50px; height: 50px;"
              >
            </button>
          </div>
        </div>
        <div class="mx-9 pt-6 flex flex-wrap">
          <div class="w-full sm:w-1/2">
            <p class="landing-font-16 font-semibold">Mật khẩu mạnh:</p>
            <div style="margin-left: 130px; transform: translateY(-23px);">
              <PasswordStrength
                v-if="password"
                :score="passwordStrength.score"
              />
            </div>
            <p class="landing-font-16 font-semibold">Độ dài</p>
            <div>
              <input
                v-model="options.length"
                class="h-[44px] w-[70px] mt-4 mr-3"
                type="number"
                min="8"
                max="64"
                @change="updateLength"
              >
              <!--            <input type="range" min="0" max="50" v-model="form_gen.length">-->
              <el-slider
                v-model="options.length"
                :min="8"
                :max="64"
                :debounce="800"
                style="margin-left: 80px; transform: translateY(-40px); padding-right: 60px"
                @change="regenerate"
              />
            </div>
          </div>
          <div class="w-full sm:w-1/2">
            <!--            <div v-for="(item, index) in form_gen.check_list" class="mb-[14px] md:pl-10 pl-0" :key="index">-->
            <!--              <input type="checkbox" :id="item.value" v-model="item.checked" :key="index">-->
            <!--              <label :for="item.value" :key="index" class="landing-font-14" style="color: #5A6176"> {{-->
            <!--                  item.label-->
            <!--                }}</label>-->
            <!--              <el-checkbox-->
            <!--                v-for="(item, index) in form_gen.check_list" :key="index"-->
            <!--                v-model="item.checked"-->
            <!--                class="mb-[14px] md:pl-10 pl-0"-->
            <!--              >-->
            <!--              {{item.label}}-->
            <!--              </el-checkbox>-->
            <!--              <br>-->
            <!--            </div>-->
            <el-checkbox
              v-model="options.uppercase"
              class="mb-[14px] md:pl-10 pl-0"
              @change="regenerate"
            >
              {{ tools.uppercase }}
            </el-checkbox>
            <el-checkbox
              v-model="options.lowercase"
              class="mb-[14px] md:pl-10 pl-0"
              @change="regenerate"
            >
              {{ tools.lowercase }}
            </el-checkbox>
            <el-checkbox
              v-model="options.number"
              class="mb-[14px] md:pl-10 pl-0"
              @change="regenerate"
            >
              {{ tools.digits }}
            </el-checkbox>
            <el-checkbox
              v-model="options.special"
              class="mb-[14px] md:pl-10 pl-0"
              @change="regenerate"
            >
              {{ tools.symbols }}
            </el-checkbox>
            <el-checkbox
              v-model="options.ambiguous"
              class="mb-[14px] md:pl-10 pl-0"
              @change="regenerate"
            >
              {{ tools.ambiguous }}
            </el-checkbox>
          </div>
          <div class="w-full mt-9 grid sm:grid-cols-2 grid-cols-1 gap-5 mb-[50px]">
            <button
              class="landing-btn w-auto"
              @click="copy_password"
            >
              Copy Password
            </button>

            <button class="landing-btn2 w-auto">
              Lưu với Locker
            </button>
          </div>
        </div>
      </div>
      <!--Tool end-->
      <!-- CTA 1 -->
      <div class="md:mt-36 mt-24">
        <div
          class="w-full rounded-lg py-[40px] px-[65px] flex justify-between align-middle md:flex-row flex-col"
          style="background-color: #f5f6f7"
        >
          <div>
            <h2 class="landing-font-28 font-semibold mb-3 sm:text-left text-center">{{ cta1.title }}</h2>
            <p class=" md:max-w-[490px] md:text-left md:mb-0 landing-font-14 max-w-max text-center mb-6">
              {{ cta1.desc }}
            </p>
          </div>
          <a
            class="landing-btn"
            :href="cta1.btn.link"
            style="align-self: center"
          >
            {{ cta1.btn.text }}
          </a>
        </div>
      </div>
      <!-- CTA 1 end -->
      <!-- Why -->
      <div class="mt-[150px]">
        <div class="w-full flex flex-wrap">
          <div class="w-full md:mb-0 mt-3 md:w-1/2 md:px-20 self-center md:order-2 order-1">
            <h2 class="w-full font-bold landing-font-38 text-black mb-[20px]">
              {{ why.title }}
            </h2>
            <p
              class="landing-font-18 md:max-w-[445px]"
              v-html="why.desc"
            />
          </div>
          <!-- Right end -->
          <!-- Left -->
          <div class="w-full md:w-1/2 pl-0 flex order-1">
            <img
              :src="require(`~/assets/images/landing/password-generator/${why.img}`)"
              alt=""
              style="align-self: center"
            >
          </div>
          <!-- Left end -->
        </div>
      </div>
      <!-- Why end -->
    </section>
    <section
      class="full-width h-auto mt-32"
      style="background-color: #F5F6F7"
    >
      <div class="max-w-[1000px] mx-auto">
        <h1 class="landing-font-38 font-bold pt-32  text-center">{{ tips.title }}</h1>
        <img
          src="~/assets/images/landing/password-generator/boundary2.svg"
          class="mx-auto mt-[15px] mb-5"
        >
      </div>
      <div class="max-w-[900px] mx-auto mt-[45px] pb-[120px] px-5">
        <div
          v-for="(tip, index) in tips.details"
          :key="index"
          class="bg-white mb-[30px] rounded-lg py-[50px] pr-[35px] pl-3"
        >
          <div class="w-full flex flex-wrap">
            <div class="md:w-1/12 w-full circle ml-6 mb-3">
              <p class="text-white landing-font-38 font-bold mx-auto my-auto">{{ index + 1 }}</p>
            </div>
            <div class="max-w-[705px] ml-6">
              <h2
                class="landing-font-22 font-bold mb-3"
                style="color: #161922"
              >
                {{ tip.title }}
              </h2>
              <p
                class="landing-font-14"
                style="color: #5A6176"
              >
                {{ tip.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="mb-20">
      <div class="mt-[150px]">
        <div class="w-full flex flex-wrap">
          <div class="w-full md:mb-0 mt-3 md:w-1/2 self-center order-1">
            <h2 class="w-full font-bold landing-font-38 text-black mb-[20px]">
              {{ use_locker.title }}
            </h2>
            <p class="landing-font-18">{{ use_locker.desc }}</p>
            <div class="landing-font-18 align-top mt-[45px]">
              <a
                href=""
                class="hover:no-underline text-green font-semibold"
              >
                {{ use_locker.link }} <i class="el-icon-right" />
              </a>
            </div>
          </div>
          <!-- Left end -->
          <!-- Right -->
          <div class="w-full md:w-1/2 pl-0 md:pl-4 pt-6 md:pt-0 flex align-middle justify-end order-2">
            <img
              :src="require(`~/assets/images/landing/password-generator/${use_locker.img}`)"
              alt=""
              style="align-self: center"
            >
          </div>
          <!-- Right end -->
        </div>
      </div>
      <!-- Download -->
      <div class="mt-[150px]">
        <h1 class="landing-font-38 font-bold text-center">{{ benefit.title }}</h1>
        <p class="landing-font-18 text-center max-w-[730px] mx-auto mt-5 mb-[45px]">{{ benefit.desc }}</p>
        <div class="w-full mx-auto grid md:grid-cols-2 grid-cols-1 gap-y-[60px] gap-x-[90px]">
          <div
            v-for="(item, index) in benefit.features"
            :key="index"
            class="rounded-md"
            style="background-color:#F5F6F7"
          >
            <div class="px-[50px] pt-[60px] text-center">
              <h2 class="landing-font-22 font-bold">{{ item.title }}</h2>
              <p class="landing-font-14 mt-3 mb-[30px]">{{ item.desc }}</p>
              <div class="landing-font-18 align-top">
                <a
                  href=""
                  class="hover:no-underline text-green font-semibold"
                >
                  {{ item.link }} <i class="el-icon-right" />
                </a>
              </div>
            </div>
            <img :src="require(`~/assets/images/landing/password-generator/${item.img}`)">
          </div>
        </div>
      </div>
      <!-- Download end -->
      <div class="md:mt-36 mt-24">
        <div
          class="w-full rounded-lg py-[40px] px-[65px] flex justify-between align-middle md:flex-row flex-col"
          style="background-color: #f5f6f7"
        >
          <p class=" md:max-w-[530px] md:text-left md:mb-0 landing-font-28 font-semibold max-w-max text-center mb-6">
            {{ cta2.title }}
          </p>
          <a
            class="landing-btn"
            :href="cta2.btn.link"
            style="align-self: center"
          >
            {{ cta2.btn.text }}
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import PasswordStrength from '../components/password/PasswordStrength'

export default {
  components: { PasswordStrength },
  layout: 'landing',
  data () {
    return {
      header: {
        title: 'Tạo mật khẩu mạnh ngẫu nhiên',
        desc: 'Công cụ giúp bạn tạo mật khẩu mạnh, duy nhất, và hoàn toàn ngẫu nhiên giúp bảo mật các tài khoản trực tuyến tốt hơn.',
        img: 'tool.png'
      },

      password: '',
      tools: {
        password_generator: 'Tạo mật khẩu mạnh',
        password_generator_desc: 'Tạo một mật khẩu mạnh và ngẫu nhiên cho tài khoản của bạn',
        password_health: 'Sức khỏe mật khẩu',
        password_health_desc: 'Xác định các mật khẩu yếu, trùng lặp có thể khiến bạn bị tấn công bởi tội phạm mạng',
        data_breach: 'Cảnh báo lộ dữ liệu',
        data_breach_desc: 'Kiểm tra xem dữ liệu nhạy cảm của bạn có bị lộ trên internet hay không',
        copy_password: 'Sao chép',
        show_options: 'Tùy chọn',
        uppercase: 'Sử dụng chữ in hoa (A-Z)',
        lowercase: 'Sử dụng chữ in thường (a-z)',
        digits: 'Sử dụng số (0-9)',
        symbols: 'Sử dụng ký tự đặc biệt (@!$%*)',
        ambiguous: 'Tránh các ký tự dễ nhầm lẫn'
      },
      options: {
        length: 16,
        uppercase: true,
        lowercase: true,
        number: true,
        special: true,
        ambiguous: false
      },
      cta1: {
        title: 'Lưu trữ mật khẩu an toàn với Locker',
        desc: 'Lưu lại mật khẩu của bạn để truy cập mật khẩu mọi lúc và mọi nơi, ngay cả khi không có kết nối internet!',
        btn: {
          text: 'Bắt đầu ngay',
          link: '#'
        }
      },
      why: {
        title: 'Tại sao bạn cần mật khẩu mạnh?',
        img: 'why.png',
        desc: 'Hơn <span class="text-green underline">80% các vụ vi phạm dữ liệu là do mật khẩu yếu hoặc bị đánh cắp</span>, theo báo cáo của Verizon. Vì vậy, nếu bạn muốn bảo vệ thông tin cá nhân và tài sản của mình, thì việc tạo mật khẩu an toàn là bước quan trọng đầu tiên. Dưới đây là một số mẹo giúp bạn tăng độ an toàn cho mật khẩu, đồng thời cải thiện bảo mật cho tài khoản trực tuyến, giúp bảo vệ tài sản và thông tin cá nhân của bạn.'
      },
      tips: {
        title: '9 mẹo sử dụng mật khẩu an toàn để bảo vệ tài khoản trực tuyến và thông tin cá nhân của bạn',
        details: [
          {
            title: 'Không sử dụng chung một mật khẩu cho nhiều trang web khác nhau',
            desc: 'Nói cách khác, bạn nên sử dụng mật khẩu duy nhất cho mỗi tài khoản của mình. Việc sử dụng chung một mật khẩu cho nhiều trang web có thể gây ra hậu quả khôn lường, một khi tội phạm mạng chiếm được một tài khoản của bạn, chúng có thể dễ dàng xâm nhập các tài khoản khác có cùng mật khẩu với tài khoản đó. Điều này đặc biệt nguy hiểm trong bối cảnh nhiều trang web bảo mật không tốt, có nguy cơ bị rò rỉ dữ liệu người dùng.'
          },
          {
            title: 'Không sử dụng tên tuổi, ngày tháng năm sinh trong mật khẩu',
            desc: 'Các thông tin cá nhân có thể dễ dàng bị đoán trúng như tên tuổi, ngày tháng năm sinh, quê quán,...không nên được sử dụng vào mật khẩu. Mặc dù chúng dễ nhớ đối với bạn, nhưng chúng cũng dễ đoán với hacker, những kẻ có khả năng dò tìm thông tin cá nhân của bạn trên internet. Thay vào đó, hãy sử dụng những cụm từ mang tính cá nhân cao nhưng không định danh như một câu (hoặc vài cụm từ) trong bài hát yêu thích, tên loài vật hoặc thú cưng của bạn, v.v.'
          },
          {
            title: 'Không sử dụng các cụm từ phổ thông dễ đoán',
            desc: 'Các mật khẩu phổ biến như iloveyou, 123456,... được sử dụng thường xuyên bởi người dùng internet để làm mật khẩu. Đây đều là những mật khẩu đơn giản và dễ đoán, có thể bị bẻ khóa trong vòng vài giây. Vì vậy, chuyên gia khuyến cáo bạn không nên sử dụng các cụm từ phổ thông để làm mật khẩu. Để tránh các cụm từ này, tham khảo Top 100 mật khẩu phổ biến nhất.'
          },
          {
            title: 'Mật khẩu bao gồm chữ cái in thường, in hoa, số, ký tự đặc biệt',
            desc: 'Hiện nay khi đăng ký tài khoản mới, hầu hết các trang web đều yêu cầu mật khẩu của bạn phải chứa ít nhất một ký tự in hoa và một số. Điều này giúp tăng bảo mật cho tài khoản của bạn. Tuy nhiên chúng tôi khuyến nghị thêm ký tự đặc biệt cho mật khẩu của bạn. Bằng cách này, mật khẩu của bạn sẽ trở nên khó đoán và khó bị bẻ khóa hơn.'
          },
          {
            title: 'Mật khẩu có độ dài tối thiểu 12 ký tự',
            desc: 'Mặc dù các tiêu chuẩn như NIST 800-63B, GPDR, hay HIPAA chỉ khuyến nghị mật khẩu tối thiểu 8 ký tự. Tuy nhiên để tăng mức độ bảo mật tài khoản của bạn lên mức cao nhất, chúng tôi khuyến nghị các mật khẩu quan trọng của bạn nên có độ dài tối thiểu 12 ký tự. Thực tế, độ dài lý tưởng để có bảo mật tốt mà không quá dài là từ 12 - 20 ký tự.'
          },
          {
            title: 'Lưu mật khẩu của bạn dưới dạng mã hóa',
            desc: 'Trình quản lý mật khẩu như Locker cho phép bạn lưu tất cả mật khẩu dưới dạng mã hóa & mang theo mình đi bất kỳ đâu. Bạn có thể truy cập mật khẩu của mình trực tiếp trên trình duyệt web, máy tính cá nhân, smartphone. Locker trên iOS và Android cho phép truy cập mật khẩu ngay cả khi bạn đang ngoại tuyến.'
          },
          {
            title: 'Bật xác thực 2 bước khi đăng nhập',
            desc: 'Bật xác thực 2 bước giúp bạn tăng thêm một lớp bảo mật cho tài khoản. Sau khi nhập mật khẩu, các trang web sẽ yêu cầu nhập thêm mã gửi về email hoặc ứng dụng điện thoại của bạn để xác minh đăng nhập. Bằng cách này, ngay cả khi kẻ tấn công biết mật khẩu của bạn, chúng cũng không thể đăng nhập tài khoản của bạn.'
          },
          {
            title: 'Không chia sẻ mật khẩu bằng email hoặc tin nhắn văn bản',
            desc: 'Các hình thức nhắn tin như email, tin nhắn văn bản, hay Facebook Messenger không phải cách tốt nhất để chia sẻ mật khẩu với gia đình, bạn bè, và nhóm làm việc. Bạn nên sử dụng các phần mềm quản lý mật khẩu như Locker để chia sẻ mật khẩu an toàn. Locker cho phép chia sẻ mật khẩu ẩn, người được chia sẻ chỉ có thể sử dụng mà không thể xem mật khẩu, bạn cũng có thể chặn quyền truy cập của họ vào mật khẩu của mình khi không còn nhu cầu chia sẻ.'
          },
          {
            title: 'Thường xuyên kiểm tra dữ liệu rò rỉ trên mạng',
            desc: 'Bạn có thể kiểm tra xem các tài khoản của mình (bao gồm email, tên tài khoản, mật khẩu, tên người dùng) có bị lộ trên mạng hay không. Nếu tài khoản bị lộ, bạn nên đổi mật khẩu để kẻ xấu không thể lợi dụng tấn công. Sử dụng các công cụ như Have I been pwned? hay Kiểm tra tài khoản bị lộ sẽ giúp bạn biết được điều này. Ngoài ra, nếu bạn sử dụng trình quản lý mật khẩu Locker Premium, các tài khoản của bạn sẽ được kiểm tra định kỳ, giúp bạn biết ngay khi một trong các tài khoản của mình bị lộ trên internet.'
          }
        ]

      },
      use_locker: {
        title: 'Sử dụng công cụ tạo mật khẩu tích hợp vào trình duyệt và smartphone',
        img: 'save.png',
        desc: 'Bạn có thể sử dụng trình tạo mật khẩu mạnh tích hợp trong trình duyệt hoặc ứng dụng trên điện thoại của bạn. Chỉ việc tải Locker là bạn có thể tạo mật khẩu an toàn ngay khi bạn đăng ký tài khoản trên bất kỳ một website nào, ngay sau đó Locker sẽ ghi nhớ mật khẩu giúp bạn để sử dụng cho những lần sau.',
        link: 'Xem cách Locker hoạt động'
      },
      benefit: {
        title: 'Bạn đã từng gặp sự cố vì quên mật khẩu?',
        desc: 'Với trình quản lý mật khẩu Locker, bạn sẽ không bao giờ quên mật khẩu thêm một lần nào nữa. Lưu và tự động điền mật khẩu với mọi trang web dễ dàng và bảo mật.',
        features: [
          {
            title: 'Giải phóng trí nhớ của bạn',
            desc: 'Sử dụng tiện ích mở rộng trình duyệt hoặc ứng dụng Locker trên di động để tạo mật khẩu mạnh, lưu mật khẩu vào kho dữ liệu an toàn của bạn.',
            img: 'img3.png',
            link: 'Cài đặt tiện ích mở rộng trình duyệt'
          },
          {
            title: 'Locker bên bạn tới bất kỳ đâu',
            desc: 'Dù bạn làm việc trên máy tính, hay giải trí trên smartphone. Dù bạn lướt web trực tuyến, hay đang trong chuyến đi dã ngoại. Bạn luôn có thể truy cập vào mật khẩu của mình được lưu trữ an toàn trong ứng dụng Locker.',
            img: 'download.png',
            link: 'Tải ứng dụng Locker trên iOS & Android'
          }
        ]
      },
      cta2: {
        title: 'Trải nghiệm internet an toàn và liền mạch với Locker Password Manager',
        btn: {
          text: 'Tải miễn phí',
          link: '#'
        }
      }
    }
  },
  computed: {
    passwordStrength () {
      if (this.password) {
        return this.$passwordGenerationService.passwordStrength(this.password, ['cystack']) || {}
      }
      return {}
    }
  },
  mounted () {
    this.regenerate()
  },
  methods: {
    // gen_password () {
    //   let result = ''
    //   let characters = ''
    //   const passLength = this.form_gen.length
    //   const listLength = this.form_gen.check_list.length
    //   for (let i = 0; i < listLength - 1; i++) {
    //     if (this.form_gen.check_list[i].checked) {
    //       characters += this.form_gen.check_list[i].characters
    //     }
    //   }
    //   if (this.form_gen.check_list[listLength - 1].checked) {
    //     for (const chr in this.form_gen.check_list[listLength - 1].characters) {
    //       characters = characters.replace(this.form_gen.check_list[listLength - 1].characters[chr], '')
    //     }
    //   }
    //   for (let i = 0; i < passLength; i++) {
    //     result += characters.charAt(Math.floor(Math.random() * characters.length))
    //   }
    //   this.form_gen.password = result
    // },
    copy_password () {
      const cb = navigator.clipboard4
      const paragraph = document.getElementById('password')
      cb.writeText(paragraph.innerText).then(() => alert('Password copied'))
    },
    async regenerate () {
      if (!this.options.lowercase && !this.options.uppercase && !this.options.lowercase && !this.options.number && !this.options.special) {
        this.options.lowercase = true
      }
      const _options = { ...this.options }
      _options.ambiguous = !_options.ambiguous
      this.password = await this.$passwordGenerationService.generatePassword(_options)
    },
    updateLength () {
      this.options.length = parseInt(this.options.length)
      this.regenerate()
    }
  }
}
</script>

<style scoped>
.circle {
  height: 60px;
  width: 60px;
  background-color: #268334;
  border-radius: 50%;
  display: flex;
}
</style>
