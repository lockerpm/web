<template>
  <div>
    <!-- Main dialog -->
    <component
      :is="currentComponent"
      id="add-edit-cipher-dialog"
      :visible.sync="dialogVisible"
      width="435px"
      destroy-on-close
      top="5vh"
      custom-class="locker-dialog"
      :close-on-click-modal="false"
      @close="onClose"
    >
      <!-- Title -->
      <div slot="title">
        <div class="text-head-5 text-black-700 font-semibold truncate">
          <span v-if="cipher.id">
            {{ isDeleted ? $t('common.restore') : $t('common.edit') }}
            {{ $tc(`type.${cipher.type}`, 1) }}
          </span>
          <span v-else>
            {{ $t('common.add') }} {{ $tc(`type.${cipher.type}`, 1) }}
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
            :disabled="isDeleted"
            required
          />
        </ValidationProvider>

        <!-- LOGIN FIELDS -->
        <login-input
          v-if="cipher.type === CipherType.Login"
          :is-deleted="isDeleted"
          :name="cipher.name"
          :username="cipher.login.username"
          :password="cipher.login.password"
          :uris="cipher.login.uris"
          :totp="cipher.login.totp"
          @update:name="newValue => (cipher.name = newValue)"
          @update:username="newValue => (cipher.login.username = newValue)"
          @update:password="newValue => (cipher.login.password = newValue)"
          @update:uris="newValue => (cipher.login.uris = newValue)"
          @update:totp="newValue => (cipher.login.totp = newValue)"
          @update:isCreateAuthenticator="newValue => (isCreateAuthenticator = newValue)"
        />

        <!-- CARD FIELDS -->
        <card-input
          v-if="cipher.type === CipherType.Card"
          :is-deleted="isDeleted"
          :errors="errors"
          :cardholder-name="cipher.card.cardholderName"
          :number="cipher.card.number"
          :brand="cipher.card.brand"
          :exp-month="cipher.card.expMonth"
          :exp-year="cipher.card.expYear"
          :code="cipher.card.code"
          @update:cardholderName="
            newValue => (cipher.card.cardholderName = newValue)
          "
          @update:number="newValue => (cipher.card.number = newValue)"
          @update:brand="newValue => (cipher.card.brand = newValue)"
          @update:expMonth="newValue => (cipher.card.expMonth = newValue)"
          @update:expYear="newValue => (cipher.card.expYear = newValue)"
          @update:code="newValue => (cipher.card.code = newValue)"
        />

        <!-- IDENTITY FIELDS -->
        <identity-input
          v-if="cipher.type === CipherType.Identity"
          :is-deleted="isDeleted"
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
          @update:title="newValue => (cipher.identity.title = newValue)"
          @update:firstName="newValue => (cipher.identity.firstName = newValue)"
          @update:lastName="newValue => (cipher.identity.lastName = newValue)"
          @update:username="newValue => (cipher.identity.username = newValue)"
          @update:company="newValue => (cipher.identity.company = newValue)"
          @update:email="newValue => (cipher.identity.email = newValue)"
          @update:phone="newValue => (cipher.identity.phone = newValue)"
          @update:ssn="newValue => (cipher.identity.ssn = newValue)"
          @update:passportNumber="
            newValue => (cipher.identity.passportNumber = newValue)
          "
          @update:licenseNumber="
            newValue => (cipher.identity.licenseNumber = newValue)
          "
          @update:address1="newValue => (cipher.identity.address1 = newValue)"
          @update:address2="newValue => (cipher.identity.address2 = newValue)"
          @update:city="newValue => (cipher.identity.city = newValue)"
          @update:state="newValue => (cipher.identity.state = newValue)"
          @update:postalCode="
            newValue => (cipher.identity.postalCode = newValue)
          "
          @update:country="newValue => (cipher.identity.country = newValue)"
        />

        <!-- CRYPTO BACKUP FIELDS -->
        <crypto-backup-input
          v-if="cipher.type === CipherType.CryptoWallet"
          ref="cryptoBackupInput"
          :is-deleted="isDeleted"
          :cipher-id="cipher.id"
        />

        <!-- DRIVER LICENSE -->
        <driver-license-input
          v-if="cipher.type === CipherType.DriverLicense"
          ref="driverLicenseInput"
          :is-deleted="isDeleted"
        />

        <!-- CITIZEN ID -->
        <citizen-id-input
          v-if="cipher.type === CipherType.CitizenID"
          ref="citizenIdInput"
          :is-deleted="isDeleted"
        />

        <!-- PASSPORT -->
        <passport-input
          v-if="cipher.type === CipherType.Passport"
          ref="passportInput"
          :is-deleted="isDeleted"
        />

        <!-- SSN -->
        <ssn-input
          v-if="cipher.type === CipherType.SocialSecurityNumber"
          ref="ssnInput"
          :is-deleted="isDeleted"
        />

        <!-- ROUTER -->
        <router-input
          v-if="cipher.type === CipherType.WirelessRouter"
          ref="routerInput"
          :is-deleted="isDeleted"
        />

        <!-- SERVER -->
        <server-input
          v-if="cipher.type === CipherType.Server"
          ref="serverInput"
          :is-deleted="isDeleted"
        />

        <!-- API -->
        <api-input
          v-if="cipher.type === CipherType.APICipher"
          ref="apiInput"
          :is-deleted="isDeleted"
        />

        <!-- DATABASE -->
        <database-input
          v-if="cipher.type === CipherType.Database"
          ref="databaseInput"
          :is-deleted="isDeleted"
        />

        <!-- NOTES -->
        <div>
          <!-- Label -->
          <div
            v-if="cipher.type !== CipherType.SecureNote"
            class="my-5 text-black-700 text-head-6 font-semibold"
          >
            {{ $t('data.ciphers.others') }}
          </div>
          <!-- Label end -->

          <!-- Input -->
          <div>
            <InputText
              v-model="cipher.notes"
              :label="$t('data.ciphers.notes')"
              class="w-full"
              :disabled="isDeleted"
              is-textarea
            />
          </div>
          <!-- Input end -->
        </div>
        <!-- NOTES END -->

        <!-- CUSTOM FIELDS -->
        <div>
          <div class="my-5 text-black-700 text-head-6 font-semibold">
            {{ $t('data.ciphers.custom_fields') }}
          </div>
          <InputCustomFields
            v-model="cipher.fields"
            :edit-mode="cipher.id ? true : false"
            class="w-full !mb-3"
            @set-fields="setFields"
          />
        </div>

        <!-- FOLDER -->
        <InputSelectFolder
          ref="inputSelectFolder"
          :label="$t('data.folders.select_folder')"
          :initial-value="cipher.folderId"
          :options="[...folders, ...writeableCollections]"
          :protected-options="nonWriteableCollections"
          :disabled="isDeleted"
          class="w-full"
          @change="v => (cipher.folderId = v)"
          @addFolder="addFolder(false)"
        />
      </div>
      <!-- Body end -->

      <!-- Footer -->
      <div slot="footer" class="dialog-footer flex items-center text-left">
        <!-- To trash/delete -->
        <div class="flex-grow">
          <button
            v-if="cipher.id"
            class="btn btn-icon !text-danger"
            @click="
              isDeleted
                ? deleteCiphers([cipher.id])
                : moveTrashCiphers([cipher.id])
            "
          >
            <i class="fa fa-trash-alt" />
          </button>
        </div>
        <!-- To trash/delete end -->

        <div>
          <!-- Close -->
          <button class="btn btn-default" @click="closeDialog">
            {{ $t('common.cancel') }}
          </button>
          <!-- Close end -->

          <!-- Restore -->
          <button
            v-if="isDeleted"
            class="btn btn-primary"
            :disabled="loading"
            @click="restoreCiphers([cipher.id])"
          >
            {{ $t('common.restore') }}
          </button>
          <!-- Restore end -->

          <!-- Add/update -->
          <button
            v-else
            class="btn btn-primary"
            :disabled="loading || !cipher.name"
            @click="preparePassword()"
          >
            {{ cipher.id ? $t('common.update') : $t('common.add') }}
          </button>
          <!-- Add/update end -->
        </div>
      </div>
      <!-- Footer end -->
    </component>
    <!-- Main dialog end -->

    <AddEditFolder ref="addEditFolder" @created-folder="handleCreatedFolder" />

    <PasswordViolationDialog
      ref="passwordPolicyDialog"
      @confirm="cipher.id ? putCipher() : postCipher()"
    />
  </div>
