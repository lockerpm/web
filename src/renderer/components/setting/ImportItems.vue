<template>
  <div v-loading="loading" class="setting-wrapper">
    <div class="setting-section">
      <div
        class="setting-section-header cursor-pointer"
        @click="collapsed = !collapsed"
      >
        <div class="text-head-5 font-semibold">
          {{ $t('data.importFile.import_items') }}
        </div>
        <i v-if="collapsed" class="el-icon-arrow-right" />
        <i v-else class="el-icon-arrow-down" />
      </div>
    </div>
    <div v-if="!collapsed" class="setting-section">
      <div class="setting-description">
        {{ $t('data.importFile.import_items_desc') }}
      </div>
      <div id="import-format-select" class="form-group">
        <label for="">{{ $t('data.importFile.select_file') }}</label>
        <el-select
          v-model="format"
          filterable
          popper-class="import-dropdown"
          @visible-change="onImportFormatVisibleChange"
        >
          <el-option-group label="Popular">
            <el-option
              v-for="item in featuredImportOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-option-group>
          <el-option-group label="Others">
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
        <label for="import-file-select">{{
          $t('data.importFile.select_format')
        }}</label>
        <input
          id="import-file-select"
          ref="fileSelect"
          type="file"
          class="form-control-file form-input mb-4 hidden"
          name="file"
          @change="handleFile"
        >
        <div class="flex flex-wrap items-center mb-4">
          <el-button @click="$refs.fileSelect.click()">
            {{ $t('common.choose_file') }}
          </el-button>
          <p v-if="file" class="ml-2">
            {{ file.name }}
          </p>
        </div>

        <label>{{ $t('data.importFile.or_copy') }}</label>
        <el-input v-model="fileContents" type="textarea" :rows="5" />
      </div>
      <div class="form-group">
        <button
          id="import-confirm"
          class="btn btn-primary"
          :disabled="disabledImport"
          @click="importData"
        >
          {{ $t('data.importFile.import') }}
        </button>
      </div>
      <el-dialog
        :visible.sync="dialogVisible"
        class=""
        center
        :title="$t('data.importFile.upgrade_dialog_title')"
      >
        <span>
          {{
            $t('data.importFile.upgrade_dialog_message', {
              importedCount: importResult.ciphersCount,
              total: importResult.totalCipherImport
            })
          }}
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click="$router.push(localeRoute({ name: 'manage-plans' }))"
          >{{ $t('common.upgrade') }}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import orderBy from 'lodash/orderBy'
