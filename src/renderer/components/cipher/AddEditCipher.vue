<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="435px"
    destroy-on-close
    top="5vh"
    custom-class="locker-dialog"
  >
    <div slot="title">
      <div class="text-head-5 text-black-700 font-semibold">
        {{ isDeleted ? 'Khôi phục mật khẩu' : cipher.id ? 'Chỉnh sửa mật khẩu' : 'Thêm mật khẩu' }}
      </div>
    </div>
    <div class="text-left">
      <template v-if="cipher.type === CipherType.Login">
        <div class="form-group">
          <label for="">Tên <span class="text-danger">*</span></label>
          <input v-model="cipher.name" type="text" class="form-control"
                 placeholder="Name*"
                 :disabled="isDeleted"
          >
        </div>
        <div class="mb-4 text-black-700 text-head-6 font-semibold">Chi tiết đăng nhập</div>
        <div class="form-group">
          <label for="">Email hoặc Username</label>
          <input v-model="cipher.login.username" type="text" class="form-control mb-4"
                 placeholder="Username"
                 :disabled="isDeleted"
          >
        </div>
        <div class="form-group !mb-0">
          <label for="">Mật khẩu</label>
          <div class="input-group">
            <input v-model="cipher.login.password"
                   :type="showPassword ? 'text' : 'password'"
                   class="form-control mb-4"
                   autocomplete="new-password"
                   :disabled="isDeleted"
            >
            <div class="input-group-append">
              <button class="btn btn-icon" @click="showPassword = !showPassword">
                <i class="far"
                   :class="{'fa-eye': !showPassword, 'fa-eye-slash': showPassword}"
                />
              </button>
            </div>
          </div>
          <div v-if="!isDeleted" class="text-right">
            <button class="btn btn-clean !text-primary !pb-0"
                    @click="generatePassword"
            >
              Tạo mật khẩu ngẫu nhiên
            </button>
          </div>
        </div>
        <div class="form-group">
          <label for="">Địa chỉ Website</label>
          <div v-for="(item, index) in cipher.login.uris" :key="index">
            <input v-model="item.uri" type="text" class="form-control"
                   placeholder="Địa chỉ website"
                   :disabled="isDeleted"
            >
          </div>
        </div>
        <div class="form-group">
          <label for="">Khác</label>
          <el-select v-model="cipher.folder_id" placeholder="Chọn thư mục"
                     class="w-full mb-4"
                     :disabled="isDeleted"
          >
            <el-option
              v-for="item in folders"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-input v-model="cipher.notes"
                    type="textarea"
                    :rows="5"
                    placeholder="Ghi chú"
          />
        </div>
      </template>
    </div>
    <div slot="footer" class="dialog-footer flex items-center justify-between">
      <div>
        <button class="btn btn-icon !text-danger">
          <i class="fa fa-trash-alt" />
        </button>
      </div>
      <div>
        <button class="btn btn-default"
                @click="dialogVisible = false"
        >
          Cancel
        </button>
        <button v-if="isDeleted" class="btn btn-primary"
                :disabled="loadingPost"
                @click="restoreCipher"
        >
          {{ $t('common.restore') }}
        </button>
        <button v-else class="btn btn-primary"
                :disabled="loadingPost"
                @click="cipher.id ?putCipher():postCipher()"
        >
          {{ cipher.id ? $t('common.update') : $t('common.add') }}
        </button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { CipherType } from '../../jslib/src/enums'
