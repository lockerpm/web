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
                :href="`https://id.locker.io/register?SERVICE_URL=${encodeURIComponent('/vault')}&SERVICE_SCOPE=pwdmanager&lang=${locale}&ENVIRONMENT=production`"
              >
                {{ header.btn.text }}
              </a>
            </div>
          </div>
          <!-- Right -->
          <div id="img-header" class="hidden md:block md:w-1/2 order-2 jusify-self-end pr-0 mb-10" style="transform: translate3d(-50px, -50px, 0px)">
            <img
              :src="require(`~/assets/images/landing/${header.img}`)"
              alt=""
              style="max-width: 120%; max-height: 485px;"
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
    <div class="mt-36 w-full flex flex-wrap bg-[#F5F6F7] rounded-[10px]">
      <div class="md:w-1/2 w-full">
        <img src="~/assets/images/landing/download/mobile-app.png" alt="Mobile App">
      </div>
      <div class="md:w-1/2 w-full flex flex-col justify-center content-start md:text-left text-center mb-4">
        <div class="text-head-5 font-semibold">
          {{ $t('download.download_mobile') }}
        </div>
        <div class="max-w-full flex gap-x-4 mt-8 md:justify-start justify-center">
          <div class="justify-self-center">
            <a
              class="w-full sm:w-auto"
              href="https://apps.apple.com/us/app/locker-password-manager/id1586927301"
              target="_blank"
            >
              <img src="~/assets/images/landing/download/app_store.svg">
            </a>
          </div>
          <div>
            <a
              class="w-full sm:w-auto"
              href="https://play.google.com/store/apps/details?id=com.cystack.locker"
              target="_blank"
            >
              <img src="~/assets/images/landing/download/gg_play.svg">
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="grid md:grid-cols-2 grid-cols-1 gap-8 mt-8 mb-16">
      <div
        class="rounded-[10px] bg-[#F5F6F7]"
      >
        <h2 class="text-center pt-[45px] pb-[30px] font-bold landing-font-22">{{ $t('download.download_extension') }}</h2>
        <div class="flex">
          <p class="text-center landing-font-14 w-[400px] mx-auto">{{ $t('download.go_to_chrome_store') }}<span class="text-green"><a href="https://chrome.google.com/webstore/detail/locker-free-password-mana/cmajindocfndlkpkjnmjpjoilibjgmgh" target="_blank">Chrome Web Store</a></span></p>
        </div>
        <div class="w-full mt-6 relative">
          <img src="~/assets/images/landing/download/chrome-extension.png" alt="Chrome Extension" class="mx-auto">
          <a
            class="landing-btn w-full text-center w-[207px] h-[45px] mx-auto absolute bottom-16 left-0 right-0"
            href="https://chrome.google.com/webstore/detail/locker-free-password-mana/cmajindocfndlkpkjnmjpjoilibjgmgh"
            target="_blank"
          >
            <!-- <div class="w-full flex items-center justify-center">
              <img class="p-[5px] bg-white rounded-full mr-3" src="~/assets/images/landing/download/chrome.png">
              <div>Chrome Store</div>
            </div> -->
            {{ $t('download.add_extension') }}
          </a>
        </div>
      </div>
      <div
        class="rounded-[10px] bg-[#F5F6F7]"
      >
        <h2 class="text-center pt-[45px] pb-[30px] font-bold landing-font-22">{{ $t('download.web_app') }}</h2>
        <div class="flex">
          <p class="text-center landing-font-14 w-[400px] mx-auto">{{ $t('download.go_to_locker') }}<span class="text-green"><nuxt-link :to="localeRoute({name: 'vault'})">locker.io/vault</nuxt-link></span></p>
        </div>
        <div class="w-full mt-6 relative">
          <img src="~/assets/images/landing/download/web-app.png" alt="Web App" class="mx-auto">
          <nuxt-link
            class="landing-btn w-full text-center w-[207px] h-[45px] mx-auto absolute bottom-16 left-0 right-0"
            :to="localeRoute({name: 'vault'})"
          >
            locker.io/vault
          </nuxt-link>
        </div>
      </div>
    </div>
    <!-- <section
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
          <h2 class="text-center pt-[45px] pb-[30px] font-bold landing-font-22">{{ grid_headers[0] }}</h2>
          <div class="w-10/12 mx-auto flex flex-wrap sm:justify-between justify-center align-start">
            <div
              v-for="(item, index) in browser"
              :key="index"
              class="opacity-90 mb-9 max-w-[190px] h-[60px] w-full w-1/2"
            >
              <div class="flex flex-nowrap">
                <div class="circle mx-4">
                  <img
                    :src="require(`~/assets/images/landing/index/${item.img}`)"
                    :alt="item.name"
                    class="max-h-full h-auto mx-auto"
                    style="max-width: 55%; max-height: 55%; align-self: center"
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
          <h2 class="text-center pt-[45px] pb-[30px] font-bold landing-font-22">{{ grid_headers[1] }}</h2>
          <div class="w-10/12 mx-auto flex flex-wrap sm:justify-between justify-center align-start">
            <div
              v-for="(item, index) in os"
              :key="index"
              class="opacity-90 mb-9 max-w-[190px] h-[60px] w-full w-1/2"
            >
              <div class="flex flex-nowrap">
                <div class="circle mx-4">
                  <img
                    :src="require(`~/assets/images/landing/index/${item.img}`)"
                    :alt="item.name"
                    class="h-auto mx-auto"
                    style="max-width: 55%; max-height: 55%; align-self: center"
                  >
                </div>

                <p class="landing-font-14 text-black self-center">{{ item.name }}</p>
              </div>
            </div>
          </div>
        </div>
        <div
          class="w-[510px] h-[382px] rounded-xl mb-10 bg-mobile-app"
          style="background-repeat: no-repeat; background-size: contain;"
        >
          <h2 class="text-center pt-[45px] pb-[30px] font-bold landing-font-22">{{ grid_headers[2] }}</h2>
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
        </div>
        <div
          class="w-[510px] h-auto rounded-xl mb-10 bg-web-app"
          style="background-repeat: no-repeat; background-size: auto;"
        >
          <h2 class="text-center pt-[45px] pb-[30px] font-bold landing-font-22">{{ grid_headers[3] }}</h2>
          <p class="text-center landing-font-14 w-[400px] mx-auto">{{ go_locker }}<span class="text-green"><nuxt-link :to="localeRoute({name: 'vault'})">locker.io/vault</nuxt-link></span></p>
          <div class="w-full h-[236px]">
            <nuxt-link
              class="landing-btn w-full text-center w-[207px] h-[45px] ml-[151px] mt-[121px]"
              :to="localeRoute({name: 'vault'})"
            >
              locker.io/vault
            </nuxt-link>
          </div>
        </div>
      </div>
    </section> -->
    <!-- Header end -->
  </div>
