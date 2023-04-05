<template>
  <div id="anchor">
    <section
      class="full-width pt-28 bg-[#EEF4ED] w-[100%] relative pb-[100px] px-5 md:px-20 overflow-inherit mb-[60px] min-h-[744px]"
    >
      <transition name="fade" mode="out-in">
        <!-- Macos -->
        <section v-if="chosen == 'macos'" id="macos" key="1" class="animation">
          <div class="absolute top-[70px] lg:top-[120px] right-[50%] sm:right-[75%] text-[#FFFFFF] width-comming-soon bg-tag1 landing-font-16 font-semibold">
            {{ $t("download.section3.coming") }}
          </div>
          <h1 class="text-center font-bold text-black landing-font-42 mb-[12px]">
            {{ $t("download.section1.title") }}
          </h1>
          <h2 class="text-center font-normal text-black-600 landing-font-20 mb-[35px]">
            {{ $t("download.section1.subtitle") }}
          </h2>
          <div class="grid gap-x-3 items-center max-w-[1010px] mx-auto justify-items-center justify-center min-h-[380px] md:flex md:justify-between">
            <div class="min-w-[310px] max-w-[310px] relative">
              <div>
                <button class="button-download bg-tag1" @click="toggleList()">
                  <span>
                    {{ $t('download.section2.button') }}
                  </span>
                  <img src="~/assets/images/landing/download2/down.svg" alt="" class="rotate-icon">
                </button>
                <div class="grid gap-y-[12px] dropdown" :class="listDownload ? 'show ' : ''">
                  <div
                    v-for="(item, id) in $t('download.section2.list')"
                    :key="id"
                    :class="id == 0 ? 'mt-[32px]' : ''"
                  >
                    <button class="button-disable">
                      <span>
                        {{ item.button }}
                      </span>
                      <img src="~/assets/images/landing/download2/download-disable.svg" alt="">
                    </button>
                    <p class="mt-[8px] text-[#617296] font-normal landing-font-14-2">
                      {{ item.note }}
                    </p>
                  </div>
                </div>
                <div class="flex my-[32px]">
                  <a
                    href="https://locker.io/release-notes"
                    class="text-[#216AE2] text-[15px] font-normal mr-[8px] hover:underline hover:text-[#216AE2] whitespace-nowrap "
                    target="_blank"
                  >
                    {{ $t('download.section2.link') }}
                  </a>
                  <img src="~/assets/images/landing/download2/right-blue.svg" alt="">
                </div>
              </div>
            </div>
            <img src="~/assets/images/landing/download2/section2.png" alt="" class="max-w-[550px] w-[100%] sm:w-3/5 object-contain">
          </div>
        </section>
        <!-- Windows -->
        <section v-if="chosen == 'windows'" id="windows" key="2" class="animation">
          <div class="absolute top-[70px] lg:top-[120px] right-[50%] sm:right-[75%] text-[#FFFFFF] width-comming-soon bg-tag2 landing-font-16 font-semibold">
            {{ $t('download.section3.coming') }}
          </div>
          <h1 class="text-center font-bold text-black landing-font-42 mb-[12px]">
            {{ $t("download.section4.title") }}
          </h1>
          <h2 class="text-center font-normal text-black-600 landing-font-20 mb-[35px]">
            {{ $t("download.section4.subtitle") }}
          </h2>
          <div class="grid justify-center md:justify-between gap-x-3 items-center max-w-[1010px] justify-items-center mx-auto min-h-[380px] md:flex">
            <div class="min-w-[310px] max-w-[310px] relative">
              <div>
                <div class="grid gap-y-[32px]">
                  <div
                    v-for="(item, id) in $t('download.section4.list')"
                    :key="id"
                  >
                    <button class="button-disable">
                      <span>
                        {{ item.button }}
                      </span>
                      <img src="~/assets/images/landing/download2/download-disable.svg" alt="">
                    </button>
                    <p class="mt-[8px] text-[#617296] font-normal landing-font-14-2">
                      {{ item.note }}
                    </p>
                  </div>
                </div>
                <div class="flex my-[32px]">
                  <a
                    href="https://locker.io/release-notes"
                    class="text-[#216AE2] text-[15px] font-normal mr-[8px] hover:underline hover:text-[#216AE2] whitespace-nowrap "
                    target="_blank"
                  >
                    {{ $t('download.section2.link') }}
                  </a>
                  <img src="~/assets/images/landing/download2/right-blue.svg" alt="">
                </div>
              </div>
            </div>
            <img src="~/assets/images/landing/download2/section3.png" alt="" class="max-w-[620px] w-[100%] sm:w-3/5 object-contain">
          </div>
        </section>
        <!-- ios -->
        <section v-if="chosen == 'ios'" id="ios" key="3" class="animation">
          <h1 class="text-center font-bold text-black landing-font-42 mb-[12px]">
            {{ $t("download.section5.title") }}
          </h1>
          <h2 class="text-center font-normal text-black-600 landing-font-20 mb-[35px]">
            {{ $t("download.section5.subtitle") }}
          </h2>
          <div class="grid justify-center md:justify-between gap-x-3 items-center justify-items-center max-w-[1010px] min-h-[380px] mx-auto md:flex">
            <div class="max-w-[310px] relative">
              <div>
                <div class="grid gap-y-[32px]">
                  <a
                    v-for="(item, id) in $t('download.section5.list')"
                    :key="id"
                    target="_blank"
                    :href="item.link"
                  >
                    <button class="button-download button-ios">
                      <span>
                        {{ item.button }}
                      </span>
                      <img src="~/assets/images/landing/download2/download.svg" alt="">
                    </button>
                    <p class="mt-[8px] text-[#617296] font-normal landing-font-14-2">
                      {{ item.note }}
                    </p>
                  </a>
                </div>
                <div class="flex my-[32px]">
                  <a
                    href="https://locker.io/release-notes"
                    class="text-[#216AE2] text-[15px] font-normal mr-[8px] hover:underline hover:text-[#216AE2] whitespace-nowrap "
                    target="_blank"
                  >
                    {{ $t('download.section2.link') }}
                  </a>
                  <img src="~/assets/images/landing/download2/right-blue.svg" alt="">
                </div>
              </div>
            </div>
            <img src="~/assets/images/landing/download2/section6.png" alt="" class="max-w-[440px] w-[100%] sm:w-3/5 object-contain">
          </div>
        </section>
        <!-- android -->
        <section v-if="chosen == 'android'" id="android" key="4" class="animation">
          <h1 class="text-center font-bold text-black landing-font-42 mb-[12px]">
            {{ $t("download.section6.title") }}
          </h1>
          <h2 class="text-center font-normal text-black-600 landing-font-20 mb-[35px]">
            {{ $t("download.section6.subtitle") }}
          </h2>
          <div class="grid justify-center md:justify-between gap-x-3 items-center justify-items-center max-w-[1010px] mx-auto md:flex">
            <div class="min-w-[310px] max-w-[310px] relative">
              <div>
                <div class="grid gap-y-[32px]">
                  <a
                    v-for="(item, id) in $t('download.section6.list')"
                    :key="id"
                    :href="item.link"
                    target="_blank"
                  >
                    <button class="button-download button-android">
                      <span>
                        {{ item.button }}
                      </span>
                      <img src="~/assets/images/landing/download2/download.svg" alt="">
                    </button>
                    <p class="mt-[8px] text-[#617296] font-normal landing-font-14-2">
                      {{ item.note }}
                    </p>
                  </a>
                </div>
                <div class="flex my-[32px]">
                  <a
                    href="https://locker.io/release-notes"
                    class="text-[#216AE2] text-[15px] font-normal mr-[8px] hover:underline hover:text-[#216AE2] whitespace-nowrap "
                    target="_blank"
                  >
                    {{ $t('download.section2.link') }}
                  </a>
                  <img src="~/assets/images/landing/download2/right-blue.svg" alt="">
                </div>
              </div>
            </div>
            <img src="~/assets/images/landing/download2/section7.png" alt="" class="max-w-[430px] w-[100%] sm:w-3/5 object-contain">
          </div>
        </section>
        <!-- linux -->
        <section v-if="chosen == 'linux'" id="linux" key="5" class="animation">
          <div class="absolute top-[70px] lg:top-[120px] right-[50%] sm:right-[75%] text-[#FFFFFF] width-comming-soon bg-tag3 landing-font-16 font-semibold">
            {{ $t('download.section3.coming') }}
          </div>
          <h1 class="text-center font-bold text-black landing-font-42 mb-[12px]">
            {{ $t("download.section7.title") }}
          </h1>
          <h2 class="text-center font-normal text-black-600 landing-font-20 mb-[35px]">
            {{ $t("download.section7.subtitle") }}
          </h2>
          <div class="grid justify-between gap-x-3 items-center justify-items-center max-w-[1010px] min-h-[380px] mx-auto md:flex">
            <div class="min-w-[310px] max-w-[310px] relative">
              <div>
                <button class="button-download bg-tag3" @click="toggleList()">
                  <span>
                    {{ $t('download.section7.button') }}
                  </span>
                  <img src="~/assets/images/landing/download2/down.svg" alt="" class="rotate-icon">
                </button>
                <div class="grid gap-y-[12px] dropdown" :class="listDownload ? 'show ' : ''">
                  <div
                    v-for="(item, id) in $t('download.section7.list')"
                    :key="id"
                    :class="id == 0 ? 'mt-[32px]' : ''"
                  >
                    <button class="button-disable">
                      <span>
                        {{ item.button }}
                      </span>
                      <img src="~/assets/images/landing/download2/download-disable.svg" alt="">
                    </button>
                    <p class="mt-[8px] text-[#617296] font-normal landing-font-14-2">
                      {{ item.note }}
                    </p>
                  </div>
                </div>
                <div class="flex my-[32px]">
                  <a
                    href="https://locker.io/release-notes"
                    class="text-[#216AE2] text-[15px] font-normal mr-[8px] hover:underline hover:text-[#216AE2] whitespace-nowrap "
                    target="_blank"
                  >
                    {{ $t('download.section2.link') }}
                  </a>
                  <img src="~/assets/images/landing/download2/right-blue.svg" alt="">
                </div>
              </div>
            </div>
            <img src="~/assets/images/landing/download2/linux-image.png" alt="" class="max-w-[637px] w-[100%] sm:w-3/5 object-contain">
          </div>
        </section>
        <!-- web browser -->
        <section v-if="chosen == 'web-browser'" id="web-browser" key="6">
          <h1 class="text-center font-bold text-black landing-font-42 mb-[12px]">
            {{ $t("download.section3.title") }}
          </h1>
          <h2
            class="text-center font-normal text-black-600 landing-font-20 mb-[10px]"
          >
            {{ $t("download.section3.subtitle") }}
          </h2>
          <div class="flex flex-wrap justify-center gap-x-3">
            <div
              v-for="item in $t('download.section3.list')"
              :key="item.name"
              class="w-[135px] mt-6 text-webkit"
            >
              <div class="h-[60px]">
                <img
                  :src="
                    require(`~/assets/images/landing/download2/${item.imgSrc}`)
                  "
                  alt=""
                >
              </div>
              <p class="mt-3 font-semibold text-[#121212]">{{ item.name }}</p>
              <a v-if="item.active" :href="item.link" target="_blank">
                <button
                  class="mt-3 py-[3px] px-[20px] font-semibold text-[#FFFFFF] bg-[#62AD56] rounded-sm hover:bg-[#2D702C]"
                >
                  {{ $t("download.section3.install") }}
                </button>
              </a>
              <button
                v-else
                class="mt-3 py-[3px] px-[20px] font-semibold text-[#606060] bg-[#EBEEF2] rounded-sm box-border border-[1px] border-[#DADEE3] cursor-auto"
              >
                {{ $t("download.section3.coming") }}
              </button>
            </div>
          </div>
          <img
            src="~/assets/images/landing/download2/section5.svg"
            alt=""
            class="max-w-[600px] mb-[-100px] w-[100%] mx-auto"
          >
        </section>
      </transition>
      <!-- icons -->
      <div
        class="absolute bottom-[-78px] max-w-[1121px] rounded-[16px] absolute-center card-section1 mx-4 px-[20px] py-[19px] md:px-[84px]"
      >
        <div class="flex overflow-x-auto justify-start lg:justify-center">
          <a
            v-for="item in $t('download.section1.card')"
            :key="item.title"
            href="#anchor"
            :custom-href="'#' + item.link"
            class="py-5 mx-2 min-w-[124px] rounded-sm link-contain"
            :class="chosen == item.link ? 'bg-[#E3EDE6]' : 'hover:bg-[#E3EDE6]'"
            @click="setChosen(item.link)"
          >
            <div class="block w-fit mx-auto h-[40px]">
              <img
                v-if="chosen !== item.link"
                :src="require(`~/assets/images/landing/download2/${item.imageSrc}`)"
                :alt="item.title"
              >
              <img
                v-else
                :src="require(`~/assets/images/landing/download2/${item.hover}`)"
                :alt="item.title"
              >
            </div>
            <p class="font-normal text-[#717171] text-center mt-[14px]">
              {{ item.title }}
            </p>
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
      chosen: '',
      listDownload: false
    }
  },
  mounted () {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()
        const customHref = anchor.getAttribute('custom-href')
        const target = document.querySelector('#anchor')
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' })
          const newUrl = window.location.origin + window.location.pathname + customHref
          history.pushState({}, '', newUrl)
        }
      })
    })
    const currentAnchor = this.$route.hash
    if (currentAnchor) {
      switch (currentAnchor) {
      case '#windows':
        this.chosen = 'windows'
        break
      case '#android':
        this.chosen = 'android'
        break
      case '#ios':
        this.chosen = 'ios'
        break
      case '#linux':
        this.chosen = 'linux'
        break
      case '#web-browser':
        this.chosen = 'web-browser'
        break
      default:
        this.chosen = 'macos'
      }
    } else {
      const os = this.$ua.os()
      if (os.includes('Windows')) this.chosen = 'windows'
      if (os.includes('iPad') || os.includes('iPhone')) this.chosen = 'ios'
      if (os.includes('Android')) this.chosen = 'android'
      if (os.includes('Linux')) this.chosen = 'linux'
    }
  },
  methods: {
    setChosen (link) {
      this.chosen = link
      this.listDownload = false
    },
    toggleList () {
      this.listDownload = !this.listDownload
      const icon = document.querySelector('.rotate-icon')
      icon.classList.toggle('rotate')
    }
  }
}
</script>

