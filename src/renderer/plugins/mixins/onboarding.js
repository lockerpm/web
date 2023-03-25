import Vue from 'vue'

Vue.mixin({
  methods: {
    async checkOnboardingProgress () {
      try {
        const res = await this.$axios.$get(
          '/cystack_platform/pm/users/me/onboarding_process'
        )
        const progress = {
          tutorial: res.tutorial,
          welcome: res.welcome,
          vaultToDashboard: res.vault_to_dashboard
        }
        this.$store.commit('UPDATE_NOTICE', {
          showWelcome: !progress.welcome,
          allowShowWelcomeBusiness: !progress.vaultToDashboard,
          allowShowTutorial: !progress.tutorial
        })

        // Should open tutorial right away or wait after welcome business
        const willOpenWelcomeBusiness =
          !progress.vaultToDashboard && this.isEnterpriseAdminOrOwner
        if (!progress.tutorial && !willOpenWelcomeBusiness) {
          setTimeout(() => {
            this.$store.commit('UPDATE_NOTICE', { showTutorial: true })
          }, 1000)
        }
      } catch (e) {
        console.log(e)
        return null
      }
    },

    async updateOnboardingProgress (payload) {
      try {
        await this.$axios.$put(
          '/cystack_platform/pm/users/me/onboarding_process',
          payload
        )
        return true
      } catch (e) {
        console.log(e)
        return false
      }
    }
  }
})
