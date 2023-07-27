import { CryptoService } from '../../../core/abstractions/crypto.service'
import Domain from '../../../core/models/domain/domainBase'

import { Utils } from '../../../core/misc/utils'

import { SendData } from '../data/sendData'

import { SendView } from '../view/sendView'

import { EncString } from '../../../core/models/domain/encString'
import { Cipher } from './cipher'

export class Send extends Domain {
  id: string
  accessId: string
  creationDate: Date
  revisionDate: Date
  key: EncString
  password: string
  maxAccessCount?: number
  accessCount: number
  eachEmailAccessCount?: number
  expirationDate: Date
  disabled: boolean
  requireOtp: boolean
  cipherId: string
  cipher: Cipher
  emails: string[]

  obj: SendData

  constructor (obj?: SendData, alreadyEncrypted: boolean = false) {
    super()
    if (obj == null) {
      return
    }

    this.obj = obj

    this.buildDomainModel(
      this,
      obj,
      {
        id: null,
        userId: null,
        accessId: null,
        key: null,
        cipherId: null
      },
      alreadyEncrypted,
      ['id', 'userId', 'accessId', 'cipherId']
    )

    // @ts-ignore
    this.creationDate =
      obj.creationDate != null ? new Date(obj.creationDate) : null
    // @ts-ignore
    this.revisionDate =
      obj.revisionDate != null ? new Date(obj.revisionDate) : null
    this.password = obj.password
    this.maxAccessCount = obj.maxAccessCount
    this.accessCount = obj.accessCount
    this.eachEmailAccessCount = obj.eachEmailAccessCount
    // @ts-ignore
    this.expirationDate =
      obj.expirationDate != null ? new Date(obj.expirationDate) : null
    this.disabled = obj.disabled
    this.requireOtp = obj.requireOtp
    this.emails = obj.emails
  }

  async decrypt (): Promise<SendView> {
    const model = new SendView(this)

    let cryptoService: CryptoService
    const containerService = (Utils.global as any).lockerContainerService
    if (containerService) {
      cryptoService = containerService.getCryptoService()
    } else {
      throw new Error('global lockerContainerService not initialized.')
    }

    try {
      model.key = await cryptoService.decryptToBytes(this.key)
      model.cryptoKey = await cryptoService.makeSendKey(model.key)
    } catch (e) {
      // TODO: error?
    }

    const cipher = new Cipher(this.obj.cipher)
    const cipherView = await cipher.decrypt(model.cryptoKey)
    model.cipher = cipherView

    return model
  }
}
