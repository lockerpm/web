<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="575px"
    destroy-on-close
    top="5vh"
    custom-class="locker-dialog"
    :close-on-click-modal="false"
  >
    <div slot="title">
      <div class="text-head-5 text-black-700 font-semibold truncate">
        Groups access {{ folder.name }}
      </div>
    </div>
    <div class="text-left">
      {{ teamFolderGroups }}
    </div>
    <div slot="footer" class="dialog-footer flex items-center text-left">
      <div class="flex-grow" />
      <div>
        <button class="btn btn-default"
                @click="dialogVisible = false"
        >
          Cancel
        </button>
        <button class="btn btn-primary"
                :disabled="loading"
                @click="putTeamFolderGroups(folder)"
        >
          {{ $t('common.update') }}
        </button>
      </div>
    </div>
  </el-dialog>
</template>

<script>

export default {
  data () {
    return {
      folder: {},
      loading: false,
      dialogVisible: false,
      errors: {},
      groups: [],
      teamFolderGroups: []
    }
  },
  computed: {
  },
  methods: {
    async openDialog (folder = {}) {
      this.dialogVisible = true
      this.folder = { ...folder }
      this.loading = true
      await this.getGroups(folder)
      await this.getTeamFolderGroups(folder)
      this.loading = false
    },
    closeDialog () {
      this.dialogVisible = false
    },
    async putTeamFolderGroups (folder) {
      try {
        this.loading = true
        const res = await this.$axios.$post(`cystack_platform/pm/teams/${folder.organizationId}/folders/${folder.id}/groups`, {

        })
        this.closeDialog()
        this.$emit('done')
        this.notify(this.$t('data.notifications.update_folder_success'), 'success')
      } catch (e) {
        this.errors = (e.response && e.response.data && e.response.data.details) || {}
        this.notify(this.$t('data.notifications.update_folder_failed'), 'warning')
      } finally {
        this.loading = false
      }
    },
    async getGroups (folder) {
      this.groups = await this.$axios.$get(`cystack_platform/pm/teams/${folder.organizationId}/groups`)
    },
    async getTeamFolderGroups (folder) {
      this.teamFolderGroups = await this.$axios.$get(`cystack_platform/pm/teams/${folder.organizationId}/folders/${folder.id}/groups`)
    }
  }
}
</script>
