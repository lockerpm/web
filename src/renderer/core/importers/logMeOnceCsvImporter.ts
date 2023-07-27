import { ImportResult } from '../../core/models/domain/importResult'
import { BaseImporter } from './baseImporter'
import { Importer } from './importer'

export class LogMeOnceCsvImporter extends BaseImporter implements Importer {
  parse (data: string): Promise<ImportResult> {
    const result = new ImportResult()
    const results = this.parseCsv(data, false)
    if (results == null) {
      result.success = false
      return Promise.resolve(result)
    }

    results.forEach(value => {
      if (value.length < 4) {
        return
      }
      const cipher = this.initLoginCipher()
      cipher.name = this.getValueOrDefault(value[0], '--')
      cipher.login.username = this.getValueOrDefault(value[2])
      cipher.login.password = this.getValueOrDefault(value[3])
      cipher.login.uris = this.makeUriArray(value[1])

      if (value.length > 4) {
        const notes = value.slice(4).join(' ')
        cipher.notes = this.getValueOrDefault(notes)
      }

      this.cleanupCipher(cipher)
      result.ciphers.push(cipher)
    })

    result.success = true
    return Promise.resolve(result)
  }
}
