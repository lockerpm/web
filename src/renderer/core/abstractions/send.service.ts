import { Send } from '../models/domain/send'
import { SymmetricCryptoKey } from '../../jslib/src/models/domain/symmetricCryptoKey'

import { SendView } from '../models/view/sendView'
import { SendData } from '../models/data/sendData'
import { SendData as OldSendData } from '../../jslib/src/models/data/sendData'

export abstract class SendService {
  decryptedSendCache: SendView[]

  clearCache: () => void
  encrypt: (
    model: SendView,
    password: string,
    key?: SymmetricCryptoKey
  ) => Promise<Send>

  get: (id: string) => Promise<Send>
  getAll: () => Promise<Send[]>
  getAllDecrypted: () => Promise<SendView[]>
  upsert: (
    send: SendData | SendData[] | OldSendData | OldSendData[]
  ) => Promise<any>

  replace: (sends: { [id: string]: SendData }) => Promise<any>
  clear: (userId: string) => Promise<any>
  delete: (id: string | string[]) => Promise<any>
}
