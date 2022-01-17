<template>
  <div>
    <component
      :is="currentComponent"
      :visible.sync="dialogVisible"
      width="435px"
      destroy-on-close
      top="5vh"
      custom-class="locker-dialog"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <div class="text-head-5 text-black-700 font-semibold truncate">
          <span v-if="cipher.id">
            {{ isDeleted ? $t('common.restore') : $t('common.edit') }} {{ $tc(`type.${cipher.type}`, 1) }}
          </span>
          <span v-else>
            {{ $t('common.add') }} {{ $tc(`type.${type}`, 1) }}
          </span>
        </div>
      </div>
      <div class="text-left">
        <!--        <div v-if="['vault', 'shares'].includes(routeName) && !cipher.id"-->
        <!--             class="form-group"-->
        <!--        >-->
        <!--          <label for="">Kiểu mục</label>-->
        <!--          <el-select v-model="cipher.type" placeholder=""-->
        <!--                     class="w-full"-->
        <!--                     :disabled="isDeleted"-->
        <!--                     :change="handleChangeType"-->
        <!--          >-->
        <!--            <el-option-->
        <!--              v-for="(item, index) in typeOptions"-->
        <!--              :key="index"-->
        <!--              :label="item.name"-->
        <!--              :value="item.value"-->
        <!--            />-->
        <!--          </el-select>-->
        <!--        </div>-->
        <ValidationProvider
          v-slot="{ errors: err }"
          rules="required"
          :name="$t('common.name')"
        >
          <InputText
            v-model="cipher.name"
            :label="$t('common.name')"
            class="w-full"
            :error-text="err && err.length && err[0]"
            :disabled="isDeleted"
            required
          />
        </ValidationProvider>

        <template v-if="cipher.type === CipherType.Login">
          <div class="mb-4 text-black-700 text-head-6 font-semibold">
            {{ $t('data.ciphers.login') }}
          </div>
          <InputText
            v-model="cipher.login.username"
            label="Email / Username"
            class="w-full"
            :disabled="isDeleted"
          />
          <template>
            <InputText
              v-model="cipher.login.password"
              :label="$t('data.ciphers.password')"
              class="w-full"
              :disabled="isDeleted"
              is-password
            />
            <PasswordStrengthBar
              :score="passwordStrength.score"
              class="mt-2"
            />
            <div
              v-if="!isDeleted"
              class="text-right"
            >
              <el-popover
                placement="right"
                width="280"
                trigger="click"
                popper-class="locker-pw-generator"
              >
                <PasswordGenerator @fill="fillPassword" />

                <button
                  slot="reference"
                  class="btn btn-clean !text-primary"
                >
                  {{ $t('data.ciphers.generate_random_password') }}
                </button>
              </el-popover>
            </div>
          </template>
          <template v-for="(item, index) in cipher.login.uris">
            <InputText
              :key="index"
              v-model="item.uri"
              :label="$t('data.ciphers.website_address')"
              class="w-full"
              :disabled="isDeleted"
            />
          </template>
        </template>
        <template v-if="cipher.type === CipherType.Card">
          <div class="mb-4 text-black-700 text-head-6 font-semibold">Chi tiết thẻ</div>
          <ValidationProvider
            v-slot="{ errors: err }"
            rules="required"
            :name="$t('data.ciphers.card_holder')"
          >
            <InputText
              v-model="cipher.card.cardholderName"
              :label="$t('data.ciphers.card_holder')"
              class="w-full !mb-2"
              :error-text="err && err.length && err[0]"
              :disabled="isDeleted"
              required
            />
          </ValidationProvider>
          <InputSelect
            :label="$t('data.ciphers.brand')"
            :initial-value="cipher.card.brand"
            class="w-full"
            :disabled="isDeleted"
            :options="cardBrandOptions"
            @change="(v) => cipher.card.brand = v"
          />
          <InputText
            v-model="cipher.card.number"
            :label="$t('data.ciphers.card_number')"
            class="w-full"
            :disabled="isDeleted"
          />
          <div class="grid grid-cols-2 gap-2">
            <InputSelect
              :label="$t('data.ciphers.expiration_month')"
              :initial-value="cipher.card.expMonth"
              class="w-full"
              :disabled="isDeleted"
              :options="cardExpMonthOptions"
              @change="(v) => cipher.card.expMonth = v"
            />
            <InputText
              v-model="cipher.card.expYear"
              :label="$t('data.ciphers.expiration_year')"
              class="w-full !mb-2"
              :disabled="isDeleted"
            />
          </div>
          <InputText
            v-model="cipher.card.code"
            :label="$t('data.ciphers.cvv')"
            is-password
            class="w-full"
            :disabled="isDeleted"
          />
        </template>
        <template v-if="cipher.type === CipherType.Identity">
          <div class="mb-4 text-black-700 text-head-6 font-semibold">
            {{ $t('data.ciphers.personal') }}
          </div>
          <div class="grid grid-cols-2 gap-x-2 mb-4">
            <InputSelect
              :label="$t('data.ciphers.title')"
              :initial-value="cipher.identity.title"
              class="w-full"
              :disabled="isDeleted"
              :options="identityTitleOptions"
              @change="(v) => cipher.identity.title = v"
            />
            <InputText
              v-model="cipher.identity.firstName"
              :label="$t('data.ciphers.first_name')"
              class="w-full"
              :disabled="isDeleted"
            />
            <InputText
              v-model="cipher.identity.lastName"
              :label="$t('data.ciphers.last_name')"
              class="w-full"
              :disabled="isDeleted"
            />
            <InputText
              v-model="cipher.identity.username"
              label="Username"
              class="w-full"
              :disabled="isDeleted"
            />
            <InputText
              v-model="cipher.identity.company"
              :label="$t('data.ciphers.company')"
              class="w-full"
              :disabled="isDeleted"
            />
            <InputText
              v-model="cipher.identity.email"
              label="Email"
              class="w-full"
              :disabled="isDeleted"
            />
            <InputText
              v-model="cipher.identity.phone"
              :label="$t('data.ciphers.phone')"
              class="w-full"
              :disabled="isDeleted"
            />
            <InputText
              v-model="cipher.identity.ssn"
              :label="$t('data.ciphers.ssn')"
              class="w-full"
              :disabled="isDeleted"
            />
            <InputText
              v-model="cipher.identity.passportNumber"
              :label="$t('data.ciphers.passport')"
              class="w-full"
              :disabled="isDeleted"
            />
            <InputText
              v-model="cipher.identity.licenseNumber"
              :label="$t('data.ciphers.license')"
              class="w-full !mb-2"
              :disabled="isDeleted"
            />
          </div>
          <div class="mb-4 text-black-700 text-head-6 font-semibold">Thông tin liên lạc</div>
          <div class="grid grid-cols-2 gap-x-2 mb-4">
            <InputText
              v-model="cipher.identity.address1"
              :label="$t('data.ciphers.address') + '1'"
              class="w-full col-span-2"
              :disabled="isDeleted"
            />
            <InputText
              v-model="cipher.identity.address2"
              :label="$t('data.ciphers.address') + '2'"
              class="w-full col-span-2"
              :disabled="isDeleted"
            />
            <InputText
              v-model="cipher.identity.city"
              :label="$t('data.ciphers.city_town')"
              class="w-full col-span-2"
              :disabled="isDeleted"
            />
            <InputText
              v-model="cipher.identity.state"
              :label="$t('data.ciphers.state_province')"
              class="w-full col-span-2"
              :disabled="isDeleted"
            />
            <InputText
              v-model="cipher.identity.postalCode"
              :label="$t('data.ciphers.zip')"
              class="w-full col-span-2"
              :disabled="isDeleted"
            />
            <InputText
              v-model="cipher.identity.country"
              :label="$t('data.ciphers.country')"
              class="w-full col-span-2 !mb-2"
              :disabled="isDeleted"
            />
          </div>
        </template>
        <template v-if="cipher.type === CipherType.CryptoAccount">
          <InputText
            v-model="cryptoAccount.username"
            label="Email / Username"
            class="w-full"
          />
          <template>
            <InputText
              v-model="cryptoAccount.password"
              :label="$t('data.ciphers.password')"
              class="w-full"
              :disabled="isDeleted"
              is-password
            />
            <PasswordStrengthBar
              :score="passwordStrength.score"
              class="mt-2"
            />
            <div
              v-if="!isDeleted && !cipher.id"
              class="text-right"
            >
              <el-popover
                placement="right"
                width="280"
                trigger="click"
                popper-class="locker-pw-generator"
              >
                <PasswordGenerator @fill="fillPassword" />

                <button
                  slot="reference"
                  class="btn btn-clean !text-primary"
                >
                  {{ $t('data.ciphers.generate_random_password') }}
                </button>
              </el-popover>
            </div>
          </template>
          <div class="mb-4 text-black-700 text-head-6 font-semibold">
            {{ $t('data.ciphers.additional_info') }}
          </div>
          <InputText
            v-model="cryptoAccount.phone"
            :label="$t('data.ciphers.phone')"
            class="w-full"
            :disabled="isDeleted"
          />
          <InputText
            v-model="cryptoAccount.emailRecovery"
            label="Recovery Email"
            class="w-full"
            :disabled="isDeleted"
          />
        </template>
        <div
          v-if="cipher.type !== CipherType.SecureNote"
          class="my-5 text-black-700 text-head-6 font-semibold"
        >
          {{ $t('data.ciphers.others') }}
        </div>
        <InputText
          v-model="cipher.notes"
          :label="$t('data.ciphers.notes')"
          class="w-full"
          :disabled="isDeleted"
          is-textarea
        />
        <InputSelectFolder
          :label="$t('data.folders.select_folder')"
          :initial-value="cipher.folderId"
          :options="folders"
          :disabled="isDeleted"
          class="w-full"
          @change="(v) => cipher.folderId = v"
          @addFolder="addFolder(false)"
        />
        <template v-if="ownershipOptions.length">
          <InputSelectOrg
            :label="$t('common.ownership')"
            :initial-value="cipher.organizationId"
            :options="ownershipOptions"
            :disabled="isDeleted || !!cipher.id"
            class="w-full"
            @change="(v) => {
              cipher.organizationId = v;
              handleChangeOrg(v)
            }"
          />
          <div
            v-if="cipher.organizationId"
            class="form-group"
          >
            <div class="flex items-center justify-between" />
            <label for="">{{ $t('data.ciphers.folders_team') }}</label>
            <div class="mb-2">
              {{ $t('data.ciphers.choose_at_least_folder') }}
            </div>
            <el-checkbox-group
              v-model="cipher.collectionIds"
              :min="1"
              :disabled="isDeleted"
            >
              <el-checkbox
                v-for="(item, index) in writeableCollections"
                :key="index"
                :label="item.id"
              >
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <!-- <div v-if="cipher.organizationId && cipher.type===CipherType.Login">
            <label class="font-semibold">{{ $t('data.ciphers.show_password') }}</label>
            <el-checkbox v-model="cipher.viewPassword" />
          </div> -->
        </template>
      </div>
      <div
        slot="footer"
        class="dialog-footer flex items-center text-left"
      >
        <div class="flex-grow">
          <button
            v-if="cipher.id"
            class="btn btn-icon !text-danger"
            @click="isDeleted ? deleteCiphers([cipher.id]) : moveTrashCiphers([cipher.id])"
          >
            <i class="fa fa-trash-alt" />
          </button>
        </div>
        <div>
          <button
            class="btn btn-default"
            @click="closeDialog"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            v-if="isDeleted"
            class="btn btn-primary"
            :disabled="loading"
            @click="restoreCiphers([cipher.id])"
          >
            {{ $t('common.restore') }}
          </button>
          <button
            v-else
            class="btn btn-primary"
            :disabled="loading || !cipher.name"
            @click="cipher.id ?putCipher(cipher):postCipher(cipher)"
          >
            {{ cipher.id ? $t('common.update') : $t('common.add') }}
          </button>
        </div>
      </div>
    </component>
    <AddEditFolder
      ref="addEditFolder"
      @created-folder="handleCreatedFolder"
    />
  </div>
