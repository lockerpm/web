import { CryptoAccountApi } from '../api/cryptoAccountApi'
import { LoginUriData } from '~/jslib/src/models/data/loginUriData'

export class CryptoAccountData {
  uris: LoginUriData[];
  username: string;
  password: string;
  phone: string;
  emailRecovery: string;

  constructor (data?: CryptoAccountApi) {
    if (data == null) {
      return
    }

    this.username = data.username
    this.password = data.password
    this.phone = data.phone
    this.emailRecovery = data.emailRecovery
    if (data.uris) {
      this.uris = data.uris.map(u => new LoginUriData(u))
    }
  }
}
