<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="435px"
      destroy-on-close
      top="5vh"
      custom-class="locker-dialog"
    >
      <div slot="title">
        <div class="text-head-5 text-black-700 font-semibold">
          {{ isDeleted ? `Khôi phục ${type}` : cipher.id ? `Chỉnh sửa ${type}` : `Thêm ${type}` }}
        </div>
      </div>
      <div class="text-left">
        <div v-if="routeName==='dashboard' && !cipher.id"
             class="form-group"
        >
          <label for="">Kiểu danh mục</label>
          <el-select v-model="cipher.type" placeholder=""
                     class="w-full"
                     :disabled="isDeleted"
                     :change="handleChangeType"
          >
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="form-group !mb-8">
          <label for="">Tên <span class="text-danger">*</span></label>
          <input v-model="cipher.name" type="text" class="form-control"
                 :class="{'is-invalid': errors.name}"
                 placeholder=""
                 :disabled="isDeleted"
          >
          <div class="invalid-feedback">
            {{ errors.name && errors.name[0] }}
          </div>
        </div>
        <template v-if="cipher.type === CipherType.Login">
          <div class="mb-4 text-black-700 text-head-6 font-semibold">Chi tiết đăng nhập</div>
          <div class="form-group">
            <label for="">Email hoặc Username</label>
            <input v-model="cipher.login.username" type="text" class="form-control mb-4"
                   placeholder=""
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
                     placeholder=""
                     :disabled="isDeleted"
              >
            </div>
          </div>
        </template>
        <template v-if="cipher.type === CipherType.Card">
          <div class="mb-4 text-black-700 text-head-6 font-semibold">Chi tiết thẻ</div>
          <div class="form-group">
            <label for="">Tên chủ thẻ <span class="text-danger">*</span></label>
            <input v-model="cipher.card.cardholderName" type="text" class="form-control"
                   :class="{'is-invalid': errors.card && errors.card.cardholderName}"
                   placeholder=""
                   :disabled="isDeleted"
            >
          </div>
          <div class="form-group">
            <label for="">Thương hiệu</label>
            <el-select v-model="cipher.card.brand" placeholder=""
                       class="w-full"
                       :disabled="isDeleted"
            >
              <el-option
                v-for="item in cardBrandOptions"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="form-group">
            <label for="">Số thẻ thẻ</label>
            <input v-model="cipher.card.number" type="text" class="form-control"
                   placeholder=""
                   :disabled="isDeleted"
            >
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label for="">Tháng hết hạn</label>
              <el-select v-model="cipher.card.expMonth" placeholder=""
                         class="w-full"
                         :disabled="isDeleted"
              >
                <el-option
                  v-for="(item, index) in cardExpMonthOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="form-group">
              <label for="">Năm hết hạn</label>
              <input v-model="cipher.card.expYear" type="text" class="form-control"
                     placeholder="ex. 2025"
                     :disabled="isDeleted"
              >
            </div>
          </div>
          <div class="form-group">
            <label for="">CVV</label>
            <div class="input-group">
              <input v-model="cipher.card.code"
                     :type="showCardCode ? 'text' : 'password'"
                     class="form-control"
                     autocomplete="new-password"
                     :disabled="isDeleted"
              >
              <div class="input-group-append !bg-transparent">
                <button class="btn btn-icon" @click="showCardCode = !showCardCode">
                  <i class="far"
                     :class="{'fa-eye': !showCardCode, 'fa-eye-slash': showCardCode}"
                  />
                </button>
              </div>
            </div>
          </div>
        </template>
        <template v-if="cipher.type === CipherType.Identity">
          <div class="mb-4 text-black-700 text-head-6 font-semibold">Thông tin cá nhân</div>
          <div class="grid grid-cols-2 gap-x-2 mb-4">
            <div class="form-group">
              <label for="">Tước hiệu</label>
              <el-select v-model="cipher.identity.title" placeholder=""
                         class="w-full"
                         :disabled="isDeleted"
              >
                <el-option
                  v-for="(item, index) in identityTitleOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div />
            <div class="form-group">
              <label for="">Tên</label>
              <input v-model="cipher.identity.firstName" type="text" class="form-control"
                     placeholder=""
                     :disabled="isDeleted"
              >
            </div>
            <div class="form-group">
              <label for="">Họ</label>
              <input v-model="cipher.identity.lastName" type="text" class="form-control"
                     placeholder=""
                     :disabled="isDeleted"
              >
            </div>
            <div class="form-group">
              <label for="">Username</label>
              <input v-model="cipher.identity.username" type="text" class="form-control"
                     placeholder=""
                     :disabled="isDeleted"
              >
            </div>
            <div class="form-group">
              <label for="">Công ty</label>
              <input v-model="cipher.identity.company" type="text" class="form-control"
                     placeholder=""
                     :disabled="isDeleted"
              >
            </div>
            <div class="form-group col-span-2">
              <label for="">Email</label>
              <input v-model="cipher.identity.email" type="text" class="form-control"
                     placeholder=""
                     :disabled="isDeleted"
              >
            </div>
            <div class="form-group">
              <label for="">Số điện thoại</label>
              <input v-model="cipher.identity.phone" type="text" class="form-control"
                     placeholder=""
                     :disabled="isDeleted"
              >
            </div>
            <div class="form-group">
              <label for="">Số CMT</label>
              <input v-model="cipher.identity.ssn" type="text" class="form-control"
                     placeholder=""
                     :disabled="isDeleted"
              >
            </div>
            <div class="form-group">
              <label for="">Số hộ chiếu</label>
              <input v-model="cipher.identity.passportNumber" type="text" class="form-control"
                     placeholder=""
                     :disabled="isDeleted"
              >
            </div>
            <div class="form-group">
              <label for="">Số bằng lái xe</label>
              <input v-model="cipher.identity.licenseNumber" type="text" class="form-control"
                     placeholder=""
                     :disabled="isDeleted"
              >
            </div>
          </div>
          <div class="mb-4 text-black-700 text-head-6 font-semibold">Thông tin liên lạc</div>
          <div class="grid grid-cols-2 gap-x-2 mb-4">
            <div class="form-group col-span-2">
              <label for="">Địa chỉ 1</label>
              <input v-model="cipher.identity.address1" type="text" class="form-control"
                     placeholder=""
                     :disabled="isDeleted"
              >
            </div>
            <div class="form-group col-span-2">
              <label for="">Địa chỉ 2</label>
              <input v-model="cipher.identity.address2" type="text" class="form-control"
                     placeholder=""
                     :disabled="isDeleted"
              >
            </div>
            <div class="form-group">
              <label for="">Thành phố</label>
              <input v-model="cipher.identity.city" type="text" class="form-control"
                     placeholder=""
                     :disabled="isDeleted"
              >
            </div>
            <div class="form-group">
              <label for="">Quận/Huyện</label>
              <input v-model="cipher.identity.state" type="text" class="form-control"
                     placeholder=""
                     :disabled="isDeleted"
              >
            </div>
            <div class="form-group">
              <label for="">Mã bưu chính</label>
              <input v-model="cipher.identity.postalCode" type="text" class="form-control"
                     placeholder=""
                     :disabled="isDeleted"
              >
            </div>
            <div class="form-group">
              <label for="">Quốc gia</label>
              <input v-model="cipher.identity.country" type="text" class="form-control"
                     placeholder=""
                     :disabled="isDeleted"
              >
            </div>
          </div>
        </template>
        <div v-if="cipher.type !== CipherType.SecureNote" class="mb-4 text-black-700 text-head-6 font-semibold">Khác</div>
        <div class="form-group">
          <label for="">Ghi chú</label>
          <el-input v-model="cipher.notes"
                    type="textarea"
                    :rows="5"
                    placeholder=""
          />
        </div>
        <div class="form-group">
          <label for="">Thư mục</label>
          <el-select v-model="cipher.folderId" placeholder="Chọn thư mục"
                     class="w-full mb-4"
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
        <div class="flex-grow">
          <button v-if="cipher.id" class="btn btn-icon !text-danger"
                  @click="cipher.isDeleted ? deleteCipher(cipher) : moveTrashCipher(cipher)"
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
          <button v-if="isDeleted" class="btn btn-primary"
                  :disabled="loadingPost"
                  @click="restoreCipher"
          >
            {{ $t('common.restore') }}
          </button>
          <button v-else class="btn btn-primary"
                  :disabled="loadingPost"
                  @click="cipher.id ?putCipher(cipher):postCipher(cipher)"
          >
            {{ cipher.id ? $t('common.update') : $t('common.add') }}
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
    },
    routeName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      cipher: new CipherView(),
      folders: [],
      showPassword: false,
      showCardCode: false,
      dialogVisible: false,
      loadingPost: false,
      CipherType,
      errors: {}
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
    cardExpMonthOptions () {
      return [
        { name: '-- ' + this.$t('select') + ' --', value: null },
        { name: '01 - ' + this.$t('january'), value: '1' },
        { name: '02 - ' + this.$t('february'), value: '2' },
        { name: '03 - ' + this.$t('march'), value: '3' },
        { name: '04 - ' + this.$t('april'), value: '4' },
        { name: '05 - ' + this.$t('may'), value: '5' },
        { name: '06 - ' + this.$t('june'), value: '6' },
        { name: '07 - ' + this.$t('july'), value: '7' },
        { name: '08 - ' + this.$t('august'), value: '8' },
        { name: '09 - ' + this.$t('september'), value: '9' },
        { name: '10 - ' + this.$t('october'), value: '10' },
        { name: '11 - ' + this.$t('november'), value: '11' },
        { name: '12 - ' + this.$t('december'), value: '12' }
      ]
    },
    identityTitleOptions () {
      return [
        { name: '-- ' + this.$t('select') + ' --', value: null },
        { name: this.$t('mr'), value: this.$t('mr') },
        { name: this.$t('mrs'), value: this.$t('mrs') },
        { name: this.$t('ms'), value: this.$t('ms') },
        { name: this.$t('dr'), value: this.$t('dr') }
      ]
    },
    isDeleted () {
      return !!this.cipher.deletedDate
    }
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
        this.newCipher(this.type)
      }
    },
    closeDialog () {
      this.dialogVisible = false
    },
    async postCipher (cipher) {
      try {
        this.loadingPost = true
        this.errors = {}
        const cipherEnc = await this.$cipherService.encrypt(cipher)
        const data = new CipherRequest(cipherEnc)

        await this.$axios.$post('cystack_platform/pm/ciphers/vaults', data)
        this.notify(this.$tc('data.notifications.create_success', 1, { type: this.$tc(`type.${CipherType[this.type]}`, 1) }), 'success')
        this.closeDialog()
        this.getSyncData()
      } catch (e) {
        this.notify(this.$tc('data.notifications.create_failed', 1, { type: this.$tc(`type.${CipherType[this.type]}`, 1) }), 'warning')
        this.errors = (e.response && e.response.data && e.response.data.details) || {}
        console.log(e)
      } finally {
        this.loadingPost = false
      }
    },
    async putCipher (cipher) {
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
    async deleteCipher (cipher) {
      this.$confirm(this.$tc('data.notifications.delete_selected_desc', 1), this.$t('common.warning'), {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        try {
          await this.$axios.$delete(`cystack_platform/pm/ciphers/${cipher.id}`)
          this.notify(this.$tc('data.notifications.delete_success', 1, { type: this.$tc(`type.${CipherType[this.type]}`, 1) }), 'success')
          this.closeDialog()
          this.getSyncData()
          this.$emit('deleted-cipher')
        } catch (e) {
          this.notify(this.$tc('data.notifications.delete_failed', 1, { type: this.$tc(`type.${CipherType[this.type]}`, 1) }), 'warning')
          console.log(e)
        } finally {
          this.loadingPost = false
        }
      }).catch(() => {

      })
    },
    async moveTrashCipher (cipher) {
      this.$confirm(this.$tc('data.notifications.trash_selected_desc', 1), this.$t('common.warning'), {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        try {
          await this.$axios.$put(`cystack_platform/pm/ciphers/${cipher.id}/delete`)
          this.notify(this.$tc('data.notifications.trash_success', 1, { type: this.$tc(`type.${CipherType[this.type]}`, 1) }), 'success')
          this.getSyncData()
          this.$emit('trashed-cipher')
        } catch (e) {
          this.notify(this.$tc('data.notifications.trash_failed', 1, { type: this.$tc(`type.${CipherType[this.type]}`, 1) }), 'warning')
          console.log(e)
        } finally {
          this.loadingPost = false
        }
      }).catch(() => {

      })
    },
    async restoreCipher (cipher) {
      console.log(cipher)
      this.$confirm(this.$tc('data.notifications.restore_selected_desc', 1), this.$t('common.warning'), {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        try {
          await this.$axios.$put(`cystack_platform/pm/ciphers/${cipher.id}/restore`)
          this.notify(this.$tc('data.notifications.delete_success', 1, { type: this.$tc(`type.${CipherType[this.type]}`, 1) }), 'success')
          this.closeDialog()
          this.getSyncData()
          this.$emit('restored-cipher')
        } catch (e) {
          this.notify(this.$tc('data.notifications.delete_failed', 1, { type: this.$tc(`type.${CipherType[this.type]}`, 1) }), 'warning')
          console.log(e)
        } finally {
          this.loadingPost = false
        }
      }).catch(() => {

      })
    },
    generatePassword () {
      if (this.cipher.login != null && this.cipher.login.password != null && this.cipher.login.password.length) {
        this.$confirm(this.$t('data.notifications.overwrite_password'), {
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
    },
    addFolder () {
      this.$refs.addEditFolder.openDialog({})
    },
    async handleCreatedFolder (id) {
      this.folders = await this.getFolders()
      this.cipher.folderId = id
    },
    newCipher (type) {
      this.cipher = new CipherView()
      this.cipher.organizationId = this.organizationId == null ? null : this.organizationId
      this.cipher.type = CipherType[type]
      this.cipher.login = new LoginView()
      this.cipher.login.uris = [new LoginUriView()]
      this.cipher.card = new CardView()
      this.cipher.identity = new IdentityView()
      this.cipher.secureNote = new SecureNoteView()
      this.cipher.secureNote.type = SecureNoteType.Generic
      this.cipher.folderId = this.$route.params.folderId || null
    },
    handleChangeType (type) {
      this.newCipher(type)
    }
  }
}
</script>
