import { ImportResult } from '../../core/models/domain/importResult'
import { BaseImporter } from './baseImporter'
import { Importer } from './importer'

export class SecureSafeCsvImporter extends BaseImporter implements Importer {
  parse (data: string): Promise<ImportResult> {
    const result = new ImportResult()
    const results = this.parseCsv(data, true)
    if (results == null) {
      result.success = false
      return Promise.resolve(result)
    }

    // CS
    const existingKeys = ['Title', 'Comment', 'Url', 'Password', 'Username']

    results.forEach(value => {
      const cipher = this.initLoginCipher()
      cipher.name = this.getValueOrDefault(value.Title)
      cipher.notes = this.getValueOrDefault(value.Comment)
      cipher.login.uris = this.makeUriArray(value.Url)
      cipher.login.password = this.getValueOrDefault(value.Password)
      cipher.login.username = this.getValueOrDefault(value.Username)

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
