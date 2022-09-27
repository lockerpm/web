<template>
  <div v-show="visible" class="banner-container">
    <div class="max-w-6xl mx-auto">
      <div class="w-full px-6 flex flex-row">
        <div class="flex-1">
          <p class="font-normal" style="color: white">
            <span class="new-container">
              NEW
            </span>
            <span v-html="$t('landing_banner.desc')" /> 🎉
            <nuxt-link
              :to="localePath('/private-email')"
              style="color: #15D127; text-decoration: none"
            >
              {{ $t('landing_banner.read_more') }} <i class="el-icon-right" />
            </nuxt-link>
          </p>
        </div>
        <a class="close-btn" @click.prevent="close()">
          <i class="el-icon-close" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopBanner',
  data () {
    return {
      visible: true
    }
  },
  computed: {
    url () {
      if (this.$store.state.user.language === 'vi') {
        return 'https://locker.io/vi/blog/chinh-thuc-ra-mat-trinh-quan-ly-mat-khau-locker'
      } else {
        return 'https://locker.io/blog/locker-password-manager-has-just-arrived-download-for-free'
      }
    }
  },
  methods: {
    close () {
      console.log(1)
      this.visible = false
    }
  }
}
</script>

<style scoped>
.banner-container {
  background-color: #222222;
  padding-top: 13px;
  padding-bottom: 13px;
  position: sticky;
  top: 0;
  z-index: 2000;
}
.new-container {
  background-color: #FFC400;
  color: #222222;
  padding: 0 1px 0 5px;
  line-height: 22px;
  border-radius: 3px;
  margin-right: 10px;
}
.close-btn {
  color: white;
  text-decoration: none;
  padding: 0 10px;
  margin-right: -10px
}
</style>
