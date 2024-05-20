<template>
  <div class="flex flex-col flex-column-fluid relative min-h-screen">
    <div class="flex-column-fluid lg:px-28 py-10 md:px-10 px-4 mb-20">
      <!-- Top -->
      <div>
        <el-button
          type="primary"
          plain
          @click="startTutorialFromFirstNotCompleted"
        >
          {{ $t('tutorial.tour.btn') }} <i class="el-icon-right" />
        </el-button>

        <div class="flex items-center flex-wrap mt-4">
          <el-progress
            :show-text="false"
            :percentage="completionPercentage"
            class="mr-6"
            style="width: 260px"
          />
          <p class="text-black-600">
            {{ completedSteps.length }}/{{ steps.length }}
            {{ $t('tutorial.tour.steps_completed') }}
          </p>
        </div>
      </div>
      <!-- Top end -->

      <!-- Steps -->
      <div class="mt-6">
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          class="sm:px-8 py-6 flex sm:items-center border-b border-black-100 flex-col sm:flex-row"
          :class="{
            'opacity-50': step.completed
          }"
        >
          <div class="relative mr-6 mb-3 sm:mb-0" style="width: 113px">
            <img
              :src="require(`~/assets/images/tutorial/steps/${step.id}.svg`)"
              style="min-width: 113px"
            >
            <div class="absolute top-0 right-0">
              <i
                class="text-primary text-[26px]"
                :class="
                  step.completed ? 'el-icon-success' : 'el-icon-circle-plus'
                "
              />
            </div>
          </div>

          <div>
            <p class="font-semibold text-[16px] mb-1">
              {{ index + 1 }}. {{ $t(`tutorial.tour.steps.${step.id}.title`) }}
            </p>
            <p class="text-black-600 mb-4">
              {{ $t(`tutorial.tour.steps.${step.id}.desc`) }}
            </p>
            <div class="flex flex-wrap items-center">
              <el-button
                type="primary"
                style="min-width: 200px"
                @click="startTutorialFromStep(step)"
              >
                {{ $t(`tutorial.tour.steps.${step.id}.btn`) }}
              </el-button>
              <a
                v-if="step.learnMore"
                :href="step.learnMore"
                target="_blank"
                class="text-info ml-2 font-semibold px-4 py-2"
              >
                {{ $t('common.learn_more') }} <i class="el-icon-right" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <!-- Steps end -->
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    completedSteps () {
      return this.$store.state.tutorial.doneSteps
    },

    completionPercentage () {
      return (this.completedSteps.length * 100) / this.steps.length
    },

    steps () {
      const res = [
        {
          id: 'add_pw',
          stepId: 'add-pw-1'
        },
        {
          id: 'import_file',
          stepId: 'add-pw-1',
          actions: [],
          learnMore:
            `https://support.locker.io/${this.locale === 'vi' ? 'vi' : 'en'}/locker-password-manager/get-started/import-and-export`
        },
        {
          id: 'browse_items',
          stepId: 'view-security'
        },
        {
          id: 'view_settings',
          stepId: 'view-settings'
        },
        {
          id: 'view_profile',
          stepId: 'view-profile'
        },
        {
          id: 'view_autofill'
        }
      ]
      return res.map(s => ({
        ...s,
        completed: this.completedSteps.includes(s.id)
      }))
    }
  },

  methods: {
    async startTutorialFromFirstNotCompleted () {
      const firstNotCompletedStep = this.steps.find(s => !s.completed)
      if (firstNotCompletedStep) {
        this.startTutorialFromStep(firstNotCompletedStep)
      } else {
        this.startFullTutorial()
      }
    },

    async startFullTutorial () {
      await this.$router.push(this.localePath({ name: 'vault' }))
      this.$tutorial.hide()
      setTimeout(() => {
        this.$tutorial.start()
      }, 1000)
    },

    async startTutorialFromStep (step) {
      switch (step.id) {
      case 'add_pw': {
        this.startFullTutorial()
        break
      }
      case 'import_file': {
        this.$router.push(this.localePath('/settings/import-export'))
        setTimeout(() => {
          this.$tutorial.show('import-1')
        }, 1000)
        break
      }
      case 'view_autofill': {
        this.$store.commit('UPDATE_NOTICE', { showTutorialStep6: true })
        break
      }
      default:
        step.stepId && this.$tutorial.show(step.stepId)
      }
    }
  }
}
</script>