import { Cipher } from '../../jslib/src/models/domain'
import { CipherRequest } from '../../jslib/src/models/request'
export default {
  props: {
    type: {
      type: String,
      default: 'Login'
    }
  },
  data () {
    return {
      cipher: new Cipher({ type: CipherType[this.type] }),
      folders: [],
      showPassword: false,
      dialogVisible: false,
      loadingPost: false,
      CipherType
    }
  },
  computed: {
    options () {
      return [
        { name: this.$t('typeLogin'), value: CipherType.Login },
        { name: this.$t('typeCard'), value: CipherType.Card },
        { name: this.$t('typeIdentity'), value: CipherType.Identity },
        { name: this.$t('typeSecureNote'), value: CipherType.SecureNote }
      ]
    },
    cardBrandOptions () {
      return [
        { name: '-- ' + this.$t('select') + ' --', value: null },
        { name: 'Visa', value: 'Visa' },
        { name: 'Mastercard', value: 'Mastercard' },
        { name: 'American Express', value: 'Amex' },
        { name: 'Discover', value: 'Discover' },
        { name: 'Diners Club', value: 'Diners Club' },
        { name: 'JCB', value: 'JCB' },
        { name: 'Maestro', value: 'Maestro' },
        { name: 'UnionPay', value: 'UnionPay' },
        { name: this.$t('other'), value: 'Other' }
      ]
    },
    isDeleted () {
      return !!this.cipher.deletedDate
    }
  },
  mounted () {
    this.getFolders()
  },
  methods: {
    openDialog (data) {
      this.dialogVisible = true
      if (data.id) {
        this.cipher = new Cipher({ ...data }, true)
      } else {
        this.cipher = new Cipher({ type: CipherType[this.type] })
      }
    },
    closeDialog () {
      this.dialogVisible = false
    },
    async postCipher () {
      try {
        this.loadingPost = true
        const cipher = await this.$cipherService.encrypt(this.cipher)
        await this.$axios.$post('cystack_platform/pm/ciphers/vaults', {
          name: cipher.name ? cipher.name.encryptedString : null,
          folder_id: cipher.folderId,
          team_id: null,
          fields: [],
          login: {
            username: cipher.login && cipher.login.username ? cipher.login.username.encryptedString : null,
            password: cipher.login && cipher.login.password ? cipher.login.password.encryptedString : null,
            totp: cipher.login && cipher.login.totp ? cipher.login.totp.encryptedString : null,
            uris: (cipher.login && cipher.login.uris)
              ? cipher.login.uris.map(u => (
                {
                  uri: (u.uri != null ? u.uri.encryptedString : null),
                  match: (u.match != null ? u.match : null)
                }))
              : null
          },
          notes: cipher.notes ? cipher.notes.encryptedString : null,
          type: cipher.type,
          favorite: cipher.favorite,
          lastKnownRevisionDate: cipher.revisionDate,
          reprompt: cipher.reprompt
        })
        this.notify('Thêm mật khẩu thành công', 'success')
        this.closeDialog()
        this.getSyncData()
      } catch (e) {
        this.notify('Thêm mật khẩu thất bại', 'warning')
        console.log(e)
      } finally {
        this.loadingPost = false
      }
    },
    async putCipher () {
      try {
        const cipherEnc = await this.$cipherService.encrypt(this.cipher)
        const data = new CipherRequest(cipherEnc)
        await this.$axios.$put(`cystack_platform/pm/ciphers/${this.cipher.id}`, data)
        this.notify('Cập nhật mật khẩu thành công', 'success')
        this.closeDialog()
        this.getSyncData()
        this.$emit('updated-cipher')
      } catch (e) {
        this.notify('Cập nhật mật khẩu thất bại', 'warning')
        console.log(e)
      } finally {
        this.loadingPost = false
      }
    },
    async restoreCipher () {
      try {
        await this.$axios.$put(`cystack_platform/pm/ciphers/${this.cipher.id}/restore`)
        this.notify('Khôi phục mật khẩu thành công', 'success')
        this.closeDialog()
        this.getSyncData()
        this.$emit('updated-cipher')
      } catch (e) {
        this.notify('Khôi phục mật khẩu thất bại', 'warning')
        console.log(e)
      } finally {
        this.loadingPost = false
      }
    },
    async deleteCipher () {
      try {
        await this.$axios.$delete(`cystack_platform/pm/ciphers/${this.cipher.id}`)
        this.notify('Xóa vĩnh viễn mật khẩu thành công', 'success')
        this.closeDialog()
        this.getSyncData()
        this.$emit('updated-cipher')
      } catch (e) {
        this.notify('Xóa vĩnh viễn mật khẩu thất bại', 'warning')
        console.log(e)
      } finally {
        this.loadingPost = false
      }
    },
    async moveTrashCipher () {
      try {
        await this.$axios.$put(`cystack_platform/pm/ciphers/${this.cipher.id}/delete`)
        this.notify('Xóa mật khẩu thành công', 'success')
        this.closeDialog()
        this.getSyncData()
        this.$emit('updated-cipher')
      } catch (e) {
        this.notify('Xóa mật khẩu thất bại', 'warning')
        console.log(e)
      } finally {
        this.loadingPost = false
      }
    },
    generatePassword () {
      if (this.cipher.login != null && this.cipher.login.password != null && this.cipher.login.password.length) {
        this.$confirm('Are you sure you want to overwrite the current password?', 'Warning', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }).then(() => {
          this.onGeneratePassword()
        }).catch(() => {

        })
      } else {
        this.onGeneratePassword()
      }
    },
    async onGeneratePassword () {
      const options = (await this.$passwordGenerationService.getOptions())[0]
      this.cipher.login.password = await this.$passwordGenerationService.generatePassword(options)
    }
  }
}
</script>
