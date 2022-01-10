<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="60%"
      class="premium-dialog header-no-padding body-no-padding"
    >
      <div
        slot="title"
      >
        <nuxt-link :to="localeRoute({name: 'plans'})">
          <img src="~/assets/images/upgrade_premium.png">
        </nuxt-link>
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
