<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="435px"
      destroy-on-close
      top="10vh"
      custom-class="locker-dialog"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <div class="text-head-5 text-black-700 font-semibold truncate">
          {{ $t('data.folders.move_to') }}
        </div>
      </div>
      <div>
        <div class="form-group">
          <label for="">
            {{ $t('data.notifications.move_selected_desc', {count: ids.length}) }}
          </label>
          <InputSelectFolder
            v-if="dialogVisible"
            ref="inputSelectFolder"
            :initial-value="folderId"
            :options="collections.concat(folders)"
            :label="$t('data.folders.select_folder')"
            class="w-full !mb-0 mt-4"
            @change="(v) => folderId = v"
            @addFolder="addFolder"
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer flex items-center text-left">
        <div class="flex-grow" />
        <div>
          <button
            class="btn btn-default"
            @click="dialogVisible = false"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            class="btn btn-primary"
            :disabled="loading"
            @click="putCiphersFolder(cipher)"
          >
            {{ $t('common.update') }}
          </button>
        </div>
      </div>
    </el-dialog>
    <AddEditFolder ref="addEditFolder" @created-folder="handleCreatedFolder" />
  </div>
</template>

<script>
import { CipherType } from '../../jslib/src/enums'
import { CipherRequest } from '../../jslib/src/models/request'
import { CipherView } from '../../jslib/src/models/view'
import InputSelectFolder from '../input/InputSelectFolder'
import AddEditFolder from './AddEditFolder'
export default {
  components: {
    InputSelectFolder,
    AddEditFolder
  },
  props: {
    type: {
      type: String,
      default: 'Login'
    }
  },
  data () {
    return {
      cipher: {},
      folders: [],
      dialogVisible: false,
      loading: false,
      errors: {},
      ids: [],
      folderId: '',
      collections: []
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    async openDialog (data) {
      this.folders = await this.getFolders()
      this.collections = await this.getCollections()
      this.dialogVisible = true
      this.ids = data
    },
    closeDialog () {
      this.dialogVisible = false
    },
    async putCiphersFolder () {
      try {
        this.loading = true
        const collection = this.collections.find(c => c.id === this.folderId)
        if (collection) {
          const orgKey = await this.$cryptoService.getOrgKey(collection.organizationId)
          const encCipher = await this.$cipherService.get(this.ids[0])
          const cipher = await encCipher.decrypt()
          const type_ = cipher.type
          if (type_ === 7) {
            cipher.type = CipherType.SecureNote
            cipher.secureNote.type = 0
          }
          const cipherEnc = await this.$cipherService.encrypt(cipher, orgKey)
          const data = new CipherRequest(cipherEnc)
          data.type = type_
          await this.$axios.$post(`cystack_platform/pm/sharing/${collection.organizationId}/folders/${collection.id}/items`, { cipher: { ...data, id: this.ids[0] } })
        } else {
          await this.$axios.$put('cystack_platform/pm/ciphers/move', {
            ids: this.ids,
            folderId: this.folderId
          })
        }
        this.notify(this.$tc('data.notifications.move_success', this.ids.length), 'success')
        this.closeDialog()
        this.$emit('reset-selection')
      } catch (e) {
        if (e.response && e.response.data && e.response.data.code === '5000') {
          this.notify(this.$t('errors.5000'), 'error')
        } else {
          this.notify(this.$tc('data.notifications.move_failed', this.ids.length), 'warning')
        }
      } finally {
        this.loading = false
      }
    },
    addFolder () {
      this.$refs.addEditFolder.openDialog({})
    },
    async handleCreatedFolder (folder) {
      // this.folders = await this.getFolders()
      // setTimeout(async () => {
      //   this.folders = await this.getFolders()
      // }, 300)
      this.folders.push(folder)
      this.cipher.folderId = folder.id
      this.folderId = folder.id
      this.$refs.inputSelectFolder.value = folder.id
    }
  }
}
</script>
