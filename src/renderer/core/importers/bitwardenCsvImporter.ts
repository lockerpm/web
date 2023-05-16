import { BaseImporter } from '../../jslib/src/importers/baseImporter'
import { Importer } from '../../jslib/src/importers/importer'

import { ImportResult } from '../../jslib/src/models/domain/importResult'

import { CipherView } from '../../jslib/src/models/view/cipherView'
import { CollectionView } from '../../jslib/src/models/view/collectionView'
import { FieldView } from '../../jslib/src/models/view/fieldView'
import { LoginView } from '../../jslib/src/models/view/loginView'
import { CardView } from '../../jslib/src/models/view/cardView'
import { IdentityView } from '../../jslib/src/models/view/identityView'
import { SecureNoteView } from '../../jslib/src/models/view/secureNoteView'

import { CipherType } from '../../jslib/src/enums/cipherType'
import { FieldType } from '../../jslib/src/enums/fieldType'
import { SecureNoteType } from '../../jslib/src/enums/secureNoteType'
import { CipherMapper } from '../../constants'

export class BitwardenCsvImporter extends BaseImporter implements Importer {
  parse (data: string): Promise<ImportResult> {
    const result = new ImportResult()
    const results = this.parseCsv(data, true)
    if (results == null) {
      result.success = false
      return Promise.resolve(result)
    }

    results.forEach(value => {
      if (this.organization && !this.isNullOrWhitespace(value.collections)) {
        const collections = (value.collections as string).split(',')
        collections.forEach(col => {
          let addCollection = true
          let collectionIndex = result.collections.length

          for (let i = 0; i < result.collections.length; i++) {
            if (result.collections[i].name === col) {
              addCollection = false
              collectionIndex = i
              break
            }
          }

          if (addCollection) {
            const collection = new CollectionView()
            collection.name = col
            result.collections.push(collection)
          }

          result.collectionRelationships.push([
            result.ciphers.length,
            collectionIndex
          ])
        })
      } else if (!this.organization) {
        this.processFolder(result, value.folder)
      }

      const cipher = new CipherView()
      cipher.favorite = !!(
        !this.organization &&
        this.getValueOrDefault(value.favorite, '0') !== '0'
      )
      cipher.type = CipherType.Login
      cipher.notes = this.getValueOrDefault(value.notes)
      cipher.name = this.getValueOrDefault(value.name, '--')

      if (!this.isNullOrWhitespace(value.fields)) {
        const fields = this.splitNewLine(value.fields)
        for (let i = 0; i < fields.length; i++) {
          if (this.isNullOrWhitespace(fields[i])) {
            continue
          }

          const delimPosition = fields[i].lastIndexOf(': ')
          if (delimPosition === -1) {
            continue
          }

          if (cipher.fields == null) {
            cipher.fields = []
          }

          const field = new FieldView()
          field.name = fields[i].substr(0, delimPosition)
          field.value = null
          field.type = FieldType.Text
          if (fields[i].length > delimPosition + 2) {
            field.value = fields[i].substr(delimPosition + 2)
          }
          cipher.fields.push(field)
        }
      }

      const valueType = value.type != null ? value.type.toLowerCase() : null
      switch (valueType) {
      case 'note':
        cipher.type = CipherType.SecureNote
        cipher.secureNote = new SecureNoteView()
        cipher.secureNote.type = SecureNoteType.Generic
        break
      case 'identity':
        cipher.type = CipherType.Identity
        cipher.identity = new IdentityView()
        try {
          const parsedData = JSON.parse(cipher.notes)
          Object.keys(parsedData).forEach(key => {
            if (key === 'notes') {
              cipher.notes = parsedData.notes
            } else {
              cipher.identity[key] = parsedData[key]
            }
          })
        } catch (e) {
          // Do nothing
        }
        break
      case 'card':
        cipher.type = CipherType.Card
        cipher.card = new CardView()
        try {
          const parsedData = JSON.parse(cipher.notes)
          Object.keys(parsedData).forEach(key => {
            if (key === 'notes') {
              cipher.notes = parsedData.notes
            } else {
              cipher.card[key] = parsedData[key]
            }
          })
        } catch (e) {
          // Do nothing
        }
        break
      default: {
        // Check new type
        if (valueType) {
          const mappedType = Object.values(CipherMapper).find(
            m => m.csvTypeName === valueType
          )
          if (mappedType) {
            cipher.type = mappedType.type
            cipher.secureNote = new SecureNoteView()
            cipher.secureNote.type = SecureNoteType.Generic
            break
          }
        }

        // Else treated as Login
        cipher.type = CipherType.Login
        cipher.login = new LoginView()
        cipher.login.totp = this.getValueOrDefault(
          value.login_totp || value.totp
        )
        cipher.login.username = this.getValueOrDefault(
          value.login_username || value.username
        )
        cipher.login.password = this.getValueOrDefault(
          value.login_password || value.password
        )
        const uris = this.parseSingleRowCsv(value.login_uri || value.uri)
        cipher.login.uris = this.makeUriArray(uris)
        break
      }
      }

      result.ciphers.push(cipher)
    })

    result.success = true
    return Promise.resolve(result)
  }
}
