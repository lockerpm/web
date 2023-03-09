<template>
  <div v-if="shouldWelcome" class="lg:px-28 py-10 px-10">
    <div class="border border-black-200 rounded p-5 md:p-8 relative">
      <div class="flex items-center justify-between">
        <div class="">
          <div class="text-lg font-semibold mb-2">
            {{ $t('data.welcome.title') }}
          </div>
          <div class="text-black-600 mb-5">
            {{ $t('data.welcome.text1') }}
            <br>
            {{ $t('data.welcome.text2') }}
            <br>
            <span v-html="$t('data.welcome.text3')" />
          </div>
        </div>
        <div>
          <img src="~/assets/images/icons/welcome.svg" alt="">
        </div>
        <button
          class="btn btn-clean absolute top-2 -right-2"
          @click="offWelcome"
        >
          <i class="el-icon-close text-lg" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    shouldWelcome () {
      return this.$store.state.notice.showWelcome
    }
  },
  methods: {
    offWelcome () {
      this.$store.commit('UPDATE_NOTICE', { showWelcome: false })
      this.updateOnboardingProgress({
        welcome: true
      })
    }
  }
}
</script>

<style scoped>

</style>
