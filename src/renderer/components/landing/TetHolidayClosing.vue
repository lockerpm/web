<template>
  <div v-show="visible" class="banner-container">
    <div class="max-w-6xl mx-auto">
      <div class="w-full px-6 flex flex-row">
        <div class="flex-1">
          <p class="font-normal text-center" style="color: white">
            <span class="new-container">
              NEW
            </span>
            <span v-html="$t('landing_banner.tet_holiday.desc')" /> 🎉
            <a
              style="color: #15D127; text-decoration: none"
              @click.prevent="dialogVisible = true"
            >
              {{ $t('landing_banner.tet_holiday.read_more') }} <i class="el-icon-right" />
            </a>
          </p>
        </div>
      </div>
    </div>

    <el-dialog
      append-to-body
      :visible.sync="dialogVisible"
      custom-class="max-w-[620px]"
      width="90%"
    >
      <img
        :src="locale === 'vi' ? 'https://s.cystack.net/resource/home/content/07104747/tet-closing-vi.png' : 'https://s.cystack.net/resource/home/content/07102022/tet-closing-en.png'"
        alt="Happy Lunar New Year"
        class="mt-6 mb-6"
      >
      <span
        v-for="(text, index) in $t('landing_banner.tet_holiday.details')"
        :key="index"
      >
        <p
          class="text-black"
          v-html="text"
        />
        <br>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TopBanner',
  data () {
    return {
      visible: true,
      dialogVisible: false
    }
  },
  methods: {
    close () {
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