</template>

<script>
import { Dialog } from 'element-ui'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { CipherType, SecureNoteType } from '../../jslib/src/enums'
import { Cipher } from '../../jslib/src/models/domain'
// import { CipherRequest } from '../../jslib/src/models/request'
import { CipherRequest } from '../../models/request/cipherRequest'
import { CipherView, LoginView, SecureNoteView, IdentityView, CardView, LoginUriView } from '../../jslib/src/models/view'
import AddEditFolder from '../folder/AddEditFolder'
import PasswordGenerator from '../password/PasswordGenerator'
import PasswordStrengthBar from '../password/PasswordStrengthBar'
import InputText from '../input/InputText'
import InputSelect from '../input/InputSelect'
import InputSelectFolder from '../input/InputSelectFolder'
import InputSelectOrg from '../input/InputSelectOrg'
import InlineEditCipher from './InlineEditCipher'
CipherType.CryptoAccount = 6
CipherType.CryptoWallet = 7
export default {
  components: {
    AddEditFolder,
    PasswordGenerator,
    Dialog,
    InlineEditCipher,
    ValidationProvider,
    ValidationObserver,
    PasswordStrengthBar,
    InputText,
    InputSelect,
    InputSelectFolder,
    InputSelectOrg
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
      cipher: {
        ...new CipherView(),
        cryptoAccount: {},
        cryptoWallet: {}
      },
      folders: [],
      showPassword: false,
      showCardCode: false,
      dialogVisible: false,
      loading: false,
      CipherType,
      errors: {},
      writeableCollections: [],
      cloneMode: false,
      currentComponent: Dialog,
      generated_password: '',
      cryptoAccount: {
        username: null,
        password: null,
        phone: null,
        emailRecovery: null,
        response: null,
        uris: {
          match: null,
          response: null,
          uri: null
        }
      },
      cryptoWallet: {
        email: null,
        seed: null
      }
    }
  },
  computed: {
    typeOptions () {
      return [
        { label: this.$tc('type.Login', 1), value: CipherType.Login },
        { label: this.$tc('type.Card', 1), value: CipherType.Card },
        { label: this.$tc('type.Identity', 1), value: CipherType.Identity },
        { label: this.$tc('type.SecureNote', 1), value: CipherType.SecureNote }
      ]
    },
    cardBrandOptions () {
      return [
        { label: '----', value: null },
        { label: 'Visa', value: 'Visa' },
        { label: 'Mastercard', value: 'Mastercard' },
        { label: 'American Express', value: 'Amex' },
        { label: 'Discover', value: 'Discover' },
        { label: 'Diners Club', value: 'Diners Club' },
        { label: 'JCB', value: 'JCB' },
        { label: 'Maestro', value: 'Maestro' },
        { label: 'UnionPay', value: 'UnionPay' },
        { label: this.$t('other'), value: 'Other' }
      ]
    },
    cardExpMonthOptions () {
      return [
        { label: '----', value: null },
        { label: '01 - ' + this.$t('january'), value: '1' },
        { label: '02 - ' + this.$t('february'), value: '2' },
        { label: '03 - ' + this.$t('march'), value: '3' },
        { label: '04 - ' + this.$t('april'), value: '4' },
        { label: '05 - ' + this.$t('may'), value: '5' },
        { label: '06 - ' + this.$t('june'), value: '6' },
        { label: '07 - ' + this.$t('july'), value: '7' },
        { label: '08 - ' + this.$t('august'), value: '8' },
        { label: '09 - ' + this.$t('september'), value: '9' },
        { label: '10 - ' + this.$t('october'), value: '10' },
        { label: '11 - ' + this.$t('november'), value: '11' },
        { label: '12 - ' + this.$t('december'), value: '12' }
      ]
    },
    identityTitleOptions () {
      return [
        { label: '-- ' + this.$t('select') + ' --', value: null },
        { label: this.$t('mr'), value: this.$t('mr') },
        { label: this.$t('mrs'), value: this.$t('mrs') },
        { label: this.$t('ms'), value: this.$t('ms') },
        { label: this.$t('dr'), value: this.$t('dr') }
      ]
    },
    isDeleted () {
      return !!this.cipher.deletedDate
    },
    passwordStrength () {
      if (this.cipher.login) {
        return this.$passwordGenerationService.passwordStrength(this.cipher.login.password, ['cystack']) || {}
      }
      return {}
    },
    ownershipOptions () {
      const teams = this.teams.filter(e => ['owner', 'admin'].includes(e.role))
      if (teams.length) {
        return [{ name: this.currentUser.email, organization_id: null }, ...teams]
      }
      return []
    },
    allowOwnershipAssignment () {
      return (!this.cipher.id || this.cloneMode) && this.ownershipOptions && this.ownershipOptions.length > 1
    },
    shouldDisableBtn () {
      return this.loading || !this.cipher.name || (this.cipher.type === CipherType.Card || !this.cipher.card.cardholderName)
    }
  },
  watch: {
    cryptoAccount () {
      this.cipher.cryptoAccount = this.cryptoAccount
    },
    cryptoWallet () {
      this.cipher.cryptoWallet = this.cryptoWallet
    }
  },
  mounted () {
  },
  methods: {
    async openDialog (data, cloneMode = false, inline = false) {
      this.currentComponent = inline ? InlineEditCipher : Dialog
      this.folders = await this.getFolders()
      this.dialogVisible = true
      this.cloneMode = cloneMode
      if (data.id || this.cloneMode) {
        this.cipher = new Cipher({ ...data }, true)
        this.writeableCollections = await this.getWritableCollections(this.cipher.organizationId)
      } else if (CipherType[this.type]) {
        this.newCipher(this.type, data)
      } else {
        this.newCipher('Login', data)
      }
    },
    closeDialog () {
      this.dialogVisible = false
      this.$emit('close')
      this.currentComponent = Dialog
    },
    async postCipher (cipher) {
      if (!cipher.name) { return }
      try {
        this.loading = true
        this.errors = {}
        const cipherEnc = await this.$myServices.encrypt(cipher)
        console.log('cipherEnc ', cipherEnc)
        const data = new CipherRequest(cipherEnc)
        await this.$axios.$post('cystack_platform/pm/ciphers/vaults', {
          ...data,
          score: this.passwordStrength.score,
          collectionIds: cipher.collectionIds
          // view_password: cipher.viewPassword
        })
        this.notify(this.$tc('data.notifications.create_success', 1, { type: this.$tc(`type.${this.type}`, 1) }), 'success')
        this.closeDialog()
      } catch (e) {
        this.notify(this.$tc('data.notifications.create_failed', 1, { type: this.$tc(`type.${this.type}`, 1) }), 'warning')
        this.errors = (e.response && e.response.data && e.response.data.details) || {}
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    async putCipher (cipher) {
      try {
        const cipherEnc = await this.$cipherService.encrypt(cipher)
        const data = new CipherRequest(cipherEnc)
        await this.$axios.$put(`cystack_platform/pm/ciphers/${cipher.id}`, {
          ...data,
          score: this.passwordStrength.score,
          collectionIds: cipher.collectionIds
          // view_password: cipher.viewPassword
        })
        this.notify(this.$tc('data.notifications.update_success', 1, { type: this.$tc(`type.${CipherType[this.cipher.type]}`, 1) }), 'success')
        this.closeDialog()
        this.$emit('updated-cipher')
      } catch (e) {
        this.notify(this.$tc('data.notifications.update_failed', 1, { type: this.$tc(`type.${CipherType[this.cipher.type]}`, 1) }), 'warning')
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    async deleteCiphers (ids) {
      this.$confirm(this.$tc('data.notifications.delete_selected_desc', ids.length), this.$t('common.warning'), {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        try {
          this.loading = true
          await this.$axios.$put('cystack_platform/pm/ciphers/permanent_delete', { ids })
          this.notify(this.$tc('data.notifications.delete_success', ids.length, { type: this.$tc('type.0', ids.length) }), 'success')
          this.closeDialog()
          this.$emit('reset-selection')
        } catch (e) {
          this.notify(this.$tc('data.notifications.delete_failed', ids.length, { type: this.$tc('type.0', ids.length) }), 'warning')
          console.log(e)
        } finally {
          this.loading = false
        }
      }).catch(() => {

      })
    },
    async moveTrashCiphers (ids) {
      this.$confirm(this.$tc('data.notifications.trash_selected_desc', ids.length, { count: ids.length }), this.$t('common.warning'), {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        try {
          this.loading = true
          await this.$axios.$put('cystack_platform/pm/ciphers/delete', { ids })
          this.notify(this.$tc('data.notifications.trash_success', ids.length, { type: this.$tc('type.0', ids.length) }), 'success')
          this.$emit('trashed-cipher')
        } catch (e) {
          this.notify(this.$tc('data.notifications.trash_failed', ids.length, { type: this.$tc('type.0', ids.length) }), 'warning')
          this.$emit('reset-selection')
        } finally {
          this.loading = false
        }
      }).catch(() => {

      })
    },
    async restoreCiphers (ids) {
      this.$confirm(this.$tc('data.notifications.restore_selected_desc', ids.length), this.$t('common.warning'), {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        try {
          this.loading = true
          await this.$axios.$put('cystack_platform/pm/ciphers/restore', { ids })
          this.notify(this.$tc('data.notifications.restore_success', ids.length, { type: this.$tc('type.0', ids.length) }), 'success')
          this.$emit('reset-selection')
        } catch (e) {
          this.notify(this.$tc('data.notifications.restore_failed', ids.length, { type: this.$tc('type.0', ids.length) }), 'warning')
          console.log(e)
        } finally {
          this.loading = false
        }
      }).catch(() => {

      })
    },
    addFolder (shouldRedirect = false) {
      this.$refs.addEditFolder.openDialog({}, shouldRedirect)
    },
    async handleCreatedFolder (folder) {
      this.folders.push(folder)
      this.cipher.folderId = folder.id
    },
    newCipher (type, data) {
      this.cipher = new CipherView()
      this.cipher.organizationId = data.organizationId ? data.organizationId : null
      this.cipher.type = CipherType[type]
      this.cipher.login = new LoginView()
      this.cipher.login.uris = [new LoginUriView()]
      this.cipher.card = new CardView()
      this.cipher.identity = new IdentityView()
      this.cipher.secureNote = new SecureNoteView()
      this.cipher.secureNote.type = SecureNoteType.Generic
      this.cryptoAccount = {
        username: null,
        password: null,
        phone: null,
        emailRecovery: null,
        response: null,
        uris: {
          match: null,
          response: null,
          uri: null
        }
      }
      this.cryptoWallet = {
        email: null,
        seed: null
      }
      this.cipher.folderId = this.$route.params.folderId || null
      this.cipher.collectionIds = this.$route.params.tfolderId ? [this.$route.params.tfolderId] : []
      if (this.cipher.organizationId) {
        this.handleChangeOrg(this.cipher.organizationId)
      }
    },
    handleChangeType (type) {
      this.newCipher(type)
    },
    async handleChangeOrg (orgId) {
      this.cipher.folderId = null
      if (orgId) {
        this.writeableCollections = await this.getWritableCollections(orgId)
        if (this.writeableCollections.length) {
          this.cipher.collectionIds = [this.writeableCollections[0].id]
        }
      } else {
        this.cipher.collectionIds = []
      }
    },
    async getWritableCollections (orgId) {
      const allCollections = await this.$collectionService.getAllDecrypted()
      return allCollections.filter(c => !c.readOnly && c.organizationId === orgId)
    },
    fillPassword (p) {
      this.cipher.login.password = p
      this.notify('Filled password', 'success')
    }
  }
}
</script>
