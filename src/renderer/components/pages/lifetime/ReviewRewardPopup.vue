<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="90%"
      custom-class="max-w-[550px]"
      class="header-no-padding body-no-padding"
    >
      <div id="popup-reward">
        <div class="pt-8 mr-6">
          <img
            v-if="locale === 'vi'"
            src="~assets/images/landing/lifetime/popup/reward-img-vi.png"
            alt="Đánh giá và nhận mã giảm giá tới 20%"
            class="w-full h-auto"
          >
          <img
            v-else
            src="~assets/images/landing/lifetime/popup/reward-img.png"
            alt="Write reviews and get discount code up to 20%"
            class="w-full h-auto"
          >
        </div>

        <div class="p-6">
          <p class="text-center font-medium landing-font-16 text-black">
            {{ $t('lifetime.redeem_page.popup.desc1') }}
            <a
              target="_blank"
              href="/rewards"
              class="underline text-info hover:text-info hover:underline cursor-pointer"
            >{{ $t('lifetime.redeem_page.popup.link') }}</a>
            {{ $t('lifetime.redeem_page.popup.desc2') }}
          </p>

          <div class="mt-8">
            <a
              :href="
                locale === 'vi'
                  ? 'https://support.locker.io/vi/articles/Nhan-uu-djai-cho-goi-djang-ky-Locker-fd847d8745c74666bad3caed8632231b'
                  : 'https://support.locker.io/articles/Get-incentives-for-a-Locker-subscription-e4c2d7cc684d4d8d86d76d6e5bfe5d7a'
              "
              target="_blank"
              class="cursor-pointer"
              @click="dialogVisible = false"
            >
              <img
                v-if="locale === 'vi'"
                src="~assets/images/landing/lifetime/popup/btn-vi.png"
                alt="Khám phá tính năng Nhận thưởng"
                class="w-full h-auto"
              >
              <img
                v-else
                src="~assets/images/landing/lifetime/popup/btn.png"
                alt="Explore rewards feature"
                class="w-full h-auto"
              >
            </a>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dialogVisible: false,
      reached: false
    }
  },

  mounted () {
    window.addEventListener('scroll', this.onScroll)
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.onScroll)
  },

  methods: {
    onScroll () {
      if (
        window.innerHeight + window.scrollY >=
          document.body.scrollHeight * 0.2 &&
        !this.reached
      ) {
        this.reached = true
        this.dialogVisible = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#popup-reward {
  background-image: url(~assets/images/landing/lifetime/popup/reward-bg.svg);
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
