import { ImportResult } from '../../core/models/domain/importResult'
import { CipherView } from '../../core/models/view/cipherView'
import { CipherType, SecureNoteType } from '../enums'
import {
  CardView,
  IdentityView,
  LoginView,
  SecureNoteView
} from '../models/view'
import { BaseImporter } from './baseImporter'
import { Importer } from './importer'

export class SplashIdCsvImporter extends BaseImporter implements Importer {
  // Static fields = category __ item_type __ name __ favourite __ sync
  // Format = STATIC_FIELDS __ VALUES | FIELDS_NAME | TYPE/true/false:MASKED | NOTES | TAGS | CREATED_TIME __ LAST_UPDATE

  parse (data: string): Promise<ImportResult> {
    const result = new ImportResult()
    const results = this.parseCsv(data, false)
    if (results == null) {
      result.success = false
      return Promise.resolve(result)
    }

    results.forEach(value => {
      if (value.length < 5) {
        return
      }

      this.processFolder(result, this.getValueOrDefault(value[0]))
      let parseResult: {
        cipher: CipherView
        existingKeys: string[]
      }
      const type = this.getValueOrDefault(value[1])
      const obj = this.parseValue(value)
      switch (type) {
      case 'Addresses': {
        parseResult = this.processAddress(obj)
        break
      }
      case 'Bank Accounts': {
        parseResult = this.processBankAccount(obj)
        break
      }
      case 'Credit Cards': {
        parseResult = this.processCreditCard(obj)
        break
      }
      case 'Email Accounts': {
        parseResult = this.processEmailAccount(obj)
        break
      }
      case 'Identification': {
        parseResult = this.processIdentification(obj)
        break
      }
      case 'Phone Numbers': {
        parseResult = this.processPhoneNumber(obj)
        break
      }
      case 'Servers': {
        parseResult = this.processServer(obj)
        break
      }
      case 'Web Logins': {
        parseResult = this.processWebLogin(obj)
        break
      }
      default:
        parseResult = {
          cipher: new CipherView(),
          existingKeys: []
        }
        parseResult.cipher.type = CipherType.SecureNote
        parseResult.cipher.secureNote = new SecureNoteView()
        parseResult.cipher.secureNote.type = SecureNoteType.Generic
      }

      const { cipher, existingKeys } = parseResult
      cipher.name = this.getValueOrDefault(value[2], '--')
      cipher.notes = obj.notes
      cipher.favorite = this.getValueOrDefault(value[3]) === 'true'
      this.processKvp(cipher, 'type', type)
      Object.keys(obj)
        .filter(k => ![...existingKeys, 'notes'].includes(k))
        .forEach(k => {
          this.processKvp(cipher, k, obj[k])
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

  // Address
  private processAddress (obj: { [key: string]: string }) {
    const existingKeys = [
      'Address',
      'Address 2',
      'City',
      'State',
      'Zip Code',
      'Country',
      'Email',
      'Phone'
    ]
    const cipher = new CipherView()
    cipher.type = CipherType.Identity
    cipher.identity = new IdentityView()
    cipher.identity.address1 = obj.Address
    cipher.identity.address2 = obj['Address 2']
    cipher.identity.city = obj.City
    cipher.identity.state = obj.State
    cipher.identity.postalCode = obj['Zip Code']
    cipher.identity.country = obj.Country
    cipher.identity.email = obj.Email
    cipher.identity.phone = obj.Phone
    return { cipher, existingKeys }
  }

  // Bank account
  private processBankAccount (obj: { [key: string]: string }) {
    const existingKeys = [
      // 'Description',
      'Account #',
      // 'PIN',
      'Name'
      // 'Branch',
      // 'Phone #'
    ]
    const cipher = new CipherView()
    cipher.type = CipherType.Card
    cipher.card = new CardView()
    cipher.card.number = obj['Account #']
    cipher.card.cardholderName = obj.Name
    return { cipher, existingKeys }
  }

  // Credit card
  private processCreditCard (obj: { [key: string]: string }) {
    const existingKeys = [
      // 'Description',
      'Card #',
      'Expir Date',
      'Name',
      'PIN'
      // 'Bank'
    ]
    const cipher = new CipherView()
    cipher.type = CipherType.Card
    cipher.card = new CardView()
    cipher.card.number = obj['Card #']
    cipher.card.brand = this.getCardBrand(cipher.card.number)
    cipher.card.cardholderName = obj.Name
    cipher.card.code = obj.PIN
    const [month, year] = this.getValueOrDefault(obj['Expir Date'], '/').split(
      '/'
    )
    cipher.card.expMonth = month
    cipher.card.expYear = year
    return { cipher, existingKeys }
  }

  // Email account
  private processEmailAccount (obj: { [key: string]: string }) {
    const existingKeys = [
      // 'Description',
      'Username',
      'Password'
      // 'POP3 Host',
      // 'SMTP Host'
    ]
    const cipher = new CipherView()
    cipher.type = CipherType.Login
    cipher.login = new LoginView()
    cipher.login.username = obj.Username
    cipher.login.password = obj.Password
    return { cipher, existingKeys }
  }

  // Identification
  private processIdentification (obj: { [key: string]: string }) {
    const existingKeys = [
      // 'Description',
      'Number',
      'Name'
      // 'Date'
    ]
    const cipher = new CipherView()
    cipher.type = CipherType.Identity
    cipher.identity = new IdentityView()
    cipher.identity.ssn = obj.Number
    cipher.identity.firstName = obj.Name
    return { cipher, existingKeys }
  }

  // Phone number
  private processPhoneNumber (obj: { [key: string]: string }) {
    const existingKeys = [
      // 'Description',
      'Phone #',
      'Name'
      // 'Date'
    ]
    const cipher = new CipherView()
    cipher.type = CipherType.Identity
    cipher.identity = new IdentityView()
    cipher.identity.phone = obj['Phone #']
    cipher.identity.firstName = obj.Name
    return { cipher, existingKeys }
  }

  // Server
  private processServer (obj: { [key: string]: string }) {
    const existingKeys = [
      // 'Description',
      'Username',
      'Password',
      'Address'
    ]
    const cipher = new CipherView()
    cipher.type = CipherType.Login
    cipher.login = new LoginView()
    cipher.login.username = obj.Username
    cipher.login.password = obj.Password
    cipher.login.uris = this.makeUriArray(obj.Address)
    return { cipher, existingKeys }
  }

  // Web logins
  private processWebLogin (obj: { [key: string]: string }) {
    const existingKeys = [
      // 'Description',
      'User ID',
      'Password',
      'URL'
    ]
    const cipher = new CipherView()
    cipher.type = CipherType.Login
    cipher.login = new LoginView()
    cipher.login.username = obj['User ID']
    cipher.login.password = obj.Password
    cipher.login.uris = this.makeUriArray(obj.URL)
    return { cipher, existingKeys }
  }

  // ------- Supporting functions -------

  private parseValue (value: string[]) {
    const [values, fields, fieldTypes, notes, tags] =
      this.splitArrayBySeparator(value.slice(5), '|')
    const res = {
      notes: (notes || []).join('\n'),
      tags: (tags || []).join(', ')
    }
    try {
      fields.forEach((f: string, index: number) => {
        let fieldName = f || fieldTypes[index].split(':')[0]
        while (res[fieldName] in res) {
          fieldName += ' 1'
        }
        res[fieldName] = values[index]
      })
    } catch (error) {
      return res
    }
    return res
  }

  private splitArrayBySeparator (arr: string[], separator: string) {
    const result = []
    let currentArray = []
    for (const item of arr) {
      if (item === separator) {
        result.push(currentArray)
        currentArray = []
      } else {
        currentArray.push(item)
      }
    }
    result.push(currentArray)
    return result
  }
}
