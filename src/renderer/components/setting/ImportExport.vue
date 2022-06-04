<template>
  <div v-loading="loading">
    <div id="import" class="text-head-5 font-semibold mb-4">
      {{ $t('data.importFile.import') }}
    </div>
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">{{ $t('data.importFile.import_items') }}</div>
            <div class="setting-description">
              {{ $t('data.importFile.import_items_desc') }}
            </div>
          </div>
          <div />
        </div>
        <div class="setting-section-body">
          <div class="form-group">
            <label for="">{{ $t('data.importFile.select_file') }}</label>
            <el-select
              v-model="format"
              filterable
            >
              <el-option-group
                label="Popular"
              >
                <el-option
                  v-for="item in cystackOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
                <el-option
                  v-for="item in featuredImportOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-option-group>
              <el-option-group
                label="Others"
              >
                <el-option
                  v-for="item in importOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-option-group>
            </el-select>
            <Instructions
              :format="format"
              :title="getFormatInstructionTitle"
              class="mt-5"
            />
          </div>
          <div class="form-group">
            <label for="">{{ $t('data.importFile.select_format') }}</label>
            <input
              type="file"
              class="form-control-file form-input mb-4"
              name="file"
              @change="handleFile"
            >

            <label>{{ $t('data.importFile.or_copy') }}</label>
            <el-input type="textarea" :rows="5" />
          </div>
          <div class="form-group">
            <button
              class="btn btn-primary"
              :disabled="disabledExport"
              @click="importData"
            >
              {{ $t('data.importFile.import') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="text-head-5 font-semibold mb-4">
      {{ $t('data.exportFile.export') }}
    </div>
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">
              {{ $t('data.exportFile.export') }}
            </div>
            <div class="setting-description">
              {{ $t('data.exportFile.export_items_desc') }}
            </div>
          </div>
          <div />
        </div>
        <div class="setting-section-body">
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
        </div>
        <ReConfirmMasterPassword ref="reConfirmMasterPassword" @done="exportData(selectedType)" />
      </div>
    </div>
  </div>
</template>

<script>
import * as papa from 'papaparse'
import orderBy from 'lodash/orderBy'
import Instructions from '../../components/import/Instructions'
import ReConfirmMasterPassword from '../../components/password/ReConfirmMasterPassword'
import { CipherType } from '../../jslib/src/enums'
import { Utils } from '../../jslib/src/misc/utils'
import { ErrorResponse } from '../../jslib/src/models/response'
import { CipherRequest, FolderRequest } from '../../jslib/src/models/request'
import { CollectionRequest } from '../../jslib/src/models/request/collectionRequest'
import { ImportCiphersRequest } from '../../jslib/src/models/request/importCiphersRequest'
import { ImportOrganizationCiphersRequest } from '../../jslib/src/models/request/importOrganizationCiphersRequest'
import { KvpRequest } from '../../jslib/src/models/request/kvpRequest'
import { CollectionWithId as CollectionExport } from '../../jslib/src/models/export/collectionWithId'
import { CipherWithIds as CipherExport } from '../../jslib/src/models/export/cipherWithIds'
import { FolderWithId as FolderExport } from '../../jslib/src/models/export/folderWithId'
import { Collection } from '../../jslib/src/models/domain/collection'
import { Cipher } from '../../jslib/src/models/domain'
import { BitwardenCsvImporter } from '../../services/bitwardenCsvImporter'
export default {
  components: {
    Instructions,
    ReConfirmMasterPassword
  },
  data () {
    return {
      selectedType: 'csv',
      exportFormats: ['csv', 'json'],
      format: 'cystackjson',
      file: null,
      fileContents: '',
      filter: null,
      loading: false
    }
  },
  asyncComputed: {
    ciphers: {
      async get () {
        // const deletedFilter = c => {
        //   return c.isDeleted === false
        // }
        const result = await this.$mySearchService.searchCiphers(this.searchText, [this.filter, null], null) || []
        // remove ciphers generated by authenticator
        // result = result.filter(cipher => [CipherType.Login, CipherType.SecureNote, CipherType.Card, CipherType.Identity].includes(cipher.type))
        return orderBy(result, [c => this.orderField === 'name' ? (c.name && c.name.toLowerCase()) : c.revisionDate], [this.orderDirection]) || []
      },
      watch: ['$store.state.syncedCiphersToggle', 'deleted', 'searchText', 'filter', 'orderField', 'orderDirection']
    },
    folders: {
      async get () {
        let folders = await this.$folderService.getAllDecrypted() || []
        folders = folders.filter(f => f.id)
        folders.forEach(f => {
          const ciphers = this.ciphers && (this.ciphers.filter(c => c.folderId === f.id) || [])
          f.ciphersCount = ciphers && ciphers.length
        })
        return folders
      },
      watch: ['searchText', 'orderField', 'orderDirection', 'ciphers']
    },
    collections: {
      async get () {
        let collections = await this.$collectionService.getAllDecrypted() || []
        collections = collections.filter(f => f.id)
        collections.forEach(f => {
          const ciphers = this.ciphers && (this.ciphers.filter(c => c.collectionIds.includes(f.id)) || [])
          f.ciphersCount = ciphers && ciphers.length
        })
        return collections
      },
      watch: ['searchText', 'orderField', 'orderDirection', 'ciphers']
    }
  },
  computed: {
    teamCiphers () {
      return this.ciphers.filter(c => c.organizationId)
    },
    personalCiphers () {
      return this.ciphers.filter(c => !this.teamCiphers.includes(c))
    },
    cystackOptions () {
      return [
        { name: 'CyStack (json)', id: 'cystackjson' },
        { name: 'CyStack (csv)', id: 'cystackcsv' }
      ]
    },
    featuredImportOptions () {
      return this.$importService.featuredImportOptions
    },
    importOptions () {
      const data = this.$importService.regularImportOptions || []
      return data.sort((a, b) => {
        if (a.name == null && b.name != null) {
          return -1
        }
        if (a.name != null && b.name == null) {
          return 1
        }
        if (a.name == null && b.name == null) {
          return 0
        }

        return a.name.localeCompare(b.name)
      })
    },
    getFormatInstructionTitle () {
      if (this.format == null) {
        return null
      }

      const results = this.featuredImportOptions
        .concat(this.importOptions)
        .concat(this.cystackOptions)
        .filter(o => o.id === this.format)
      if (results.length > 0) {
        return this.$t('data.importFile.instructions', { name: results[0].name })
      }
      return null
    },
    disabledExport () {
      return (!this.file && !this.fileContents) || this.loading
    },
    teamId () {
      return this.$route.params.teamId
    }
  },
  methods: {
    selectTypeExport (type) {
      this.selectedType = type
      this.$refs.reConfirmMasterPassword.openDialog()
    },
    async exportData (type) {
      const data = this.teamId ? await this.getOrganizationExport(this.teamId, type) : await this.getExport(type)
      this.downloadFile(data)
    },
    getOrganizationExport (organizationId, format) {
      if (format === 'encrypted_json') {
        return this.getOrganizationEncryptedExport(organizationId)
      } else {
        return this.getOrganizationDecryptedExport(organizationId, format)
      }
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

      ciphers = await this.$myCipherService.getAllDecrypted()
      // ciphers = ciphers.filter(c => c.organizationId === null)
      ciphers = ciphers.filter(c => c.deletedDate === null)
      // ciphers = ciphers.filter(cipher => [CipherType.Login, CipherType.SecureNote, CipherType.Card, CipherType.Identity].includes(cipher.type))
      if (format === 'csv') {
        const foldersMap = new Map()
        folders.forEach(f => {
          if (f.id != null) {
            foldersMap.set(f.id, f)
          }
        })

        const exportCiphers = []
        ciphers.forEach(c => {
          // only export logins and secure notes
          // if (c.type !== CipherType.Login && c.type !== CipherType.SecureNote) {
          //   return
          // }
          if (c.organizationId != null) {
            return
          }

          const cipher = {}
          cipher.folder = c.folderId != null && foldersMap.has(c.folderId)
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
      ciphers = await this.$myCipherService.getAll()
      // ciphers = ciphers.filter(c => c.organizationId === null)
      ciphers = ciphers.filter(c => c.deletedDate === null)
      // ciphers = ciphers.filter(cipher => [CipherType.Login, CipherType.SecureNote, CipherType.Card, CipherType.Identity].includes(cipher.type))
      const encKeyValidation = await this.$cryptoService.encrypt(Utils.newGuid())
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
    async getOrganizationEncryptedExport (organizationId) {
      let collections = []
      let ciphers = []

      collections = await this.$collectionService.getAll()
      collections = collections.filter(c => c.organizationId === organizationId)

      ciphers = await this.$myCipherService.getAll()
      ciphers = ciphers.filter(c => c.organizationId === organizationId)
      ciphers = ciphers.filter(c => c.deletedDate === null)
      ciphers = ciphers.filter(cipher => [CipherType.Login, CipherType.SecureNote, CipherType.Card, CipherType.Identity].includes(cipher.type))

      const jsonDoc = {
        encrypted: true,
        collections: [],
        items: []
      }

      collections.forEach(c => {
        const collection = new CollectionExport()
        collection.build(c)
        jsonDoc.collections.push(collection)
      })

      ciphers.forEach(c => {
        const cipher = new CipherExport()
        cipher.build(c)
        jsonDoc.items.push(cipher)
      })

      return JSON.stringify(jsonDoc, null, '  ')
    },
    async getOrganizationDecryptedExport (organizationId, format) {
      let collections = []
      let ciphers = []

      collections = await this.$collectionService.getAllDecrypted()
      collections = collections.filter(c => c.organizationId === organizationId)
      ciphers = await this.$myCipherService.getAllDecrypted()
      ciphers = ciphers.filter(c => c.organizationId === organizationId)
      ciphers = ciphers.filter(c => c.deletedDate === null)
      ciphers = ciphers.filter(cipher => [CipherType.Login, CipherType.SecureNote, CipherType.Card, CipherType.Identity].includes(cipher.type))

      if (format === 'csv') {
        const collectionsMap = new Map()
        collections.forEach(c => {
          collectionsMap.set(c.id, c)
        })

        const exportCiphers = []
        ciphers.forEach(c => {
          // only export logins and secure notes
          if (c.type !== CipherType.Login && c.type !== CipherType.SecureNote) {
            return
          }

          const cipher = {}
          cipher.collections = []
          if (c.collectionIds != null) {
            cipher.collections = c.collectionIds.filter(id => collectionsMap.has(id))
              .map(id => collectionsMap.get(id).name)
          }
          this.buildCommonCipher(cipher, c)
          exportCiphers.push(cipher)
        })

        return papa.unparse(exportCiphers)
      } else {
        const jsonDoc = {
          encrypted: false,
          collections: [],
          items: []
        }

        collections.forEach(c => {
          const collection = new CollectionExport()
          collection.build(c)
          jsonDoc.collections.push(collection)
        })

        ciphers.forEach(c => {
          const cipher = new CipherExport()
          cipher.build(c)
          jsonDoc.items.push(cipher)
        })
        return JSON.stringify(jsonDoc, null, '  ')
      }
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

          cipher.fields += ((f.name || '') + ': ' + f.value)
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
      case 7:
        cipher.type = 'crypto-wallet'
        break
      case 5:
        cipher.type = 'totp'
        break
      case 3:
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
        console.log(cardPayload)
        cipher.notes = JSON.stringify(cardPayload)
        break
      case 4:
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
        console.log(identityPayload)
        cipher.notes = JSON.stringify(identityPayload)
        break
      default:
        return
      }

      return cipher
    },
    getFileName (prefix = null, extension = 'csv') {
      const now = new Date()
      const dateString =
          now.getFullYear() + '' + this.padNumber(now.getMonth() + 1, 2) + '' + this.padNumber(now.getDate(), 2) +
          this.padNumber(now.getHours(), 2) + '' + this.padNumber(now.getMinutes(), 2) +
          this.padNumber(now.getSeconds(), 2)

      return 'cystack' + (prefix ? ('_' + prefix) : '') + '_export_' + dateString + '.' + extension
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
      const fileName = this.createFileName(this.teamId ? 'team' : null)
      this.$platformUtilsService.saveFile(window, csv, { type: 'text/plain' }, fileName)
    },
    handleFile (e) {
      if (e.target && e.target.files && e.target.files.length) {
        this.file = e.target.files[0]
      }
    },
    getFolderImportName (folderName, suffix = 1) {
      const newName = folderName + (suffix === 1 ? '' : ` (${suffix}) `)
      if (this.folders.some(folder => folder.name === newName)) {
        return this.getFolderImportName(folderName, suffix + 1)
      } else {
        return newName
      }
    },
    getCipherImportName (cipherName, cipherType, suffix = 1) {
      const newName = cipherName + (suffix === 1 ? '' : ` (${suffix}) `)
      if (this.ciphers.some(cipher => cipher.name === newName && cipher.type === cipherType)) {
        return this.getCipherImportName(cipherName, cipherType, suffix + 1)
      } else {
        return newName
      }
    },
    getCollectionImportName (collectionName, suffix = 1) {
      const newName = collectionName + (suffix === 1 ? '' : ` (${suffix}) `)
      if (this.collections.filter(c => c.organizationId === this.teamId).some(collection => collection.name === newName)) {
        return this.getCollectionImportName(collectionName, suffix + 1)
      } else {
        return newName
      }
    },
    async importData () {
      this.loading = true
      const format = this.cystackOptions.map(e => e.id).includes(this.format) ? this.format.replace('cystack', 'bitwarden') : this.format
      let importer = null
      if (format === 'bitwardencsv') {
        importer = new BitwardenCsvImporter()
        importer.organizationId = this.teamId
      } else {
        importer = this.$importService.getImporter(format, this.teamId)
      }
      let fileContents = this.fileContents
      if (this.file) {
        try {
          const content = await this.getFileContents(this.file)
          if (content != null) {
            fileContents = content
          }
        } catch { }
      }
      if (!fileContents) {
        this.notify(this.$t('data.notifications.select_appropriate_file'), 'warning')
        this.loading = false
        return
      }
      try {
        const importResult = await importer.parse(fileContents)
        if (importResult.success) {
          if (importResult.folders.length === 0 && importResult.ciphers.length === 0) {
            this.notify(this.$t('data.notifications.no_data'), 'warning')
            this.loading = false
            return
          } else if (importResult.ciphers.length > 0) {
            const halfway = Math.floor(importResult.ciphers.length / 2)
            const last = importResult.ciphers.length - 1

            if (this.badData(importResult.ciphers[0]) &&
                this.badData(importResult.ciphers[halfway]) &&
                this.badData(importResult.ciphers[last])) {
              this.notify(this.$t('data.notifications.incorrect_format'), 'warning')
              this.loading = false
              return
            }
          }
          const finalImportResult = importResult
          finalImportResult.ciphers = importResult.ciphers.map(cipher => {
            return {
              ...cipher
              // name: this.getCipherImportName(cipher.name, cipher.type)
            }
          })
          if (this.teamId) {
            finalImportResult.collections = importResult.collections.map(collection => {
              return {
                ...collection
                // name: this.getCollectionImportName(collection.name)
              }
            })
          } else {
            finalImportResult.folders = importResult.folders.map(folder => {
              return {
                ...folder
                // name: this.getFolderImportName(folder.name)
              }
            })
          }
          try {
            const importResult = await this.postImport(finalImportResult)
            this.notify(this.$t('data.notifications.import_success', { foldersCount: importResult.foldersCount, ciphersCount: importResult.ciphersCount }), 'success')
          } catch (error) {
            if (error.response && error.response.data) {
              const errorResponse = new ErrorResponse(error.response.data, 400)
              this.notify(this.handleServerError(errorResponse, importResult), 'warning')
              this.loading = false
              return
            }
            console.log(error)
            this.notify(this.$t('data.notifications.incorrect_format') + '..', 'warning')
          }
        } else {
          this.notify(this.$t('data.notifications.incorrect_format') + '...', 'warning')
        }
      } catch {
        this.notify(this.$t('data.notifications.import_failed'), 'warning')
      }
      this.loading = false
    },
    getFileContents (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsText(file, 'utf-8')
        reader.onload = evt => {
          if (this.format === 'lastpasscsv' && file.type === 'text/html') {
            const parser = new DOMParser()
            const doc = parser.parseFromString(evt.target.result, 'text/html')
            const pre = doc.querySelector('pre')
            if (pre != null) {
              resolve(pre.textContent)
              return
            }
            reject('Error')
            return
          }

          resolve(evt.target.result)
        }
        reader.onerror = () => {
          reject('Error')
        }
      })
    },
    badData (c) {
      return (c.name == null || c.name === '--') &&
          (c.type === CipherType.Login && c.login != null && Utils.isNullOrWhitespace(c.login.password))
    },
    async postImport (importResult) {
      let request = new ImportCiphersRequest()
      if (this.teamId) {
        request = new ImportOrganizationCiphersRequest()
        for (let i = 0; i < importResult.ciphers.length; i++) {
          importResult.ciphers[i].organizationId = this.teamId
          const type_ = importResult.ciphers[i].type
          if ([5, 6, 7].includes(importResult.ciphers[i].type)) {
            importResult.ciphers[i].type = 2
          }
          const c = await this.$cipherService.encrypt(importResult.ciphers[i])
          c.type = type_
          request.ciphers.push(new CipherRequest(c))
        }
        if (importResult.collections != null) {
          for (let i = 0; i < importResult.collections.length; i++) {
            importResult.collections[i].organizationId = this.teamId
            const model = importResult.collections[i]
            const key = await this.$cryptoService.getOrgKey(model.organizationId)
            if (key == null) {
              throw new Error('No key for this collection\'s organization.')
            }
            const collection = new Collection()
            collection.id = model.id
            collection.organizationId = model.organizationId
            collection.readOnly = model.readOnly
            collection.name = await this.$cryptoService.encrypt(model.name, key)
            // const f = await this.$collectionService.encrypt(importResult.collections[i])
            request.collections.push(new CollectionRequest(collection))
          }
        }
        if (importResult.collectionRelationships != null) {
          importResult.collectionRelationships.forEach(r =>
            request.collectionRelationships.push(new KvpRequest(r[0], r[1])))
        }
      } else {
        for (let i = 0; i < importResult.ciphers.length; i++) {
          const type_ = importResult.ciphers[i].type
          if ([5, 6, 7].includes(importResult.ciphers[i].type)) {
            importResult.ciphers[i].type = 2
          }
          const c = await this.$cipherService.encrypt(importResult.ciphers[i])
          c.type = type_
          request.ciphers.push(new CipherRequest(c))
        }
        if (importResult.folders != null) {
          for (let i = 0; i < importResult.folders.length; i++) {
            const f = await this.$folderService.encrypt(importResult.folders[i])
            request.folders.push(new FolderRequest(f))
          }
        }
        if (importResult.folderRelationships != null) {
          importResult.folderRelationships.forEach(r =>
            request.folderRelationships.push(new KvpRequest(r[0], r[1])))
        }
      }
      const folderRelationships = request.folderRelationships
      let folderImportResults = []
      const urlFolder = 'cystack_platform/pm/import/folders'
      let importedFolders = 0
      while (importedFolders < request.folders.length) {
        const folders = request.folders.slice(importedFolders, importedFolders + 1000)
        const importResult = await this.$axios.$post(urlFolder, { folders })
        folderImportResults = folderImportResults.concat(importResult.ids || [])
        importedFolders += 1000
      }
      request.ciphers = request.ciphers.map((cipher, index) => {
        const folderRelationship = folderRelationships.find(item => item.key === index)
        return {
          ...cipher,
          folderId: folderRelationship ? folderImportResults[folderRelationship.value] : null
        }
      })
      const urlCipher = 'cystack_platform/pm/import/ciphers'
      let importedCiphers = 0
      while (importedCiphers < request.ciphers.length) {
        const ciphers = request.ciphers.slice(importedCiphers, importedCiphers + 1000)
        await this.$axios.$post(urlCipher, { ciphers })
        importedCiphers += 1000
      }
      let importedCipherCount = request.ciphers.length
      if (this.currentPlan.alias === 'pm_free') {
        const currentPasswordCount = this.ciphers.filter(c => c.type === CipherType.Login && c.organizationId === null).length
        const importedPasswordCount = request.ciphers.filter(c => c.type === CipherType.Login).length
        const currentNoteCount = this.ciphers.filter(c => c.type === CipherType.SecureNote && c.organizationId === null).length
        const importedNoteCount = request.ciphers.filter(c => c.type === CipherType.SecureNote).length
        const currentCardCount = this.ciphers.filter(c => c.type === CipherType.Card && c.organizationId === null).length
        const importedCardCount = request.ciphers.filter(c => c.type === CipherType.Card).length
        const currentIdentityCount = this.ciphers.filter(c => c.type === CipherType.Identity && c.organizationId === null).length
        const importedIdentityCount = request.ciphers.filter(c => c.type === CipherType.Identity).length
        const currentCryptoCount = this.ciphers.filter(c => c.type === 7 && c.organizationId === null).length
        const importedCryptoCount = request.ciphers.filter(c => c.type === 7).length
        importedCipherCount = Math.min(importedPasswordCount, (100 - currentPasswordCount)) +
        Math.min((50 - currentNoteCount), importedNoteCount) +
        Math.min((5 - currentCardCount), importedCardCount) +
        Math.min((10 - currentIdentityCount), importedIdentityCount) +
        Math.min((5 - currentCryptoCount), importedCryptoCount)
      }
      return {
        ciphersCount: importedCipherCount,
        foldersCount: request.folders.length
      }
      // this.notify(this.$t('data.notifications.import_success'), 'success')
      // this.loading = false

      // const url = this.teamId ? `cystack_platform/pm/teams/${this.teamId}/import` : 'cystack_platform/pm/ciphers/import'
      // await this.$axios.$post(url, request)
      // this.$router.push(this.localeRoute({ name: 'vault' }))
    },
    handleServerError (errorResponse, importResult) {
      if (errorResponse.validationErrors == null) {
        return new Error(errorResponse.message)
      }

      let errorMessage = ''

      Object.entries(errorResponse.validationErrors).forEach(([key, value], index) => {
        let item
        let itemType
        const i = Number(key.match(/[0-9]+/)[0])

        switch (key.match(/^\w+/)[0]) {
        case 'Ciphers':
          item = importResult.ciphers[i]
          itemType = CipherType[item.type]
          break
        case 'Folders':
          item = importResult.folders[i]
          itemType = 'Folder'
          break
        case 'Collections':
          item = importResult.collections[i]
          itemType = 'Collection'
          break
        default:
          return
        }

        if (index > 0) {
          errorMessage += '\n\n'
        }

        if (itemType !== 'Folder' && itemType !== 'Collection') {
          errorMessage += '[' + (i + 1) + '] '
        }

        errorMessage += '[' + itemType + '] "' + item.name + '": ' + value
      })

      return errorMessage
    }
  }
}
</script>
