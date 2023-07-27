import { ImportResult } from '../../core/models/domain/importResult'
import { BaseImporter } from './baseImporter'
import { Importer } from './importer'

export class AvastCsvImporter extends BaseImporter implements Importer {
  parse (data: string): Promise<ImportResult> {
    const result = new ImportResult()
    const results = this.parseCsv(data, true)
    if (results == null) {
      result.success = false
      return Promise.resolve(result)
    }

    // CS
    const existingKeys = ['name', 'web', 'password', 'login']

    results.forEach(value => {
      const cipher = this.initLoginCipher()
      cipher.name = this.getValueOrDefault(value.name)
      cipher.login.uris = this.makeUriArray(value.web)
      cipher.login.password = this.getValueOrDefault(value.password)
      cipher.login.username = this.getValueOrDefault(value.login)

      // CS
      Object.keys(value)
        .filter(k => !existingKeys.includes(k))
        .forEach(k => {
          this.processKvp(cipher, k, value[k])
        })

      this.cleanupCipher(cipher)
      result.ciphers.push(cipher)
    })

    result.success = true
    return Promise.resolve(result)
  }
}
