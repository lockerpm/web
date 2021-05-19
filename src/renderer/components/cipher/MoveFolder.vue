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
          <label for="">Thư mục</label>
          <el-select v-model="cipher.folderId" placeholder="Chọn thư mục"
                     class="w-full"
                     :disabled="isDeleted"
          >
            <el-option
              v-for="item in folders"
              :key="item.id"
              :label="item.name || 'No folder'"
              :value="item.id"
            >
              <div class="flex items-center">
                <img src="~/assets/images/icons/folder.svg" alt="" class="mr-2.5">
                <div class="font-semibold text-black">{{ item.name || 'No folder' }}</div>
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
                  :disabled="loadingPost"
                  @click="putCipher(cipher)"
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
      cipher: new CipherView(),
      folders: [],
      dialogVisible: false,
      loadingPost: false,
      CipherType,
      errors: {},
      ids: []
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
      if (data.id) {
        this.cipher = new Cipher({ ...data }, true)
      } else {
        this.ids = data
      }
    },
    closeDialog () {
      this.dialogVisible = false
    },
    async putCiphersFolder () {
      try {
        const cipherEnc = await this.$cipherService.encrypt(cipher)
        const data = new CipherRequest(cipherEnc)
        await this.$axios.$put(`cystack_platform/pm/ciphers/${cipher.id}`, data)
        this.notify(this.$tc('data.notifications.update_success', 1, { type: this.$tc(`type.${CipherType[this.type]}`, 1) }), 'success')
        this.closeDialog()
        this.getSyncData()
        this.$emit('updated-cipher')
      } catch (e) {
        this.notify(this.$tc('data.notifications.update_failed', 1, { type: this.$tc(`type.${CipherType[this.type]}`, 1) }), 'warning')
        console.log(e)
      } finally {
        this.loadingPost = false
      }
    },
    addFolder () {
      this.$refs.addEditFolder.openDialog()
    },
    async handleCreatedFolder (id) {
      this.folders = await this.getFolders()
      this.cipher.folderId = id
    }
  }
}
</script>
