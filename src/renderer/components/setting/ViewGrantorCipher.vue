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
          <span>
            {{ $t('common.view_item') }}
          </span>
        </div>
      </div>
      <div class="text-left">
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
            :disabled="true"
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
            :disabled="true"
          />
          <template>
            <InputText
              v-model="cipher.login.password"
              :label="$t('data.ciphers.password')"
              class="w-full"
              :disabled="false"
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
                <PasswordGenerator @generated="(p) => cipher.login.password = p" />

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
              :disabled="true"
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
              :disabled="true"
              required
            />
          </ValidationProvider>
          <InputSelect
            :label="$t('data.ciphers.brand')"
            :initial-value="cipher.card.brand"
            class="w-full"
            :disabled="true"
            :options="cardBrandOptions"
            @change="(v) => cipher.card.brand = v"
          />
          <InputText
            v-model="cipher.card.number"
            :label="$t('data.ciphers.card_number')"
            class="w-full"
            :disabled="true"
          />
          <div class="grid grid-cols-2 gap-2">
            <InputSelect
              :label="$t('data.ciphers.expiration_month')"
              :initial-value="cipher.card.expMonth"
              class="w-full"
              :disabled="true"
              :options="cardExpMonthOptions"
              @change="(v) => cipher.card.expMonth = v"
            />
            <InputText
              v-model="cipher.card.expYear"
              :label="$t('data.ciphers.expiration_year')"
              class="w-full !mb-2"
              :disabled="true"
            />
          </div>
          <InputText
            v-model="cipher.card.code"
            :label="$t('data.ciphers.cvv')"
            is-password
            class="w-full"
            :disabled="false"
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
              :disabled="true"
              :options="identityTitleOptions"
              @change="(v) => cipher.identity.title = v"
            />
            <InputText
              v-model="cipher.identity.firstName"
              :label="$t('data.ciphers.first_name')"
              class="w-full"
              :disabled="true"
            />
            <InputText
              v-model="cipher.identity.lastName"
              :label="$t('data.ciphers.last_name')"
              class="w-full"
              :disabled="true"
            />
            <InputText
              v-model="cipher.identity.username"
              label="Username"
              class="w-full"
              :disabled="true"
            />
            <InputText
              v-model="cipher.identity.company"
              :label="$t('data.ciphers.company')"
              class="w-full"
              :disabled="true"
            />
            <InputText
              v-model="cipher.identity.email"
              label="Email"
              class="w-full"
              :disabled="true"
            />
            <InputText
              v-model="cipher.identity.phone"
              :label="$t('data.ciphers.phone')"
              class="w-full"
              :disabled="true"
            />
            <InputText
              v-model="cipher.identity.ssn"
              :label="$t('data.ciphers.ssn')"
              class="w-full"
              :disabled="true"
            />
            <InputText
              v-model="cipher.identity.passportNumber"
              :label="$t('data.ciphers.passport')"
              class="w-full"
              :disabled="true"
            />
            <InputText
              v-model="cipher.identity.licenseNumber"
              :label="$t('data.ciphers.license')"
              class="w-full !mb-2"
              :disabled="true"
            />
          </div>
          <div class="mb-4 text-black-700 text-head-6 font-semibold">Thông tin liên lạc</div>
          <div class="grid grid-cols-2 gap-x-2 mb-4">
            <InputText
              v-model="cipher.identity.address1"
              :label="$t('data.ciphers.address') + '1'"
              class="w-full col-span-2"
              :disabled="true"
            />
            <InputText
              v-model="cipher.identity.address2"
              :label="$t('data.ciphers.address') + '2'"
              class="w-full col-span-2"
              :disabled="true"
            />
            <InputText
              v-model="cipher.identity.city"
              :label="$t('data.ciphers.city_town')"
              class="w-full col-span-2"
              :disabled="true"
            />
            <InputText
              v-model="cipher.identity.state"
              :label="$t('data.ciphers.state_province')"
              class="w-full col-span-2"
              :disabled="true"
            />
            <InputText
              v-model="cipher.identity.postalCode"
              :label="$t('data.ciphers.zip')"
              class="w-full col-span-2"
              :disabled="true"
            />
            <InputText
              v-model="cipher.identity.country"
              :label="$t('data.ciphers.country')"
              class="w-full col-span-2 !mb-2"
              :disabled="true"
            />
          </div>
        </template>
        <template v-if="cipher.type === CipherType.CryptoWallet">
          <InputSelectCryptoWallet
            ref="inputSelectCryptoWallet"
            :label="$t('data.ciphers.wallet_app')"
            class="w-full"
            :initial-value="cryptoWallet.walletApp ? cryptoWallet.walletApp.alias : null"
            :disabled="true"
          />
          <InputText
            v-model="cryptoWallet.username"
            :label="$t('data.ciphers.username')"
            class="w-full"
            :is-password="false"
            :disabled="true"
          />
          <InputText
            v-model="cryptoWallet.password"
            :label="$t('data.ciphers.password_pin')"
            class="w-full"
            is-password
            :disabled="true"
          />
          <InputText
            v-model="cryptoWallet.address"
            :label="$t('data.ciphers.wallet_address')"
            class="w-full"
            :disabled="true"
          />
          <InputText
            v-model="cryptoWallet.privateKey"
            :label="$t('data.ciphers.private_key')"
            class="w-full"
            is-password
            :disabled="true"
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
            :disabled="true"
          />
          <!-- <div class="py-1 px-3 text-xs mb-3" style="background: rgba(242, 232, 135, 0.3);">
            {{ $t('data.ciphers.seed_phrase_desc') }}
          </div> -->
          <InputSelectCryptoNetworks
            ref="inputSelectCryptoWallet"
            :label="$t('data.ciphers.networks')"
            class="w-full !pt-6"
            :initial-value="cryptoWallet.networks ? cryptoWallet.networks.map(n => n.alias) : []"
            :disabled="true"
          />
        </template>
        <div
          v-if="cipher.type !== CipherType.SecureNote"
          class="my-5 text-black-700 text-head-6 font-semibold"
        >
          {{ $t('data.ciphers.others') }}
        </div>
        <InputText
          v-if="cipher.type === CipherType.CryptoWallet"
          v-model="cryptoWallet.notes"
          :label="$t('data.ciphers.notes')"
          class="w-full"
          is-textarea
          :disabled="true"
        />
        <InputText
          v-else
          v-model="cipher.notes"
          :label="$t('data.ciphers.notes')"
          class="w-full"
          :disabled="true"
          is-textarea
        />
      </div>
      <div
        slot="footer"
        class="dialog-footer flex items-center text-left"
      >
        <div>
          <button
            class="btn btn-default"
            @click="closeDialog"
          >
            {{ $t('common.close') }}
          </button>
        </div>
      </div>
    </component>
  </div>
