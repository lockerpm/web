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
          @update:name="newValue => (cipher.name = newValue)"
          @update:username="newValue => (cipher.login.username = newValue)"
          @update:password="newValue => (cipher.login.password = newValue)"
          @update:uris="newValue => (cipher.login.uris = newValue)"
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
        <div :class="cipher.type === CipherType.CryptoWallet ? '' : 'hidden'">
          <crypto-backup-input
            ref="cryptoBackupInput"
            :is-deleted="isDeleted"
            :cipher-id="cipher.id"
            @update:cryptoWallet="val => (cipher.cryptoWallet = val)"
          />
        </div>

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
        <div>
          <button class="btn btn-default" @click="closeDialog">
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
            @click="preparePassword(cipher)"
          >
            {{ cipher.id ? $t('common.update') : $t('common.add') }}
          </button>
        </div>
      </div>
      <!-- Footer end -->
    </component>
    <!-- Main dialog end -->

    <AddEditFolder ref="addEditFolder" @created-folder="handleCreatedFolder" />

    <PasswordViolationDialog
      ref="passwordPolicyDialog"
      @confirm="cipher.id ? putCipher(cipher) : postCipher(cipher)"
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
import InputSelect from '../input/InputSelect'
import InputSelectFolder from '../input/InputSelectFolder'
import InputCustomFields from '../input/InputCustomFields.vue'
import InlineEditCipher from './InlineEditCipher'
import PasswordViolationDialog from './PasswordViolationDialog'
import LoginInput from './cipher-types/login/LoginInput.vue'
import CardInput from './cipher-types/card/CardInput.vue'
import IdentityInput from './cipher-types/identity/IdentityInput.vue'
import CryptoBackupInput from './cipher-types/crypto-backup/CryptoBackupInput.vue'

CipherType.CryptoWallet = CipherType.CryptoBackup = 7

