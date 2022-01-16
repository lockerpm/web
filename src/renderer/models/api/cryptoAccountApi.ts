import { BaseResponse } from '@/jslib/src/models/response/baseResponse'

export class CryptoAccountApi extends BaseResponse {
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
  }
}