</template>

<script>
import { Dialog } from 'element-ui'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { CipherType, SecureNoteType } from '../../jslib/src/enums'
import { Cipher } from '../../jslib/src/models/domain'
import { CipherRequest } from '../../jslib/src/models/request'
import { CipherView, LoginView, SecureNoteView, IdentityView, CardView, LoginUriView } from '../../jslib/src/models/view'
import PasswordGenerator from '../password/PasswordGenerator'
import PasswordStrengthBar from '../password/PasswordStrengthBar'
import InputText from '../input/InputText'
import InputSelect from '../input/InputSelect'
import InputSelectCryptoWallet from '../input/InputSelectCryptoWallet'
import InputSelectCryptoNetworks from '../input/InputSelectCryptoNetworks'
import InputSeedPhrase from '../input/InputSeedPhrase'
CipherType.CryptoWallet = 7
export default {
  components: {
    PasswordGenerator,
    Dialog,
    ValidationProvider,
    ValidationObserver,
    PasswordStrengthBar,
    InputText,
    InputSelect,
    InputSelectCryptoWallet,
    InputSelectCryptoNetworks,
    InputSeedPhrase
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
      loading: false,
      CipherType,
      errors: {},
      writeableCollections: [],
      cloneMode: false,
      currentComponent: Dialog,
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
    shouldDisableBtn () {
      return this.loading || !this.cipher.name || (this.cipher.type === CipherType.Card || !this.cipher.card.cardholderName)
    }
  },
  mounted () {
  },
  methods: {
    async openDialog (data, cloneMode = false) {
      this.currentComponent = Dialog
      this.folders = await this.getFolders()
      this.dialogVisible = true
      this.cloneMode = cloneMode
      if (data.id || this.cloneMode) {
        if (data.type === CipherType.CryptoWallet) {
          this.cryptoWallet = data.cryptoWallet
        }
        this.cipher = new Cipher({ ...data }, true)
        // this.writeableCollections = await this.getWritableCollections(this.cipher.organizationId)
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
      this.cipher.folderId = this.$route.params.folderId || null
      this.cipher.collectionIds = this.$route.params.tfolderId ? [this.$route.params.tfolderId] : []
      if (this.cipher.organizationId) {
        this.handleChangeOrg(this.cipher.organizationId)
      }
    },
    handleChangeType (type) {
      this.newCipher(type)
    }
  }
}
</script>
