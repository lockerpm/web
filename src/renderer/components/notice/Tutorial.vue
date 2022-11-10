<template>
  <div>
    <el-dialog
      :visible="showTutorial"
      custom-class="locker-dialog max-w-[450px]"
      width="100%"
      @close="closeDialog"
    >
      <div class="flex flex-col items-center">
        <h1 class="font-medium text-[28px] text-black">
          Welcome to Locker
        </h1>
        <img src="~/assets/images/tutorial/welcome.svg" height="256">
        <p class="text-lg text-black text-center mb-8" style="max-width: 350px">
          We will guide you through Locker’s most essential features in just 3 minutes.
        </p>
        <el-button
          type="primary"
          @click="startTutorial"
        >
          Let's get started
        </el-button>
        <a class="mt-3" @click.prevent="closeDialog">
          Skip tutorial
        </a>
      </div>
    </el-dialog>

    <el-dialog
      :visible="showTutorialStep6"
      custom-class="locker-dialog max-w-[500px]"
      width="100%"
      @close="closeDialog"
    >
      <div class="flex flex-col">
        <h1 class="text-[24px] text-black mb-8">
          6. Auto-save on the go
        </h1>
        <img src="~/assets/images/tutorial/extension.png" style="width: 100%">
        <p class="mt-4">
          With Locker Extension, you can:
        </p>
        <ul class="list-disc ml-4">
          <li>
            Save accounts and passwords while you browsing
          </li>
          <li>
            Fill login credentials securely with a single click
          </li>
          <li>
            Access all your passwords and other items quickly
          </li>
        </ul>
        <div class="flex flex-row justify-between items-center mt-6">
          <el-button
            type="primary"
            @click="openExtension"
          >
            Get the extension <i class="el-icon-right" />
          </el-button>
          <a @click.prevent="closeDialog">
            Close
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
  methods: {
    closeDialog () {
      this.$store.commit('UPDATE_NOTICE', { showTutorial: false, showTutorialStep6: false })
    },
    async startTutorial () {
      await this.$router.push(this.localePath({ name: 'vault' }))
      this.closeDialog()
      this.$tutorial.cancel()
      setTimeout(() => {
        this.$tutorial.start()
      }, 1000)
    },
    openExtension () {
      window.open('https://chrome.google.com/webstore/detail/locker-password-manager/cmajindocfndlkpkjnmjpjoilibjgmgh/related', '_blank')
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
}
</style>