</template>

<script>
import { Dialog } from 'element-ui'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { SecureNoteType } from '../../jslib/src/enums'
import { CipherType } from '../../core/enums/cipherType'
import { Cipher } from '../../jslib/src/models/domain'
import {
  CipherView,
  LoginView,
  SecureNoteView,
  IdentityView,
  CardView,
  LoginUriView
} from '../../jslib/src/models/view'
import AddEditFolder from '../folder/AddEditFolder'
import InputText from '../input/InputText'
import InputSelectFolder from '../input/InputSelectFolder'
import InputCustomFields from '../input/InputCustomFields.vue'
import InlineEditCipher from './InlineEditCipher'
import PasswordViolationDialog from './PasswordViolationDialog'
import LoginInput from './cipher-types/login/LoginInput.vue'
import CardInput from './cipher-types/card/CardInput.vue'
import IdentityInput from './cipher-types/identity/IdentityInput.vue'
import CryptoBackupInput from './cipher-types/crypto-backup/CryptoBackupInput.vue'
import DriverLicenseInput from './cipher-types/driver-license/DriverLicenseInput.vue'
import CitizenIdInput from './cipher-types/citizen-id/CitizenIdInput.vue'
import PassportInput from './cipher-types/passport/PassportInput.vue'
import SsnInput from './cipher-types/ssn/SsnInput.vue'
import RouterInput from './cipher-types/router/RouterInput.vue'
import ServerInput from './cipher-types/server/ServerInput.vue'
import ApiInput from './cipher-types/api/ApiInput.vue'
import DatabaseInput from './cipher-types/database/DatabaseInput.vue'

