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
            {{ $t('common.add') }} {{ $tc(`type.${cipher.type}`, 1) }}
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
        <!-- <template v-if="(cipher.type === CipherType.CryptoAccount || cipher.type === CipherType.CryptoWallet) && !cipher.id">
          <div class="mb-3">
            <el-radio-group v-model="cipher.type">
              <el-radio :label="6" border>
                <span><i class="fas fa-globe-asia" /> Account</span>
              </el-radio>
              <el-radio :label="7" border>
                <span><i class="fas fa-wallet" /> Wallet</span>
              </el-radio>
            </el-radio-group>
          </div>
        </template> -->
        <ValidationProvider
          v-slot="{ errors: err }"
          rules="required"
          :name="$t('common.item_name')"
        >
          <InputText
            v-model="cipher.name"
            :label="$t('common.item_name')"
            class="w-full"
            :error-text="err && err.length && err[0]"
            :disabled="isDeleted"
            required
          />
        </ValidationProvider>

        <!-- LOGIN FIELDS -->
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

        <!-- CARD FIELDS -->
        <template v-if="cipher.type === CipherType.Card">
          <div class="mb-4 text-black-700 text-head-6 font-semibold">{{ $t('data.ciphers.card_details') }}</div>
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

        <!-- IDENTITY FIELDS -->
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
          <div class="mb-4 text-black-700 text-head-6 font-semibold">{{ $t('data.ciphers.contact_info') }}</div>
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

        <!-- CRYPTO ACCOUNT (DEPRECATED) -->
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
          <div class="my-5 text-black-700 text-head-6 font-semibold">
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
            :label="$t('data.ciphers.recovery_email')"
            class="w-full"
            :disabled="isDeleted"
          />
          <InputText
            v-model="cryptoAccount.uris.uri"
            :label="$t('data.ciphers.website_address')"
            class="w-full"
            :disabled="isDeleted"
          />
        </template>

        <!-- CRYPTO BACKUP FIELDS -->
        <template v-if="cipher.type === CipherType.CryptoWallet">
          <InputSelectCryptoWallet
            ref="inputSelectCryptoWallet"
            :label="$t('data.ciphers.wallet_app')"
            :disabled="isDeleted"
            class="w-full"
            :initial-value="cryptoWallet.walletApp ? cryptoWallet.walletApp.alias : null"
            @change="handleChangeCryptoWallet"
          />
          <InputText
            v-model="cryptoWallet.username"
            :label="$t('data.ciphers.username')"
            class="w-full"
            :disabled="isDeleted"
            :is-password="false"
          />
          <InputText
            v-model="cryptoWallet.password"
            :label="$t('data.ciphers.password_pin')"
            class="w-full"
            :disabled="isDeleted"
            is-password
          />
          <InputText
            v-model="cryptoWallet.address"
            :label="$t('data.ciphers.wallet_address')"
            class="w-full"
            :disabled="isDeleted"
          />
          <InputText
            v-model="cryptoWallet.privateKey"
            :label="$t('data.ciphers.private_key')"
            class="w-full"
            :disabled="isDeleted"
            is-password
          />
          <!-- <InputText
            v-model="cryptoWallet.seed"
            :label="$t('data.ciphers.seed')"
            class="w-full !mb-1"
            :error-text="err && err.length && err[0]"
            :disabled="isDeleted"
            is-textarea=""
          /> -->
          <div class="cs-field w-full">
            <label>
              {{ $t('data.ciphers.seed') }}
            </label>
          </div>
          <InputSeedPhrase
            v-model="cryptoWallet.seed"
            :edit-mode="cipher.id ? true : false"
            class="w-full !mb-3"
            @set-seed="setSeed"
          />
          <!-- <div class="py-1 px-3 text-xs mb-3" style="background: rgba(242, 232, 135, 0.3);">
            {{ $t('data.ciphers.seed_phrase_desc') }}
          </div> -->
          <InputSelectCryptoNetworks
            ref="inputSelectCryptoWallet"
            :label="$t('data.ciphers.networks')"
            :disabled="isDeleted"
            class="w-full !pt-6"
            :initial-value="cryptoWallet.networks ? cryptoWallet.networks.map(n => n.alias) : []"
            @change="handleChangeCryptoNetworks"
          />
        </template>

        <!-- NOTES -->
        <div
          v-if="cipher.type !== CipherType.SecureNote"
          class="my-5 text-black-700 text-head-6 font-semibold"
        >
          {{ $t('data.ciphers.others') }}
        </div>
        <InputText
          v-if="cipher.type === CipherType.CryptoAccount"
          v-model="cryptoAccount.notes"
          :label="$t('data.ciphers.notes')"
          class="w-full"
          :disabled="isDeleted"
          is-textarea
        />
        <InputText
          v-else-if="cipher.type === CipherType.CryptoWallet"
          v-model="cryptoWallet.notes"
          :label="$t('data.ciphers.notes')"
          class="w-full"
          :disabled="isDeleted"
          is-textarea
        />
        <InputText
          v-else
          v-model="cipher.notes"
          :label="$t('data.ciphers.notes')"
          class="w-full"
          :disabled="isDeleted"
          is-textarea
        />

        <!-- CUSTOM FIELDS -->
        <div
          class="my-5 text-black-700 text-head-6 font-semibold"
        >
          {{ $t('data.ciphers.custom_fields') }}
        </div>
        <InputCustomFields
          v-model="cipher.fields"
          :edit-mode="cipher.id ? true : false"
          class="w-full !mb-3"
          @set-fields="setFields"
        />

        <!-- FOLDER -->
        <InputSelectFolder
          ref="inputSelectFolder"
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
import { Cipher, SecureNote } from '../../jslib/src/models/domain'
import { CipherRequest } from '../../jslib/src/models/request'
// import { CipherRequest } from '../../core/models/request/cipherRequest'
import { CipherView, LoginView, SecureNoteView, IdentityView, CardView, LoginUriView } from '../../jslib/src/models/view'
import AddEditFolder from '../folder/AddEditFolder'
import PasswordGenerator from '../password/PasswordGenerator'
import PasswordStrengthBar from '../password/PasswordStrengthBar'
import InputText from '../input/InputText'
import InputSelect from '../input/InputSelect'
import InputSelectFolder from '../input/InputSelectFolder'
import InputSelectOrg from '../input/InputSelectOrg'
import InputSelectCryptoWallet from '../input/InputSelectCryptoWallet'
import InputSelectCryptoNetworks from '../input/InputSelectCryptoNetworks'
import InputSeedPhrase from '../input/InputSeedPhrase'
import InputCustomFields from '../input/InputCustomFields.vue'
import { WALLET_APP_LIST } from '../../utils/crypto/applist/index'
import { CHAIN_LIST } from '../../utils/crypto/chainlist/index'
import InlineEditCipher from './InlineEditCipher'
CipherType.CryptoAccount = 6
CipherType.CryptoWallet = CipherType.CryptoBackup = 7
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
    InputSelectOrg,
    InputSelectCryptoWallet,
    InputSelectCryptoNetworks,
    InputSeedPhrase,
    InputCustomFields
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
        ...new CipherView()
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
        },
        notes: ''
      },
      cryptoWallet: {
        walletApp: {
          name: '',
          alias: ''
        },
        username: '',
        password: '',
        address: '',
        privateKey: '',
        seed: '',
        networks: [],
        notes: ''
      }
    }
  },
  asyncComputed: {
    ciphers: {
      async get () {
        const result = await this.$cipherService.getAllDecrypted()
        return result
      },
      watch: ['$store.state.syncedCiphersToggle']
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
        { label: '-- ' + this.$t('common.select') + ' --', value: null },
        { label: this.$t('common.mr'), value: 'mr' },
        { label: this.$t('common.mrs'), value: 'mrs' },
        { label: this.$t('common.ms'), value: 'ms' },
        { label: this.$t('common.dr'), value: 'dr' }
      ]
    },
    isDeleted () {
      return !!this.cipher.deletedDate
    },
    passwordStrength () {
      if (this.cipher.login) {
        return this.$passwordGenerationService.passwordStrength(this.cipher.login.password, ['cystack']) || {}
      }
      if (this.cipher.cryptoAccount) {
        return this.$passwordGenerationService.passwordStrength(this.cipher.cryptoAccount.password, ['cystack']) || {}
      }
      if (this.cipher.cryptoWallet) {
        return this.$passwordGenerationService.passwordStrength(this.cipher.cryptoWallet.password, ['cystack']) || {}
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
        if (data.type === CipherType.CryptoAccount) {
          // data.notes = JSON.stringify(data.cryptoAccount)
          this.cryptoAccount = data.cryptoAccount
        }
        if (data.type === CipherType.CryptoWallet) {
          this.cryptoWallet = data.cryptoWallet
        }
        if (data.type === CipherType.Login && data.login && data.login.uris == null) {
          data.login.uris = [new LoginUriView()]
        }
        if (data.fields == null) {
          data.fields = []
          // data.fields[0].type = FieldType.Text
        }
        this.cipher = new Cipher({ ...data }, true)
        this.$refs.inputSelectFolder.value = this.cipher.folderId
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
        // this.cryptoAccount.notes = this.cipher.notes
        // this.cryptoWallet.notes = this.cipher.notes
        const type_ = this.cipher.type
        if (this.cipher.type === CipherType.CryptoAccount || this.cipher.type === CipherType.CryptoWallet) {
          this.cipher.notes = JSON.stringify(this.cipher.type === CipherType.CryptoAccount ? this.cryptoAccount : this.cryptoWallet)
          this.cipher.type = CipherType.SecureNote
        }
        // this.cipher.name = this.validateCipherName(this.cipher.name, type_)
        if (this.cloneMode) {
          this.cipher.organizationId = null
        }
        const cipherEnc = await this.$cipherService.encrypt(cipher)
        const data = new CipherRequest(cipherEnc)
        data.type = type_
        this.cipher.type = type_
        await this.$axios.$post('cystack_platform/pm/ciphers/vaults', {
          ...data,
          score: this.passwordStrength.score,
          collectionIds: cipher.collectionIds
          // view_password: cipher.viewPassword
        })
        this.notify(this.$tc('data.notifications.create_success', 1, { type: this.$tc(`type.${this.type}`, 1) }), 'success')
        this.closeDialog()
      } catch (e) {
        if (e.response && e.response.data && e.response.data.code === '5002') {
          this.notify(this.$t('errors.5002', { type: this.$tc(`type.${this.type}`, 1) }), 'error')
        } else {
          this.notify(this.$tc('data.notifications.create_failed', 1, { type: this.$tc(`type.${this.type}`, 1) }), 'warning')
        }
        // this.errors = (e.response && e.response.data && e.response.data.details) || {}
      } finally {
        this.loading = false
      }
    },
    async putCipher (cipher) {
      try {
        // const cipherEnc = await this.$cipherService.encrypt(cipher)
        // const data = new CipherRequest(cipherEnc)
        // this.cryptoAccount.notes = this.cipher.notes
        // this.cryptoWallet.notes = this.cipher.notes
        const type_ = this.cipher.type
        if (this.cipher.type === CipherType.CryptoAccount || this.cipher.type === CipherType.CryptoWallet) {
          this.cipher.notes = JSON.stringify(this.cipher.type === CipherType.CryptoAccount ? this.cryptoAccount : this.cryptoWallet)
          this.cipher.type = CipherType.SecureNote
          this.cipher.secureNote = new SecureNote(this.cipher.secureNote, true)
          this.cipher.secureNote.type = 0
        }
        const cipherEnc = await this.$cipherService.encrypt(cipher)
        const data = new CipherRequest(cipherEnc)
        data.type = type_
        await this.$axios.$put(`cystack_platform/pm/ciphers/${cipher.id}`, {
          ...data,
          score: this.passwordStrength.score,
          collectionIds: cipher.collectionIds
        })
        // if (type_ === CipherType.CryptoAccount) {
        //   this.cipher.notes = this.cryptoAccount.notes
        // }
        // if (type_ === CipherType.CryptoWallet) {
        //   this.cipher.notes = this.cryptoWallet.notes
        // }
        this.notify(this.$tc('data.notifications.update_success', 1, { type: this.$tc(`type.${this.type}`, 1) }), 'success')
        this.closeDialog()
        this.$emit('updated-cipher')
      } catch (e) {
        this.notify(this.$tc('data.notifications.update_failed', 1, { type: this.$tc(`type.${this.type}`, 1) }), 'warning')
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
          await this.$cipherService.delete(ids)
          this.notify(this.$tc('data.notifications.delete_success', ids.length, { type: this.$tc('type.0', ids.length) }), 'success')
          this.closeDialog()
          this.$emit('reset-selection')
        } catch (e) {
          if (e.response && e.response.data && e.response.code === '5001') {
            this.notify(this.$t('errors.5001'), 'error')
          } else {
            this.notify(this.$tc('data.notifications.delete_failed', ids.length, { type: this.$tc('type.0', ids.length) }), 'warning')
          }
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
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(async () => {
        try {
          this.loading = true
          await this.$axios.$put('cystack_platform/pm/ciphers/delete', { ids })
          this.notify(this.$tc('data.notifications.trash_success', ids.length, { type: this.$tc('type.0', ids.length) }), 'success')
          this.$emit('trashed-cipher')
        } catch (e) {
          if (e.response && e.response.data && e.response.code === '5001') {
            this.notify(this.$t('errors.5001'), 'error')
          } else {
            this.notify(this.$tc('data.notifications.trash_failed', ids.length, { type: this.$tc('type.0', ids.length) }), 'warning')
          }
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
      this.$refs.inputSelectFolder.value = folder.id
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
      this.cipher.fields = []
      // this.cipher.fields[0].type = FieldType.Text
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
      if (this.cipher.type === CipherType.Login) {
        this.cipher.login.password = p
      }
      if (this.cipher.type === CipherType.CryptoAccount) {
        this.cryptoAccount.password = p
      }
      if (this.cipher.type === CipherType.CryptoWallet) {
        this.cryptoWallet.password = p
      }
      this.notify('Filled password', 'success')
    },
    validateCipherName (cipherName, cipherType, suffix = 1) {
      const newName = cipherName + (suffix === 1 ? '' : ` (${suffix}) `)
      if (this.ciphers.some(cipher => cipher.name === newName && cipher.type === cipherType)) {
        return this.validateCipherName(cipherName, cipherType, suffix + 1)
      } else {
        return newName
      }
    },
    handleChangeCryptoWallet (v) {
      const selectedApp = WALLET_APP_LIST.find(a => a.alias === v)
      this.cryptoWallet.walletApp = {
        name: selectedApp.name,
        alias: selectedApp.alias
      }
    },
    handleChangeCryptoNetworks (v) {
      const selectedNetworks = v.map(alias => CHAIN_LIST.find(n => n.alias === alias))
      this.cryptoWallet.networks = selectedNetworks.map(selectedNetwork => {
        return {
          name: selectedNetwork.name,
          alias: selectedNetwork.alias
        }
      })
    },
    setSeed (v) {
      this.cryptoWallet.seed = v
    },
    setFields (v) {
      if (v.remove) {
        this.cipher.fields.splice(v.index, 1)
      } else if (v.index != null) {
        this.cipher.fields[v.index].value = v.value.value
        this.cipher.fields[v.index].name = v.value.name
        this.cipher.fields[v.index].type = v.value.type != null ? v.value.type : this.cipher.fields[v.index].type
      } else {
        this.cipher.fields.push(v.value)
      }
    }
  }
}
</script>
