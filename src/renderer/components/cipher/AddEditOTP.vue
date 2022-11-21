<template>
  <div>
    <!-- Main dialog -->
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
          <span v-if="cipher.id">
            {{ $t('common.edit') }} {{ $tc(`type.${cipher.type}`, 1) }}
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
            required
          />
        </ValidationProvider>
      </div>
      <!-- Body end -->

      <!-- Footer -->
      <div
        slot="footer"
        class="dialog-footer flex items-center text-left"
      >
        <div class="flex-grow">
          <button
            v-if="cipher.id"
            class="btn btn-icon !text-danger"
            @click="deleteCiphers([cipher.id])"
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
            class="btn btn-primary"
            :disabled="loading || !cipher.name"
            @click="putCipher(cipher)"
          >
            {{ $t('common.update') }}
          </button>
        </div>
      </div>
      <!-- Footer end -->
    </component>
    <!-- Main dialog end -->
  </div>
</template>

<script>
import { Dialog } from 'element-ui'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { CipherType, SecureNoteType } from '../../jslib/src/enums'
import { Cipher, SecureNote } from '../../jslib/src/models/domain'
import { CipherRequest } from '../../jslib/src/models/request'
import { CipherView, SecureNoteView } from '../../jslib/src/models/view'
import InputText from '../input/InputText'
import InlineEditCipher from './InlineEditCipher'

CipherType.TOTP = 5

export default {
  components: {
    Dialog,
    InlineEditCipher,
    ValidationProvider,
    ValidationObserver,
    InputText
  },

  data () {
    return {
      cipher: {
        ...new CipherView()
      },
      dialogVisible: false,
      loading: false,
      CipherType,
      errors: {},
      currentComponent: Dialog,
      type: 'TOTP'
    }
  },

  methods: {
    async openDialog (data, inline = false) {
      this.currentComponent = inline ? InlineEditCipher : Dialog
      this.dialogVisible = true
      if (data.id) {
        this.cipher = new Cipher({ ...data }, true)
      } else {
        this.newCipher('TOTP', data)
      }
    },

    closeDialog () {
      this.dialogVisible = false
      this.$emit('close')
      this.currentComponent = Dialog
    },

    // Update cipher
    async putCipher (cipher) {
      try {
        // Change type to Note for new cipher types
        const type_ = this.cipher.type
        if (this.cipher.type === CipherType.TOTP) {
          this.cipher.type = CipherType.SecureNote
          this.cipher.secureNote = new SecureNote(this.cipher.secureNote, true)
          this.cipher.secureNote.type = 0
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
          collectionIds: []
        })
        this.notify(this.$tc('data.notifications.update_success', 1, { type: this.$tc(`type.${this.type}`, 1) }), 'success')
        this.closeDialog()
        this.$emit('updated-cipher')
      } catch (e) {
        if (e.response && e.response.data && e.response.data.code === '3003') {
          this.notify(this.$t('errors.3003'), 'error')
        } else {
          this.notify(this.$tc('data.notifications.update_failed', 1, { type: this.$tc(`type.${this.type}`, 1) }), 'warning')
        }
      } finally {
        this.loading = false
      }
    },

    // Delete cipher
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

    newCipher () {
      this.cipher = new CipherView()
      this.cipher.type = CipherType.TOTP
      this.cipher.secureNote = new SecureNoteView()
      this.cipher.secureNote.type = SecureNoteType.Generic
    }
  }
}
</script>
