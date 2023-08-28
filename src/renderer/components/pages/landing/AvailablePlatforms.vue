<template>
  <div>
    <!--Devices-->
    <section class="full-width h-auto" style="background: #ffffff">
      <div
        class="hidden lg:flex w-full h-auto text-center pt-10 mb-24 justify-items-end justify-center gap-x-6 overflow-hidden"
      >
        <img
          id="mobile"
          :src="
            require(`~/assets/images/landing/index/${$t(
              'landing.section1.image'
            )}`)
          "
          class="inline self-end"
          style="width: 40%"
        >
      </div>
    </section>
    <!-- Devices end -->

    <!-- Platforms -->
    <section class="mt-7">
      <div class="w-full lg:w-8/12 mx-auto mb-[100px]">
        <h2 class="text-center font-bold text-black landing-font-38 mb-[14px]">
          {{ $t('landing.platform.title') }}
        </h2>
        <p
          class="text-center text-black-600 leading-[26px] landing-font-18 mx-auto mb-[42px]"
        >
          {{ $t('landing.platform.desc') }}
        </p>
      </div>
      <div
        class="w-full lg:w-8/12 mx-auto align-start grid sm:grid-cols-3 grid-cols-2"
      >
        <div
          v-for="(item, index) in $t('landing.platform.platforms')"
          :key="index"
          class="opacity-90 mb-[80px]"
        >
          <a
            v-if="!!item.href"
            :href="item.href || '#'"
            :target="item.href ? '_blank' : '_self'"
            class="flex sm:flex-row flex-col justify-center items-center"
          >
            <div
              class="rounded-full shadow-md w-[80px] h-[80px] justify-center items-center flex sm:mr-5 mr-0 mb-5 sm:mb-0"
            >
              <img
                :src="require(`~/assets/images/landing/index/${item.img}`)"
                :alt="item.name"
                class="mx-auto self-center max-w-[42px] max-h-[42px]"
              >
            </div>

            <p
              class="landing-font-16 font-semibold text-black self-center sm:mt-0 mt-2 w-[70px] text-center sm:text-left"
            >
              {{ item.name }}
            </p>
          </a>
        </div>
      </div>
    </section>
    <!-- Platforms end -->
  </div>
</template>
