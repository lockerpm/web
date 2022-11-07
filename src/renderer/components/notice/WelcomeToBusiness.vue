<template>
  <el-dialog
    :visible.sync="visible"
    custom-class="locker-dialog max-w-[600px]"
    width="100%"
    @close="isFirst = false"
  >
    <div slot="title">
      <div class="text-head-5 text-black-700 font-semibold text-center" v-html="$t('data.welcome_business.title')" />
    </div>

    <div class="flex md:flex-row flex-col items-center">
      <div class="w-1/3 mb-6 md:mb-0">
        <img v-if="locale === 'vi'" :src="require(`~/assets/images/business/vi/vault-dialog-intro.png`)" class="w-full">
        <img v-else :src="require(`~/assets/images/business/en/vault-dialog-intro.png`)" class="w-full">
      </div>

      <div class="md:w-2/3 w-full md:pl-6 pl-0">
        <p class="mb-2">
          {{ $t('data.welcome_business.content.text_1') }}
        </p>
        <ul style="list-style-type: circle; margin-left: 20px">
          <li
            v-for="(item, index) in $t('data.welcome_business.content.list')"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>
        <p class="mt-2" v-html="$t('data.welcome_business.content.text_2')" />
      </div>
    </div>

    <span slot="footer">
      <a class="mr-6" @click.prevent="offWelcome">
        {{ $t('data.welcome_business.dont_show') }}
      </a>
      <el-button
        type="primary"
        @click="goToDashboard"
      >
        {{ $t('data.welcome_business.go_dashboard') }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      isFirst: true,
      visible: false,
      allowWelcome: false
    }
  },
  computed: {
    shouldWelcome () {
      return this.allowWelcome && this.isEnterpriseAdminOrOwner && this.isFirst
    }
  },
  watch: {
    shouldWelcome (newVal) {
      if (newVal) {
        this.visible = true
      }
    }
  },
  mounted () {
    this.allowWelcome = this.checkWelcome() !== 'false'
  },
  methods: {
    goToDashboard () {
      window.open(process.env.lockerEnterprise, '_blank')
      this.offWelcome()
    },
    checkWelcome () {
      return localStorage.getItem('show_welcome_business')
    },
    offWelcome () {
      this.visible = false
      localStorage.setItem('show_welcome_business', 'false')
      this.allowWelcome = false
    }
  }
}
</script>

<style scoped>

</style>
