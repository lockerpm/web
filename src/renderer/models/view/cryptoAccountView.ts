
import { View } from '@/jslib/src/models/view'

import { CryptoAccount } from '../domain/cryptoAccount'

export class CryptoAccountView implements View {
  username: string = null;
  password: string = null;
  phone: string = null;
  emailRecovery: string = null;

  // eslint-disable-next-line no-useless-constructor
  constructor (_c?: CryptoAccount) {
    // ctor
  }

  get maskedPassword (): string {
    return this.password != null ? '••••••••' : null
  }

  get subTitle (): string {
    return this.username
  }
}