import Instructions from '../../components/import/Instructions'
import { CipherType } from '../../jslib/src/enums/cipherType'
import { Utils } from '../../jslib/src/misc/utils'
import { ErrorResponse } from '../../jslib/src/models/response'
import { FolderRequest } from '../../jslib/src/models/request'
import { CollectionRequest } from '../../jslib/src/models/request/collectionRequest'
import { ImportCiphersRequest } from '../../jslib/src/models/request/importCiphersRequest'
import { ImportOrganizationCiphersRequest } from '../../jslib/src/models/request/importOrganizationCiphersRequest'
import { KvpRequest } from '../../jslib/src/models/request/kvpRequest'
import { Collection } from '../../jslib/src/models/domain/collection'
export default {
  components: {
    Instructions
  },
  data () {
    return {
      format: 'lockerjson',
      file: null,
      fileContents: '',
      filter: null,
      loading: false,
      dialogVisible: false,
      importResult: {},
      collapsed: false
    }
  },
  asyncComputed: {
    ciphers: {
      async get () {
        let result =
          (await this.$searchService.searchCiphers(
            this.searchText,
            [this.filter, null],
            null
          )) || []
        result = result.filter(
          cipher => ![CipherType.MasterPassword].includes(cipher.type)
        )
        return (
          orderBy(
            result,
            [
              c =>
                this.orderField === 'name'
                  ? c.name && c.name.toLowerCase()
                  : c.revisionDate
            ],
            [this.orderDirection]
          ) || []
        )
      },
      watch: [
        '$store.state.syncedCiphersToggle',
        'deleted',
        'searchText',
        'filter',
        'orderField',
        'orderDirection'
      ]
    }
  },
  computed: {
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
        .filter(o => o.id === this.format)
      if (results.length > 0) {
        return this.$t('data.importFile.instructions', {
          name: results[0].name
        })
      }
      return null
    },
    disabledImport () {
      return (!this.file && !this.fileContents) || this.loading
    },
    teamId () {
      return this.$route.params.teamId
    }
  },
  methods: {
    padNumber (num, width, padCharacter = '0') {
      const numString = num.toString()
      return numString.length >= width
        ? numString
        : new Array(width - numString.length + 1).join(padCharacter) + numString
    },
    handleFile (e) {
      if (e.target && e.target.files && e.target.files.length) {
        this.file = e.target.files[0]
      }
    },
    async importData () {
      this.loading = true
      const importer = this.$importService.getImporter(this.format, this.teamId)
      let fileContents = this.fileContents
      if (this.file) {
        try {
          const content = await this.getFileContents(this.file)
          if (content != null) {
            fileContents = content
          }
        } catch {}
      }
      if (!fileContents) {
        this.notify(
          this.$t('data.notifications.select_appropriate_file'),
          'warning'
        )
        this.loading = false
        return
      }
      try {
        const importResult = await importer.parse(fileContents)
        if (importResult.success) {
          if (
            importResult.folders.length === 0 &&
            importResult.ciphers.length === 0
          ) {
            this.notify(this.$t('data.notifications.no_data'), 'warning')
            this.loading = false
            return
          } else if (importResult.ciphers.length > 0) {
            const halfway = Math.floor(importResult.ciphers.length / 2)
            const last = importResult.ciphers.length - 1

            if (
              this.badData(importResult.ciphers[0]) &&
              this.badData(importResult.ciphers[halfway]) &&
              this.badData(importResult.ciphers[last])
            ) {
              this.notify(
                this.$t('data.notifications.incorrect_format'),
                'warning'
              )
              this.loading = false
              return
            }
          }
          const finalImportResult = importResult
          finalImportResult.ciphers = importResult.ciphers.map(cipher => {
            return {
              ...cipher
            }
          })
          if (this.teamId) {
            finalImportResult.collections = importResult.collections.map(
              collection => {
                return {
                  ...collection
                }
              }
            )
          } else {
            finalImportResult.folders = importResult.folders.map(folder => {
              return {
                ...folder
              }
            })
          }
          try {
            const importResult = await this.postImport(finalImportResult)
            this.importResult = importResult
            this.notify(
              this.$t('data.notifications.import_success', {
                foldersCount: importResult.foldersCount,
                ciphersCount: importResult.ciphersCount,
                total: importResult.totalCipherImport
              }),
              'success'
            )
            if (
              !this.isPremiumFeaturesAvailable &&
              importResult.ciphersCount < importResult.totalCipherImport
            ) {
              this.dialogVisible = true
            }

            // Tutorial
            if (this.$store.state.tutorial.isActive) {
              this.markDoneStep('import_file')
            }
          } catch (error) {
            if (error.response && error.response.data) {
              const errorResponse = new ErrorResponse(error.response.data, 400)
              this.notify(
                this.handleServerError(errorResponse, importResult),
                'warning'
              )
              this.loading = false
              return
            }
            console.log(error)
            this.notify(
              this.$t('data.notifications.incorrect_format'),
              'warning'
            )
          }
        } else {
          this.notify(this.$t('data.notifications.incorrect_format'), 'warning')
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
            reject(Error('Error'))
            return
          }

          resolve(evt.target.result)
        }
        reader.onerror = () => {
          reject(Error('Error'))
        }
      })
    },
    badData (c) {
      return (
        (c.name == null || c.name === '--') &&
        c.type === CipherType.Login &&
        c.login != null &&
        Utils.isNullOrWhitespace(c.login.password)
      )
    },
    async postImport (importResult) {
      let request = new ImportCiphersRequest()
      if (this.teamId) {
        request = new ImportOrganizationCiphersRequest()
        for (let i = 0; i < importResult.ciphers.length; i++) {
          importResult.ciphers[i].organizationId = this.teamId
          const { data } = await this.getEncCipherForRequest(
            importResult.ciphers[i],
            {
              noCheck: true
            }
          )
          request.ciphers.push(data)
        }
        if (importResult.collections != null) {
          for (let i = 0; i < importResult.collections.length; i++) {
            importResult.collections[i].organizationId = this.teamId
            const model = importResult.collections[i]
            const key = await this.$cryptoService.getOrgKey(
              model.organizationId
            )
            if (key == null) {
              throw new Error("No key for this collection's organization.")
            }
            const collection = new Collection()
            collection.id = model.id
            collection.organizationId = model.organizationId
            collection.readOnly = model.readOnly
            collection.name = await this.$cryptoService.encrypt(model.name, key)
            request.collections.push(new CollectionRequest(collection))
          }
        }
        if (importResult.collectionRelationships != null) {
          importResult.collectionRelationships.forEach(r =>
            request.collectionRelationships.push(new KvpRequest(r[0], r[1]))
          )
        }
      } else {
        for (let i = 0; i < importResult.ciphers.length; i++) {
          const { data } = await this.getEncCipherForRequest(
            importResult.ciphers[i],
            {
              noCheck: true
            }
          )
          request.ciphers.push(data)
        }
        if (importResult.folders != null) {
          for (let i = 0; i < importResult.folders.length; i++) {
            const f = await this.$folderService.encrypt(importResult.folders[i])
            request.folders.push(new FolderRequest(f))
          }
        }
        if (importResult.folderRelationships != null) {
          importResult.folderRelationships.forEach(r =>
            request.folderRelationships.push(new KvpRequest(r[0], r[1]))
          )
        }
      }
      const folderRelationships = request.folderRelationships
      let folderImportResults = []
      const urlFolder = 'cystack_platform/pm/import/folders'
      let importedFolders = 0
      while (importedFolders < request.folders.length) {
        const folders = request.folders.slice(
          importedFolders,
          importedFolders + 1000
        )
        const importResult = await this.$axios.$post(urlFolder, { folders })
        folderImportResults = folderImportResults.concat(importResult.ids || [])
        importedFolders += 1000
      }
      request.ciphers = request.ciphers.map((cipher, index) => {
        const folderRelationship = folderRelationships.find(
          item => item.key === index
        )
        return {
          ...cipher,
          folderId: folderRelationship
            ? folderImportResults[folderRelationship.value]
            : null
        }
      })
      const urlCipher = 'cystack_platform/pm/import/ciphers'
      let importedCiphers = 0
      while (importedCiphers < request.ciphers.length) {
        const ciphers = request.ciphers.slice(
          importedCiphers,
          importedCiphers + 1000
        )
        await this.$axios.$post(urlCipher, { ciphers })
        importedCiphers += 1000
      }
      let importedCipherCount = request.ciphers.length
      if (!this.isPremiumFeaturesAvailable) {
        importedCipherCount = Object.values(this.cipherMapping)
          .filter(m => !!m.freeLimit)
          .reduce((total, m) => {
            const currentCount = this.ciphers.filter(
              c => c.type === m.type && c.organizationId === null
            ).length
            const importedCount = request.ciphers.filter(
              c => c.type === m.type
            ).length
            return (
              total +
              Math.min(importedCount, Math.max(m.freeLimit - currentCount, 0))
            )
          }, 0)
      }
      return {
        ciphersCount: importedCipherCount,
        foldersCount: request.folders.length,
        totalCipherImport: request.ciphers.length
      }
    },
    handleServerError (errorResponse, importResult) {
      if (errorResponse.validationErrors == null) {
        return new Error(errorResponse.message)
      }

      let errorMessage = ''

      Object.entries(errorResponse.validationErrors).forEach(
        ([key, value], index) => {
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
        }
      )

      return errorMessage
    },

    // Tutorial
    onImportFormatVisibleChange (isVisible) {
      if (!isVisible && this.$store.state.tutorial.isActive) {
        this.$tutorial.next()
      }
    }
  }
}
</script>