<style scoped>
.card-section1 {
  background-color: #ffffff;
  box-shadow: 0px 107px 43px rgba(0, 0, 0, 0.01),
    0px 60px 36px rgba(0, 0, 0, 0.03), 0px 27px 27px rgba(0, 0, 0, 0.04),
    0px 7px 15px rgba(0, 0, 0, 0.05), 0px 0px 0px rgba(0, 0, 0, 0.05);
}
.center-webkit {
  text-align: -webkit-center;
}
.w-fit {
  width: fit-content;
}
.absolute-center {
  margin-left: auto;
  margin-right: auto;
  left: 24px;
  right: 24px;
}
.overflow-inherit {
  overflow: inherit;
}
.button-download {
  width: 298px;
  justify-content: space-between;
  display: flex;
  padding: 10px 20px;
  color: #ffffff;
  border-radius: 4px;
  align-items: center;
}
.button-download:hover {
  opacity: 0.7;
}
.bg-tag1 {
  background: linear-gradient(92.77deg, #f36cff -46.79%, #9781ff 106.78%);
}
.bg-tag2 {
  background: linear-gradient(87.29deg, #34e98d -9.88%, #4c9aff 102.53%);
}
.bg-tag3 {
  background: linear-gradient(
    266.66deg,
    #22a2ff -3.45%,
    #2262ff 59.41%,
    #2222ff 122.27%
  );
}
.button-web-browser {
  background: linear-gradient(
    93.19deg,
    #ff0844 -68.98%,
    #ff5c6e 33.26%,
    #ffb199 137.66%
  );
}
.button-ios {
  background: linear-gradient(92.51deg, #ffa53a -60.81%, #ff3e3e 146.04%);
}
.button-android {
  background: linear-gradient(
    273.87deg,
    #62ad56 -72.83%,
    #6fd065 48.37%,
    #7af072 182.9%
  );
}
.button-disable {
  width: 298px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding: 10px 24px;
  color: #c2c4c7;
  background: #ebeef2;
  border: 1px solid #dadee3;
  border-radius: 4px;
  align-items: center;
}
.button-disable-center {
  width: 298px;
  display: flex;
  justify-content: center;
  flex-direction: row;
  padding: 10px 24px;
  color: #c2c4c7;
  background: #ebeef2;
  border: 1px solid #dadee3;
  border-radius: 4px;
  align-items: center;
  cursor: auto;
}
.text-webkit {
  text-align: -webkit-center;
}
.width-comming-soon {
  width: calc(25vw + 170px);
  direction: rtl;
  padding: 10px 25px;
  border-radius: 75px;
}
.link-contain .hover-image {
  display: none;
}
.link-contain:hover .hover-image {
  display: block;
}
.link-contain:hover .normal-image {
  display: none;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
.rotate-icon {
  transition: transform 0.3s ease-in-out; /* Thêm hiệu ứng transition */
}
.rotate-icon.rotate {
  transform: rotate(180deg); /* Áp dụng thuộc tính transform để xoay 180 độ */
}
.dropdown {
  max-height: 0;
  overflow: hidden;
  transition: max-height 1s ease-out; /* tạo hiệu ứng từ trên xuống dưới */
}

.dropdown.show {
  max-height: 700px; /* ví dụ */
}
</style>
