<template>
  <div class="mt-[78px]">
    <section class="bg-welcome full-width h-auto py-[244px] bg-center bg-cover bg-no-repeat" :style="{backgroundImage: `url(${require(`~/assets/images/landing/about-us/bg-welcome.png`)})`}">
      <div class="max-w-6xl mx-auto px-6">
        <div class="landing-font-72 font-bold text-white text-center" style="text-shadow: 0px 3.5px 5.5px rgba(0, 0, 0, 0.2);">
          {{ $t('about_us.welcome') }}
        </div>
      </div>
    </section>
    <section class="about-locker full-width h-auto py-[120px] bg-[#F8F9FA]">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid md:grid-cols-2 grid-cols-1 md:gap-x-[80px] md:gap-y-0 gap-y-[40px]">
          <div>
            <div class="mb-6">
              <img src="~/assets/images/landing/about-us/line.png">
            </div>
            <div class="font-bold landing-font-48 text-black">
              {{ $t('about_us.about_locker.title') }}
            </div>
            <div class="mt-[42px]">
              <a :href="locale==='vi'?'https://s.locker.io/assets/Locker_VN.pdf':'https://s.locker.io/assets/Locker_Portfolio.pdf'" target="_blank" class="landing-btn landing-font-16" style="align-self: center">
                {{ $t('about_us.about_locker.btn.title') }}
              </a>
            </div>
          </div>
          <div class="landing-font-20 font-normal text-black mt-6" v-html="$t('about_us.about_locker.content')" />
        </div>
      </div>
    </section>
    <section class="vision-mission py-[120px]">
      <div class="grid md:grid-cols-2 grid-cols-1 md:gap-x-[80px] md:gap-y-0 gap-y-[60px] items-center">
        <div class="md:order-first order-last">
          <img src="~/assets/images/landing/about-us/vision-mission.png">
        </div>
        <div>
          <div class="mb-6">
            <img src="~/assets/images/landing/about-us/line.png">
          </div>
          <div class="mb-[28px] font-bold landing-font-48 text-black">
            {{ $t('about_us.vision_mission.title') }}
          </div>
          <div class="text-black font-normal landing-font-20" v-html=" $t('about_us.vision_mission.subtitle') " />
        </div>
      </div>
    </section>
    <section class="meet-team full-width h-auto py-[120px] bg-[#F8F9FA]">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid md:grid-cols-2 grid-cols-1 md:gap-x-[116px] md:gap-y-0 gap-y-[40px] items-center">
          <div>
            <div class="mb-6">
              <img src="~/assets/images/landing/about-us/line.png">
            </div>
            <div class="mb-[28px] font-bold landing-font-48 text-black">
              {{ $t('about_us.meet_team.title') }}
            </div>
            <div class="text-black font-normal landing-font-20">
              {{ $t('about_us.meet_team.subtitle') }}
            </div>
          </div>
          <div class="m-auto">
            <img src="~/assets/images/landing/about-us/meet-team.png">
          </div>
        </div>
      </div>
    </section>
    <section class="awards-recognitions py-[120px]">
      <div class="text-black landing-font-48 font-bold text-center">
        {{ $t('about_us.awards_recognitions.title') }}
      </div>
      <div class="my-6">
        <img src="~/assets/images/landing/about-us/line-tick.png" class="m-auto">
      </div>
      <div class="font-normal landing-font-20 text-center text-black mb-[42px]">
        {{ $t('about_us.awards_recognitions.subtitle') }}
      </div>
      <div>
        <img src="~/assets/images/landing/about-us/image-awards.png" class="m-auto">
      </div>
    </section>
  </div>
</template>
<script>
export default {
  layout: 'landing'
}
</script>
<style>
</style>
