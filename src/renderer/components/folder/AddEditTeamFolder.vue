<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="435px"
    destroy-on-close
    top="5vh"
    custom-class="locker-dialog"
    :close-on-click-modal="false"
  >
    <div slot="title">
      <div class="text-head-5 text-black-700 font-semibold">
        {{ folder.id ? 'Cập nhật thư mục' : 'Tạo thư mục' }}
      </div>
    </div>
    <div class="text-left">
      <div class="form-group">
        <label for="">Team</label>
        <el-select v-model="team" placeholder=""
                   :class="{'is-invalid': errors.team}"
                   value-key="id"
                   class="w-full"
                   :disabled="folder.id"
        >
          <el-option
            v-for="item in teams"
            :key="item.id"
            :label="item.name"
            :value="item"
            :disabled="!canManage(item)"
          >
            <div class="flex items-center justify-between">
              <div>{{ item.name }}</div>
              <div>{{ item.role }}</div>
            </div>
          </el-option>
        </el-select>
        <div class="invalid-feedback">
          {{ errors.team && errors.team[0] }}
        </div>
      </div>
      <div class="form-group">
        <label for="">Tên thư mục</label>
        <input v-model="folder.name" type="text" class="form-control"
               :class="{'is-invalid': errors.name}"
               placeholder=""
        >
        <div class="invalid-feedback">
          {{ errors.name && errors.name[0] }}
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer flex items-center text-left">
      <div class="flex-grow">
        <button v-if="folder.id" class="btn btn-icon !text-danger"
                @click="deleteFolder(folder)"
        >
          <i class="fa fa-trash-alt" />
        </button>
      </div>
      <div>
        <button class="btn btn-default"
                @click="dialogVisible = false"
        >
          Cancel
        </button>
        <button class="btn btn-primary"
                :disabled="loading"
                @click="folder.id ?putFolder(folder):postFolder(folder)"
        >
          {{ folder.id ? $t('common.update') : $t('common.add') }}
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
      redirect: false,
      shouldRedirect: false,
      team: {}
    }
  },
  computed: {
  },
  methods: {
    openDialog (folder = {}, shouldRedirect = false) {
      this.dialogVisible = true
      this.shouldRedirect = shouldRedirect
      this.folder = { ...folder }
    },
    closeDialog () {
      this.dialogVisible = false
    },
    async postFolder (folder) {
      try {
        this.loading = true
        const orgKey = await this.$cryptoService.getOrgKey(this.team.organization_id)
        const name = (await this.$cryptoService.encrypt(folder.name, orgKey)).encryptedString
        const res = await this.$axios.$post(`cystack_platform/pm/teams/${this.team.id}/folders`, { name })
        await this.getSyncData()
        this.closeDialog()
        this.$emit('created-team-folder', res.id)
        if (this.shouldRedirect) {
          this.$router.push(this.localeRoute({ name: 'vault-folders-folderId', params: { folderId: res.id } }))
        }
      } catch (e) {
        this.errors = (e.response && e.response.data && e.response.data.details) || {}
      } finally {
        this.loading = false
      }
    },
    async deleteFolder (folder) {
      this.$confirm(this.$t('data.notifications.deleted_folder'), this.$t('common.warning'), {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        try {
          this.loading = true
          await this.$axios.$delete(`cystack_platform/pm/folders/${folder.id}`)
          this.getSyncData()
          this.closeDialog()
          this.notify(this.$tc('data.notifications.delete_success', 1, { type: this.$t('common.folder') }), 'success')
        } catch (e) {
          this.errors = (e.response && e.response.data && e.response.data.details) || {}
          this.notify(this.$tc('data.notifications.delete_failed', 1, { type: this.$t('common.folder') }), 'success')
        } finally {
          this.loading = false
        }
      }).catch(() => {

      })
    },
    async putFolder (folder) {
      try {
        this.loading = true
        const folderEnc = await this.$folderService.encrypt(folder)
        const data = new FolderRequest(folderEnc)
        await this.$axios.$put(`cystack_platform/pm/folders/${folder.id}`, data)
        await this.getSyncData()
        this.closeDialog()
      } catch (e) {
        this.errors = (e.response && e.response.data && e.response.data.details) || {}
      } finally {
        this.loading = false
      }
    },
    canManage (team) {
      return ['owner', 'admin'].includes(team.role)
    }
  }
}
</script>
