<template>
  <section id="web-browser" key="web-browser">
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
</template>
<style scoped>
.text-webkit {
  text-align: -webkit-center;
}
</style>
