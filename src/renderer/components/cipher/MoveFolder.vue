<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="435px"
      destroy-on-close
      top="10vh"
      custom-class="locker-dialog"
    >
      <div slot="title">
        <div class="text-head-5 text-black-700 font-semibold">
          Di chuyển tới
        </div>
      </div>
      <div>
        <div class="form-group">
          <label for="">{{ $t('data.notifications.move_selected_desc', {count: ids.length}) }}</label>
          <el-select v-model="folderId" placeholder="Chọn thư mục"
                     class="w-full"
                     :disabled="isDeleted"
          >
            <el-option
              v-for="item in folders"
              :key="item.id"
              :label="item.name || 'No Folder'"
              :value="item.id"
            >
              <div class="flex items-center">
                <img src="~/assets/images/icons/folder.svg" alt="" class="mr-2.5">
                <div class="text-black">{{ item.name || 'No folder' }}</div>
              </div>
            </el-option>
            <el-option value="" @click.native="addFolder">
              <div class="flex items-center">
                <img src="~/assets/images/icons/folderAdd.svg" alt="" class="mr-2.5">
                <div class="text-black">Thêm thư mục</div>
              </div>
            </el-option>
          </el-select>
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
import { CipherType, SecureNoteType } from '../../jslib/src/enums'
import { Cipher } from '../../jslib/src/models/domain'
import { CipherRequest } from '../../jslib/src/models/request'
import { CipherView, LoginView, SecureNoteView, IdentityView, CardView, LoginUriView } from '../../jslib/src/models/view'
import AddEditFolder from './AddEditFolder'
export default {
  components: {
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
      folderId: ''
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    async openDialog (data) {
      this.folders = await this.getFolders()
      this.dialogVisible = true
      this.ids = data
    },
    closeDialog () {
      this.dialogVisible = false
    },
    async putCiphersFolder () {
      try {
        await this.$axios.$put('cystack_platform/pm/ciphers/move', {
          ids: this.ids,
          folderId: this.folderId
        })
        this.notify(this.$tc('data.notifications.move_success', this.ids.length), 'success')
        this.closeDialog()
        this.getSyncData()
      } catch (e) {
        this.notify(this.$tc('data.notifications.move_failed', this.ids.length), 'warning')
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    addFolder () {
      this.$refs.addEditFolder.openDialog({})
    },
    async handleCreatedFolder (id) {
      this.folders = await this.getFolders()
      this.cipher.folderId = id
    }
  }
}
</script>
