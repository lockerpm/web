import { CryptoAccountApi } from '../api/cryptoAccountApi'

export class CryptoAccountData {
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
  }
}