export default {
  components: {
    AddEditFolder,
    Dialog,
    InlineEditCipher,
    ValidationProvider,
    ValidationObserver,
    InputText,
    InputSelect,
    InputSelectFolder,
    InputCustomFields,
    PasswordViolationDialog,
    LoginInput,
    CardInput,
    IdentityInput,
    CryptoBackupInput
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
      dialogVisible: false,
      loading: false,
      CipherType,
      errors: {},
      writeableCollections: [],
      nonWriteableCollections: [],
      cloneMode: false,
      currentComponent: Dialog
    }
  },

  computed: {
    isDeleted () {
      return !!this.cipher.deletedDate
    },
    passwordStrength () {
      if (this.cipher.login) {
        return (
          this.$passwordGenerationService.passwordStrength(
            this.cipher.login.password,
            ['cystack']
          ) || {}
        )
      }
      if (this.cipher.cryptoWallet) {
        return (
          this.$passwordGenerationService.passwordStrength(
            this.cipher.cryptoWallet.password,
            ['cystack']
          ) || {}
        )
      }
      return {}
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
      if (data.id || this.cloneMode) {
        if (
          data.type === CipherType.Login &&
          data.login &&
          data.login.uris == null
        ) {
          data.login.uris = [new LoginUriView()]
        }
        if (data.fields == null) {
          data.fields = []
        }
        this.cipher = new Cipher({ ...data }, true)
        if (this.cloneMode) {
          this.cipher.organizationId = null
          this.cipher.collectionIds = []
        }
        if (this.cipher.collectionIds && this.cipher.collectionIds[0]) {
          this.cipher.folderId = this.cipher.collectionIds[0]
        }
        setTimeout(() => {
          this.$refs.inputSelectFolder.value = this.cipher.folderId
          if (data.type === CipherType.CryptoWallet) {
            this.$refs.cryptoBackupInput.setInitialData(data.cryptoWallet)
          }
        }, 0)
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

    // Check for password violations
    preparePassword (cipher) {
      const violationItems =
        cipher.type === CipherType.Login
          ? this.checkPasswordPolicy(cipher.login.password || '')
          : []
      if (violationItems.length) {
        this.$refs.passwordPolicyDialog.openDialog(violationItems)
      } else {
        cipher.id ? this.putCipher(cipher) : this.postCipher(cipher)
      }
    },

    // Create cipher
    async postCipher (cipher) {
      if (!cipher.name) {
        return
      }
      try {
        this.loading = true
        this.errors = {}

        // Change type to Note for new cipher types
        const type_ = this.cipher.type
        if (this.cipher.type === CipherType.CryptoWallet) {
          this.cipher.notes = JSON.stringify({
            ...this.cipher.cryptoWallet,
            notes: this.cipher.notes
          })
          this.cipher.type = CipherType.SecureNote
        }

        // Check if current folder is a collection
        const collection = this.writeableCollections.find(
          c => c.id === this.cipher.folderId
        )
        if (collection) {
          this.cipher.organizationId = collection.organizationId
          this.cipher.folderId = null
          this.cipher.collectionIds = [collection.id]
        }

        // Remove org in clone mode and not set to any collection
        if (this.cloneMode && !collection) {
          this.cipher.organizationId = null
        }

        // Encrypt cipher
        const cipherEnc = await this.$cipherService.encrypt(cipher)
        const data = new CipherRequest(cipherEnc)

        // Change type back after encryption
        data.type = type_
        this.cipher.type = type_

        // Send api
        await this.$axios.$post('cystack_platform/pm/ciphers/vaults', {
          ...data,
          score: this.passwordStrength.score,
          collectionIds: cipher.collectionIds
        })
        this.notify(
          this.$tc('data.notifications.create_success', 1, {
            type: this.$tc(`type.${this.type}`, 1)
          }),
          'success'
        )
        this.closeDialog()
      } catch (e) {
        if (e.response && e.response.data && e.response.data.code === '5002') {
          this.notify(
            this.$t('errors.5002', { type: this.$tc(`type.${this.type}`, 1) }),
            'error'
          )
          this.$store.commit('UPDATE_NOTICE', { showPleaseUpgrade: true })
        } else {
          this.notify(
            this.$tc('data.notifications.create_failed', 1, {
              type: this.$tc(`type.${this.type}`, 1)
            }),
            'warning'
          )
        }
        // this.errors = (e.response && e.response.data && e.response.data.details) || {}
      } finally {
        this.loading = false
      }
    },

    // Update cipher
    async putCipher (cipher) {
      try {
        // Change type to Note for new cipher types
        const type_ = this.cipher.type
        if (this.cipher.type === CipherType.CryptoWallet) {
          this.cipher.notes = JSON.stringify({
            ...this.cipher.cryptoWallet,
            notes: this.cipher.notes
          })
          this.cipher.type = CipherType.SecureNote
          this.cipher.secureNote = new SecureNote(this.cipher.secureNote, true)
          this.cipher.secureNote.type = 0
        }

        // Check if current folder is a collection or remove from old collection if move back to folder
        if (this.cipher.folderId) {
          const collection = [
            ...this.writeableCollections,
            ...this.nonWriteableCollections
          ].find(c => c.id === this.cipher.folderId)
          if (collection) {
            this.cipher.organizationId = collection.organizationId
            this.cipher.folderId = null
            this.cipher.collectionIds = [collection.id]
          } else {
            this.cipher.organizationId = null
            this.cipher.collectionIds = []
          }
        } else if (this.cipher.organizationId) {
          // If move item from folder share back to no folder -> remove orgId
          const collection = this.writeableCollections.find(
            c => c.organizationId === this.cipher.organizationId
          )
          if (collection) {
            this.cipher.organizationId = null
            this.cipher.collectionIds = []
          }
        }

        // Encrypt cipher
        const cipherEnc = await this.$cipherService.encrypt(cipher)
        const data = new CipherRequest(cipherEnc)

        // Change type back after encryption
        data.type = type_
        this.cipher.type = type_

        // Send api
        await this.$axios.$put(`cystack_platform/pm/ciphers/${cipher.id}`, {
          ...data,
          score: this.passwordStrength.score,
          collectionIds: cipher.collectionIds
        })
        this.notify(
          this.$tc('data.notifications.update_success', 1, {
            type: this.$tc(`type.${this.type}`, 1)
          }),
          'success'
        )
        this.closeDialog()
        this.$emit('updated-cipher')
      } catch (e) {
        if (e.response && e.response.data && e.response.data.code === '3003') {
          this.notify(this.$t('errors.3003'), 'error')
        } else {
          this.notify(
            this.$tc('data.notifications.update_failed', 1, {
              type: this.$tc(`type.${this.type}`, 1)
            }),
            'warning'
          )
        }
      } finally {
        this.loading = false
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
          try {
            this.loading = true
            await this.$axios.$put(
              'cystack_platform/pm/ciphers/permanent_delete',
              { ids }
            )
            await this.$cipherService.delete(ids)
            this.notify(
              this.$tc('data.notifications.delete_success', ids.length, {
                type: this.$tc('type.0', ids.length)
              }),
              'success'
            )
            this.closeDialog()
            this.$emit('reset-selection')
          } catch (e) {
            if (e.response && e.response.data && e.response.code === '5001') {
              this.notify(this.$t('errors.5001'), 'error')
            } else {
              this.notify(
                this.$tc('data.notifications.delete_failed', ids.length, {
                  type: this.$tc('type.0', ids.length)
                }),
                'warning'
              )
            }
            console.log(e)
          } finally {
            this.loading = false
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
          try {
            this.loading = true
            await this.$axios.$put('cystack_platform/pm/ciphers/delete', {
              ids
            })
            this.notify(
              this.$tc('data.notifications.trash_success', ids.length, {
                type: this.$tc('type.0', ids.length)
              }),
              'success'
            )
            this.$emit('trashed-cipher')
          } catch (e) {
            if (e.response && e.response.data && e.response.code === '5001') {
              this.notify(this.$t('errors.5001'), 'error')
            } else {
              this.notify(
                this.$tc('data.notifications.trash_failed', ids.length, {
                  type: this.$tc('type.0', ids.length)
                }),
                'warning'
              )
            }
            this.$emit('reset-selection')
          } finally {
            this.loading = false
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
          try {
            this.loading = true
            await this.$axios.$put('cystack_platform/pm/ciphers/restore', {
              ids
            })
            this.notify(
              this.$tc('data.notifications.restore_success', ids.length, {
                type: this.$tc('type.0', ids.length)
              }),
              'success'
            )
            this.$emit('reset-selection')
          } catch (e) {
            this.notify(
              this.$tc('data.notifications.restore_failed', ids.length, {
                type: this.$tc('type.0', ids.length)
              }),
              'warning'
            )
            console.log(e)
          } finally {
            this.loading = false
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
      this.cipher.type = CipherType[type]
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
      if (this.cipher.organizationId) {
        this.handleChangeOrg(this.cipher.organizationId)
      }

      // Set item name if open from tutorial
      if (this.$tutorial.isActive()) {
        this.cipher.name = 'New password'
      }
    },

    // Get writable collections
    async getWritableCollections () {
      let collections = []
      try {
        collections = await this.$collectionService.getAllDecrypted()
        const organizations = await this.$userService.getAllOrganizations()
        collections = collections.filter(item => {
          const _type = this.getTeam(organizations, item.organizationId).type
          return _type === 0
        })
      } catch (error) {}
      return collections
    },

    // Get non-writable collections
    async getNonWritableCollections () {
      let collections = []
      try {
        collections = await this.$collectionService.getAllDecrypted()
        const organizations = await this.$userService.getAllOrganizations()
        collections = collections.filter(item => {
          const _type = this.getTeam(organizations, item.organizationId).type
          return _type !== 0
        })
      } catch (error) {}
      return collections
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
