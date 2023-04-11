<template>
  <div class="setting-wrapper">
    <div class="setting-section">
      <div
        class="setting-section-header cursor-pointer"
        @click="collapsed = !collapsed"
      >
        <div class="text-head-5 font-semibold">
          {{ $t('data.exportFile.export_items') }}
        </div>
        <i v-if="!collapsed" class="el-icon-arrow-right" />
        <i v-else class="el-icon-arrow-down" />
      </div>
    </div>
    <div v-if="collapsed" class="setting-section">
      <div class="setting-description mb-2">
        {{ $t('data.exportFile.export_items_desc') }}
      </div>
      <div class="grid md:grid-cols-2 gap-4">
        <div v-for="(item, index) in exportFormats" :key="index">
          <div
            class="rounded bg-black-300 flex items-center px-4 py-1.5 cursor-pointer"
            @click="selectTypeExport(item)"
          >
            <img
              :size="30"
              :src="require(`~/assets/images/icons/files/${item}.svg`)"
              class="w-[40px] h-[40px] mr-3"
            >
            <div class="flex-grow uppercase">{{ item }}</div>
            <i class="fa fa-chevron-right text-black-600" />
          </div>
        </div>
      </div>
      <ReConfirmMasterPassword
        ref="reConfirmMasterPassword"
        @done="exportData(selectedType)"
      />
    </div>
  </div>
</template>

