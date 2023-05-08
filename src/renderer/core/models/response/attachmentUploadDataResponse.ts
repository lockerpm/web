import { FileUploadType } from '../../../jslib/src/enums/fileUploadType'
import { BaseResponse } from '../../../jslib/src/models/response/baseResponse'
import { CipherResponse } from '../response/cipherResponse'

export class AttachmentUploadDataResponse extends BaseResponse {
  attachmentId: string;
  fileUploadType: FileUploadType;
  cipherResponse: CipherResponse | null;
  cipherMiniResponse: CipherResponse | null;
  url: string;
  constructor (response: any) {
    super(response)
    this.attachmentId = this.getResponseProperty('AttachmentId')
    this.fileUploadType = this.getResponseProperty('FileUploadType')
    const cipherResponse = this.getResponseProperty('CipherResponse')
    const cipherMiniResponse = this.getResponseProperty('CipherMiniResponse')
    this.cipherResponse = cipherResponse ? new CipherResponse(cipherResponse) : null
    this.cipherMiniResponse = cipherMiniResponse ? new CipherResponse(cipherMiniResponse) : null
    this.url = this.getResponseProperty('Url')
  }
}
