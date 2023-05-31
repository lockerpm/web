import Vue from 'vue'
import { LoginUriView, LoginView } from '../../../jslib/src/models/view'
import { CipherRequest } from '../../../jslib/src/models/request'
import { CipherType } from '../../../core/enums/cipherType'
import { CipherView } from '../../../core/models/view/cipherView'

Vue.mixin({
  methods: {
    async createEncryptedMasterPwItem (masterPw, encKey) {
      const cipher = new CipherView()
      cipher.type = CipherType.Login
      const loginData = new LoginView()
      loginData.username = 'locker.io'
      loginData.password = masterPw
      const uriView = new LoginUriView()
      uriView.uri = 'https://locker.io'
      loginData.uris = [uriView]
      cipher.login = loginData
      cipher.name = 'Locker Master Password'
      const cipherEnc = await this.$cipherService.encrypt(cipher, encKey)
      const data = new CipherRequest(cipherEnc)
      data.type = CipherType.MasterPassword
      return data
    },

    // Create cipher
    async handleCreateCipher (cipher, options = {}) {
      const { cloneMode, score } = options
      try {
        const { data, collectionIds } = await this.getEncCipherForRequest(
          cipher,
          {
            writeableCollections: await this.getWritableCollections(),
            isNewCipher: true,
            cloneMode
          }
        )
        await this.$axios.$post('cystack_platform/pm/ciphers/vaults', {
          ...data,
          score,
          collectionIds
        })
        this.notify(
          this.$tc('data.notifications.create_success', 1, {
            type: this.$tc(`type.${cipher.type}`, 1)
          }),
          'success'
        )
        return true
      } catch (e) {
        const isHandled = this.handleApiError(e.response)
        if (!isHandled) {
          this.notify(
            this.$tc('data.notifications.create_failed', 1, {
              type: this.$tc(`type.${cipher.type}`, 1)
            }),
            'warning'
          )
        }
        return false
      }
    },

    // Update cipher
    async handleEditCipher (cipher, options = {}) {
      const { score, silent } = options
      try {
        const { data, collectionIds } = await this.getEncCipherForRequest(
          cipher,
          {
            writeableCollections: await this.getWritableCollections(),
            nonWriteableCollections: await this.getNonWritableCollections()
          }
        )
        // Send api
        await this.$axios.$put(`cystack_platform/pm/ciphers/${cipher.id}`, {
          ...data,
          score,
          collectionIds
        })
        if (!silent) {
          this.notify(
            this.$tc('data.notifications.update_success', 1, {
              type: this.$tc(`type.${cipher.type}`, 1)
            }),
            'success'
          )
        }
        return true
      } catch (e) {
        if (silent) {
          return false
        }
        const isHandled = this.handleApiError(e.response)
        if (!isHandled) {
          this.notify(
            this.$tc('data.notifications.update_failed', 1, {
              type: this.$tc(`type.${cipher.type}`, 1)
            }),
            'warning'
          )
        }
        return false
      }
    },

    // Delete cipher
    async handleDeleteCiphers (ids) {
      try {
        await this.$axios.$put('cystack_platform/pm/ciphers/permanent_delete', {
          ids
        })
        await this.$cipherService.delete(ids)
        this.notify(
          this.$tc('data.notifications.delete_success', ids.length, {
            type: this.$tc('type.0', ids.length)
          }),
          'success'
        )
        return true
      } catch (e) {
        const isHandled = this.handleApiError(e.response)
        if (!isHandled) {
          this.notify(
            this.$tc('data.notifications.delete_failed', ids.length, {
              type: this.$tc('type.0', ids.length)
            }),
            'warning'
          )
        }
        console.log(e)
        return false
      }
    },

    // Move to trash
    async handleMoveTrashCiphers (ids) {
      try {
        await this.$axios.$put('cystack_platform/pm/ciphers/delete', {
          ids
        })
        this.notify(
          this.$tc('data.notifications.trash_success', ids.length, {
            type: this.$tc('type.0', ids.length)
          }),
          'success'
        )
        return true
      } catch (e) {
        console.log(e)
        const isHandled = this.handleApiError(e.response)
        if (!isHandled) {
          this.notify(
            this.$tc('data.notifications.trash_failed', ids.length, {
              type: this.$tc('type.0', ids.length)
            }),
            'warning'
          )
        }
        return false
      }
    },

    // Restore cipher
    async handleRestoreCiphers (ids) {
      try {
        await this.$axios.$put('cystack_platform/pm/ciphers/restore', {
          ids
        })
        this.notify(
          this.$tc('data.notifications.restore_success', ids.length, {
            type: this.$tc('type.0', ids.length)
          }),
          'success'
        )
        return true
      } catch (e) {
        this.notify(
          this.$tc('data.notifications.restore_failed', ids.length, {
            type: this.$tc('type.0', ids.length)
          }),
          'warning'
        )
        console.log(e)
        return false
      }
    }
  }
})
