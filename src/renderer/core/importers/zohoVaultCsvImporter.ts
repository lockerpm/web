import { ImportResult } from '../../jslib/src/models/domain/importResult'
import { CipherView } from '../../jslib/src/models/view'
import { BaseImporter } from './baseImporter'
import { Importer } from './importer'

export class ZohoVaultCsvImporter extends BaseImporter implements Importer {
  parse (data: string): Promise<ImportResult> {
    const result = new ImportResult()
    const results = this.parseCsv(data, true)
    if (results == null) {
      result.success = false
      return Promise.resolve(result)
    }

    // CS
    const existingKeys = ['ChamberName', 'Favorite', 'Notes', 'Password Name', 'Secret Name', 'Password URL', 'Secret URL', 'SecretData', 'CustomData']

    results.forEach(value => {
      if (this.isNullOrWhitespace(value['Password Name']) && this.isNullOrWhitespace(value['Secret Name'])) {
        return
      }
      this.processFolder(result, this.getValueOrDefault(value.ChamberName))
      const cipher = this.initLoginCipher()
      cipher.favorite = this.getValueOrDefault(value.Favorite, '0') === '1'
      cipher.notes = this.getValueOrDefault(value.Notes)
      cipher.name = this.getValueOrDefault(
        value['Password Name'], this.getValueOrDefault(value['Secret Name'], '--'))
      cipher.login.uris = this.makeUriArray(
        this.getValueOrDefault(value['Password URL'], this.getValueOrDefault(value['Secret URL'])))
      this.parseData(cipher, value.SecretData)
      this.parseData(cipher, value.CustomData)

      // CS
      Object.keys(value).filter(k => !existingKeys.includes(k)).forEach(k => {
        this.processKvp(cipher, k, value[k])
      })

      this.convertToNoteIfNeeded(cipher)
      this.cleanupCipher(cipher)
      result.ciphers.push(cipher)
    })

    if (this.organization) {
      this.moveFoldersToCollections(result)
    }

    result.success = true
    return Promise.resolve(result)
  }

  private parseData (cipher: CipherView, data: string) {
    if (this.isNullOrWhitespace(data)) {
      return
    }
    const dataLines = this.splitNewLine(data)
    dataLines.forEach(line => {
      const delimPosition = line.indexOf(':')
      if (delimPosition < 0) {
        return
      }
      const field = line.substring(0, delimPosition)
      const value = line.length > delimPosition ? line.substring(delimPosition + 1) : null
      if (this.isNullOrWhitespace(field) || this.isNullOrWhitespace(value) || field === 'SecretType') {
        return
      }
      const fieldLower = field.toLowerCase()
      if (cipher.login.username == null && this.usernameFieldNames.includes(fieldLower)) {
        cipher.login.username = value
      } else if (cipher.login.password == null && this.passwordFieldNames.includes(fieldLower)) {
        cipher.login.password = value
      } else {
        this.processKvp(cipher, field, value)
      }
    })
  }
}
