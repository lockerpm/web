
import { SymmetricCryptoKey } from '@/jslib/src/models/domain/symmetricCryptoKey'
import Domain from '@/jslib/src/models/domain/domainBase'
import { EncString } from '@/jslib/src/models/domain/encString'
import { CryptoAccountData } from '../data/cryptoAccountData'

import { CryptoAccountView } from '../view/cryptoAccountView'

export class CryptoAccount extends Domain {
  username: EncString;
  password: EncString;
  phone: EncString;
  emailRecovery: EncString;

  constructor (obj?: CryptoAccountData, alreadyEncrypted: boolean = false) {
    super()
    if (obj == null) {
      return
    }
    this.buildDomainModel(
      this,
      obj,
      {
        username: null,
        password: null,
        phone: null,
        emailRecovery: null
      },
      alreadyEncrypted,
      []
    )
  }

  async decrypt (
    orgId: string,
    encKey?: SymmetricCryptoKey
  ): Promise<CryptoAccountView> {
    const view = await this.decryptObj(
      new CryptoAccountView(this),
      {
        username: null,
        password: null,
        phone: null,
        emailRecovery: null
      },
      orgId,
      encKey
    )

    return view
  }
}
