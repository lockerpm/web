import { ImportResult } from '../../core/models/domain/importResult'

import { CardView } from '../../core/models/view/cardView'

import { CipherType } from '../../core/enums/cipherType'
import { Importer } from './importer'
import { BaseImporter } from './baseImporter'

export class EncryptrCsvImporter extends BaseImporter implements Importer {
  parse (data: string): Promise<ImportResult> {
    const result = new ImportResult()
    const results = this.parseCsv(data, true)
    if (results == null) {
      result.success = false
      return Promise.resolve(result)
    }
    // CS
    const existingKeys = [
      'Label',
      'Notes',
      'Text',
      'Username',
      'Password',
      'Site URL',
      'Name on card',
      'Card Number',
      'CVV',
      'Expiry',
      'Entry Type'
    ]

    results.forEach(value => {
      const cipher = this.initLoginCipher()
      cipher.name = this.getValueOrDefault(value.Label, '--')
      cipher.notes = this.getValueOrDefault(value.Notes)
      const text = this.getValueOrDefault(value.Text)
      if (!this.isNullOrWhitespace(text)) {
        if (this.isNullOrWhitespace(cipher.notes)) {
          cipher.notes = text
        } else {
          cipher.notes += '\n\n' + text
        }
      }

      const type = value['Entry Type']
      if (type === 'Password') {
        cipher.login.username = this.getValueOrDefault(value.Username)
        cipher.login.password = this.getValueOrDefault(value.Password)
        cipher.login.uris = this.makeUriArray(value['Site URL'])
      } else if (type === 'Credit Card') {
        cipher.type = CipherType.Card
        cipher.card = new CardView()
        cipher.card.cardholderName = this.getValueOrDefault(
          value['Name on card']
        )
        cipher.card.number = this.getValueOrDefault(value['Card Number'])
        cipher.card.brand = this.getCardBrand(cipher.card.number)
        cipher.card.code = this.getValueOrDefault(value.CVV)
        const expiry = this.getValueOrDefault(value.Expiry)
        if (!this.isNullOrWhitespace(expiry)) {
          const expParts = expiry.split('/')
          if (expParts.length > 1) {
            cipher.card.expMonth = parseInt(expParts[0], null).toString()
            cipher.card.expYear = (
              2000 + parseInt(expParts[1], null)
            ).toString()
          }
        }
      }

      // CS
      Object.keys(value)
        .filter(k => !existingKeys.includes(k))
        .forEach(k => {
          this.processKvp(cipher, k, value[k])
        })

      this.convertToNoteIfNeeded(cipher)
      this.cleanupCipher(cipher)
      result.ciphers.push(cipher)
    })

    result.success = true
    return Promise.resolve(result)
  }
}
