<template>
  <div id="anchor">
    <section
      class="full-width pt-28 bg-[#EEF4ED] w-[100%] relative pb-[100px] px-5 md:px-20 overflow-inherit mb-[60px] min-h-[744px]"
    >
      <transition name="fade" mode="out-in">
        <!-- Not browser -->
        <template
          v-for="item in platforms"
        >
          <section
            v-if="chosen === item.key"
            :id="item.key"
            :key="item.key"
            class="animation"
          >
            <h1
              class="text-center font-bold text-black landing-font-42 mb-[12px]"
            >
              {{ item.data.title }}
            </h1>
            <h2
              class="text-center font-normal text-black-600 landing-font-20 mb-[35px]"
            >
              {{ item.data.subtitle }}
            </h2>
            <div
              class="grid gap-x-3 items-center max-w-[1010px] mx-auto justify-items-center justify-center min-h-[380px] md:flex md:justify-between"
            >
              <!-- Download buttons -->
              <div class="min-w-[310px] max-w-[310px] relative">
                <div>
                  <button v-if="item.data.button" class="button-download bg-tag1" @click="toggleList()">
                    <span>
                      {{ item.data.button }}
                    </span>
                    <i class="el-icon-arrow-down rotate-icon right" />
                  </button>

                  <div
                    class="grid gap-y-[12px] dropdown"
                    :class="{ 'show': listDownload || !item.data.button }"
                  >
                    <a
                      v-for="(btn, id) in item.data.list"
                      :key="id"
                      :class="{
                        'mt-[32px]': id === 0,
                        'pointer-events-none': !btn.link
                      }"
                      target="_blank"
                      :href="btn.link || '#'"
                    >
                      <button
                        :class="
                          btn.link ? 'button-download bg-tag1' : 'button-disable'
                        "
                      >
                        <span>
                          {{ btn.button }}
                        </span>
                        <img
                          v-if="btn.link"
                          src="~/assets/images/landing/download2/download.svg"
                          alt=""
                        >
                        <img
                          v-else
                          src="~/assets/images/landing/download2/download-disable.svg"
                          alt=""
                        >
                      </button>
                      <p
                        class="mt-[8px] text-[#617296] font-normal landing-font-14-2"
                      >
                        {{ btn.note }}
                      </p>
                    </a>
                  </div>

                  <!-- See what's new -->
                  <div class="flex my-[32px]">
                    <a
                      href="https://locker.io/release-notes"
                      class="text-[#216AE2] text-[15px] font-normal mr-[8px] hover:underline hover:text-[#216AE2] whitespace-nowrap"
                      target="_blank"
                    >
                      {{ $t('download.see_what_new') }} <i class="el-icon-right" />
                    </a>
                  </div>
                  <!-- See what's new end -->
                </div>
              </div>
              <!-- Download buttons end -->

              <!-- Image -->
              <img
                :src="require(`~/assets/images/landing/download2/${item.img.name}`)"
                :alt="item.key"
                class="w-[100%] sm:w-3/5 object-contain"
                :style="`max-width: ${item.img.width}`"
              >
              <!-- Image -->
            </div>
          </section>
        </template>
        <!-- Not browser end -->

        <!-- Browser -->
        <section v-if="chosen === 'web-browser'" id="web-browser" key="web-browser">
          <h1
            class="text-center font-bold text-black landing-font-42 mb-[12px]"
          >
            {{ $t('download.browser.title') }}
          </h1>
          <h2
            class="text-center font-normal text-black-600 landing-font-20 mb-[10px]"
          >
            {{ $t('download.browser.subtitle') }}
          </h2>
          <div class="flex flex-wrap justify-center gap-x-3">
            <div
              v-for="item in $t('download.browser.list')"
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
                  {{ $t('download.browser.install') }}
                </button>
              </a>
              <button
                v-else
                class="mt-3 py-[3px] px-[20px] font-semibold text-[#606060] bg-[#EBEEF2] rounded-sm box-border border-[1px] border-[#DADEE3] cursor-auto"
              >
                {{ $t('download.coming') }}
              </button>
            </div>
          </div>
          <img
            src="~/assets/images/landing/download2/section5.svg"
            alt=""
            class="max-w-[600px] mb-[-100px] w-[100%] mx-auto"
          >
        </section>
        <!-- Browser end -->
      </transition>

      <!-- Selector -->
      <div
        class="absolute bottom-[-78px] max-w-[1121px] rounded-[16px] absolute-center card-section1 mx-4 px-[20px] py-[19px] md:px-[84px]"
      >
        <div class="flex overflow-x-auto justify-start lg:justify-center">
          <a
            v-for="item in selectors"
            :key="item.link"
            :href="`#${item.link}`"
            class="py-5 mx-2 min-w-[124px] rounded-sm link-contain"
            :class="chosen == item.link ? 'bg-[#E3EDE6]' : 'hover:bg-[#E3EDE6]'"
          >
            <div class="block w-fit mx-auto h-[40px]">
              <img
                v-if="chosen !== item.link"
                :src="
                  require(`~/assets/images/landing/download2/${item.imageSrc}`)
                "
                :alt="item.title"
              >
              <img
                v-else
                :src="
                  require(`~/assets/images/landing/download2/${item.hover}`)
                "
                :alt="item.title"
              >
            </div>
            <p class="font-normal text-[#717171] text-center mt-[14px]">
              {{ item.title }}
            </p>
          </a>
        </div>
      </div>
      <!-- Selector end -->
    </section>
  </div>
