<template>
  <div>
    <div class="setting-wrapper">
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">Import Items</div>
            <div class="setting-description">Transfer passwords and other items from browser or files.</div>
          </div>
          <div />
        </div>
        <div class="setting-section-body">
          <div class="form-group">
            <label for="">1. Select the format of the import file</label>
            <el-select v-model="format">
              <el-option-group
                label="Popular"
              >
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
            <Instructions :format="format"
                          :title="getFormatInstructionTitle"
                          class="mt-5"
            />
          </div>
          <div class="form-group">
            <label for="">2. Select the format of the import file</label>
            <input type="file" class="form-control-file form-input mb-4"
                   name="file" @change="handleFile"
            >

            <label>or copy/paste the import file contents</label>
            <el-input type="textarea" :rows="5" />
          </div>
          <div class="form-group">
            <button class="btn btn-primary"
                    :disabled="disabledExport"
                    @click="importData"
            >
              Import
            </button>
          </div>
        </div>
      </div>
      <div class="setting-section">
        <div class="setting-section-header">
          <div>
            <div class="setting-title">
              Export Items
            </div>
            <div class="setting-description">
              Enter your master password to export your vault data.
            </div>
          </div>
          <div />
        </div>
        <div class="setting-section-body">
          <div class="grid md:grid-cols-2 gap-4">
            <div v-for="(item, index) in exportFormats" :key="index">
              <div class="rounded bg-black-300 flex items-center px-4 py-1.5 cursor-pointer"
                   @click="selectTypeExport(item)"
              >
                <img :size="30" :src="require(`~/assets/images/icons/files/${item}.svg`)"
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
import Instructions from '../../components/import/Instructions'
import ReConfirmMasterPassword from '../../components/password/ReConfirmMasterPassword'
import { CipherType } from '../../jslib/src/enums'
import { Utils } from '../../jslib/src/misc/utils'
import { ErrorResponse } from '../../jslib/src/models/response'
import { CipherRequest, FolderRequest } from '../../jslib/src/models/request'
import { ImportCiphersRequest } from '../../jslib/src/models/request/importCiphersRequest'
import { KvpRequest } from '../../jslib/src/models/request/kvpRequest'
export default {
  components: {
    Instructions,
    ReConfirmMasterPassword
  },
  data () {
    return {
      selectedType: 'csv',
      exportFormats: ['csv', 'json', 'encrypted_json'],
      format: 'bitwardenjson',
      file: null,
      fileContents: ''
    }
  },
  computed: {
    featuredImportOptions () {
      return this.$importService.featuredImportOptions
    },
    importOptions () {
      return this.$importService.regularImportOptions
    },
    getFormatInstructionTitle () {
      if (this.format == null) {
        return null
      }

      const results = this.featuredImportOptions.concat(this.importOptions).filter(o => o.id === this.format)
      if (results.length > 0) {
        return this.$t('data.importFile.instructions', { name: results[0].name })
      }
      return null
    },
    disabledExport () {
      return (!this.file && !this.fileContents) || this.loading
    }
  },
  methods: {
    selectTypeExport (type) {
      this.selectedType = type
      this.$refs.reConfirmMasterPassword.openDialog()
    },
    async exportData (type) {
      const data = await this.$exportService.getExport(type)
      this.downloadFile('\uFEFF' + data)
    },
    padNumber (num, width, padCharacter = '0') {
      const numString = num.toString()
      return numString.length >= width
        ? numString
        : new Array(width - numString.length + 1).join(padCharacter) + numString
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
      const fileName = this.createFileName()
      this.$platformUtilsService.saveFile(window, csv, { type: 'text/plain' }, fileName)
    },
    handleFile (e) {
      if (e.target && e.target.files && e.target.files.length) {
        this.file = e.target.files[0]
      }
    },
    async importData () {
      this.loading = true
      const importer = this.$importService.getImporter(this.format, null)
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
        this.notify('Vui lòng chọn File phù hợp', 'warning')
        this.loading = false
        return
      }

      try {
        const importResult = await importer.parse(fileContents)
        if (importResult.success) {
          if (importResult.folders.length === 0 && importResult.ciphers.length === 0) {
            this.notify('Không có dữ liệu', 'warning')
            return
          } else if (importResult.ciphers.length > 0) {
            const halfway = Math.floor(importResult.ciphers.length / 2)
            const last = importResult.ciphers.length - 1

            if (this.badData(importResult.ciphers[0]) &&
                this.badData(importResult.ciphers[halfway]) &&
                this.badData(importResult.ciphers[last])) {
              this.notify('Dữ liệu không đúng định dạng', 'warning')
              return
            }
          }
          try {
            await this.postImport(importResult)
          } catch (error) {
            if (error.response && error.response.data) {
              const errorResponse = new ErrorResponse(error.response.data, 400)
              this.notify(this.handleServerError(errorResponse, importResult), 'warning')
              return
            }
            this.notify('Dữ liệu không đúng định dạng', 'warning')
          }
        } else {
          this.notify('Dữ liệu không đúng định dạng', 'warning')
        }
      } catch {
        this.notify('Nhập dữ liệu thất bại', 'warning')
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
      const request = new ImportCiphersRequest()
      for (let i = 0; i < importResult.ciphers.length; i++) {
        const c = await this.$cipherService.encrypt(importResult.ciphers[i])
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
      await this.$axios.$post('cystack_platform/pm/ciphers/import', request)
      this.notify('Nhập dữ liệu thành công', 'success')
      this.getSyncData()
      this.$router.push(this.localeRoute({ name: 'vault' }))
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
