<template>
  <div class="md:pt-[180px] pt-36 pb-20">
    <div class="h-full flex justify-center flex-col">
      <p class="text-success text-center mb-6" style="font-size: 50px">
        <i class="far fa-check-circle" />
      </p>
      <div class="text-center">
        <h1 class="text-lg font-semibold mb-4" style="font-size: 28px">
          {{ content.title }}
        </h1>
        <p :class="content.desc2 ? 'mb-0' : 'mb-6'">
          {{ content.desc }}
        </p>
        <p v-if="content.desc2" class="mb-6">
          {{ content.desc2 }}
        </p>
        <el-button type="primary" @click="goToVault">
          {{ $t('common.login') }}
          {{ content.goToVault ? `(${remainingTime}s)` : '' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'landing',
  data () {
    return {
      countdown: null,
      remainingTime: 10
    }
  },
  computed: {
    content () {
      const { action, status } = this.$route.query
      switch (action) {
      case 'buy-lifetime-family':
      case 'buy-lifetime-premium': {
        const needCreateAccount = status === 'account-created'
        const isFamily = action === 'buy-lifetime-family'
        if (needCreateAccount) {
          return {
            title: this.$t('promo.buy13.form.success.title'),
            desc: this.$t('promo.buy13.form.success.desc_1_new').replace(
              'Premium',
              isFamily ? 'Family' : 'Premium'
            ),
            desc2: this.$t('promo.buy13.form.success.desc_2_new')
          }
        }
        return {
          title: this.$t('promo.buy13.form.success.title'),
          desc: this.$t('promo.buy13.form.success.desc_1'),
          desc2: this.$t('promo.buy13.form.success.desc_2'),
          goToVault: true
        }
      }
      default:
        return {
          title: this.$t('thank_you.title'),
          desc: this.$t('thank_you.desc'),
          goToVault: false
        }
      }
    }
  },
  mounted () {
    if (this.content.goToVault) {
      this.countdown = setInterval(() => {
        this.remainingTime -= 1
        if (this.remainingTime === 0) {
          clearInterval(this.countdown)
          this.goToVault()
        }
      }, 1000)
    }
  },
  beforeDestroy () {
    clearInterval(this.countdown)
  },
  methods: {
    goToVault () {
      this.$router.push(this.localeRoute('/vault'))
    }
  }
}
</script>

<style scoped></style>
