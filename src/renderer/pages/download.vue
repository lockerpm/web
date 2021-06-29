<template>
  <div>
    <!-- Header -->
    <section class="full-width h-auto">
      <div class="md:pt-[200px] pt-28 mx-auto pl-6">
        <div class="w-full flex flex-wrap justify-end">
          <div class="md:max-w-[570px] md:w-1/2 order-1 mb-8 md:mb-0">
            <h1 class="text-left w-11/12 font-bold text-black landing-font-50 mb-[24px]">
              {{ header.title }}
            </h1>
            <img
              src="~/assets/images/landing/download/boundary.svg"
              alt=""
            >
            <p class="md:max-w-[350px] text-left font-normal text-black-600 landing-font-20 mb-[50px] mt-[18px]">
              {{ header.desc }}
            </p>
            <div class="max-w-xs mb-4 sm:mb-0">
              <a
                class="landing-btn w-full sm:w-auto mb-1"
                :href="header.btn.link"
              >
                {{ header.btn.text }}
              </a>
            </div>
          </div>
          <!-- Right -->
          <div class="hidden md:block md:w-1/2 order-2 jusify-self-end pr-0 mb-10">
            <img
              :src="require(`~/assets/images/landing/${header.img}`)"
              alt=""
              style="width:100%;"
            >
          </div>
          <div class="w-full md:hidden order-2">
            <img
              src="~/assets/images/landing/download/img_1.png"
              alt=""
            >
          </div>
          <!-- Right end -->
        </div>
      </div>
    </section>
    <section
      id="section2"
      class="mt-36 mb-20"
    >
      <div
        id="flex1"
        class="w-full mx-auto flex flex-wrap justify-between align-start"
      >
        <div
          class="w-[510px] h-auto rounded-xl mb-10"
          style="background: #F5F6F7;"
        >
          <h2 class="text-center pt-[45px] pb-[30px] font-bold landing-font-22">Tiện ích mở rộng trình duyệt</h2>
          <div class="w-10/12 mx-auto flex flex-wrap sm:justify-between justify-center align-start">
            <div
              v-for="(item, index) in browser"
              :key="index"
              class="mb-9 max-w-[190px] h-[60px] w-full w-1/2"
            >
              <div class="flex flex-nowrap">
                <div class="circle mx-4">
                  <img
                    :src="item.img"
                    :alt="item.name"
                    class="max-h-full h-auto mx-auto"
                    style="max-width: 50%"
                  >
                </div>

                <p class="landing-font-14 text-black self-center">{{ item.name }}</p>
              </div>
            </div>
          </div>
        </div>
        <div
          class="w-[510px] h-auto rounded-xl mb-10"
          style="background: #F5F6F7;"
        >
          <h2 class="text-center pt-[45px] pb-[30px] font-bold landing-font-22">Ứng dụng cho máy tính cá nhân</h2>
          <div class="w-10/12 mx-auto flex flex-wrap sm:justify-between justify-center align-start">
            <div
              v-for="(item, index) in os"
              :key="index"
              class="mb-9 max-w-[190px] h-[60px] w-full w-1/2"
            >
              <div class="flex flex-nowrap">
                <div class="circle mx-4">
                  <img
                    :src="item.img"
                    :alt="item.name"
                    class="max-h-full h-auto mx-auto"
                    style="max-width: 50%"
                  >
                </div>

                <p class="landing-font-14 text-black self-center">{{ item.name }}</p>
              </div>
            </div>
          </div>
        </div>
        <div
          class="w-[510px] h-auto rounded-xl mb-10"
          style="background: #F5F6F7;"
        >
          <h2 class="text-center pt-[45px] pb-[30px] font-bold landing-font-22">Ứng dụng di động</h2>
          <div class="max-w-full mx-auto justify-center flex gap-x-4">
            <div class="justify-self-center">
              <a
                class="w-full sm:w-auto"
                href="#"
              >
                <img src="~/assets/images/landing/download/app_store.svg">
              </a>
            </div>
            <div>
              <a
                class="w-full sm:w-auto"
                href="#"
              >
                <img src="~/assets/images/landing/download/gg_play.svg">
              </a>
            </div>
          </div>
          <div class="w-full">
            <img src="~/assets/images/landing/download/mobile_app.png">
          </div>
        </div>
        <div
          class="w-[510px] h-auto rounded-xl mb-10"
          style="background: #F5F6F7;"
        >
          <h2 class="text-center pt-[45px] pb-[30px] font-bold landing-font-22">Truy cập phiên bản web</h2>
          <p class="text-center landing-font-14 w-[400px] mx-auto">Chỉ cần một thiết bị bất kỳ có hỗ trợ trình duyệt web, bạn đã có thể truy cập Locker tại: <span class="text-green"><a href="#">locker.io/vault</a></span></p>
          <div class="w-full h-[236px] bg-web-app">
            <a
              class="landing-btn w-full text-center w-[207px] h-[45px] ml-[141px] mt-[125px]"
              href="#"
            >
              locker.io/vault
            </a>
          </div>
        </div>
      </div>
    </section>
    <!-- Header end -->
  </div>
</template>

<script>
export default {
  layout: 'landing',
  data () {
    return {
      header: {
        title: 'Tải Locker trên các thiết bị của bạn',
        desc: 'Truy cập, chỉnh sửa, tự động điền mật khẩu mọi lúc, mọi nơi.',
        img: 'download/img3x.png',
        btn: {
          text: 'Đăng ký miễn phí',
          link: '#'
        }
      },
      os: [
        {
          name: 'Windows',
          img: require('~/assets/images/landing/index/windows.svg')
        },
        {
          name: 'MacOs',
          img: require('~/assets/images/landing/index/macos.svg')
        },
        {
          name: 'Linux',
          img: require('~/assets/images/landing/index/linux.svg')
        },
        {
          name: 'Ubuntu',
          img: require('~/assets/images/landing/index/ubuntu.svg')
        }
      ],
      browser: [
        {
          name: 'Chrome',
          img: require('~/assets/images/landing/index/chrome.svg')
        },
        {
          name: 'Safari',
          img: require('~/assets/images/landing/index/safari.svg')
        },
        {
          name: 'Firefox',
          img: require('~/assets/images/landing/index/firefox.svg')
        },
        {
          name: 'Microsoft Edge',
          img: require('~/assets/images/landing/index/edge.svg')
        },
        {
          name: 'Cốc Cốc',
          img: require('~/assets/images/landing/index/coccoc.svg')
        },
        {
          name: 'Opera',
          img: require('~/assets/images/landing/index/opera.svg')
        }
      ]
    }
  }
}
</script>

<style scoped>
.circle {
  height: 60px;
  width: 60px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 50%;
  display: flex;
}
@media screen and (max-width: 1070px) {
  #section2 {
    margin-top: 96px !important;
  }
  #flex1 {
    justify-content: center;
  }
}
</style>
