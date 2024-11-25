<template>
  <el-dialog
    append-to-body
    :visible.sync="dialogVisible"
    custom-class="max-w-[620px] img-dialog"
    width="90%"
  >
    <a :href="locale === 'vi' ? 'https://locker.io/vi/blog/black-friday-2024-sieu-uu-dai?utm_medium=popupweb&utm_campaign=blackfriday2024&utm_source=popup-bf2024' : 'https://locker.io/blog/black-friday-2024-save-big-secure-forever?utm_medium=popupweb&utm_campaign=blackfriday2024&utm_source=popup-bf2024'" target="_blank">
      <img
        :src="locale === 'vi' ? 'https://s.cystack.net/resource/home/content/25110817/locker-popup-vi-black-friday-2024.png' : 'https://s.cystack.net/resource/home/content/25111254/locker-popup-en-black-friday-2024.png'"
        alt="Black Friday 2024"
      >
    </a>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      isViewed: false,
      dialogVisible: false
    }
  },
  computed: {
    currentPath () {
      return this.$route.name
    }
  },
  watch: {
    currentPath () {
      this.checkOpen()
    }
  },
  mounted () {
    this.checkOpen()
  },
  methods: {
    checkOpen () {
      let isShow = !this.isViewed
      if (Date.now() > 1733029200000) {
        isShow = false
      }
      const BLACKLIST = ['business_', 'lifetime_']
      if (BLACKLIST.some(path => this.currentPath.startsWith(path))) {
        isShow = false
      }
      if (isShow) {
        setTimeout(() => {
          this.dialogVisible = true
          this.isViewed = true
        }, 1000)
      }
    }
  }
}
</script>

<style lang="scss">
.img-dialog {
  .el-dialog__header {
    padding: 0;
    .el-dialog__headerbtn {
      top: 8px;
      right: 16px;
    }
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>
