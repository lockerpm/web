<template>
  <div>
    <section class="full-width pt-32 bg-[#EEF4ED] w-[100%] relative pb-[150px] md:pb-[94px] px-8 overflow-inherit">
      <h1 class="text-center font-bold text-black landing-font-50 mb-[24px]">{{ $t('download2.section1.title') }}</h1>
      <h2 class="text-center font-normal text-black-600 landing-font-20 mb-[50px] mt-[18px]">{{ $t('download2.section1.subtitle') }}</h2>
      <a href="https://id.locker.io/register?SERVICE_URL=%2Fregister&SERVICE_SCOPE=pwdmanager&lang=en&ENVIRONMENT=dev" target="_blank">
        <button class="py-[10px] px-[20px] bg-[#62AD56] rounded-sm flex items-center mx-auto hover:bg-[#2D702C] mb-5">
          <span class="text-base font-semibold text-[#FFFFFF] mr-[12px]">
            {{ $t("password_generator.cta1.btn.text") }}
          </span>
          <img src="~/assets/images/landing/download2/right-white.svg">
        </button>
      </a>
      <img src="~/assets/images/landing/download2/section1-pc.png" alt="" class="hidden max-w-[1120px] w-[100%] mx-auto md:block">
      <img src="~/assets/images/landing/download2/section1-mobile.png" alt="" class="block w-[100%] mx-auto mt-7 md:hidden">
      <div class="absolute bottom-[-94px] max-w-[1059px] rounded-[16px] absolute-center card-section1 grid grid-cols-3 gap-y-3 mx-4 px-[20px] py-[56px] sm:grid-cols-6 md:px-[84px]">
        <div
          v-for="(item) in $t('download2.section1.card')"
          :key="item.title"
        >
          <a :href="'#' + item.link" class="block w-fit mx-auto h-[40px]">
            <img :src="require(`~/assets/images/landing/download2/${item.imageSrc}`)" :alt="item.title">
          </a>
          <p class="font-normal text-[#717171] text-center mt-[14px]">{{ item.title }}</p>
        </div>
      </div>
    </section>
    <section id="macos" class="pt-[284px] flex-row justify-between pb-[50px] md:pb-[170px] gap-x-3 md:flex">
      <div class="max-w-[360px] relative mx-auto">
        <div class="absolute top-[-80px] right-[205px] text-[#FFFFFF] width-comming-soon bg-tag1 landing-font-16 font-semibold">
          {{ $t('download2.section3.coming') }}
        </div>
        <img src="~/assets/images/landing/download2/section2-line.svg" alt="">
        <div class="ml-[35px] mt-[-87px]">
          <div class="py-1 px-3 bg-[#FFFFFF] inline-block">
            <p class="landing-font-42 font-bold text-[#072245]">{{ $t('download2.section2.title') }}</p>
          </div>
          <div class="grid gap-y-[32px] mt-[68px]">
            <div
              v-for="(item, id) in $t('download2.section2.list')"
              :key="id"
            >
              <button class="button-disable">
                <span>
                  {{ item.button }}
                </span>
                <img src="~/assets/images/landing/download2/download-disable.svg" alt="" class="ml-[10px]">
              </button>
              <p class="mt-[8px] text-[#617296] font-normal landing-font-14-2">
                {{ item.note }}
              </p>
            </div>
          </div>
          <div class="flex my-[30px] sm:mt-[64px]">
            <nuxt-link
              to="/release-notes"
              class="text-[#216AE2] text-[15px] font-normal mr-[8px] hover:underline hover:text-[#216AE2]"
            >
              {{ $t('download2.section2.link') }}
            </nuxt-link>
            <img src="~/assets/images/landing/download2/right-blue.svg" alt="">
          </div>
        </div>
      </div>
      <img src="~/assets/images/landing/download2/section2.png" alt="" class="max-w-[675px] w-[100%] sm:w-3/5 object-contain mx-auto">
    </section>
    <section class="full-width w-[100%] bg-[#F4F5F7] py-[80px]">
      <div class="max-w-[1099px] px-5 flex-row mx-auto items-center justify-between lg:flex">
        <div class="text-center max-w-[500px] mx-auto lg:text-left lg:max-w-[316px]">
          <div class="landing-font-24 text-[#072245] font-bold mb-[24px]">{{ $t('download2.section3.title') }}</div>
          <div class="lading-font-16 text-[#617296]">
            {{ $t('download2.section3.subtitle') }}
          </div>
        </div>
        <div class="flex flex-wrap justify-center pt-8">
          <div
            v-for="(item) in $t('download2.section3.list')"
            :key="item.name"
            class="w-[135px] mt-5 md:mt-0 text-webkit"
          >
            <img :src="require(`~/assets/images/landing/download2/${item.imgSrc}`)" alt="">
            <p class="mt-3 font-semibold text-[#121212]">{{ item.name }}</p>
            <a v-if="item.active" :href="item.link" target="_blank">
              <button class="mt-3 py-[3px] px-[20px] font-semibold text-[#FFFFFF] bg-[#62AD56] rounded-sm hover:bg-[#2D702C]">
                {{ $t('download2.section3.install') }}
              </button>
            </a>
            <button
              v-else
              class="mt-3 py-[3px] px-[20px] font-semibold text-[#606060] bg-[#EBEEF2] rounded-sm box-border border-[1px] border-[#DADEE3] cursor-auto"
            >
              {{ $t('download2.section3.coming') }}
            </button>
          </div>
        </div>
      </div>
    </section>
    <section id="windows" class="md:pt-[240px] pt-[140px] flex-row justify-between pb-[50px] md:pb-[170px] gap-x-3 md:flex">
      <div class="max-w-[360px] relative mx-auto">
        <div class="absolute top-[-80px] right-[205px] text-[#FFFFFF] width-comming-soon bg-tag2 landing-font-16 font-semibold">
          {{ $t('download2.section3.coming') }}
        </div>
        <img src="~/assets/images/landing/download2/blue-line.svg" alt="">
        <div class="ml-[35px] mt-[-87px]">
          <div class="py-1 px-3 bg-[#FFFFFF] inline-block">
            <p class="landing-font-42 font-bold text-[#072245]">{{ $t('download2.section4.title') }}</p>
          </div>
          <div class="grid gap-y-[32px] mt-[68px]">
            <div
              v-for="(item, id) in $t('download2.section4.card')"
              :key="id"
            >
              <button class="button-disable">
                <span>
                  {{ item.button }}
                </span>
                <img src="~/assets/images/landing/download2/download-disable.svg" alt="" class="ml-[10px]">
              </button>
              <p class="mt-[8px] text-[#617296] font-normal landing-font-14-2">
                {{ item.note }}
              </p>
            </div>
          </div>
          <div class="flex my-[30px] sm:mt-[64px]">
            <nuxt-link
              to="/release-notes"
              class="text-[#216AE2] text-[15px] font-normal mr-[8px] hover:underline hover:text-[#216AE2]"
            >
              {{ $t('download2.section4.link') }}
            </nuxt-link>
            <img src="~/assets/images/landing/download2/right-blue.svg" alt="">
          </div>
        </div>
      </div>
      <img src="~/assets/images/landing/download2/section3.png" alt="" class="max-w-[675px] w-[100%] sm:w-3/5 object-contain mx-auto">
    </section>
    <section class="full-width w-[100%] bg-[#F4F5F7] py-[80px]">
      <div class="max-w-[1099px] px-5 flex-row mx-auto items-center justify-between lg:flex">
        <div class="text-center max-w-[500px] mx-auto lg:text-left lg:max-w-[316px]">
          <div class="landing-font-24 text-[#072245] font-bold mb-[24px]">{{ $t('download2.section3.title') }}</div>
          <div class="lading-font-16 text-[#617296]">
            {{ $t('download2.section3.subtitle') }}
          </div>
        </div>
        <div class="flex flex-wrap justify-center pt-8">
          <div
            v-for="(item) in $t('download2.section3.list')"
            :key="item.name"
            class="w-[135px] mt-5 md:mt-0 text-webkit"
          >
            <img :src="require(`~/assets/images/landing/download2/${item.imgSrc}`)" alt="">
            <p class="mt-3 font-semibold text-[#121212]">{{ item.name }}</p>
            <a v-if="item.active" :href="item.link" target="_blank">
              <button class="mt-3 py-[3px] px-[20px] font-semibold text-[#FFFFFF] bg-[#62AD56] rounded-sm hover:bg-[#2D702C]">
                {{ $t('download2.section3.install') }}
              </button>
            </a>
            <button
              v-else
              class="mt-3 py-[3px] px-[20px] font-semibold text-[#606060] bg-[#EBEEF2] rounded-sm box-border border-[1px] border-[#DADEE3] cursor-auto"
            >
              {{ $t('download2.section3.coming') }}
            </button>
          </div>
        </div>
      </div>
    </section>
    <section id="web-browser" class="md:pt-[91px] pt-[50px] flex-row justify-between items-center pb-[50px] md:pb-[100px] gap-x-3 md:flex">
      <div class="max-w-[360px] relative mx-auto">
        <img src="~/assets/images/landing/download2/red-line.svg" alt="">
        <div class="ml-[35px] mt-[-87px]">
          <div class="py-1 px-3 bg-[#FFFFFF] inline-block">
            <p class="landing-font-42 font-bold text-[#072245]">{{ $t('download2.section5.title') }}</p>
          </div>
          <div class="grid gap-y-[32px] mt-[68px]">
            <div
              v-for="(item, id) in $t('download2.section5.card')"
              :key="id"
            >
              <button class="button-download button-web-browser">
                <span>
                  {{ item.button }}
                </span>
                <img src="~/assets/images/landing/download2/download.svg" alt="" class="ml-[10px]">
              </button>
              <p class="mt-[8px] text-[#617296] font-normal landing-font-14-2">
                {{ item.note }}
              </p>
            </div>
          </div>
          <div class="flex my-[30px] sm:mt-[64px]">
            <nuxt-link
              to="/release-notes"
              class="text-[#216AE2] text-[15px] font-normal mr-[8px] hover:underline hover:text-[#216AE2]"
            >
              {{ $t('download2.section5.link') }}
            </nuxt-link>
            <img src="~/assets/images/landing/download2/right-blue.svg" alt="">
          </div>
        </div>
      </div>
      <img src="~/assets/images/landing/download2/section4.png" alt="" class="max-w-[675px] w-[100%] sm:w-3/5 object-contain mx-auto">
    </section>
    <section class="full-width w-[100%] bg-[#F4F5F7] py-[80px] sm:pb-0">
      <div class="max-w-[1099px] px-5 flex-row mx-auto items-center justify-between relative z-10 lg:flex">
        <div class="text-center max-w-[500px] mx-auto lg:text-left lg:max-w-[316px]">
          <div class="landing-font-24 text-[#072245] font-bold mb-[24px]">{{ $t('download2.section3.title') }}</div>
          <div class="lading-font-16 text-[#617296]">
            {{ $t('download2.section3.subtitle') }}
          </div>
        </div>
        <div class="flex flex-wrap justify-center pt-8">
          <div
            v-for="(item) in $t('download2.section3.list')"
            :key="item.name"
            class="w-[135px] mt-5 md:mt-0 text-webkit"
          >
            <img :src="require(`~/assets/images/landing/download2/${item.imgSrc}`)" alt="">
            <p class="mt-3 font-semibold text-[#121212]">{{ item.name }}</p>
            <a v-if="item.active" :href="item.link" target="_blank">
              <button class="mt-3 py-[3px] px-[20px] font-semibold text-[#FFFFFF] bg-[#62AD56] rounded-sm hover:bg-[#2D702C]">
                {{ $t('download2.section3.install') }}
              </button>
            </a>
            <button
              v-else
              class="mt-3 py-[3px] px-[20px] font-semibold text-[#606060] bg-[#EBEEF2] rounded-sm box-border border-[1px] border-[#DADEE3] cursor-auto"
            >
              {{ $t('download2.section3.coming') }}
            </button>
          </div>
        </div>
      </div>
      <img src="~/assets/images/landing/download2/section5.png" alt="" class="hidden max-w-[768px] mx-auto mt-[-130px] w-2/3 min-w-[550px] sm:block">
    </section>
    <section id="ios" class="pt-[80px] flex-row justify-between items-center pb-[130px] gap-x-3 md:flex">
      <div class="max-w-[360px] relative mx-auto">
        <img src="~/assets/images/landing/download2/orange-line.svg" alt="">
        <div class="ml-[35px] mt-[-87px]">
          <div class="py-1 px-3 bg-[#FFFFFF] inline-block">
            <p class="landing-font-42 font-bold text-[#072245]">{{ $t('download2.section6.title') }}</p>
          </div>
          <div class="grid gap-y-[32px] mt-[68px]">
            <div
              v-for="(item, id) in $t('download2.section6.card')"
              :key="id"
            >
              <button class="button-download button-ios">
                <span>
                  {{ item.button }}
                </span>
                <img src="~/assets/images/landing/download2/download.svg" alt="" class="ml-[10px]">
              </button>
              <p class="mt-[8px] text-[#617296] font-normal landing-font-14-2">
                {{ item.note }}
              </p>
            </div>
          </div>
          <div class="flex my-[30px] sm:mt-[64px]">
            <nuxt-link
              to="/release-notes"
              class="text-[#216AE2] text-[15px] font-normal mr-[8px] hover:underline hover:text-[#216AE2]"
            >
              {{ $t('download2.section2.link') }}
            </nuxt-link>
            <img src="~/assets/images/landing/download2/right-blue.svg" alt="">
          </div>
        </div>
      </div>
      <img src="~/assets/images/landing/download2/section6.png" alt="" class="max-w-[675px] w-[100%] sm:w-3/5 object-contain mx-auto">
    </section>
    <div id="android" class="full-width relative px-6">
      <div class="absolute top-0 left-0 button-android width-line h-[2px]"></div>
      <section class="pt-[80px] max-w-[1088px] mx-auto justify-between pb-[50px] md:pb-[130px] gap-x-3 flex flex-col-reverse md:flex-row">
        <img src="~/assets/images/landing/download2/section7.png" alt="" class="max-w-[675px] w-[100%] sm:w-3/5 object-contain mx-auto">
        <div class="max-w-[360px] relative mx-auto">
          <img src="~/assets/images/landing/download2/green-line.svg" alt="">
          <div class="ml-[35px] mt-[-87px]">
            <div class="py-1 px-3 bg-[#FFFFFF] inline-block">
              <p class="landing-font-42 font-bold text-[#072245]">{{ $t('download2.section7.title') }}</p>
            </div>
            <div class="grid gap-y-[32px] mt-[68px]">
              <div
                v-for="(item, id) in $t('download2.section7.card')"
                :key="id"
              >
                <a href="https://play.google.com/store/apps/details?id=com.cystack.locker&pli=1" target="_blank">
                  <button class="button-download button-android">
                    <span>
                      {{ item.button }}
                    </span>
                    <img src="~/assets/images/landing/download2/download.svg" alt="" class="ml-[10px]">
                  </button>
                </a>
                <p class="mt-[8px] text-[#617296] font-normal landing-font-14-2">
                  {{ item.note }}
                </p>
              </div>
            </div>
            <div class="flex my-[30px] sm:mt-[64px]">
              <nuxt-link
                to="/release-notes"
                class="text-[#216AE2] text-[15px] font-normal mr-[8px] hover:underline hover:text-[#216AE2]"
              >
                {{ $t('download2.section2.link') }}
              </nuxt-link>
              <img src="~/assets/images/landing/download2/right-blue.svg" alt="">
            </div>
          </div>
        </div>
      </section>
    </div>
    <div id="linux" class="full-width relative px-6">
      <div class="absolute top-0 right-0 bg-tag3 width-line h-[2px]"></div>
      <section class="mx-auto max-w-[1118px] md:pt-[150px] pt-[140px] flex-row justify-between pb-[50px] md:pb-[170px] gap-x-3 md:flex">
        <div class="max-w-[360px] relative mx-auto">
          <div v-if="$t('download2.section4.active')" class="absolute top-[-80px] right-[205px] text-[#FFFFFF] width-comming-soon bg-tag3 landing-font-16 font-semibold">
            {{ $t('download2.section3.coming') }}
          </div>
          <img src="~/assets/images/landing/download2/wave-line.svg" alt="">
          <div class="ml-[35px] mt-[-87px]">
            <div class="py-1 px-3 bg-[#FFFFFF] inline-block">
              <p class="landing-font-42 font-bold text-[#072245]">{{ $t('download2.section8.title') }}</p>
            </div>
            <div class="grid gap-y-[32px] mt-[68px]">
              <div
                v-for="(item, id) in $t('download2.section8.card')"
                :key="id"
              >
                <button class="button-disable">
                  <span>
                    {{ item.button }}
                  </span>
                  <img src="~/assets/images/landing/download2/download-disable.svg" alt="" class="ml-[10px]">
                </button>
                <p class="mt-[8px] text-[#617296] font-normal landing-font-14-2">
                  {{ item.note }}
                </p>
              </div>
            </div>
            <div class="flex mt-[64px]">
              <nuxt-link
                to="/release-notes"
                class="text-[#216AE2] text-[15px] font-normal mr-[8px] hover:underline hover:text-[#216AE2]"
              >
                {{ $t('download2.section4.link') }}
              </nuxt-link>
              <img src="~/assets/images/landing/download2/right-blue.svg" alt="">
            </div>
          </div>
        </div>
        <div class="mt-[100px] max-w-[512px] w-[100%] sm:w-3/5 object-contain mx-auto">
          <div class="landing-font-24 font-bold text-[#072245]">{{ $t('download2.section8.content.title') }}</div>
          <p class="landing-font-16 font-normal text-[#617296] mt-[24px]">{{ $t('download2.section8.content.subtitle') }}</p>
          <div class="mt-[42px] flex">
            <p class="landing-font-14 font-normal text-[#606060] opacity-30 mr-[8px]">{{ $t('download2.section8.content.link') }}</p>
            <img src="~/assets/images/landing/download2/right-gray.svg" alt="">
          </div>
        </div>
      </section>
    </div>
    <section class="full-width w-[100%] bg-[#F4F5F7] py-[80px]">
      <div class="max-w-[1099px] px-5 flex-row mx-auto items-center justify-between lg:flex">
        <div class="text-center max-w-[500px] mx-auto lg:text-left lg:max-w-[316px]">
          <div class="landing-font-24 text-[#072245] font-bold mb-[24px]">{{ $t('download2.section3.title') }}</div>
          <div class="lading-font-16 text-[#617296]">
            {{ $t('download2.section3.subtitle') }}
          </div>
        </div>
        <div class="flex flex-wrap justify-center pt-8">
          <div
            v-for="(item) in $t('download2.section3.list')"
            :key="item.name"
            class="w-[135px] mt-5 md:mt-0 text-webkit"
          >
            <img :src="require(`~/assets/images/landing/download2/${item.imgSrc}`)" alt="">
            <p class="mt-3 font-semibold text-[#121212]">{{ item.name }}</p>
            <a v-if="item.active" :href="item.link" target="_blank">
              <button class="mt-3 py-[3px] px-[20px] font-semibold text-[#FFFFFF] bg-[#62AD56] rounded-sm hover:bg-[#2D702C]">
                {{ $t('download2.section3.install') }}
              </button>
            </a>
            <button
              v-else
              class="mt-3 py-[3px] px-[20px] font-semibold text-[#606060] bg-[#EBEEF2] rounded-sm box-border border-[1px] border-[#DADEE3] cursor-auto"
            >
              {{ $t('download2.section3.coming') }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  layout: 'landing'

}
</script>

