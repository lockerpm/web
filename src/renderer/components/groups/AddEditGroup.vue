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
        {{ group.id ? 'Chỉnh sửa nhóm' : 'Thêm nhóm' }}
      </div>
    </div>
    <div class="text-left">
      <div class="form-group">
        <label for="">Tên nhóm</label>
        <input v-model="group.name" type="text" class="form-control">
        <div class="invalid-feedback">
          {{ errors.name && errors.name[0] }}
        </div>
      </div>
      <div class="form-group">
        <el-radio-group v-model="group.access_all" @change="() => !group.id ? group.collections = [] : null">
          <el-radio :label="true"
                    class="!flex items-start !break-words !whitespace-normal !mb-4"
          >
            <div>This group can access all items.</div>
          </el-radio>
          <el-radio :label="false"
                    class="!flex items-start !break-words !whitespace-normal !mb-4"
          >
            <div>This group can access only the selected collections.</div>
          </el-radio>
        </el-radio-group>
      </div>
      <div v-if="group.access_all === false" class="form-group">
        <el-checkbox-group v-model="group.collections">
          <el-checkbox
            v-for="item in collections"
            :key="item.id"
            :label="item.id"
          >
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
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
                @click="group.id ? putGroup(group) : postGroup(group)"
        >
          {{ group.id ? $t('common.update') : $t('common.add') }}
        </button>
      </div>
    </div>
  </el-dialog>
</template>

<script>

export default {
  data () {
    return {
      loading: false,
      dialogVisible: false,
      errors: {},
      group: {
        name: '',
        access_all: false,
        collections: []
      }
    }
  },
  computed: {
    ownershipOptions () {
      return this.teams.filter(e => ['owner', 'admin'].includes(e.role))
    }
  },
  asyncComputed: {
    collections: {
      async get () {
        const collections = await this.$collectionService.getAllDecrypted() || []
        return collections.filter(c => !c.readOnly && c.organizationId === this.$route.params.teamId)
      },
      watch: ['$store.state.syncedCiphersToggle']
    }
  },
  methods: {
    async openDialog (group = {}) {
      if (group.id) {
        this.group = await this.getGroup(group)
      } else {
        this.group = {
          name: '',
          access_all: false,
          collections: []
        }
      }
      this.dialogVisible = true
    },
    closeDialog () {
      this.dialogVisible = false
    },
    async getGroup (group) {
      return await this.$axios.$get(`cystack_platform/pm/teams/${this.$route.params.teamId}/groups/${group.id}`)
    },
    async postGroup (group) {
      try {
        this.loading = true
        await this.$axios.$post(`cystack_platform/pm/teams/${this.$route.params.teamId}/groups`, group)
        this.notify(this.$t('data.notifications.add_group_success'), 'success')
        this.getSyncData()
        this.closeDialog()
        this.$emit('done')
      } catch (e) {
        console.log(e)
        this.errors = (e.response && e.response.data && e.response.data.details) || {}
        this.notify(this.$t('data.notifications.add_group_failed'), 'warning')
      } finally {
        this.loading = false
      }
    },
    async putGroup (group) {
      try {
        this.loading = true
        await this.$axios.$put(`cystack_platform/pm/teams/${this.$route.params.teamId}/groups/${group.id}`, group)
        this.notify(this.$t('data.notifications.update_group_success'), 'success')
        this.getSyncData()
        this.closeDialog()
        this.$emit('done')
      } catch (e) {
        console.log(e)
        this.errors = (e.response && e.response.data && e.response.data.details) || {}
        this.notify(this.$t('data.notifications.update_group_failed'), 'warning')
      } finally {
        this.loading = false
      }
    },
    async deleteGroup (group) {
      this.$confirm(this.$t('data.notifications.delete_group_description'), this.$t('common.warning'), {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        try {
          this.loading = true
          await this.$axios.$delete(`cystack_platform/pm/teams/${this.$route.params.teamId}/groups/${group.id}`)
          this.getSyncData()
          this.closeDialog()
          this.$emit('done')
          this.notify(this.$t('data.notifications.delete_group_success'), 'success')
        } catch (e) {
          this.errors = (e.response && e.response.data && e.response.data.details) || {}
          this.notify(this.$t('data.notifications.delete_group_failed'), 'warning')
        } finally {
          this.loading = false
        }
      }).catch(() => {

      })
    }
  }
}
</script>
