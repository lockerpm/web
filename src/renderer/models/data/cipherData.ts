import { CipherType } from '../../enums/cipherType'
import { CipherResponse } from '../response/cipherResponse'
import { CryptoAccountData } from './cryptoAccountData'
import { CipherRepromptType } from '~/jslib/src/enums/cipherRepromptType'

import { AttachmentData } from '~/jslib/src/models/data/attachmentData'
import { CardData } from '~/jslib/src/models/data/cardData'
import { FieldData } from '~/jslib/src/models/data/fieldData'
import { IdentityData } from '~/jslib/src/models/data/identityData'
import { LoginData } from '~/jslib/src/models/data/loginData'
import { PasswordHistoryData } from '~/jslib/src/models/data/passwordHistoryData'
import { SecureNoteData } from '~/jslib/src/models/data/secureNoteData'

export class CipherData {
  id: string;
  organizationId: string;
  folderId: string;
  userId: string;
  edit: boolean;
  viewPassword: boolean;
  organizationUseTotp: boolean;
  favorite: boolean;
  revisionDate: string;
  type: CipherType;
  sizeName: string;
  name: string;
  notes: string;
  login?: LoginData;
  cryptoAccount?: CryptoAccountData;
  secureNote?: SecureNoteData;
  card?: CardData;
  identity?: IdentityData;
  fields?: FieldData[];
  attachments?: AttachmentData[];
  passwordHistory?: PasswordHistoryData[];
  collectionIds?: string[];
  deletedDate: string;
  reprompt: CipherRepromptType;

  constructor (
    response?: CipherResponse,
    userId?: string,
    collectionIds?: string[]
  ) {
    if (response == null) {
      return
    }

    this.id = response.id
    this.organizationId = response.organizationId
    this.folderId = response.folderId
    this.userId = userId
    this.edit = response.edit
    this.viewPassword = response.viewPassword
    this.organizationUseTotp = response.organizationUseTotp
    this.favorite = response.favorite
    this.revisionDate = response.revisionDate
    this.type = response.type
    this.name = response.name
    this.notes = response.notes
    this.collectionIds =
      collectionIds != null ? collectionIds : response.collectionIds
    this.deletedDate = response.deletedDate
    this.reprompt = response.reprompt

    switch (this.type) {
    case CipherType.Login:
      this.login = new LoginData(response.login)
      break
    case CipherType.SecureNote:
      this.secureNote = new SecureNoteData(response.secureNote)
      break
    case CipherType.Card:
      this.card = new CardData(response.card)
      break
    case CipherType.Identity:
      this.identity = new IdentityData(response.identity)
      break
    case CipherType.CryptoAccount:
      this.cryptoAccount = new CryptoAccountData(response.cryptoAccount)
      break
    default:
      break
    }

    if (response.fields != null) {
      this.fields = response.fields.map(f => new FieldData(f))
    }
    if (response.attachments != null) {
      this.attachments = response.attachments.map(a => new AttachmentData(a))
    }
    if (response.passwordHistory != null) {
      this.passwordHistory = response.passwordHistory.map(
        ph => new PasswordHistoryData(ph)
      )
    }
  }
}
