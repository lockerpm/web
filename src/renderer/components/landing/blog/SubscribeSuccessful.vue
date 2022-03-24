<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="1140px"
      class="premium-dialog header-no-padding body-no-padding"
    >
      <div class="text-center py-10">
        <img class="mx-auto" src="~/assets/images/landing/subscribe-successful.gif">
        <div class="mt-3 landing-font-20 font-semibold">{{ $t('blog.success_title') }}</div>
        <div class="mt-2 text-head-6">{{ $t('blog.success_subtitle') }}</div>
        <div class="mt-[30px]">
          <button
            class="btn btn-primary w-[320px]"
            @click="dialogVisible=false"
          >
            {{ $t('blog.great') }}
          </button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      bg: '/upgrade_premium.png'
    }
  },
  methods: {
    openDialog () {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