export default {
  components: {
    AddEditFolder,
    Dialog,
    InlineEditCipher,
    ValidationProvider,
    ValidationObserver,
    InputText,
    InputSelectFolder,
    InputCustomFields,
    PasswordViolationDialog,
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
    DatabaseInput
  },

  props: {
    type: {
      type: [String, Number],
      default: 1
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
      dialogVisible: false,
      loading: false,
      CipherType,
      errors: {},
      writeableCollections: [],
      nonWriteableCollections: [],
      cloneMode: false,
      currentComponent: Dialog,
      isCreateAuthenticator: false
    }
  },

  computed: {
    isDeleted () {
      return !!this.cipher.deletedDate
    }
  },

  watch: {
    '$store.state.ui.closeAllModal' (newVal) {
      if (newVal) {
        this.dialogVisible = false
      }
    }
  },

  methods: {
    async openDialog (data, cloneMode = false, inline = false) {
      this.currentComponent = inline ? InlineEditCipher : Dialog
      this.folders = await this.getFolders()
      this.writeableCollections = await this.getWritableCollections()
      this.nonWriteableCollections = await this.getNonWritableCollections()
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
          cipherData.organizationId = null
          cipherData.collectionIds = []
        }

        // Check if current org is shared folder
        if (cipherData.collectionIds && cipherData.collectionIds[0]) {
          cipherData.folderId = cipherData.collectionIds[0]
        }

        // Set current folder
        setTimeout(() => {
          this.$refs.inputSelectFolder.value = cipherData.folderId
        }, 0)

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

    // Check for password violations
    preparePassword () {
      const violationItems =
        this.cipher.type === CipherType.Login
          ? this.checkPasswordPolicy(this.cipher.login.password || '')
          : []
      if (violationItems.length) {
        this.$refs.passwordPolicyDialog.openDialog(violationItems)
      } else {
        this.cipher.id ? this.putCipher() : this.postCipher()
      }
    },

    // Get password strength
    async getPasswordStrength (cipher) {
      let pw = ''
      if (cipher.type === CipherType.CryptoWallet) {
        pw = cipher.cryptoWallet.password
      }
      if (cipher.type === CipherType.Login) {
        pw = cipher.login.password
      }
      if (!pw) {
        return {}
      }
      return (
        this.$passwordGenerationService.passwordStrength(pw, ['cystack']) || {}
      )
    },

    // Load data from components
    loadCipherDataFromComponents () {
      if (this.cipher.type === CipherType.CryptoWallet) {
        this.cipher.cryptoWallet = this.$refs.cryptoBackupInput.getData()
      }
      if (this.cipher.type === CipherType.DriverLicense) {
        this.cipher.driverLicense = this.$refs.driverLicenseInput.getData()
      }
      if (this.cipher.type === CipherType.CitizenID) {
        this.cipher.citizenId = this.$refs.citizenIdInput.getData()
      }
      if (this.cipher.type === CipherType.Passport) {
        this.cipher.passport = this.$refs.passportInput.getData()
      }
      if (this.cipher.type === CipherType.SocialSecurityNumber) {
        this.cipher.ssn = this.$refs.ssnInput.getData()
      }
      if (this.cipher.type === CipherType.WirelessRouter) {
        this.cipher.router = this.$refs.routerInput.getData()
      }
      if (this.cipher.type === CipherType.Server) {
        this.cipher.server = this.$refs.serverInput.getData()
      }
      if (this.cipher.type === CipherType.APICipher) {
        this.cipher.api = this.$refs.apiInput.getData()
      }
      if (this.cipher.type === CipherType.Database) {
        this.cipher.database = this.$refs.databaseInput.getData()
      }
    },

    // Create cipher
    async postCipher () {
      if (!this.cipher.name) {
        return
      }
      this.loading = true
      this.errors = {}
      this.loadCipherDataFromComponents()
      const passwordStrength = await this.getPasswordStrength(this.cipher)
      const isSuccess = await this.handleCreateCipher(this.cipher, {
        cloneMode: this.cloneMode,
        score: passwordStrength.score
      })
      if (this.isCreateAuthenticator && this.cipher.login.totp) {
        const otpCipher = new CipherView()
        otpCipher.name = this.cipher.name
        otpCipher.secretKey = this.cipher.login.totp
        await this.handleCreateAuthenticator(otpCipher)
      }
      this.loading = false
      if (isSuccess) {
        this.closeDialog()
      }
    },

    // Update cipher
    async putCipher () {
      if (!this.cipher.name) {
        return
      }
      this.loading = true
      this.errors = {}
      this.loadCipherDataFromComponents()
      const passwordStrength = await this.getPasswordStrength(this.cipher)
      const isSuccess = await this.handleEditCipher(this.cipher, {
        score: passwordStrength.score
      })
      if (this.isCreateAuthenticator && this.cipher.login.totp) {
        const otpCipher = new CipherView()
        otpCipher.name = this.cipher.name
        otpCipher.secretKey = this.cipher.login.totp
        await this.handleCreateAuthenticator(otpCipher)
      }
      this.loading = false
      if (isSuccess) {
        this.closeDialog()
        this.$emit('updated-cipher')
      }
    },

    // Delete cipher
    async deleteCiphers (ids) {
      this.$confirm(
        this.$tc('data.notifications.delete_selected_desc', ids.length),
        this.$t('common.warning'),
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(async () => {
          this.loading = true
          const isSuccess = await this.handleDeleteCiphers(ids)
          this.loading = false
          if (isSuccess) {
            this.closeDialog()
            this.$emit('reset-selection')
          }
        })
        .catch(() => {})
    },

    // Move to trash
    async moveTrashCiphers (ids) {
      this.$confirm(
        this.$tc('data.notifications.trash_selected_desc', ids.length, {
          count: ids.length
        }),
        this.$t('common.warning'),
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }
      )
        .then(async () => {
          this.loading = true
          const isSuccess = await this.handleMoveTrashCiphers(ids)
          this.loading = false
          if (isSuccess) {
            this.$emit('trashed-cipher')
            this.$emit('reset-selection')
            this.closeDialog()
          }
        })
        .catch(() => {})
    },

    // Restore cipher
    async restoreCiphers (ids) {
      this.$confirm(
        this.$tc('data.notifications.restore_selected_desc', ids.length),
        this.$t('common.warning'),
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(async () => {
          this.loading = true
          const isSuccess = await this.handleRestoreCiphers(ids)
          this.loading = false
          if (isSuccess) {
            this.$emit('reset-selection')
            this.closeDialog()
          }
        })
        .catch(() => {})
    },

    // Open create folder dialog
    addFolder (shouldRedirect = false) {
      this.$refs.addEditFolder.openDialog({}, shouldRedirect)
    },

    // Set current cipher to new folder
    async handleCreatedFolder (folder) {
      this.folders.push(folder)
      this.cipher.folderId = folder.id
      this.$refs.inputSelectFolder.value = folder.id
    },

    newCipher (type, data) {
      this.cipher = new CipherView()
      this.cipher.organizationId = data.organizationId
        ? data.organizationId
        : null
      this.cipher.type = typeof type === 'string' ? CipherType[type] : type
      this.cipher.login = new LoginView()
      this.cipher.login.uris = [new LoginUriView()]
      this.cipher.login.uris[0].uri = 'https://'
      this.cipher.card = new CardView()
      this.cipher.identity = new IdentityView()
      this.cipher.secureNote = new SecureNoteView()
      this.cipher.secureNote.type = SecureNoteType.Generic
      this.cipher.fields = []
      // this.cipher.fields[0].type = FieldType.Text
      this.cipher.folderId = this.$route.params.folderId || null
      this.cipher.collectionIds = this.$route.params.tfolderId
        ? [this.$route.params.tfolderId]
        : []

      // Set item name if open from tutorial
      if (this.$tutorial.isActive()) {
        this.cipher.name = 'New password'
      }
    },

    setFields (v) {
      if (v.remove) {
        this.cipher.fields.splice(v.index, 1)
      } else if (v.index != null) {
        this.cipher.fields[v.index].value = v.value.value
        this.cipher.fields[v.index].name = v.value.name
        this.cipher.fields[v.index].type =
          v.value.type != null ? v.value.type : this.cipher.fields[v.index].type
      } else {
        this.cipher.fields.push(v.value)
      }
    },

    onClose () {
      if (
        this.$tutorial.isActive() &&
        this.$store.state.tutorial.currentStepId !== 'add-pw-1'
      ) {
        this.$tutorial.hide()
        this.$tutorial.show('view-shares')
      }
    }
  }
}
</script>
