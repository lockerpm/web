<template>
  <div class="mx-auto">
    <div class="text-head-4 font-semibold mb-4">
      {{ $t('data.settings.email_notifications') }}
    </div>
    <div class="setting-wrapper">
      <div v-for="(item,index) in notificationSettings" :key="index" class="setting-section">
        <div v-if="item.mail != null && item.category" class="setting-section-header">
          <div>
            <div class="setting-title">
              {{ locale==='vi' ? item.category.name_vi : item.category.name }}
            </div>
          </div>
          <div>
            <el-switch :value="item.mail" @change="(v) => updateSetting(v, item.category.id)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      notificationSettings: []
    }
  },
  mounted () {
    this.getNotificationSettings()
  },
  methods: {
    async getNotificationSettings () {
      this.notificationSettings = await this.$axios.$get('cystack_platform/pm/notification/settings?type=mail') || []
    },
    async updateSetting (v, id) {
      try {
        await this.$axios.$put(`cystack_platform/pm/notification/settings/${id}`, { mail: v })
        this.notify(this.$t('data.notifications.update_settings_success'), 'success')
        await this.getNotificationSettings()
      } catch (error) {
        this.notify(this.$t('data.notifications.update_settings_failed'), 'warning')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
