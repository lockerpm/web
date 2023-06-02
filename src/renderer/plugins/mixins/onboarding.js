import Vue from 'vue'
import uniqBy from 'lodash/uniqBy'

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
          vaultToDashboard: res.vault_to_dashboard,
          tutorialProcess: res.tutorial_process
        }
        this.$store.commit('UPDATE_NOTICE', {
          showWelcome: !progress.welcome,
          allowShowWelcomeBusiness: !progress.vaultToDashboard,
          allowShowTutorial: !progress.tutorial
        })
        this.$store.commit('UPDATE_TUTORIAL', {
          doneSteps: progress.tutorialProcess || []
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
    },

    markDoneStep (stepId) {
      const progress = uniqBy([...this.$store.state.tutorial.doneSteps])
      if (!progress.includes(stepId)) {
        progress.push(stepId)
        this.$store.commit('UPDATE_TUTORIAL', {
          doneSteps: progress
        })
        this.updateOnboardingProgress({
          tutorial_process: progress
        })
      }
    }
  }
})
