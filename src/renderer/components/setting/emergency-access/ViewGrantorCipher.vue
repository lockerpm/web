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
      <!-- Title -->
      <div slot="title">
        <div class="text-head-5 text-black-700 font-semibold truncate">
          <span>
            {{ $t('common.view_item') }}
          </span>
        </div>
      </div>
      <!-- Title end -->

      <!-- Body -->
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

        <!-- LOGIN FIELDS -->
        <login-input
          v-if="cipher.type === CipherType.Login"
          :is-deleted="true"
          :name="cipher.name"
          :username="cipher.login.username"
          :password="cipher.login.password"
          :uris="cipher.login.uris"
        />

        <!-- CARD FIELDS -->
        <card-input
          v-if="cipher.type === CipherType.Card"
          :is-deleted="true"
          :errors="errors"
          :cardholder-name="cipher.card.cardholderName"
          :number="cipher.card.number"
          :brand="cipher.card.brand"
          :exp-month="cipher.card.expMonth"
          :exp-year="cipher.card.expYear"
          :code="cipher.card.code"
        />

        <!-- IDENTITY FIELDS -->
        <identity-input
          v-if="cipher.type === CipherType.Identity"
          :is-deleted="true"
          :title="cipher.identity.title"
          :first-name="cipher.identity.firstName"
          :last-name="cipher.identity.lastName"
          :username="cipher.identity.username"
          :company="cipher.identity.company"
          :email="cipher.identity.email"
          :phone="cipher.identity.phone"
          :ssn="cipher.identity.ssn"
          :passport-number="cipher.identity.passportNumber"
          :license-number="cipher.identity.licenseNumber"
          :address1="cipher.identity.address1"
          :address2="cipher.identity.address2"
          :city="cipher.identity.city"
          :state="cipher.identity.state"
          :postal-code="cipher.identity.postalCode"
          :country="cipher.identity.country"
        />

        <!-- CRYPTO BACKUP FIELDS -->
        <crypto-backup-input
          v-if="cipher.type === CipherType.CryptoWallet"
          ref="cryptoBackupInput"
          :is-deleted="true"
          :cipher-id="cipher.id"
        />

        <!-- DRIVER LICENSE -->
        <driver-license-input
          v-if="cipher.type === CipherType.DriverLicense"
          ref="driverLicenseInput"
          :is-deleted="true"
        />

        <!-- CITIZEN ID -->
        <citizen-id-input
          v-if="cipher.type === CipherType.CitizenID"
          ref="citizenIdInput"
          :is-deleted="true"
        />

        <!-- PASSPORT -->
        <passport-input
          v-if="cipher.type === CipherType.Passport"
          ref="passportInput"
          :is-deleted="true"
        />

        <!-- SSN -->
        <ssn-input
          v-if="cipher.type === CipherType.SocialSecurityNumber"
          ref="ssnInput"
          :is-deleted="true"
        />

        <!-- ROUTER -->
        <router-input
          v-if="cipher.type === CipherType.WirelessRouter"
          ref="routerInput"
          :is-deleted="true"
        />

        <!-- SERVER -->
        <server-input
          v-if="cipher.type === CipherType.Server"
          ref="serverInput"
          :is-deleted="true"
        />

        <!-- API -->
        <api-input
          v-if="cipher.type === CipherType.APICipher"
          ref="apiInput"
          :is-deleted="true"
        />

        <!-- DATABASE -->
        <database-input
          v-if="cipher.type === CipherType.Database"
          ref="databaseInput"
          :is-deleted="true"
        />

        <!-- NOTES -->
        <div>
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
            :disabled="true"
            is-textarea
          />
        </div>

        <!-- CUSTOM FIELDS -->
        <div>
          <div class="my-5 text-black-700 text-head-6 font-semibold">
            {{ $t('data.ciphers.custom_fields') }}
          </div>
          <InputCustomFields
            v-model="cipher.fields"
            class="w-full !mb-3"
            :disabled="true"
            @set-fields="setFields"
          />
        </div>
      </div>
      <!-- Body end -->

      <!-- Footer -->
      <div slot="footer" class="dialog-footer flex items-center justify-end">
        <el-button @click="closeDialog">
          {{ $t('common.close') }}
        </el-button>
      </div>
      <!-- Footer end -->
    </component>
  </div>
</template>

<script>
import { Dialog } from 'element-ui'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { SecureNoteType } from '../../../jslib/src/enums'
import { CipherType } from '../../../jslib/src/enums/cipherType'
import { Cipher } from '../../../jslib/src/models/domain'
import {
  CipherView,
  LoginView,
  SecureNoteView,
  IdentityView,
  CardView,
  LoginUriView
} from '../../../jslib/src/models/view'
import InputText from '../../input/InputText'
import LoginInput from '../../cipher/cipher-types/login/LoginInput.vue'
import CardInput from '../../cipher/cipher-types/card/CardInput.vue'
import IdentityInput from '../../cipher/cipher-types/identity/IdentityInput.vue'
import CryptoBackupInput from '../../cipher/cipher-types/crypto-backup/CryptoBackupInput.vue'
import DriverLicenseInput from '../../cipher/cipher-types/driver-license/DriverLicenseInput.vue'
import CitizenIdInput from '../../cipher/cipher-types/citizen-id/CitizenIdInput.vue'
import PassportInput from '../../cipher/cipher-types/passport/PassportInput.vue'
import SsnInput from '../../cipher/cipher-types/ssn/SsnInput.vue'
import RouterInput from '../../cipher/cipher-types/router/RouterInput.vue'
import ServerInput from '../../cipher/cipher-types/server/ServerInput.vue'
import ApiInput from '../../cipher/cipher-types/api/ApiInput.vue'
import DatabaseInput from '../../cipher/cipher-types/database/DatabaseInput.vue'
import InputCustomFields from '../../input/InputCustomFields.vue'

