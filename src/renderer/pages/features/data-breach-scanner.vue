<template>
  <div>
    <section
      class="bg-[#F5F6F7] pt-[151px] full-width px-6 pt-[173px] pb-[86px]"
    >
      <div class="text-center">
        <div
          id="title1"
          class="font-bold leading-[64px] text-[40px] text-[#195723] mb-[22px] sm:text-[48px]"
        >
          {{ $t('data_breach_scanner.title') }}
        </div>
        <div class="font-normal text-[20px] leading-[32px] text-[#3A3A3A]">
          {{ $t('data_breach_scanner.subtitle') }}
        </div>
      </div>
      <div class="text-center pt-[56px]">
        <div
          id="div-input"
          class="relative w-full max-w-[896px] mx-auto border-[1px] border-[#DFDFDF] bg-[#FFFFFF]"
        >
          <input
            id="input-email"
            type="text"
            :placeholder="$t('data_breach_scanner.enter')"
            autocomplete="off"
            class="border-0 p-0 w-[calc(100%-130px)] my-[26px] ml-[42px] mr-[108px] text-[22px] leading-[20px] font-normal"
            @keyup.enter="getData"
          >
          <img
            src="~/assets/images/landing/features/icon-input.svg"
            class="cursor-pointer absolute right-0 mr-[33px] my-auto top-0 bottom-0"
            alt=""
            @click="getData"
          >
        </div>
        <div
          class="pt-[32px] text-[14px] leading-[19px] font-normal text-[#979797]"
        >
          {{ $t('data_breach_scanner.note') }}
        </div>
      </div>
      <div
        v-loading="loading"
        class="w-full full-w text-[#000000] max-w-[1110px] mx-auto mt-[52px]"
      >
        <div v-if="breaches == 0">
          <div
            class="flex justify-center bg-[#58BF66] rounded-[24px] px-[30px] py-[32px] box-border border-[1px] border-[#DFDFDF]"
          >
            <img
              src="~/assets/images/landing/features/ShieldCheck.svg"
              alt=""
              class="mr-[10px] h-[30px] self-center sm:h-[35px] sm:mr-[20px]"
            >
            <div
              class="font-bold text-[22px] text-center leading-[30px] text-[#FFFFFF] sm:leading-[60px] sm:text-[32px]"
            >
              {{ $t('data_breach_scanner.box.title.safe') }}
            </div>
          </div>
        </div>

        <div v-else>
          <div
            class="flex justify-center bg-[#F54F64] rounded-t-[44px] px-[30px] py-[32px] box-border border-[1px] border-[#DFDFDF]"
          >
            <img
              src="~/assets/images/landing/features/ShieldWarning.svg"
              alt=""
              class="mr-[10px] h-[30px] self-center sm:h-[35px] sm:mr-[20px]"
            >
            <div
              class="font-bold text-[22px] text-center leading-[30px] text-[#FFFFFF] sm:leading-[60px] sm:text-[32px]"
            >
              {{
                $t('data_breach_scanner.box.title.warning', {
                  breaches: breaches
                })
              }}
            </div>
          </div>
          <div
            class="pt-[36px] box-border border-[1px] rounded-b-[44px] border-[#DFDFDF] pb-[36px] bg-[#FFFFFF]"
          >
            <div
              class="font-normal text-[24px] leading-[27px] text-center mb-[22px]"
            >
              {{ $t('data_breach_scanner.box.subtitle') }}
            </div>
            <div class="block sm:grid sm:grid-cols-2">
              <div
                v-for="(item, index) in response"
                :key="index"
                class="flex pt-[22px] pb-[36px] px-[100px]"
              >
                <div class="w-[50px] mr-[16px]">
                  <img :src="item.logo_path" alt="" class="logo min-w-[50px]">
                </div>
                <div class="space-y-[16px]">
                  <div class="font-semibold text-[28px] leading-[37px]">
                    {{ item.name }}
                  </div>
                  <div class="space-y-[8px]">
                    <div
                      class="font-normal text-[18px] leading-[27px] text-[#979797]"
                    >
                      {{ $t('data_breach_scanner.box.infor1') }}
                    </div>
                    <div class="font-normal text-[20px] leading-[27px]">
                      {{ item.breach_date }}
                    </div>
                  </div>
                  <div class="space-y-[8px]">
                    <div
                      class="font-normal text-[18px] leading-[27px] text-[#979797]"
                    >
                      {{ $t('data_breach_scanner.box.infor2') }}
                    </div>
                    <span
                      v-for="(data, index) in item.data_classes"
                      :key="index"
                      class="font-normal text-[20px] leading-[27px]"
                    >
                      <span v-if="index == 0">{{ data }}</span><span v-else>, {{ data }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-[120px] text-[#000000] w-full max-w-[897px] mx-auto">
        <div class="text-center font-semibold text-[28px] leading-[38px]">
          {{ $t('data_breach_scanner.detail1.title') }}
        </div>
        <div
          class="mt-[48px] text-center space-y-[42px] sm:space-y-0 sm:space-x-[42px]"
        >
          <a class="landing-btn" href="#title1">
            {{ $t('data_breach_scanner.detail1.button1') }}
          </a>

          <nuxt-link class="landing-btn" :to="localePath('/download')">
            {{ $t('data_breach_scanner.detail1.button2') }}
          </nuxt-link>
        </div>
      </div>
    </section>

    <div class="mt-[120px] max-w-[936px] mx-auto">
      <div
        class="block text-[#000000] space-y-[30px] justify-center items-center md:space-y-0 md:flex md:space-x-[48px]"
      >
        <div
          v-for="(item, index) in $t('data_breach_scanner.detail1.box')"
          :key="index"
          class="w-auto md:w-[33%] mx-auto flex items-center justify-center text-center max-w-[280px] h-[244px] bg-[#F5F6F7] rounded-[16px]"
        >
          <div>
            <div
              class="font-bold text-[55px] leading-[73px] text-[#F84259] md:text-[40px] lg:text-[55px]"
            >
              {{ item.number }}
            </div>
            <div
              class="max-w-[171px] mx-auto font-normal text-[20px] leading-[30px] mt-[12px]"
            >
              {{ item.subtitle }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="mt-[21px] font-normal text-[16px] leading-[24px] text-[#979797]"
      >
        {{ $t('data_breach_scanner.detail1.note') }}
      </div>
    </div>

    <section class="space-x-[37px] mt-[120px] lg:flex">
      <img
        src="~/assets/images/landing/features/detail/bitmap.svg"
        alt=""
        class="mb-[40px] mx-auto lg:mb-0"
      >
      <div class="space-y-[40px] text-[#000000]">
        <div class="title">
          {{ $t('data_breach_scanner.detail2.title') }}
        </div>
        <div class="font-normal text-[18px] leading-[32px]">
          {{ $t('data_breach_scanner.detail2.subtitle') }}
        </div>
        <div
          v-for="(item, index) in $t('data_breach_scanner.detail2.list')"
          :key="index"
        >
          <div
            class="flex space-x-[14px] font-normal text-[18px] leading-[31px]"
          >
            <img
              src="~/assets/images/landing/features/correct.svg"
              alt=""
              class="logo"
            >
            <div>
              {{ item }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-[200px] text-[#000000]">
      <div class="title text-center">
        {{ $t('data_breach_scanner.detail3.title') }}
      </div>
      <img
        src="~/assets/images/landing/features/right-line.svg"
        alt=""
        class="mx-auto mt-[24px]"
      >
      <div class="space-y-[33px] mt-[48px]">
        <div class="font-normal text-[22px] leading-[30px]">
          {{ $t('data_breach_scanner.detail3.subtitle') }}
        </div>
        <div
          v-for="(item, index) in $t('data_breach_scanner.detail3.list')"
          :key="index"
          class="flex"
        >
          <div
            class="bg-primary text-white h-fit font-bold px-[15px] py-[5px] text-head-5 rounded"
          >
            {{ index + 1 }}
          </div>
          <div
            class="ml-[22px] self-center text-[22px] leading-[30px] font-semibold"
          >
            {{ item }}
          </div>
        </div>
        <div
          v-if="locale === 'en'"
          class="font-normal text-[22px] leading-[27px]"
        >
          <span>{{ $t('data_breach_scanner.detail3.link1') }}</span>
          <nuxt-link
            class="password-manager"
            :to="localePath('/blog/what-is-a-password-manager')"
          >
            {{ $t('data_breach_scanner.detail3.link2') }}
          </nuxt-link>
          <span>{{ $t('data_breach_scanner.detail3.link3') }}</span>
        </div>
      </div>
    </section>

    <section class="mt-[170px] full-width min-h-[670px] relative">
      <div class="max-w-6xl mx-auto px-6 z-10 relative">
        <div
          class="font-bold text-[30px] leading-[50px] text-[#161922] sm:text-[38px]"
        >
          {{ $t('data_breach_scanner.detail4.title') }}
        </div>
        <div class="max-w-[742px] mt-[60px]">
          <div
            v-for="(item, index) in $t('data_breach_scanner.detail4.content')"
            :key="index"
            :class="
              index == 0
                ? 'relative overflow-hidden py-[39px]'
                : 'relative overflow-hidden py-[39px] border-t border-[#DFDFDF]'
            "
          >
            <input
              type="checkbox"
              class="peer absolute top-[46px] right-0 w-[30px] h-[30px] opacity-0 z-10 cursor-pointer"
            >
            <div class="font-bold text-[22px] leading-[30px] text-[#161922]">
              {{ item.question }}
            </div>
            <div
              class="absolute top-[46px] right-0 transition-transform duration-500 rotate-0 peer-checked:rotate-180"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
            <div
              v-if="locale === 'vi' && index === 3"
              class="font-normal text-[18px] text-[#5A6176] leading-[30px] overflow-hidden h-0 peer-checked:h-auto peer-checked:pt-[28px]"
            >
              <div>{{ item.answer1 }}</div>
              <br>
              <span>
                {{ item.answer2 }}
                <nuxt-link
                  class="password-manager"
                  :to="localePath('/blog/quan-ly-mat-khau-la-gi')"
                >
                  {{ item.link }}</nuxt-link>.
              </span>
            </div>
            <div
              v-else
              class="font-normal text-[18px] text-[#5A6176] leading-[30px] overflow-hidden h-0 peer-checked:h-auto peer-checked:pt-[28px]"
              v-html="item.answer"
            />
          </div>
        </div>
      </div>
      <img
        src="~/assets/images/landing/features/detail/search-mockup.svg"
        alt=""
        class="hidden lg:block z-0 absolute top-0 right-0"
      >
    </section>

    <section
      class="max-w-[1110px] bg-[#F5F6F7] rounded-[10px] mt-[60px] py-[64px]"
    >
      <div
        class="font-bold text-[38px] leading-[50px] text-[#161922] text-center"
      >
        {{ $t('data_breach_scanner.detail5.title') }}
      </div>
      <div
        class="font-normal text-[18px] leading-[30px] mt-[12px] mb-[40px] text-center"
      >
        {{ $t('data_breach_scanner.detail5.subtitle') }}
      </div>
      <div class="text-center">
        <nuxt-link
          class="mx-auto landing-btn"
          :to="localePath('/download')"
          style="align-self: center"
        >
          {{ $t('data_breach_scanner.detail5.button') }}
        </nuxt-link>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  layout: 'landing',
  data () {
    return {
      loading: false,
      response: {},
      breaches: 0
    }
  },
  mounted () {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        })
      })
    })
  },
  methods: {
    async getData () {
      this.loading = true
      const textEmail = document.getElementById('input-email')
      try {
        const moutains = await this.$axios
          .$post(
            'https://api.locker.io/v3/cystack_platform/pm/tools/public/breach',
            {
              email: textEmail.value
            }
          )
          .then(res => {
            this.response = res
            this.breaches = res.length
          })
        return { moutains }
      } catch (e) {
        if (e.request.status === 400) {
          this.notify(this.$tc('errors.0004', 1), 'error')
        } else {
          this.notify(this.$tc('errors.oops', 1), 'error')
        }
      } finally {
        this.loading = false
      }
    },
    register () {
      const environment = process.env.environment
      window.location.href = `${process.env.idUrl}/register?SERVICE_URL=${
        this.$store.state.currentPath !== '/'
          ? encodeURIComponent(`${this.$store.state.currentPath}`)
          : '/vault'
      }&SERVICE_SCOPE=pwdmanager&lang=${this.store.state.user.language}${
        environment ? `&ENVIRONMENT=${environment}` : ''
      }`
    }
  }
}
</script>
<style scoped>
.logo {
  height: fit-content;
}

.h-fit {
  height: fit-content;
}

.title {
  font-weight: 700;
  font-size: 38px;
  line-height: 50px;
}

@media (max-width: 640px) {
  .title {
    font-weight: 700;
    font-size: 35px;
    line-height: 35px;
  }
}
.question-box {
  border: 1px solid #dfdfdf;
  padding-top: 7px;
  box-shadow: 0px 64px 100px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

#div-input {
  border-radius: 44px;
  box-shadow: 0px 3.5px 5.5px rgba(0, 0, 0, 0.05);
}

.password-manager {
  color: #268334;
  cursor: pointer;
}
.password-manager:hover {
  text-decoration: underline;
  text-decoration-color: #268334;
}
</style>
