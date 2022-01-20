
import { View, LoginUriView } from '@/jslib/src/models/view'

import { CryptoAccount } from '../domain/cryptoAccount'

export class CryptoAccountView implements View {
  username: string = null;
  password: string = null;
  phone: string = null;
  emailRecovery: string = null;
  uris: LoginUriView[] = null;

  // eslint-disable-next-line no-useless-constructor
  constructor (_c?: CryptoAccount) {
    // ctor
  }

  get uri (): string {
    return this.hasUris ? this.uris[0].uri : null
  }

  get hasUris (): boolean {
    return this.uris != null && this.uris.length > 0
  }

  get maskedPassword (): string {
    return this.password != null ? '••••••••' : null
  }

  get subTitle (): string {
    return this.username
  }

  get canLaunch (): boolean {
    return this.hasUris && this.uris.some(u => u.canLaunch)
  }

  get launchUri (): string {
    if (this.hasUris) {
      const uri = this.uris.find(u => u.canLaunch)
      if (uri != null) {
        return uri.launchUri
      }
    }
    return null
  }
}
