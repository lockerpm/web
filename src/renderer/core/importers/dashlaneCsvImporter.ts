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
    // 'title',
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
      if (isSubset(this.idFields, fields)) {
        cipher = this.processId(value)
      } else if (isSubset(this.paymentFields, fields)) {
        cipher = this.processPayment(value)
      } else if (isSubset(this.personalInfoFields, fields)) {
        cipher = this.processPersonalInfo(value)
      } else if (isSubset(this.credentialFields, fields)) {
        cipher = this.processCredential(value)
      } else {
        cipher = this.processNote(value)
      }
      this.convertToNoteIfNeeded(cipher)
      this.cleanupCipher(cipher)
      result.ciphers.push(cipher)
    })

    result.success = true
    return Promise.resolve(result)
  }

  // ID
  private processId (obj: { [key: string]: string }) {
    let existingKeys = ['name', 'number', 'type']

    const cipher = new CipherView()
    cipher.name = this.getValueOrDefault(obj.name || obj.type)

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
      existingKeys = ['name', 'type']
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
    let existingKeys = [
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
      existingKeys = ['type']
    }

    Object.keys(obj)
      .filter(k => !existingKeys.includes(k))
      .forEach(k => {
        this.processKvp(cipher, k, obj[k])
      })
    return cipher
  }

  // Personal info
  private processPersonalInfo (obj: { [key: string]: string }) {
    let existingKeys = [
      'type',
      'item_name',
      'first_name',
      'last_name',
      'middle_name',
      'login',
      'email',
      'phone_number',
      'address',
      'country',
      'state',
      'city',
      'zip'
    ]

    const cipher = new CipherView()
    cipher.name = this.getValueOrDefault(obj.item_name)

    switch (obj.type) {
    case 'name':
    case 'email':
    case 'number':
    case 'address':
    case 'company': {
      cipher.type = CipherType.Identity
      cipher.identity = new IdentityView()
      cipher.identity.firstName = this.getValueOrDefault(obj.first_name)
      if (this.getValueOrDefault(obj.middle_name)) {
        cipher.identity.firstName +=
            ' ' + this.getValueOrDefault(obj.middle_name)
      }
      cipher.identity.lastName = this.getValueOrDefault(obj.last_name)
      cipher.identity.username = this.getValueOrDefault(obj.login)
      cipher.identity.email = this.getValueOrDefault(obj.email)
      cipher.identity.phone = this.getValueOrDefault(obj.phone_number)
      cipher.identity.address1 = this.getValueOrDefault(obj.address)
      cipher.identity.country = this.getValueOrDefault(obj.country)
      cipher.identity.state = this.getValueOrDefault(obj.state)
      cipher.identity.city = this.getValueOrDefault(obj.city)
      cipher.identity.postalCode = this.getValueOrDefault(obj.zip)
      if (obj.type === 'company') {
        cipher.identity.company = this.getValueOrDefault(obj.item_name)
      }
      if (cipher.identity.fullName) {
        cipher.name = cipher.identity.fullName
      }
      break
    }

    default:
      cipher.type = CipherType.SecureNote
      cipher.secureNote = new SecureNoteView()
      cipher.secureNote.type = SecureNoteType.Generic
      existingKeys = ['type']
    }

    Object.keys(obj)
      .filter(k => !existingKeys.includes(k))
      .forEach(k => {
        this.processKvp(cipher, k, obj[k])
      })
    return cipher
  }

  // Credential
  private processCredential (obj: { [key: string]: string }) {
    const existingKeys = [
      'title',
      'username',
      'password',
      'note',
      'url',
      'otpSecret'
    ]
    const cipher = new CipherView()
    cipher.type = CipherType.Login
    cipher.name = this.getValueOrDefault(obj.title || obj.username)
    cipher.login = new LoginView()
    cipher.login.username = this.getValueOrDefault(obj.username)
    cipher.login.password = this.getValueOrDefault(obj.password)
    cipher.notes = this.getValueOrDefault(obj.note)
    cipher.login.uris = this.makeUriArray(obj.url)
    cipher.login.totp = this.getValueOrDefault(obj.otpSecret)

    Object.keys(obj)
      .filter(k => !existingKeys.includes(k))
      .forEach(k => {
        this.processKvp(cipher, k, obj[k])
      })
    return cipher
  }

  // Note
  private processNote (obj: { [key: string]: string }) {
    const existingKeys = ['title', 'note', 'name']
    const cipher = new CipherView()
    cipher.type = CipherType.SecureNote
    cipher.name = this.getValueOrDefault(obj.name || obj.title)
    cipher.notes = this.getValueOrDefault(obj.note)
    cipher.secureNote = new SecureNoteView()
    cipher.secureNote.type = SecureNoteType.Generic
    Object.keys(obj)
      .filter(k => !existingKeys.includes(k))
      .forEach(k => {
        this.processKvp(cipher, k, obj[k])
      })
    return cipher
  }
}

function isSubset (a: string[], b: string[]) {
  const setB = new Set(b)
  return a.every(item => setB.has(item))
}