</template>

<script>
export default {
  layout: 'landing',

  data () {
    return {
      chosen: '',
      listDownload: false,
      notionData: []
    }
  },

  computed: {
    selectors () {
      return [
        {
          title: 'macOS',
          imageSrc: 'macOS.svg',
          hover: 'hover-macOS.svg',
          link: 'macos'
        },
        {
          title: 'Windows',
          imageSrc: 'windows.svg',
          hover: 'hover-windows.svg',
          link: 'windows'
        },
        {
          title: 'iOS',
          imageSrc: 'iOS.svg',
          hover: 'hover-iOS.svg',
          link: 'ios'
        },
        {
          title: 'Android',
          imageSrc: 'android.svg',
          hover: 'hover-Android.svg',
          link: 'android'
        },
        {
          title: 'Linux',
          imageSrc: 'linux.svg',
          hover: 'hover-linux.svg',
          link: 'linux'
        },
        {
          title: 'Web Browser',
          imageSrc: 'webBrowser.svg',
          hover: 'hover-web-browser.svg',
          link: 'web-browser'
        }
      ]
    },

    platforms () {
      const keys = [
        'macos',
        'windows',
        'ios',
        'android',
        'linux'
      ]
      const imgs = {
        macos: {
          name: 'section2.png',
          width: '550px'
        },
        windows: {
          name: 'section3.png',
          width: '620px'
        },
        ios: {
          name: 'section6.png',
          width: '440px'
        },
        android: {
          name: 'section7.png',
          width: '430px'
        },
        linux: {
          name: 'linux-image.png',
          width: '637px'
        }
      }
      return keys.map(key => {
        const obj = { ...this.$t(`download.${key}`) }
        obj.list.forEach(btn => {
          const notionItem = this.notionData.find(item => item.Tag === btn.tag)
          if (notionItem) {
            btn.link = notionItem.Link
          }
        })
        return {
          key,
          img: imgs[key],
          data: obj
        }
      })
    }
  },

  mounted () {
    this.getNotionData()
    this.onHashChange()
    window.addEventListener('hashchange', this.onHashChange)
  },

  beforeDestroy () {
    window.removeEventListener('hashchange', this.onHashChange)
  },

  methods: {
    onHashChange () {
      this.listDownload = false
      const target = document.querySelector('#anchor')
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
      let currentAnchor = this.$route.hash.replace('#', '')
      const validPlatforms = ['windows', 'android', 'ios', 'linux', 'web-browser', 'macos']
      if (currentAnchor && validPlatforms.includes(currentAnchor)) {
        this.chosen = currentAnchor
      } else {
        const os = this.$ua.os()
        if (os.includes('Windows')) {
          currentAnchor = 'windows'
        } else if (os.includes('iPad') || os.includes('iPhone')) {
          currentAnchor = 'ios'
        } else if (os.includes('Android')) {
          currentAnchor = 'android'
        } else if (os.includes('Linux')) {
          currentAnchor = 'linux'
        } else {
          currentAnchor = 'macos'
        }
        this.chosen = currentAnchor
      }
    },

    toggleList () {
      this.listDownload = !this.listDownload
      const icon = document.querySelector('.rotate-icon')
      icon.classList.toggle('rotate')
    },

    getNotionData () {
      this.$axios.$get(`${process.env.baseUrl}/api/download`).then(res => {
        this.notionData = res.data
      }).catch(e => {
        console.log('download notion err', e)
      })
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
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
  transition: max-height .5s ease; /* tạo hiệu ứng từ trên xuống dưới */
}

.dropdown.show {
  max-height: 700px; /* ví dụ */
}
</style>