export default {
  components: {
    Dialog,
    ValidationProvider,
    ValidationObserver,
    InputText,
    LoginInput,
    CardInput,
    IdentityInput,
    CryptoBackupInput,
    DriverLicenseInput,
    CitizenIdInput,
    PassportInput,
    SsnInput,
    RouterInput,
    ServerInput,
    ApiInput,
    DatabaseInput,
    InputCustomFields
  },

  props: {
    type: {
      type: [String, Number],
      default: 1
    }
  },

  data () {
    return {
      cipher: new CipherView(),
      folders: [],
      dialogVisible: false,
      loading: false,
      CipherType,
      errors: {},
      cloneMode: false,
      currentComponent: Dialog
    }
  },

  methods: {
    async openDialog (data, cloneMode = false) {
      this.currentComponent = Dialog
      this.folders = await this.getFolders()
      this.dialogVisible = true
      this.cloneMode = cloneMode

      // Edit/clone
      if (data.id || this.cloneMode) {
        const cipherData = new Cipher({ ...data }, true)

        // Update login uris
        if (
          data.type === CipherType.Login &&
          data.login &&
          data.login.uris == null
        ) {
          cipherData.login.uris = [new LoginUriView()]
        }

        // Set special types notes
        if (data.type === CipherType.CryptoWallet) {
          cipherData.notes = data.cryptoWallet.notes
          setTimeout(() => {
            this.$refs.cryptoBackupInput.loadData(data.cryptoWallet)
          }, 0)
        }
        if (data.type === CipherType.DriverLicense) {
          cipherData.notes = data.driverLicense.notes
          setTimeout(() => {
            this.$refs.driverLicenseInput.loadData(data.driverLicense)
          }, 0)
        }
        if (data.type === CipherType.CitizenID) {
          cipherData.notes = data.citizenId.notes
          setTimeout(() => {
            this.$refs.citizenIdInput.loadData(data.citizenId)
          }, 0)
        }
        if (data.type === CipherType.Passport) {
          cipherData.notes = data.passport.notes
          setTimeout(() => {
            this.$refs.passportInput.loadData(data.passport)
          }, 0)
        }
        if (data.type === CipherType.SocialSecurityNumber) {
          cipherData.notes = data.ssn.notes
          setTimeout(() => {
            this.$refs.ssnInput.loadData(data.ssn)
          }, 0)
        }
        if (data.type === CipherType.WirelessRouter) {
          cipherData.notes = data.router.notes
          setTimeout(() => {
            this.$refs.routerInput.loadData(data.router)
          }, 0)
        }
        if (data.type === CipherType.Server) {
          cipherData.notes = data.server.notes
          setTimeout(() => {
            this.$refs.serverInput.loadData(data.server)
          }, 0)
        }
        if (data.type === CipherType.APICipher) {
          cipherData.notes = data.api.notes
          setTimeout(() => {
            this.$refs.apiInput.loadData(data.api)
          }, 0)
        }
        if (data.type === CipherType.Database) {
          cipherData.notes = data.database.notes
          setTimeout(() => {
            this.$refs.databaseInput.loadData(data.database)
          }, 0)
        }

        // Update custom fields
        if (data.fields == null) {
          cipherData.fields = []
        }

        // Remove org if clone
        if (this.cloneMode) {
          this.cipher.organizationId = null
          this.cipher.collectionIds = []
        }

        // Check if current org is shared folder
        if (this.cipher.collectionIds && this.cipher.collectionIds[0]) {
          this.cipher.folderId = this.cipher.collectionIds[0]
        }

        this.cipher = cipherData
        return
      }

      // Create new cipher
      if (this.type) {
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
      this.cipher.organizationId = data.organizationId
        ? data.organizationId
        : null
      this.cipher.type = CipherType[type]
      this.cipher.login = new LoginView()
      this.cipher.login.uris = [new LoginUriView()]
      this.cipher.card = new CardView()
      this.cipher.identity = new IdentityView()
      this.cipher.secureNote = new SecureNoteView()
      this.cipher.secureNote.type = SecureNoteType.Generic
      this.cipher.folderId = this.$route.params.folderId || null
      this.cipher.collectionIds = this.$route.params.tfolderId
        ? [this.$route.params.tfolderId]
        : []
      if (this.cipher.organizationId) {
        this.handleChangeOrg(this.cipher.organizationId)
      }
    }
  }
}
</script>
