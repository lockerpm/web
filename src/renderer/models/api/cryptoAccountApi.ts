import { BaseResponse } from '@/jslib/src/models/response/baseResponse'
import { LoginUriApi } from '~/jslib/src/models/api/loginUriApi'

export class CryptoAccountApi extends BaseResponse {
  uris: LoginUriApi[];
  username: string;
  password: string;
  phone: string;
  emailRecovery: string;

  constructor (data: any = null) {
    super(data)
    if (data == null) {
      return
    }
    this.username = this.getResponseProperty('Username')
    this.password = this.getResponseProperty('Password')
    this.phone = this.getResponseProperty('Phone')
    this.emailRecovery = this.getResponseProperty('EmailRecovery')
    const uris = this.getResponseProperty('Uris')
    if (uris != null) {
      this.uris = uris.map((u: any) => new LoginUriApi(u))
    }
  }
}
