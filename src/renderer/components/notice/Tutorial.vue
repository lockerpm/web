<template>
  <div>
    <el-dialog
      :visible="showTutorial"
      custom-class="locker-tutorial-dialog !max-w-[450px]"
      width="100%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <div class="flex flex-col items-center">
        <h1 class="font-medium text-[28px] text-black">
          {{ $t('tutorial.welcome.title') }}
        </h1>
        <img src="~/assets/images/tutorial/welcome.svg" height="256">
        <p class="text-lg text-black text-center mb-8" style="max-width: 350px">
          {{ $t('tutorial.welcome.desc') }}
        </p>
        <el-button type="primary" @click="startTutorial">
          {{ $t('tutorial.welcome.start') }}
        </el-button>
        <a class="mt-3" @click.prevent="closeDialog(true)">
          {{ $t('tutorial.welcome.skip') }}
        </a>
      </div>
    </el-dialog>

    <el-dialog
      :visible="showTutorialStep6"
      custom-class="locker-tutorial-dialog !max-w-[500px]"
      width="100%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <div class="flex flex-col">
        <h1 class="text-[24px] text-black mb-8">
          {{ $t('tutorial.extension.title') }}
        </h1>
        <img src="~/assets/images/tutorial/extension.png" style="width: 100%">
        <p class="mt-4">
          {{ $t('tutorial.extension.desc') }}
        </p>
        <ul class="list-disc ml-4">
          <li
            v-for="(item, index) in $t('tutorial.extension.list')"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>
        <div class="flex flex-row justify-between items-center mt-6">
          <el-button type="primary" @click="openExtension">
            <span v-html="$t('tutorial.extension.action')" />
          </el-button>
          <a @click.prevent="closeDialog(true)">
            {{ $t('common.close') }}
          </a>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  computed: {
    showTutorial () {
      return this.$store.state.notice.showTutorial
    },
    showTutorialStep6 () {
      return this.$store.state.notice.showTutorialStep6
    }
  },
  beforeDestroy () {
    this.closeDialog()
    this.$tutorial.hide()
    this.$store.commit('UPDATE_TUTORIAL', { isActive: false })
  },
  methods: {
    closeDialog (isSkip = false) {
      if (isSkip) {
        this.updateOnboardingProgress({
          tutorial: true
        })
      }
      this.$store.commit('UPDATE_NOTICE', {
        showTutorial: false,
        showTutorialStep6: false
      })
    },

    async startTutorial () {
      this.closeDialog()
      this.$router.push(this.localePath({ path: '/welcome-tour' }))
    },

    openExtension () {
      this.closeDialog(true)
      this.markDoneStep('view_autofill')
      window.open('/download#web-browser', '_blank')
    }
  }
}
</script>

<style lang="scss">
.shepherd-content {
  padding-left: 10px;
  padding-right: 10px;

  .shepherd-header {
    background: white !important;
    padding-bottom: 0 !important;
  }
  .shepherd-title {
    font-size: 24px !important;
  }
  .shepherd-text {
    font-size: 14px !important;
    margin-bottom: 4px;
  }
  .shepherd-arrow {
    background: white !important;
  }

  .tutorial-skip {
    margin-left: auto;
  }

  .tutorial-arrow {
    padding: 8px 13px;
  }
}
</style>