<style scoped>
  .card-section1 {
    background-color: #FFFFFF;
    box-shadow: 0px 107px 43px rgba(0, 0, 0, 0.01), 0px 60px 36px rgba(0, 0, 0, 0.03), 0px 27px 27px rgba(0, 0, 0, 0.04), 0px 7px 15px rgba(0, 0, 0, 0.05), 0px 0px 0px rgba(0, 0, 0, 0.05);
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
    width: 280px;
    justify-content: center;
    display: flex;
    padding: 10px 13px;
    color: #FFFFFF;
    border-radius: 4px;
    align-items: center;
  }
  .button-download:hover {
    opacity: 0.7;
  }
  .bg-tag1 {
    background: linear-gradient(92.77deg, #F36CFF -46.79%, #9781FF 106.78%);
  }
  .bg-tag2 {
    background: linear-gradient(87.29deg, #34E98D -9.88%, #4C9AFF 102.53%);
  }
  .bg-tag3 {
    background: linear-gradient(266.66deg, #22A2FF -3.45%, #2262FF 59.41%, #2222FF 122.27%);;
  }
  .button-web-browser {
    background: linear-gradient(93.19deg, #FF0844 -68.98%, #FF5C6E 33.26%, #FFB199 137.66%);
  }
  .button-ios {
    background: linear-gradient(92.51deg, #FFA53A -60.81%, #FF3E3E 146.04%);
  }
  .button-android {
    background: linear-gradient(273.87deg, #62AD56 -72.83%, #6FD065 48.37%, #7AF072 182.9%);
  }
  .width-line {
    width: calc(50vw - 105px);
  }

  .button-disable {
    width: 280px;
    justify-content: center;
    display: flex;
    padding: 10px 13px;
    color: #606060;
    background: #EBEEF2;
    border: 1px solid #DADEE3;
    border-radius: 4px;
    align-items: center;
    cursor: auto;
  }
  .text-webkit {
    text-align: -webkit-center;
  }
  .width-comming-soon {
    width: calc(50vw + 500px);
    direction: rtl;
    padding: 10px 25px;
    border-radius: 75px;
  }
</style>
