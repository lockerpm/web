import Vue from 'vue'
import { FolderRequest } from '../../../core/models/request'

Vue.mixin({
  methods: {
    async upsertFolderLocal (folder, data) {
      if (folder.id && !data.id) {
        data.id = folder.id
      }
      data.revisionDate = new Date().toISOString()
      await this.$folderService.upsert([data])
      this.$store.commit('UPDATE_SYNCED_CIPHERS')
    },

    async upsertCollectionLocal (collection, data) {
      if (collection.id && !data.id) {
        data.id = collection.id
      }
      data.revisionDate = new Date().toISOString()
      data.organizationId = collection.organizationId
      await this.$collectionService.upsert([data])
      this.$store.commit('UPDATE_SYNCED_CIPHERS')
    },

    // Create folder
    async handleCreateFolder (folder) {
      try {
        const folderEnc = await this.$folderService.encrypt(folder)
        const data = new FolderRequest(folderEnc)
        const res = await this.$axios.$post('cystack_platform/pm/folders', data)
        if (res.id) {
          data.id = res.id
          await this.upsertFolderLocal(folder, data)
        }
        return res.id
      } catch (e) {
        const isHandled = this.handleApiError(e.response)
        if (!isHandled) {
          this.notify(
            this.$tc('data.notifications.create_failed', 1, {
              type: this.$tc('type.Folder', 1)
            }),
            'warning'
          )
          throw e
        }
        return null
      }
    },

    // Update folder
    async handleEditFolder (folder) {
      try {
        if (folder.organizationId) {
          const orgKey = await this.$cryptoService.getOrgKey(
            folder.organizationId
          )
          const folderEnc = await this.$folderService.encrypt(folder, orgKey)
          const data = new FolderRequest(folderEnc)
          await this.$axios.$put(
            `cystack_platform/pm/sharing/${folder.organizationId}/folders/${folder.id}`,
            data
          )
          await this.upsertCollectionLocal(folder, data)
        } else {
          const folderEnc = await this.$folderService.encrypt(folder)
          const data = new FolderRequest(folderEnc)
          await this.$axios.$put(
            `cystack_platform/pm/folders/${folder.id}`,
            data
          )
          await this.upsertFolderLocal(folder, data)
        }

        this.notify(
          this.$tc('data.notifications.update_success', 1, {
            type: this.$tc('type.Folder', 1)
          }),
          'success'
        )
      } catch (e) {
        const isHandled = this.handleApiError(e.response)
        if (!isHandled) {
          this.notify(
            this.$tc('data.notifications.update_failed', 1, {
              type: this.$tc('type.Folder', 1)
            }),
            'warning'
          )
        }
        throw e
      }
    },

    // Delete folder
    async handleDeleteFolder (folder) {
      try {
        const deletedCipherIds = []

        if (folder.organizationId) {
          let folderNameEnc = await this.$cryptoService.encrypt(folder.name)
          folderNameEnc = folderNameEnc.encryptedString
          const cipherInsideCollection =
            (await this.$searchService.searchCiphers(
              this.searchText,
              [c => c.collectionIds.includes(folder.id)],
              null
            )) || []

          // Encrypt ciphers with self key
          const personalKey = await this.$cryptoService.getEncKey()
          const ciphers = await Promise.all(
            cipherInsideCollection.map(async cipher => {
              const { data } = await this.getEncCipherForRequest(cipher, {
                noCheck: true,
                encKey: personalKey
              })
              deletedCipherIds.push(cipher.id)
              return {
                id: cipher.id,
                ...data
              }
            })
          )
          const payload = {
            folder: {
              id: folder.id,
              name: folderNameEnc,
              ciphers
            }
          }
          await this.$axios.$post(
            `cystack_platform/pm/sharing/${folder.organizationId}/folders/${folder.id}/delete`,
            payload
          )

          // Upsert all ciphers
          await this.$cipherService.upsert(ciphers)
          await this.$collectionService.delete(folder.id)
        } else {
          const cipherInsideFolder =
            (await this.$searchService.searchCiphers(
              this.searchText,
              [c => c.folderId === folder.id],
              null
            )) || []
          cipherInsideFolder.forEach(c => {
            deletedCipherIds.push(c.id)
          })
          await this.$axios.$delete(`cystack_platform/pm/folders/${folder.id}`)
          await this.$folderService.delete(folder.id)
        }
        await this.$cipherService.softDelete(deletedCipherIds)
        this.$store.commit('UPDATE_SYNCED_CIPHERS')
        this.notify(
          this.$tc('data.notifications.delete_success', 1, {
            type: this.$t('common.folder')
          }),
          'success'
        )
      } catch (e) {
        const isHandled = this.handleApiError(e.response)
        if (!isHandled) {
          this.notify(
            this.$tc('data.notifications.delete_failed', 1, {
              type: this.$t('common.folder')
            }),
            'warning'
          )
        }
        throw e
      }
    }
  }
})