<script>
import * as papa from 'papaparse'
import ReConfirmMasterPassword from '../../components/password/ReConfirmMasterPassword'
import { CipherType } from '../../core/enums/cipherType'
import { Utils } from '../../jslib/src/misc/utils'
import { CipherWithIds as CipherExport } from '../../jslib/src/models/export/cipherWithIds'
import { FolderWithId as FolderExport } from '../../jslib/src/models/export/folderWithId'
export default {
  components: {
    ReConfirmMasterPassword
  },
  data () {
    return {
      selectedType: 'csv',
      exportFormats: ['csv', 'json'],
      collapsed: false
    }
  },
  methods: {
    selectTypeExport (type) {
      this.selectedType = type
      this.$refs.reConfirmMasterPassword.openDialog()
    },
    async exportData (type) {
      const data = await this.getExport(type)
      this.downloadFile(data)
    },
    getExport (format) {
      if (format === 'encrypted_json') {
        return this.getEncryptedExport()
      } else {
        return this.getDecryptedExport(format)
      }
    },
    async getDecryptedExport (format) {
      let folders = []
      let ciphers = []

      folders = await this.$folderService.getAllDecrypted()
      ciphers = await this.$cipherService.getAllDecrypted()

      // Don't export protected or deleted cipher
      ciphers = ciphers.filter(
        cipher => !this.isProtectedCipher(cipher) && cipher.deletedDate === null
      )

      if (format === 'csv') {
        const foldersMap = new Map()
        folders.forEach(f => {
          if (f.id != null) {
            foldersMap.set(f.id, f)
          }
        })

        const exportCiphers = []
        ciphers.forEach(c => {
          if (c.organizationId != null) {
            return
          }

          const cipher = {}
          cipher.folder =
            c.folderId != null && foldersMap.has(c.folderId)
              ? foldersMap.get(c.folderId).name
              : null
          cipher.favorite = c.favorite ? 1 : null
          this.buildCommonCipher(cipher, c)
          exportCiphers.push(cipher)
        })

        return papa.unparse(exportCiphers)
      } else {
        const jsonDoc = {
          encrypted: false,
          folders: [],
          items: []
        }

        folders.forEach(f => {
          if (f.id == null) {
            return
          }
          const folder = new FolderExport()
          folder.build(f)
          jsonDoc.folders.push(folder)
        })

        ciphers.forEach(c => {
          if (c.organizationId != null) {
            return
          }
          const cipher = new CipherExport()
          cipher.build(c)
          cipher.collectionIds = null
          jsonDoc.items.push(cipher)
        })

        return JSON.stringify(jsonDoc, null, '  ')
      }
    },
    async getEncryptedExport () {
      let folders = []
      let ciphers = []

      folders = await this.$folderService.getAll()
      ciphers = await this.$cipherService.getAll()
      ciphers = ciphers.filter(c => c.deletedDate === null)
      const encKeyValidation = await this.$cryptoService.encrypt(
        Utils.newGuid()
      )
      const jsonDoc = {
        encrypted: true,
        encKeyValidation_DO_NOT_EDIT: encKeyValidation.encryptedString,
        folders: [],
        items: []
      }

      folders.forEach(f => {
        if (f.id == null) {
          return
        }
        const folder = new FolderExport()
        folder.build(f)
        jsonDoc.folders.push(folder)
      })

      ciphers.forEach(c => {
        if (c.organizationId != null) {
          return
        }
        const cipher = new CipherExport()
        cipher.build(c)
        cipher.collectionIds = null
        jsonDoc.items.push(cipher)
      })

      return JSON.stringify(jsonDoc, null, '  ')
    },
    padNumber (num, width, padCharacter = '0') {
      const numString = num.toString()
      return numString.length >= width
        ? numString
        : new Array(width - numString.length + 1).join(padCharacter) + numString
    },
    buildCommonCipher (cipher, c) {
      cipher.type = null
      cipher.name = c.name
      cipher.notes = c.notes
      cipher.fields = null
      cipher.reprompt = c.reprompt
      // Login props
      cipher.login_uri = null
      cipher.login_username = null
      cipher.login_password = null
      cipher.login_totp = null

      if (c.fields) {
        c.fields.forEach(f => {
          if (!cipher.fields) {
            cipher.fields = ''
          } else {
            cipher.fields += '\n'
          }

          cipher.fields += (f.name || '') + ': ' + f.value
        })
      }

      switch (c.type) {
      case CipherType.Login:
        cipher.type = 'login'
        cipher.login_username = c.login.username
        cipher.login_password = c.login.password
        cipher.login_totp = c.login.totp

        if (c.login.uris) {
          cipher.login_uri = []
          c.login.uris.forEach(u => {
            cipher.login_uri.push(u.uri)
          })
        }
        break
      case CipherType.SecureNote:
        cipher.type = 'note'
        break
      case CipherType.Card:
        cipher.type = 'card'
        // eslint-disable-next-line no-case-declarations
        const cardPayload = {
          notes: c.notes
        }
        Object.getOwnPropertyNames(c.card).forEach(key => {
          if (key.startsWith('_')) {
            if (key !== '_subTitle') {
              cardPayload[key.slice(1)] = c.card[key]
            }
          } else {
            cardPayload[key] = c.card[key]
          }
        })
        cipher.notes = JSON.stringify(cardPayload)
        break
      case CipherType.Identity:
        cipher.type = 'identity'
        // eslint-disable-next-line no-case-declarations
        const identityPayload = {
          notes: c.notes
        }
        Object.getOwnPropertyNames(c.identity).forEach(key => {
          if (key.startsWith('_')) {
            if (key !== '_subTitle') {
              identityPayload[key.slice(1)] = c.identity[key]
            }
          } else {
            identityPayload[key] = c.identity[key]
          }
        })
        cipher.notes = JSON.stringify(identityPayload)
        break
      default:
        if (this.cipherMapping[c.type].csvTypeName) {
          cipher.type = this.cipherMapping[c.type].csvTypeName
        } else {
          return
        }
      }

      return cipher
    },
    getFileName (prefix = null, extension = 'csv') {
      const now = new Date()
      const dateString =
        now.getFullYear() +
        '' +
        this.padNumber(now.getMonth() + 1, 2) +
        '' +
        this.padNumber(now.getDate(), 2) +
        this.padNumber(now.getHours(), 2) +
        '' +
        this.padNumber(now.getMinutes(), 2) +
        this.padNumber(now.getSeconds(), 2)

      return (
        'locker' +
        (prefix ? '_' + prefix : '') +
        '_export_' +
        dateString +
        '.' +
        extension
      )
    },
    createFileName (prefix) {
      let extension = this.selectedType
      if (this.selectedType === 'encrypted_json') {
        if (prefix == null) {
          prefix = 'encrypted'
        } else {
          prefix = 'encrypted_' + prefix
        }
        extension = 'json'
      }
      return this.getFileName(prefix, extension)
    },
    downloadFile (csv) {
      const fileName = this.createFileName(null)
      this.$platformUtilsService.saveFile(
        window,
        csv,
        { type: 'text/plain' },
        fileName
      )
    }
  }
}
</script>
