<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="435px"
      destroy-on-close
      top="10vh"
      custom-class="locker-dialog"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <div class="text-head-5 text-black-700 font-semibold truncate">
          {{ $t('data.folders.move_to') }}
        </div>
      </div>
      <div>
        <div class="form-group">
          <label for="">
            {{
              $t('data.notifications.move_selected_desc', { count: ids.length })
            }}
          </label>
          <InputSelectFolder
            v-if="dialogVisible"
            ref="inputSelectFolder"
            :initial-value="folderId"
            :options="collections.concat(folders)"
            :label="$t('data.folders.select_folder')"
            class="w-full !mb-0 mt-4"
            @change="v => (folderId = v)"
            @addFolder="addFolder"
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer flex items-center text-left">
        <div class="flex-grow" />
        <div>
          <button class="btn btn-default" @click="dialogVisible = false">
            {{ $t('common.cancel') }}
          </button>
          <button
            class="btn btn-primary"
            :disabled="loading"
            @click="putCiphersFolder(cipher)"
          >
            {{ $t('common.update') }}
          </button>
        </div>
      </div>
    </el-dialog>
    <AddEditFolder
      ref="addEditFolder"
      :organizations="organizations"
      @created-folder="handleCreatedFolder"
    />
  </div>
</template>

<script>
import InputSelectFolder from '../input/InputSelectFolder'
import { CipherRequest } from '../../jslib/src/models/request/cipherRequest'
import AddEditFolder from './AddEditFolder'

export default {
  components: {
    InputSelectFolder,
    AddEditFolder
  },

  props: {
    type: {
      type: String,
      default: 'Login'
    }
  },

  data () {
    return {
      cipher: {},
      folders: [],
      dialogVisible: false,
      loading: false,
      errors: {},
      ids: [],
      folderId: '',
      collections: [],
      organizations: [],
      ciphers: []
    }
  },

  methods: {
    async openDialog (data) {
      ;[this.folders, this.collections, this.organizations] = await Promise.all(
        [this.getFolders(), this.getCollections(), this.getOrganizations()]
      )
      this.collections = this.collections.filter(c =>
        this.isOwner(this.organizations, c)
      )
      this.dialogVisible = true
      this.ids = data
    },

    closeDialog () {
      this.dialogVisible = false
    },

    async putCiphersFolder () {
      try {
        this.loading = true
        const collection = this.collections.find(c => c.id === this.folderId)
        const personalKey = await this.$cryptoService.getEncKey()
        const promises = []

        // Get decrypted ciphers list
        this.ids.forEach(async id => {
          const encCipher = await this.$cipherService.get(id)
          const decCipher = await encCipher.decrypt()
          this.ciphers.push({ ...decCipher, id })
          promises.push(this.removeFromCollection(decCipher, personalKey))
        })

        // Remove from collection
        await Promise.all(promises)

        if (collection) {
          // Remove from current folder
          await this.$axios.$put('cystack_platform/pm/ciphers/move', {
            ids: this.ids,
            folderId: null
          })
          const orgKey = await this.$cryptoService.getOrgKey(
            collection.organizationId
          )
          this.ciphers.forEach(cipher => {
            promises.push(this.addToCollection(cipher, orgKey, collection))
          })
          await Promise.all(promises)
        } else {
          await this.$axios.$put('cystack_platform/pm/ciphers/move', {
            ids: this.ids,
            folderId: this.folderId
          })
          const now = new Date().toISOString()
          await Promise.all(
            this.ids.map(id =>
              (async () => {
                const encCipher = await this.$cipherService.get(id)
                const encCipherData = new CipherRequest(encCipher)
                await this.$cipherService.upsert([
                  {
                    ...encCipherData,
                    id,
                    revisionDate: now,
                    folderId: this.folderId,
                    collectionIds: []
                  }
                ])
              })()
            )
          )
        }
        this.$store.commit('UPDATE_SYNCED_CIPHERS')
        this.notify(
          this.$tc('data.notifications.move_success', this.ids.length),
          'success'
        )
        this.closeDialog()
        this.$emit('reset-selection')
      } catch (e) {
        if (e.response && e.response.data && e.response.data.code === '5000') {
          this.notify(this.$tc('errors.5000', 1), 'error')
        } else {
          this.notify(
            this.$tc('data.notifications.move_failed', this.ids.length),
            'warning'
          )
        }
      } finally {
        this.loading = false
      }
    },

    addFolder () {
      this.$refs.addEditFolder.openDialog({})
    },

    async handleCreatedFolder (folder) {
      this.folders.push(folder)
      this.cipher.folderId = folder.id
      this.folderId = folder.id
      this.$refs.inputSelectFolder.value = folder.id
    },

    async removeFromCollection (decCipher, personalKey) {
      if (decCipher.collectionIds && decCipher.collectionIds.length) {
        const { data } = await this.getEncCipherForRequest(decCipher, {
          noCheck: true,
          encKey: personalKey
        })
        try {
          await this.$axios.put(
            `cystack_platform/pm/sharing/${decCipher.organizationId}/folders/${decCipher.collectionIds[0]}/items`,
            { cipher: { ...data, id: decCipher.id } }
          )
          await this.upsertCipherLocal(decCipher, {
            ...data,
            collectionIds: [],
            organizationId: null
          })
        } catch (error) {}
      }
    },

    async addToCollection (cipher, orgKey, collection) {
      const { data } = await this.getEncCipherForRequest(cipher, {
        noCheck: true,
        encKey: orgKey
      })
      await this.$axios.$post(
        `cystack_platform/pm/sharing/${collection.organizationId}/folders/${collection.id}/items`,
        { cipher: { ...data, id: cipher.id } }
      )
      await this.upsertCipherLocal(cipher, {
        ...data,
        organizationId: collection.organizationId,
        collectionIds: [collection.id]
      })
    }
  }
}
</script>