</template>

<script>
export default {
  layout: 'landing',
  data () {
    return this.$t('download')
    // return {
    //   header: {
    //     title: 'Tải Locker trên các thiết bị của bạn',
    //     desc: 'Truy cập, chỉnh sửa, tự động điền mật khẩu mọi lúc, mọi nơi.',
    //     img: 'download/img_1.png',
    //     btn: {
    //       text: 'Đăng ký miễn phí',
    //       link: '#'
    //     }
    //   },
    //   grid_headers: ['Tiện ích mở rộng trình duyệt', 'Ứng dụng cho máy tính cá nhân', 'Ứng dụng di động', 'Truy cập phiên bản web'],
    //   go_locker: 'Chỉ cần một thiết bị bất kỳ có hỗ trợ trình duyệt web, bạn đã có thể truy cập Locker tại:',
    //   os: [
    //     {
    //       name: 'Windows',
    //       img: 'windows.png'
    //     },
    //     {
    //       name: 'MacOs',
    //       img: 'macos.png'
    //     },
    //     {
    //       name: 'Linux',
    //       img: 'linux.png'
    //     },
    //     {
    //       name: 'Ubuntu',
    //       img: 'ubuntu.png'
    //     }
    //   ],
    //   browser: [
    //     {
    //       name: 'Chrome',
    //       img: 'chrome.png'
    //     },
    //     {
    //       name: 'Safari',
    //       img: 'safari.png'
    //     },
    //     {
    //       name: 'Firefox',
    //       img: 'firefox.png'
    //     },
    //     {
    //       name: 'Microsoft Edge',
    //       img: 'edge.png'
    //     },
    //     {
    //       name: 'Cốc Cốc',
    //       img: 'coccoc.png'
    //     },
    //     {
    //       name: 'Opera',
    //       img: 'opera.png'
    //     }
    //   ]
    // }
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
  #img-header {
    transform: translate3d(0px, 0px, 0px) !important;
  }
}
</style>
