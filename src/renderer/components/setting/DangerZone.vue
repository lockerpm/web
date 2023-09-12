<template>
  <div class="setting-wrapper" style="border-color: red">
    <div class="setting-section">
      <div
        class="setting-section-header cursor-pointer"
        @click="collapsed = !collapsed"
      >
        <div class="text-head-5 font-semibold text-danger">
          {{ $t('data.settings.danger_zone') }}
        </div>
        <i v-if="collapsed" class="el-icon-arrow-right" />
        <i v-else class="el-icon-arrow-down" />
      </div>
    </div>
    <div v-if="!collapsed" class="setting-section">
      <div
        class="flex flex-col sm:flex-row justify-between sm:items-center mb-4 sm:mb-0"
      >
        <div>
          <div class="setting-title">
            {{ $t('data.settings.delete_all_items') }}
          </div>
          <div class="setting-description mb-2 sm:mb-4">
            {{ $t('data.settings.delete_all_items_desc') }}
          </div>
        </div>
        <button
          class="btn btn-default !text-danger sm:mt-2 sm:mb-0 sm:ml-2 self-start"
          @click="openPurgeVault('purge')"
        >
          {{ $t('data.settings.delete_all_items') }}
        </button>
      </div>
      <div class="flex flex-col sm:flex-row justify-between sm:items-center">
        <div>
          <div class="setting-title">
            {{ $t('data.settings.delete_account') }}
          </div>
          <div class="setting-description mb-2 sm:mb-4">
            {{ $t('data.settings.delete_account_desc') }}
          </div>
        </div>
        <button
          class="btn btn-default !text-danger sm:mt-2 sm:mb-0 sm:ml-2 self-start"
          @click="openPurgeVault('delete_account')"
        >
          {{ $t('data.settings.delete_account') }}
        </button>
      </div>
      <PurgeVault ref="purgeVault" />
    </div>
  </div>
</template>

<script>
import PurgeVault from './PurgeVault.vue'
export default {
  components: {
    PurgeVault
  },
  data () {
    return {
      collapsed: true
    }
  },
  computed: {
    currentPlan () {
      return this.$store.state.currentPlan
    },
    currentTeam () {
      return this.teams[0]
    }
  },
  methods: {
    openPurgeVault (type) {
      this.$refs.purgeVault.openDialog(type)
    }
  }
}
</script>
