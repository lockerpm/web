import { BaseImporter } from '../../core/importers/baseImporter'
import { Importer } from '../../core/importers/importer'

import { ImportResult } from '../../core/models/domain/importResult'

import { CipherView } from '../../core/models/view/cipherView'
import { LoginView } from '../../core/models/view/loginView'
import { CardView } from '../../core/models/view/cardView'
import { IdentityView } from '../../core/models/view/identityView'
import { SecureNoteView } from '../../core/models/view/secureNoteView'

import { CipherType } from '../../core/enums/cipherType'
import { SecureNoteType } from '../../core/enums/secureNoteType'

export class DashlaneCsvImporter extends BaseImporter implements Importer {
  // Id card -> convert to note
  protected idFields = [
    'type',
    'number',
    'name',
    'issue_date',
    'expiration_date',
    'place_of_issue',
    'state'
  ]

  // Convert to card
  protected paymentFields = [
    'type',
    'account_name',
    // 'account_holder',
    'cc_number',
    'code',
    'expiration_month',
    'expiration_year'
    // 'routing_number'
    // 'account_number'
    // 'country',
    // 'issuing_bank',
    // 'note'
  ]

  protected noteFields = ['title', 'note']

  protected personalInfoFields = [
    // 'type',
    'title',
    'first_name',
    // 'middle_name',
    'last_name',
    // 'login',
    // 'date_of_birth',
    // 'place_of_birth',
    'email',
    // 'email_type',
    // 'item_name',
    'phone_number',
    'address',
    'country',
    'state',
    'city',
    'zip'
    // 'address_recipient',
    // 'address_building',
    // 'address_apartment',
    // 'address_floor',
    // 'address_door_code',
    // 'job_title',
    // 'url'
  ]

  protected credentialFields = [
    'username',
    // 'username2',
    // 'username3',
    'title',
    'password',
    // 'note',
    'url'
    // 'category',
    // 'otpSecret'
  ]

  parse (data: string): Promise<ImportResult> {
    const result = new ImportResult()
    const results = this.parseCsv(data, true)
    if (results == null) {
      result.success = false
      return Promise.resolve(result)
    }

    results.forEach(value => {
      let cipher: CipherView
      const fields = Object.keys(value)
      if (isSubset(fields, this.idFields)) {
        cipher = this.processId(value)
      } else if (isSubset(fields, this.paymentFields)) {
        cipher = this.processPayment(value)
      } else {
        cipher = this.processNote(value)
      }
      this.convertToNoteIfNeeded(cipher)
      this.cleanupCipher(cipher)
      result.ciphers.push(cipher)
    })

    result.success = false
    console.log(result)

    // result.success = true
    return Promise.resolve(result)
  }

  // ID
  private processId (obj: { [key: string]: string }) {
    const existingKeys = ['name', 'number', 'type']

    const cipher = new CipherView()
    cipher.name = this.getValueOrDefault(obj.name)

    switch (obj.type) {
    case 'passport': {
      cipher.type = CipherType.Identity
      cipher.identity = new IdentityView()
      cipher.identity.passportNumber = this.getValueOrDefault(obj.number)
      break
    }

    case 'license': {
      cipher.type = CipherType.Identity
      cipher.identity = new IdentityView()
      cipher.identity.licenseNumber = this.getValueOrDefault(obj.number)
      break
    }

    case 'social_security': {
      cipher.type = CipherType.Identity
      cipher.identity = new IdentityView()
      cipher.identity.ssn = this.getValueOrDefault(obj.number)
      break
    }

    default:
      cipher.type = CipherType.SecureNote
      cipher.secureNote = new SecureNoteView()
      cipher.secureNote.type = SecureNoteType.Generic
    }

    Object.keys(obj)
      .filter(k => !existingKeys.includes(k))
      .forEach(k => {
        this.processKvp(cipher, k, obj[k])
      })
    return cipher
  }

  // Payment
  private processPayment (obj: { [key: string]: string }) {
    const existingKeys = [
      'type',
      'account_name',
      'cc_number',
      'expiration_month',
      'expiration_year'
    ]

    const cipher = new CipherView()
    cipher.name = this.getValueOrDefault(obj.account_name)
    cipher.notes = this.getValueOrDefault(obj.note)

    switch (obj.type) {
    case 'payment_card': {
      cipher.type = CipherType.Card
      cipher.card = new CardView()
      cipher.card.number = this.getValueOrDefault(obj.cc_number)
      cipher.card.brand = this.getCardBrand(cipher.card.number)
      cipher.card.cardholderName = this.getValueOrDefault(obj.account_name)
      cipher.card.code = this.getValueOrDefault(obj.code)
      cipher.card.expMonth = this.getValueOrDefault(obj.expiration_month)
      cipher.card.expYear = this.getValueOrDefault(obj.expiration_year)
      if (!this.isNullOrWhitespace(cipher.card.brand)) {
        if (this.isNullOrWhitespace(cipher.name)) {
          cipher.name = cipher.card.brand
        } else {
          cipher.name += ' - ' + cipher.card.brand
        }
      }
      break
    }

    default:
      cipher.type = CipherType.SecureNote
      cipher.secureNote = new SecureNoteView()
      cipher.secureNote.type = SecureNoteType.Generic
    }

    Object.keys(obj)
      .filter(k => !existingKeys.includes(k))
      .forEach(k => {
        this.processKvp(cipher, k, obj[k])
      })
    return cipher
  }

  // Note
  private processNote (obj: { [key: string]: string }) {
    const cipher = new CipherView()
    cipher.type = CipherType.SecureNote
    cipher.name = this.getValueOrDefault(obj.name || obj.title)
    cipher.secureNote = new SecureNoteView()
    cipher.secureNote.type = SecureNoteType.Generic
    Object.keys(obj).forEach(k => {
      this.processKvp(cipher, k, obj[k])
    })
    return cipher
  }
}

function isSubset (a: string[], b: string[]) {
  const setB = new Set(b)
  return a.every(item => setB.has(item))
}
