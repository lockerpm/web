import { DeviceType } from '../../core/enums/deviceType'
import { PolicyType } from '../../core/enums/policyType'

import { ApiService as ApiServiceAbstraction } from '../../core/abstractions/api.service'
import { PlatformUtilsService } from '../../core/abstractions/platformUtils.service'
import { TokenService } from '../../core/abstractions/token.service'

import { EnvironmentUrls } from '../../core/models/domain/environmentUrls'

import { AttachmentRequest } from '../../core/models/request/attachmentRequest'
import { BitPayInvoiceRequest } from '../../core/models/request/bitPayInvoiceRequest'
import { CipherBulkDeleteRequest } from '../../core/models/request/cipherBulkDeleteRequest'
import { CipherBulkMoveRequest } from '../../core/models/request/cipherBulkMoveRequest'
import { CipherBulkShareRequest } from '../../core/models/request/cipherBulkShareRequest'
import { CipherCollectionsRequest } from '../../core/models/request/cipherCollectionsRequest'
import { CipherCreateRequest } from '../../core/models/request/cipherCreateRequest'
import { CipherRequest } from '../../core/models/request/cipherRequest'
import { CipherShareRequest } from '../../core/models/request/cipherShareRequest'
import { CollectionRequest } from '../../core/models/request/collectionRequest'
import { DeleteRecoverRequest } from '../../core/models/request/deleteRecoverRequest'
import { EmailRequest } from '../../core/models/request/emailRequest'
import { EmailTokenRequest } from '../../core/models/request/emailTokenRequest'
import { EmergencyAccessAcceptRequest } from '../../core/models/request/emergencyAccessAcceptRequest'
import { EmergencyAccessConfirmRequest } from '../../core/models/request/emergencyAccessConfirmRequest'
import { EmergencyAccessInviteRequest } from '../../core/models/request/emergencyAccessInviteRequest'
import { EmergencyAccessPasswordRequest } from '../../core/models/request/emergencyAccessPasswordRequest'
import { EmergencyAccessUpdateRequest } from '../../core/models/request/emergencyAccessUpdateRequest'
import { EventRequest } from '../../core/models/request/eventRequest'
import { FolderRequest } from '../../core/models/request/folderRequest'
import { GroupRequest } from '../../core/models/request/groupRequest'
import { IapCheckRequest } from '../../core/models/request/iapCheckRequest'
import { ImportCiphersRequest } from '../../core/models/request/importCiphersRequest'
import { ImportDirectoryRequest } from '../../core/models/request/importDirectoryRequest'
import { ImportOrganizationCiphersRequest } from '../../core/models/request/importOrganizationCiphersRequest'
import { KdfRequest } from '../../core/models/request/kdfRequest'
import { KeysRequest } from '../../core/models/request/keysRequest'
import { OrganizationCreateRequest } from '../../core/models/request/organizationCreateRequest'
import { OrganizationTaxInfoUpdateRequest } from '../../core/models/request/organizationTaxInfoUpdateRequest'
import { OrganizationUpdateRequest } from '../../core/models/request/organizationUpdateRequest'
import { OrganizationUpgradeRequest } from '../../core/models/request/organizationUpgradeRequest'
import { OrganizationUserAcceptRequest } from '../../core/models/request/organizationUserAcceptRequest'
import { OrganizationUserConfirmRequest } from '../../core/models/request/organizationUserConfirmRequest'
import { OrganizationUserInviteRequest } from '../../core/models/request/organizationUserInviteRequest'
import { OrganizationUserResetPasswordEnrollmentRequest } from '../../core/models/request/organizationUserResetPasswordEnrollmentRequest'
import { OrganizationUserUpdateGroupsRequest } from '../../core/models/request/organizationUserUpdateGroupsRequest'
import { OrganizationUserUpdateRequest } from '../../core/models/request/organizationUserUpdateRequest'
import { PasswordHintRequest } from '../../core/models/request/passwordHintRequest'
import { PasswordRequest } from '../../core/models/request/passwordRequest'
import { PasswordVerificationRequest } from '../../core/models/request/passwordVerificationRequest'
import { PaymentRequest } from '../../core/models/request/paymentRequest'
import { PolicyRequest } from '../../core/models/request/policyRequest'
import { PreloginRequest } from '../../core/models/request/preloginRequest'
import { RegisterRequest } from '../../core/models/request/registerRequest'
import { SeatRequest } from '../../core/models/request/seatRequest'
import { SelectionReadOnlyRequest } from '../../core/models/request/selectionReadOnlyRequest'
import { SendAccessRequest } from '../../core/models/request/sendAccessRequest'
import { SendRequest } from '../../core/models/request/sendRequest'
import { SetPasswordRequest } from '../../core/models/request/setPasswordRequest'
import { StorageRequest } from '../../core/models/request/storageRequest'
import { TaxInfoUpdateRequest } from '../../core/models/request/taxInfoUpdateRequest'
import { TokenRequest } from '../../core/models/request/tokenRequest'
import { TwoFactorEmailRequest } from '../../core/models/request/twoFactorEmailRequest'
import { TwoFactorProviderRequest } from '../../core/models/request/twoFactorProviderRequest'
import { TwoFactorRecoveryRequest } from '../../core/models/request/twoFactorRecoveryRequest'
import { UpdateDomainsRequest } from '../../core/models/request/updateDomainsRequest'
import { UpdateKeyRequest } from '../../core/models/request/updateKeyRequest'
import { UpdateProfileRequest } from '../../core/models/request/updateProfileRequest'
import { UpdateTwoFactorAuthenticatorRequest } from '../../core/models/request/updateTwoFactorAuthenticatorRequest'
import { UpdateTwoFactorDuoRequest } from '../../core/models/request/updateTwoFactorDuoRequest'
import { UpdateTwoFactorEmailRequest } from '../../core/models/request/updateTwoFactorEmailRequest'
import { UpdateTwoFactorWebAuthnDeleteRequest } from '../../core/models/request/updateTwoFactorWebAuthnDeleteRequest'
import { UpdateTwoFactorWebAuthnRequest } from '../../core/models/request/updateTwoFactorWebAuthnRequest'
import { UpdateTwoFactorYubioOtpRequest } from '../../core/models/request/updateTwoFactorYubioOtpRequest'
import { VerifyBankRequest } from '../../core/models/request/verifyBankRequest'
import { VerifyDeleteRecoverRequest } from '../../core/models/request/verifyDeleteRecoverRequest'
import { VerifyEmailRequest } from '../../core/models/request/verifyEmailRequest'

import { Utils } from '../../core/misc/utils'
import { ApiKeyResponse } from '../../core/models/response/apiKeyResponse'
import { AttachmentResponse } from '../../core/models/response/attachmentResponse'
import { AttachmentUploadDataResponse } from '../../core/models/response/attachmentUploadDataResponse'
import { BillingResponse } from '../../core/models/response/billingResponse'
import { BreachAccountResponse } from '../../core/models/response/breachAccountResponse'
import { CipherResponse } from '../../core/models/response/cipherResponse'
import {
  CollectionGroupDetailsResponse,
  CollectionResponse
} from '../models/response/collectionResponse'
import { DomainsResponse } from '../../core/models/response/domainsResponse'
import {
  EmergencyAccessGranteeDetailsResponse,
  EmergencyAccessGrantorDetailsResponse,
  EmergencyAccessTakeoverResponse,
  EmergencyAccessViewResponse
} from '../../core/models/response/emergencyAccessResponse'
import { ErrorResponse } from '../../core/models/response/errorResponse'
import { EventResponse } from '../../core/models/response/eventResponse'
import { FolderResponse } from '../../core/models/response/folderResponse'
import {
  GroupDetailsResponse,
  GroupResponse
} from '../../core/models/response/groupResponse'
import { IdentityTokenResponse } from '../../core/models/response/identityTokenResponse'
import { IdentityTwoFactorResponse } from '../../core/models/response/identityTwoFactorResponse'
import { ListResponse } from '../../core/models/response/listResponse'
import { OrganizationResponse } from '../../core/models/response/organizationResponse'
import { OrganizationSubscriptionResponse } from '../../core/models/response/organizationSubscriptionResponse'
import {
  OrganizationUserDetailsResponse,
  OrganizationUserUserDetailsResponse
} from '../../core/models/response/organizationUserResponse'
import { PaymentResponse } from '../../core/models/response/paymentResponse'
import { PlanResponse } from '../../core/models/response/planResponse'
import { PolicyResponse } from '../../core/models/response/policyResponse'
import { PreloginResponse } from '../../core/models/response/preloginResponse'
import { ProfileResponse } from '../../core/models/response/profileResponse'
import { SelectionReadOnlyResponse } from '../../core/models/response/selectionReadOnlyResponse'
import { SendAccessResponse } from '../../core/models/response/sendAccessResponse'
import { SendFileDownloadDataResponse } from '../../core/models/response/sendFileDownloadDataResponse'
import { SendFileUploadDataResponse } from '../../core/models/response/sendFileUploadDataResponse'
import { SendResponse } from '../../core/models/response/sendResponse'
import { SubscriptionResponse } from '../../core/models/response/subscriptionResponse'
import { SyncResponse } from '../../core/models/response/syncResponse'
import { TaxInfoResponse } from '../../core/models/response/taxInfoResponse'
import { TaxRateResponse } from '../../core/models/response/taxRateResponse'
import { TwoFactorAuthenticatorResponse } from '../../core/models/response/twoFactorAuthenticatorResponse'
import { TwoFactorDuoResponse } from '../../core/models/response/twoFactorDuoResponse'
import { TwoFactorEmailResponse } from '../../core/models/response/twoFactorEmailResponse'
import { TwoFactorProviderResponse } from '../../core/models/response/twoFactorProviderResponse'
import { TwoFactorRecoverResponse } from '../../core/models/response/twoFactorRescoverResponse'
import {
  TwoFactorWebAuthnResponse,
  ChallengeResponse
} from '../../core/models/response/twoFactorWebAuthnResponse'

import { TwoFactorYubiKeyResponse } from '../../core/models/response/twoFactorYubiKeyResponse'
import { UserKeyResponse } from '../../core/models/response/userKeyResponse'

import { SendAccessView } from '../../core/models/view/sendAccessView'

export class ApiService implements ApiServiceAbstraction {
  urlsSet: boolean = false
  apiBaseUrl: string
  identityBaseUrl: string
  eventsBaseUrl: string

  private device: DeviceType
  private deviceType: string
  private isWebClient = false
  private isDesktopClient = false
  private usingBaseUrl = false

  constructor (
    private tokenService: TokenService,
    private platformUtilsService: PlatformUtilsService,
    private logoutCallback: (expired: boolean) => Promise<void>,
    private customUserAgent: string = null
  ) {
    this.device = platformUtilsService.getDevice()
    this.deviceType = this.device.toString()
    this.isWebClient =
      this.device === DeviceType.IEBrowser ||
      this.device === DeviceType.ChromeBrowser ||
      this.device === DeviceType.EdgeBrowser ||
      this.device === DeviceType.FirefoxBrowser ||
      this.device === DeviceType.OperaBrowser ||
      this.device === DeviceType.SafariBrowser ||
      this.device === DeviceType.UnknownBrowser ||
      this.device === DeviceType.VivaldiBrowser
    this.isDesktopClient =
      this.device === DeviceType.WindowsDesktop ||
      this.device === DeviceType.MacOsDesktop ||
      this.device === DeviceType.LinuxDesktop
  }

  setUrls (urls: EnvironmentUrls): void {
    this.urlsSet = true

    if (urls.base != null) {
      this.usingBaseUrl = true
      this.apiBaseUrl = urls.base + '/api'
      this.identityBaseUrl = urls.base + '/identity'
      this.eventsBaseUrl = urls.base + '/events'
      return
    }

    this.apiBaseUrl = urls.api
    this.identityBaseUrl = urls.identity
    this.eventsBaseUrl = urls.events

    // Production
    if (this.apiBaseUrl == null) {
      this.apiBaseUrl = 'https://api.locker.io'
    }
    if (this.identityBaseUrl == null) {
      this.identityBaseUrl = 'https://id.locker.io'
    }
    if (this.eventsBaseUrl == null) {
      this.eventsBaseUrl = 'https://api.locker.io'
    }
  }

  // Auth APIs

  async postIdentityToken (
    request: TokenRequest
  ): Promise<IdentityTokenResponse | IdentityTwoFactorResponse> {
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      Accept: 'application/json',
      'Device-Type': this.deviceType
    })
    if (this.customUserAgent != null) {
      headers.set('User-Agent', this.customUserAgent)
    }
    const response = await this.fetch(
      new Request(this.identityBaseUrl + '/connect/token', {
        body: this.qsStringify(
          request.toIdentityToken(
            request.clientId ?? this.platformUtilsService.identityClientId
          )
        ),
        credentials: this.getCredentials(),
        cache: 'no-store',
        headers,
        method: 'POST'
      })
    )

    let responseJson: any = null
    if (this.isJsonResponse(response)) {
      responseJson = await response.json()
    }

    if (responseJson != null) {
      if (response.status === 200) {
        return new IdentityTokenResponse(responseJson)
      } else if (
        response.status === 400 &&
        responseJson.TwoFactorProviders2 &&
        Object.keys(responseJson.TwoFactorProviders2).length
      ) {
        await this.tokenService.clearTwoFactorToken(request.email)
        return new IdentityTwoFactorResponse(responseJson)
      }
    }

    return Promise.reject(
      new ErrorResponse(responseJson, response.status, true)
    )
  }

  async refreshIdentityToken (): Promise<any> {
    try {
      await this.doRefreshToken()
    } catch (e) {
      return Promise.reject(null)
    }
  }

  // Account APIs

  async getProfile (): Promise<ProfileResponse> {
    const r = await this.send('GET', '/accounts/profile', null, true, true)
    return new ProfileResponse(r)
  }

  async getUserBilling (): Promise<BillingResponse> {
    const r = await this.send('GET', '/accounts/billing', null, true, true)
    return new BillingResponse(r)
  }

  async getUserSubscription (): Promise<SubscriptionResponse> {
    const r = await this.send('GET', '/accounts/subscription', null, true, true)
    return new SubscriptionResponse(r)
  }

  async getTaxInfo (): Promise<TaxInfoResponse> {
    const r = await this.send('GET', '/accounts/tax', null, true, true)
    return new TaxInfoResponse(r)
  }

  async putProfile (request: UpdateProfileRequest): Promise<ProfileResponse> {
    const r = await this.send('PUT', '/accounts/profile', request, true, true)
    return new ProfileResponse(r)
  }

  putTaxInfo (request: TaxInfoUpdateRequest): Promise<any> {
    return this.send('PUT', '/accounts/tax', request, true, false)
  }

  async postPrelogin (request: PreloginRequest): Promise<PreloginResponse> {
    const r = await this.send(
      'POST',
      '/accounts/prelogin',
      request,
      false,
      true
    )
    return new PreloginResponse(r)
  }

  postEmailToken (request: EmailTokenRequest): Promise<any> {
    return this.send('POST', '/accounts/email-token', request, true, false)
  }

  postEmail (request: EmailRequest): Promise<any> {
    return this.send('POST', '/accounts/email', request, true, false)
  }

  postPassword (request: PasswordRequest): Promise<any> {
    return this.send('POST', '/accounts/password', request, true, false)
  }

  setPassword (request: SetPasswordRequest): Promise<any> {
    return this.send('POST', '/accounts/set-password', request, true, false)
  }

  postSecurityStamp (request: PasswordVerificationRequest): Promise<any> {
    return this.send('POST', '/accounts/security-stamp', request, true, false)
  }

  deleteAccount (request: PasswordVerificationRequest): Promise<any> {
    return this.send('DELETE', '/accounts', request, true, false)
  }

  async getAccountRevisionDate (): Promise<number> {
    const r = await this.send(
      'GET',
      '/accounts/revision-date',
      null,
      true,
      true
    )
    return r as number
  }

  postPasswordHint (request: PasswordHintRequest): Promise<any> {
    return this.send('POST', '/accounts/password-hint', request, false, false)
  }

  postRegister (request: RegisterRequest): Promise<any> {
    return this.send('POST', '/accounts/register', request, false, false)
  }

  async postPremium (data: FormData): Promise<PaymentResponse> {
    const r = await this.send('POST', '/accounts/premium', data, true, true)
    return new PaymentResponse(r)
  }

  async postIapCheck (request: IapCheckRequest): Promise<any> {
    return this.send('POST', '/accounts/iap-check', request, true, false)
  }

  postReinstatePremium (): Promise<any> {
    return this.send('POST', '/accounts/reinstate-premium', null, true, false)
  }

  postCancelPremium (): Promise<any> {
    return this.send('POST', '/accounts/cancel-premium', null, true, false)
  }

  async postAccountStorage (request: StorageRequest): Promise<PaymentResponse> {
    const r = await this.send('POST', '/accounts/storage', request, true, true)
    return new PaymentResponse(r)
  }

  postAccountPayment (request: PaymentRequest): Promise<any> {
    return this.send('POST', '/accounts/payment', request, true, false)
  }

  postAccountLicense (data: FormData): Promise<any> {
    return this.send('POST', '/accounts/license', data, true, false)
  }

  postAccountKeys (request: KeysRequest): Promise<any> {
    return this.send('POST', '/accounts/keys', request, true, false)
  }

  postAccountKey (request: UpdateKeyRequest): Promise<any> {
    return this.send('POST', '/accounts/key', request, true, false)
  }

  postAccountVerifyEmail (): Promise<any> {
    return this.send('POST', '/accounts/verify-email', null, true, false)
  }

  postAccountVerifyEmailToken (request: VerifyEmailRequest): Promise<any> {
    return this.send(
      'POST',
      '/accounts/verify-email-token',
      request,
      false,
      false
    )
  }

  postAccountVerifyPassword (
    request: PasswordVerificationRequest
  ): Promise<any> {
    return this.send('POST', '/accounts/verify-password', request, true, false)
  }

  postAccountRecoverDelete (request: DeleteRecoverRequest): Promise<any> {
    return this.send('POST', '/accounts/delete-recover', request, false, false)
  }

  postAccountRecoverDeleteToken (
    request: VerifyDeleteRecoverRequest
  ): Promise<any> {
    return this.send(
      'POST',
      '/accounts/delete-recover-token',
      request,
      false,
      false
    )
  }

  postAccountKdf (request: KdfRequest): Promise<any> {
    return this.send('POST', '/accounts/kdf', request, true, false)
  }

  async getEnterprisePortalSignInToken (): Promise<string> {
    const r = await this.send(
      'GET',
      '/accounts/enterprise-portal-signin-token',
      null,
      true,
      true
    )
    return r as string
  }

  async deleteSsoUser (organizationId: string): Promise<any> {
    return this.send(
      'DELETE',
      '/accounts/sso/' + organizationId,
      null,
      true,
      false
    )
  }

  async getSsoUserIdentifier (): Promise<string> {
    return this.send('GET', '/accounts/sso/user-identifier', null, true, true)
  }

  async postUserApiKey (
    id: string,
    request: PasswordVerificationRequest
  ): Promise<ApiKeyResponse> {
    const r = await this.send('POST', '/accounts/api-key', request, true, true)
    return new ApiKeyResponse(r)
  }

  async postUserRotateApiKey (
    id: string,
    request: PasswordVerificationRequest
  ): Promise<ApiKeyResponse> {
    const r = await this.send(
      'POST',
      '/accounts/rotate-api-key',
      request,
      true,
      true
    )
    return new ApiKeyResponse(r)
  }

  // Folder APIs

  async getFolder (id: string): Promise<FolderResponse> {
    const r = await this.send('GET', '/folders/' + id, null, true, true)
    return new FolderResponse(r)
  }

  async postFolder (request: FolderRequest): Promise<FolderResponse> {
    const r = await this.send('POST', '/folders', request, true, true)
    return new FolderResponse(r)
  }

  async putFolder (id: string, request: FolderRequest): Promise<FolderResponse> {
    const r = await this.send('PUT', '/folders/' + id, request, true, true)
    return new FolderResponse(r)
  }

  deleteFolder (id: string): Promise<any> {
    return this.send('DELETE', '/folders/' + id, null, true, false)
  }

  // Send APIs

  async getSend (id: string): Promise<SendResponse> {
    const r = await this.send('GET', '/sends/' + id, null, true, true)
    return new SendResponse(r)
  }

  async postSendAccess (
    id: string,
    request: SendAccessRequest,
    apiUrl?: string
  ): Promise<SendAccessResponse> {
    const r = await this.send(
      'POST',
      '/sends/access/' + id,
      request,
      false,
      true,
      apiUrl
    )
    return new SendAccessResponse(r)
  }

  async getSendFileDownloadData (
    send: SendAccessView,
    request: SendAccessRequest,
    apiUrl?: string
  ): Promise<SendFileDownloadDataResponse> {
    const r = await this.send(
      'POST',
      '/sends/' + send.id + '/access/file/' + send.file.id,
      request,
      false,
      true,
      apiUrl
    )
    return new SendFileDownloadDataResponse(r)
  }

  async getSends (): Promise<ListResponse<SendResponse>> {
    const r = await this.send('GET', '/sends', null, true, true)
    return new ListResponse(r, SendResponse)
  }

  async postSend (request: SendRequest): Promise<SendResponse> {
    const r = await this.send('POST', '/sends', request, true, true)
    return new SendResponse(r)
  }

  async postFileTypeSend (
    request: SendRequest
  ): Promise<SendFileUploadDataResponse> {
    const r = await this.send('POST', '/sends/file/v2', request, true, true)
    return new SendFileUploadDataResponse(r)
  }

  async renewSendFileUploadUrl (
    sendId: string,
    fileId: string
  ): Promise<SendFileUploadDataResponse> {
    const r = await this.send(
      'GET',
      '/sends/' + sendId + '/file/' + fileId,
      null,
      true,
      true
    )
    return new SendFileUploadDataResponse(r)
  }

  postSendFile (sendId: string, fileId: string, data: FormData): Promise<any> {
    return this.send(
      'POST',
      '/sends/' + sendId + '/file/' + fileId,
      data,
      true,
      false
    )
  }

  /**
   * @deprecated Mar 25 2021: This method has been deprecated in favor of direct uploads.
   * This method still exists for backward compatibility with old server versions.
   */
  async postSendFileLegacy (data: FormData): Promise<SendResponse> {
    const r = await this.send('POST', '/sends/file', data, true, true)
    return new SendResponse(r)
  }

  async putSend (id: string, request: SendRequest): Promise<SendResponse> {
    const r = await this.send('PUT', '/sends/' + id, request, true, true)
    return new SendResponse(r)
  }

  async putSendRemovePassword (id: string): Promise<SendResponse> {
    const r = await this.send(
      'PUT',
      '/sends/' + id + '/remove-password',
      null,
      true,
      true
    )
    return new SendResponse(r)
  }

  deleteSend (id: string): Promise<any> {
    return this.send('DELETE', '/sends/' + id, null, true, false)
  }

  // Cipher APIs

  async getCipher (id: string): Promise<CipherResponse> {
    const r = await this.send('GET', '/ciphers/' + id, null, true, true)
    return new CipherResponse(r)
  }

  async getCipherAdmin (id: string): Promise<CipherResponse> {
    const r = await this.send(
      'GET',
      '/ciphers/' + id + '/admin',
      null,
      true,
      true
    )
    return new CipherResponse(r)
  }

  async getCiphersOrganization (
    organizationId: string
  ): Promise<ListResponse<CipherResponse>> {
    const r = await this.send(
      'GET',
      '/ciphers/organization-details?organizationId=' + organizationId,
      null,
      true,
      true
    )
    return new ListResponse(r, CipherResponse)
  }

  async postCipher (request: CipherRequest): Promise<CipherResponse> {
    const r = await this.send('POST', '/ciphers', request, true, true)
    return new CipherResponse(r)
  }

  async postCipherCreate (
    request: CipherCreateRequest
  ): Promise<CipherResponse> {
    const r = await this.send('POST', '/ciphers/create', request, true, true)
    return new CipherResponse(r)
  }

  async postCipherAdmin (request: CipherCreateRequest): Promise<CipherResponse> {
    const r = await this.send('POST', '/ciphers/admin', request, true, true)
    return new CipherResponse(r)
  }

  async putCipher (id: string, request: CipherRequest): Promise<CipherResponse> {
    const r = await this.send('PUT', '/ciphers/' + id, request, true, true)
    return new CipherResponse(r)
  }

  async putCipherAdmin (
    id: string,
    request: CipherRequest
  ): Promise<CipherResponse> {
    const r = await this.send(
      'PUT',
      '/ciphers/' + id + '/admin',
      request,
      true,
      true
    )
    return new CipherResponse(r)
  }

  deleteCipher (id: string): Promise<any> {
    return this.send('DELETE', '/ciphers/' + id, null, true, false)
  }

  deleteCipherAdmin (id: string): Promise<any> {
    return this.send('DELETE', '/ciphers/' + id + '/admin', null, true, false)
  }

  deleteManyCiphers (request: CipherBulkDeleteRequest): Promise<any> {
    return this.send('DELETE', '/ciphers', request, true, false)
  }

  deleteManyCiphersAdmin (request: CipherBulkDeleteRequest): Promise<any> {
    return this.send('DELETE', '/ciphers/admin', request, true, false)
  }

  putMoveCiphers (request: CipherBulkMoveRequest): Promise<any> {
    return this.send('PUT', '/ciphers/move', request, true, false)
  }

  async putShareCipher (
    id: string,
    request: CipherShareRequest
  ): Promise<CipherResponse> {
    const r = await this.send(
      'PUT',
      '/ciphers/' + id + '/share',
      request,
      true,
      true
    )
    return new CipherResponse(r)
  }

  putShareCiphers (request: CipherBulkShareRequest): Promise<any> {
    return this.send('PUT', '/ciphers/share', request, true, false)
  }

  putCipherCollections (
    id: string,
    request: CipherCollectionsRequest
  ): Promise<any> {
    return this.send(
      'PUT',
      '/ciphers/' + id + '/collections',
      request,
      true,
      false
    )
  }

  putCipherCollectionsAdmin (
    id: string,
    request: CipherCollectionsRequest
  ): Promise<any> {
    return this.send(
      'PUT',
      '/ciphers/' + id + '/collections-admin',
      request,
      true,
      false
    )
  }

  postPurgeCiphers (
    request: PasswordVerificationRequest,
    organizationId: string = null
  ): Promise<any> {
    let path = '/ciphers/purge'
    if (organizationId != null) {
      path += '?organizationId=' + organizationId
    }
    return this.send('POST', path, request, true, false)
  }

  postImportCiphers (request: ImportCiphersRequest): Promise<any> {
    return this.send('POST', '/ciphers/import', request, true, false)
  }

  postImportOrganizationCiphers (
    organizationId: string,
    request: ImportOrganizationCiphersRequest
  ): Promise<any> {
    return this.send(
      'POST',
      '/ciphers/import-organization?organizationId=' + organizationId,
      request,
      true,
      false
    )
  }

  putDeleteCipher (id: string): Promise<any> {
    return this.send('PUT', '/ciphers/' + id + '/delete', null, true, false)
  }

  putDeleteCipherAdmin (id: string): Promise<any> {
    return this.send(
      'PUT',
      '/ciphers/' + id + '/delete-admin',
      null,
      true,
      false
    )
  }

  putDeleteManyCiphers (request: CipherBulkDeleteRequest): Promise<any> {
    return this.send('PUT', '/ciphers/delete', request, true, false)
  }

  putDeleteManyCiphersAdmin (request: CipherBulkDeleteRequest): Promise<any> {
    return this.send('PUT', '/ciphers/delete-admin', request, true, false)
  }

  async putRestoreCipher (id: string): Promise<CipherResponse> {
    const r = await this.send(
      'PUT',
      '/ciphers/' + id + '/restore',
      null,
      true,
      true
    )
    return new CipherResponse(r)
  }

  async putRestoreCipherAdmin (id: string): Promise<CipherResponse> {
    const r = await this.send(
      'PUT',
      '/ciphers/' + id + '/restore-admin',
      null,
      true,
      true
    )
    return new CipherResponse(r)
  }

  async putRestoreManyCiphers (
    request: CipherBulkDeleteRequest
  ): Promise<ListResponse<CipherResponse>> {
    const r = await this.send('PUT', '/ciphers/restore', request, true, true)
    return new ListResponse<CipherResponse>(r, CipherResponse)
  }

  // Attachments APIs

  async getAttachmentData (
    cipherId: string,
    attachmentId: string,
    emergencyAccessId?: string
  ): Promise<AttachmentResponse> {
    const path =
      (emergencyAccessId != null
        ? '/emergency-access/' + emergencyAccessId + '/'
        : '/ciphers/') +
      cipherId +
      '/attachment/' +
      attachmentId
    const r = await this.send('GET', path, null, true, true)
    return new AttachmentResponse(r)
  }

  async postCipherAttachment (
    id: string,
    request: AttachmentRequest
  ): Promise<AttachmentUploadDataResponse> {
    const r = await this.send(
      'POST',
      '/ciphers/' + id + '/attachment/v2',
      request,
      true,
      true
    )
    return new AttachmentUploadDataResponse(r)
  }

  /**
   * @deprecated Mar 25 2021: This method has been deprecated in favor of direct uploads.
   * This method still exists for backward compatibility with old server versions.
   */
  async postCipherAttachmentLegacy (
    id: string,
    data: FormData
  ): Promise<CipherResponse> {
    const r = await this.send(
      'POST',
      '/ciphers/' + id + '/attachment',
      data,
      true,
      true
    )
    return new CipherResponse(r)
  }

  /**
   * @deprecated Mar 25 2021: This method has been deprecated in favor of direct uploads.
   * This method still exists for backward compatibility with old server versions.
   */
  async postCipherAttachmentAdminLegacy (
    id: string,
    data: FormData
  ): Promise<CipherResponse> {
    const r = await this.send(
      'POST',
      '/ciphers/' + id + '/attachment-admin',
      data,
      true,
      true
    )
    return new CipherResponse(r)
  }

  deleteCipherAttachment (id: string, attachmentId: string): Promise<any> {
    return this.send(
      'DELETE',
      '/ciphers/' + id + '/attachment/' + attachmentId,
      null,
      true,
      false
    )
  }

  deleteCipherAttachmentAdmin (id: string, attachmentId: string): Promise<any> {
    return this.send(
      'DELETE',
      '/ciphers/' + id + '/attachment/' + attachmentId + '/admin',
      null,
      true,
      false
    )
  }

  postShareCipherAttachment (
    id: string,
    attachmentId: string,
    data: FormData,
    organizationId: string
  ): Promise<any> {
    return this.send(
      'POST',
      '/ciphers/' +
        id +
        '/attachment/' +
        attachmentId +
        '/share?organizationId=' +
        organizationId,
      data,
      true,
      false
    )
  }

  async renewAttachmentUploadUrl (
    id: string,
    attachmentId: string
  ): Promise<AttachmentUploadDataResponse> {
    const r = await this.send(
      'GET',
      '/ciphers/' + id + '/attachment/' + attachmentId + '/renew',
      null,
      true,
      true
    )
    return new AttachmentUploadDataResponse(r)
  }

  postAttachmentFile (
    id: string,
    attachmentId: string,
    data: FormData
  ): Promise<any> {
    return this.send(
      'POST',
      '/ciphers/' + id + '/attachment/' + attachmentId,
      data,
      true,
      false
    )
  }

  // Collections APIs

  async getCollectionDetails (
    organizationId: string,
    id: string
  ): Promise<CollectionGroupDetailsResponse> {
    const r = await this.send(
      'GET',
      '/organizations/' + organizationId + '/collections/' + id + '/details',
      null,
      true,
      true
    )
    return new CollectionGroupDetailsResponse(r)
  }

  async getUserCollections (): Promise<ListResponse<CollectionResponse>> {
    const r = await this.send('GET', '/collections', null, true, true)
    return new ListResponse(r, CollectionResponse)
  }

  async getCollections (
    organizationId: string
  ): Promise<ListResponse<CollectionResponse>> {
    const r = await this.send(
      'GET',
      '/organizations/' + organizationId + '/collections',
      null,
      true,
      true
    )
    return new ListResponse(r, CollectionResponse)
  }

  async getCollectionUsers (
    organizationId: string,
    id: string
  ): Promise<SelectionReadOnlyResponse[]> {
    const r = await this.send(
      'GET',
      '/organizations/' + organizationId + '/collections/' + id + '/users',
      null,
      true,
      true
    )
    return r.map((dr: any) => new SelectionReadOnlyResponse(dr))
  }

  async postCollection (
    organizationId: string,
    request: CollectionRequest
  ): Promise<CollectionResponse> {
    const r = await this.send(
      'POST',
      '/organizations/' + organizationId + '/collections',
      request,
      true,
      true
    )
    return new CollectionResponse(r)
  }

  async putCollection (
    organizationId: string,
    id: string,
    request: CollectionRequest
  ): Promise<CollectionResponse> {
    const r = await this.send(
      'PUT',
      '/organizations/' + organizationId + '/collections/' + id,
      request,
      true,
      true
    )
    return new CollectionResponse(r)
  }

  async putCollectionUsers (
    organizationId: string,
    id: string,
    request: SelectionReadOnlyRequest[]
  ): Promise<any> {
    await this.send(
      'PUT',
      '/organizations/' + organizationId + '/collections/' + id + '/users',
      request,
      true,
      false
    )
  }

  deleteCollection (organizationId: string, id: string): Promise<any> {
    return this.send(
      'DELETE',
      '/organizations/' + organizationId + '/collections/' + id,
      null,
      true,
      false
    )
  }

  deleteCollectionUser (
    organizationId: string,
    id: string,
    organizationUserId: string
  ): Promise<any> {
    return this.send(
      'DELETE',
      '/organizations/' +
        organizationId +
        '/collections/' +
        id +
        '/user/' +
        organizationUserId,
      null,
      true,
      false
    )
  }

  // Groups APIs

  async getGroupDetails (
    organizationId: string,
    id: string
  ): Promise<GroupDetailsResponse> {
    const r = await this.send(
      'GET',
      '/organizations/' + organizationId + '/groups/' + id + '/details',
      null,
      true,
      true
    )
    return new GroupDetailsResponse(r)
  }

  async getGroups (
    organizationId: string
  ): Promise<ListResponse<GroupResponse>> {
    const r = await this.send(
      'GET',
      '/organizations/' + organizationId + '/groups',
      null,
      true,
      true
    )
    return new ListResponse(r, GroupResponse)
  }

  async getGroupUsers (organizationId: string, id: string): Promise<string[]> {
    const r = await this.send(
      'GET',
      '/organizations/' + organizationId + '/groups/' + id + '/users',
      null,
      true,
      true
    )
    return r
  }

  async postGroup (
    organizationId: string,
    request: GroupRequest
  ): Promise<GroupResponse> {
    const r = await this.send(
      'POST',
      '/organizations/' + organizationId + '/groups',
      request,
      true,
      true
    )
    return new GroupResponse(r)
  }

  async putGroup (
    organizationId: string,
    id: string,
    request: GroupRequest
  ): Promise<GroupResponse> {
    const r = await this.send(
      'PUT',
      '/organizations/' + organizationId + '/groups/' + id,
      request,
      true,
      true
    )
    return new GroupResponse(r)
  }

  async putGroupUsers (
    organizationId: string,
    id: string,
    request: string[]
  ): Promise<any> {
    await this.send(
      'PUT',
      '/organizations/' + organizationId + '/groups/' + id + '/users',
      request,
      true,
      false
    )
  }

  deleteGroup (organizationId: string, id: string): Promise<any> {
    return this.send(
      'DELETE',
      '/organizations/' + organizationId + '/groups/' + id,
      null,
      true,
      false
    )
  }

  deleteGroupUser (
    organizationId: string,
    id: string,
    organizationUserId: string
  ): Promise<any> {
    return this.send(
      'DELETE',
      '/organizations/' +
        organizationId +
        '/groups/' +
        id +
        '/user/' +
        organizationUserId,
      null,
      true,
      false
    )
  }

  // Policy APIs

  async getPolicy (
    organizationId: string,
    type: PolicyType
  ): Promise<PolicyResponse> {
    const r = await this.send(
      'GET',
      '/organizations/' + organizationId + '/policies/' + type,
      null,
      true,
      true
    )
    return new PolicyResponse(r)
  }

  async getPolicies (
    organizationId: string
  ): Promise<ListResponse<PolicyResponse>> {
    const r = await this.send(
      'GET',
      '/organizations/' + organizationId + '/policies',
      null,
      true,
      true
    )
    return new ListResponse(r, PolicyResponse)
  }

  async getPoliciesByToken (
    organizationId: string,
    token: string,
    email: string,
    organizationUserId: string
  ): Promise<ListResponse<PolicyResponse>> {
    const r = await this.send(
      'GET',
      '/organizations/' +
        organizationId +
        '/policies/token?' +
        'token=' +
        encodeURIComponent(token) +
        '&email=' +
        encodeURIComponent(email) +
        '&organizationUserId=' +
        organizationUserId,
      null,
      false,
      true
    )
    return new ListResponse(r, PolicyResponse)
  }

  async putPolicy (
    organizationId: string,
    type: PolicyType,
    request: PolicyRequest
  ): Promise<PolicyResponse> {
    const r = await this.send(
      'PUT',
      '/organizations/' + organizationId + '/policies/' + type,
      request,
      true,
      true
    )
    return new PolicyResponse(r)
  }

  // Organization User APIs

  async getOrganizationUser (
    organizationId: string,
    id: string
  ): Promise<OrganizationUserDetailsResponse> {
    const r = await this.send(
      'GET',
      '/organizations/' + organizationId + '/users/' + id,
      null,
      true,
      true
    )
    return new OrganizationUserDetailsResponse(r)
  }

  async getOrganizationUserGroups (
    organizationId: string,
    id: string
  ): Promise<string[]> {
    const r = await this.send(
      'GET',
      '/organizations/' + organizationId + '/users/' + id + '/groups',
      null,
      true,
      true
    )
    return r
  }

  async getOrganizationUsers (
    organizationId: string
  ): Promise<ListResponse<OrganizationUserUserDetailsResponse>> {
    const r = await this.send(
      'GET',
      '/organizations/' + organizationId + '/users',
      null,
      true,
      true
    )
    return new ListResponse(r, OrganizationUserUserDetailsResponse)
  }

  postOrganizationUserInvite (
    organizationId: string,
    request: OrganizationUserInviteRequest
  ): Promise<any> {
    return this.send(
      'POST',
      '/organizations/' + organizationId + '/users/invite',
      request,
      true,
      false
    )
  }

  postOrganizationUserReinvite (
    organizationId: string,
    id: string
  ): Promise<any> {
    return this.send(
      'POST',
      '/organizations/' + organizationId + '/users/' + id + '/reinvite',
      null,
      true,
      false
    )
  }

  postOrganizationUserAccept (
    organizationId: string,
    id: string,
    request: OrganizationUserAcceptRequest
  ): Promise<any> {
    return this.send(
      'POST',
      '/organizations/' + organizationId + '/users/' + id + '/accept',
      request,
      true,
      false
    )
  }

  postOrganizationUserConfirm (
    organizationId: string,
    id: string,
    request: OrganizationUserConfirmRequest
  ): Promise<any> {
    return this.send(
      'POST',
      '/organizations/' + organizationId + '/users/' + id + '/confirm',
      request,
      true,
      false
    )
  }

  putOrganizationUser (
    organizationId: string,
    id: string,
    request: OrganizationUserUpdateRequest
  ): Promise<any> {
    return this.send(
      'PUT',
      '/organizations/' + organizationId + '/users/' + id,
      request,
      true,
      false
    )
  }

  putOrganizationUserGroups (
    organizationId: string,
    id: string,
    request: OrganizationUserUpdateGroupsRequest
  ): Promise<any> {
    return this.send(
      'PUT',
      '/organizations/' + organizationId + '/users/' + id + '/groups',
      request,
      true,
      false
    )
  }

  putOrganizationUserResetPasswordEnrollment (
    organizationId: string,
    userId: string,
    request: OrganizationUserResetPasswordEnrollmentRequest
  ): Promise<any> {
    return this.send(
      'PUT',
      '/organizations/' +
        organizationId +
        '/users/' +
        userId +
        '/reset-password-enrollment',
      request,
      true,
      false
    )
  }

  deleteOrganizationUser (organizationId: string, id: string): Promise<any> {
    return this.send(
      'DELETE',
      '/organizations/' + organizationId + '/users/' + id,
      null,
      true,
      false
    )
  }

  // Plan APIs

  async getPlans (): Promise<ListResponse<PlanResponse>> {
    const r = await this.send('GET', '/plans/', null, true, true)
    return new ListResponse(r, PlanResponse)
  }

  async postImportDirectory (
    organizationId: string,
    request: ImportDirectoryRequest
  ): Promise<any> {
    return this.send(
      'POST',
      '/organizations/' + organizationId + '/import',
      request,
      true,
      false
    )
  }

  async getTaxRates (): Promise<ListResponse<TaxRateResponse>> {
    const r = await this.send(
      'GET',
      '/plans/sales-tax-rates/',
      null,
      true,
      true
    )
    return new ListResponse(r, TaxRateResponse)
  }

  // Settings APIs

  async getSettingsDomains (): Promise<DomainsResponse> {
    const r = await this.send('GET', '/settings/domains', null, true, true)
    return new DomainsResponse(r)
  }

  async putSettingsDomains (
    request: UpdateDomainsRequest
  ): Promise<DomainsResponse> {
    const r = await this.send('PUT', '/settings/domains', request, true, true)
    return new DomainsResponse(r)
  }

  // Sync APIs

  async getSync (): Promise<SyncResponse> {
    const path =
      this.isDesktopClient || this.isWebClient
        ? '/sync?excludeDomains=true'
        : '/sync'
    const r = await this.send('GET', path, null, true, true)
    return new SyncResponse(r)
  }

  // Two-factor APIs

  async getTwoFactorProviders (): Promise<
    ListResponse<TwoFactorProviderResponse>
    > {
    const r = await this.send('GET', '/two-factor', null, true, true)
    return new ListResponse(r, TwoFactorProviderResponse)
  }

  async getTwoFactorOrganizationProviders (
    organizationId: string
  ): Promise<ListResponse<TwoFactorProviderResponse>> {
    const r = await this.send(
      'GET',
      '/organizations/' + organizationId + '/two-factor',
      null,
      true,
      true
    )
    return new ListResponse(r, TwoFactorProviderResponse)
  }

  async getTwoFactorAuthenticator (
    request: PasswordVerificationRequest
  ): Promise<TwoFactorAuthenticatorResponse> {
    const r = await this.send(
      'POST',
      '/two-factor/get-authenticator',
      request,
      true,
      true
    )
    return new TwoFactorAuthenticatorResponse(r)
  }

  async getTwoFactorEmail (
    request: PasswordVerificationRequest
  ): Promise<TwoFactorEmailResponse> {
    const r = await this.send(
      'POST',
      '/two-factor/get-email',
      request,
      true,
      true
    )
    return new TwoFactorEmailResponse(r)
  }

  async getTwoFactorDuo (
    request: PasswordVerificationRequest
  ): Promise<TwoFactorDuoResponse> {
    const r = await this.send(
      'POST',
      '/two-factor/get-duo',
      request,
      true,
      true
    )
    return new TwoFactorDuoResponse(r)
  }

  async getTwoFactorOrganizationDuo (
    organizationId: string,
    request: PasswordVerificationRequest
  ): Promise<TwoFactorDuoResponse> {
    const r = await this.send(
      'POST',
      '/organizations/' + organizationId + '/two-factor/get-duo',
      request,
      true,
      true
    )
    return new TwoFactorDuoResponse(r)
  }

  async getTwoFactorYubiKey (
    request: PasswordVerificationRequest
  ): Promise<TwoFactorYubiKeyResponse> {
    const r = await this.send(
      'POST',
      '/two-factor/get-yubikey',
      request,
      true,
      true
    )
    return new TwoFactorYubiKeyResponse(r)
  }

  async getTwoFactorWebAuthn (
    request: PasswordVerificationRequest
  ): Promise<TwoFactorWebAuthnResponse> {
    const r = await this.send(
      'POST',
      '/two-factor/get-webauthn',
      request,
      true,
      true
    )
    return new TwoFactorWebAuthnResponse(r)
  }

  async getTwoFactorWebAuthnChallenge (
    request: PasswordVerificationRequest
  ): Promise<ChallengeResponse> {
    const r = await this.send(
      'POST',
      '/two-factor/get-webauthn-challenge',
      request,
      true,
      true
    )
    return new ChallengeResponse(r)
  }

  async getTwoFactorRecover (
    request: PasswordVerificationRequest
  ): Promise<TwoFactorRecoverResponse> {
    const r = await this.send(
      'POST',
      '/two-factor/get-recover',
      request,
      true,
      true
    )
    return new TwoFactorRecoverResponse(r)
  }

  async putTwoFactorAuthenticator (
    request: UpdateTwoFactorAuthenticatorRequest
  ): Promise<TwoFactorAuthenticatorResponse> {
    const r = await this.send(
      'PUT',
      '/two-factor/authenticator',
      request,
      true,
      true
    )
    return new TwoFactorAuthenticatorResponse(r)
  }

  async putTwoFactorEmail (
    request: UpdateTwoFactorEmailRequest
  ): Promise<TwoFactorEmailResponse> {
    const r = await this.send('PUT', '/two-factor/email', request, true, true)
    return new TwoFactorEmailResponse(r)
  }

  async putTwoFactorDuo (
    request: UpdateTwoFactorDuoRequest
  ): Promise<TwoFactorDuoResponse> {
    const r = await this.send('PUT', '/two-factor/duo', request, true, true)
    return new TwoFactorDuoResponse(r)
  }

  async putTwoFactorOrganizationDuo (
    organizationId: string,
    request: UpdateTwoFactorDuoRequest
  ): Promise<TwoFactorDuoResponse> {
    const r = await this.send(
      'PUT',
      '/organizations/' + organizationId + '/two-factor/duo',
      request,
      true,
      true
    )
    return new TwoFactorDuoResponse(r)
  }

  async putTwoFactorYubiKey (
    request: UpdateTwoFactorYubioOtpRequest
  ): Promise<TwoFactorYubiKeyResponse> {
    const r = await this.send('PUT', '/two-factor/yubikey', request, true, true)
    return new TwoFactorYubiKeyResponse(r)
  }

  async putTwoFactorWebAuthn (
    request: UpdateTwoFactorWebAuthnRequest
  ): Promise<TwoFactorWebAuthnResponse> {
    const response = request.deviceResponse
      .response as AuthenticatorAttestationResponse
    const data: any = Object.assign({}, request)

    data.deviceResponse = {
      id: request.deviceResponse.id,
      rawId: btoa(request.deviceResponse.id),
      type: request.deviceResponse.type,
      extensions: request.deviceResponse.getClientExtensionResults(),
      response: {
        AttestationObject: Utils.fromBufferToB64(response.attestationObject),
        clientDataJson: Utils.fromBufferToB64(response.clientDataJSON)
      }
    }

    const r = await this.send('PUT', '/two-factor/webauthn', data, true, true)
    return new TwoFactorWebAuthnResponse(r)
  }

  async deleteTwoFactorWebAuthn (
    request: UpdateTwoFactorWebAuthnDeleteRequest
  ): Promise<TwoFactorWebAuthnResponse> {
    const r = await this.send(
      'DELETE',
      '/two-factor/webauthn',
      request,
      true,
      true
    )
    return new TwoFactorWebAuthnResponse(r)
  }

  async putTwoFactorDisable (
    request: TwoFactorProviderRequest
  ): Promise<TwoFactorProviderResponse> {
    const r = await this.send('PUT', '/two-factor/disable', request, true, true)
    return new TwoFactorProviderResponse(r)
  }

  async putTwoFactorOrganizationDisable (
    organizationId: string,
    request: TwoFactorProviderRequest
  ): Promise<TwoFactorProviderResponse> {
    const r = await this.send(
      'PUT',
      '/organizations/' + organizationId + '/two-factor/disable',
      request,
      true,
      true
    )
    return new TwoFactorProviderResponse(r)
  }

  postTwoFactorRecover (request: TwoFactorRecoveryRequest): Promise<any> {
    return this.send('POST', '/two-factor/recover', request, false, false)
  }

  postTwoFactorEmailSetup (request: TwoFactorEmailRequest): Promise<any> {
    return this.send('POST', '/two-factor/send-email', request, true, false)
  }

  postTwoFactorEmail (request: TwoFactorEmailRequest): Promise<any> {
    return this.send(
      'POST',
      '/two-factor/send-email-login',
      request,
      false,
      false
    )
  }

  // Emergency Access APIs

  async getEmergencyAccessTrusted (): Promise<
    ListResponse<EmergencyAccessGranteeDetailsResponse>
    > {
    const r = await this.send(
      'GET',
      '/emergency-access/trusted',
      null,
      true,
      true
    )
    return new ListResponse(r, EmergencyAccessGranteeDetailsResponse)
  }

  async getEmergencyAccessGranted (): Promise<
    ListResponse<EmergencyAccessGrantorDetailsResponse>
    > {
    const r = await this.send(
      'GET',
      '/emergency-access/granted',
      null,
      true,
      true
    )
    return new ListResponse(r, EmergencyAccessGrantorDetailsResponse)
  }

  async getEmergencyAccess (
    id: string
  ): Promise<EmergencyAccessGranteeDetailsResponse> {
    const r = await this.send(
      'GET',
      '/emergency-access/' + id,
      null,
      true,
      true
    )
    return new EmergencyAccessGranteeDetailsResponse(r)
  }

  async getEmergencyGrantorPolicies (
    id: string
  ): Promise<ListResponse<PolicyResponse>> {
    const r = await this.send(
      'GET',
      '/emergency-access/' + id + '/policies',
      null,
      true,
      true
    )
    return new ListResponse(r, PolicyResponse)
  }

  putEmergencyAccess (
    id: string,
    request: EmergencyAccessUpdateRequest
  ): Promise<any> {
    return this.send('PUT', '/emergency-access/' + id, request, true, false)
  }

  deleteEmergencyAccess (id: string): Promise<any> {
    return this.send('DELETE', '/emergency-access/' + id, null, true, false)
  }

  postEmergencyAccessInvite (
    request: EmergencyAccessInviteRequest
  ): Promise<any> {
    return this.send('POST', '/emergency-access/invite', request, true, false)
  }

  postEmergencyAccessReinvite (id: string): Promise<any> {
    return this.send(
      'POST',
      '/emergency-access/' + id + '/reinvite',
      null,
      true,
      false
    )
  }

  postEmergencyAccessAccept (
    id: string,
    request: EmergencyAccessAcceptRequest
  ): Promise<any> {
    return this.send(
      'POST',
      '/emergency-access/' + id + '/accept',
      request,
      true,
      false
    )
  }

  postEmergencyAccessConfirm (
    id: string,
    request: EmergencyAccessConfirmRequest
  ): Promise<any> {
    return this.send(
      'POST',
      '/emergency-access/' + id + '/confirm',
      request,
      true,
      false
    )
  }

  postEmergencyAccessInitiate (id: string): Promise<any> {
    return this.send(
      'POST',
      '/emergency-access/' + id + '/initiate',
      null,
      true,
      false
    )
  }

  postEmergencyAccessApprove (id: string): Promise<any> {
    return this.send(
      'POST',
      '/emergency-access/' + id + '/approve',
      null,
      true,
      false
    )
  }

  postEmergencyAccessReject (id: string): Promise<any> {
    return this.send(
      'POST',
      '/emergency-access/' + id + '/reject',
      null,
      true,
      false
    )
  }

  async postEmergencyAccessTakeover (
    id: string
  ): Promise<EmergencyAccessTakeoverResponse> {
    const r = await this.send(
      'POST',
      '/emergency-access/' + id + '/takeover',
      null,
      true,
      true
    )
    return new EmergencyAccessTakeoverResponse(r)
  }

  async postEmergencyAccessPassword (
    id: string,
    request: EmergencyAccessPasswordRequest
  ): Promise<any> {
    const r = await this.send(
      'POST',
      '/emergency-access/' + id + '/password',
      request,
      true,
      true
    )
  }

  async postEmergencyAccessView (
    id: string
  ): Promise<EmergencyAccessViewResponse> {
    const r = await this.send(
      'POST',
      '/emergency-access/' + id + '/view',
      null,
      true,
      true
    )
    return new EmergencyAccessViewResponse(r)
  }

  // Organization APIs

  async getOrganization (id: string): Promise<OrganizationResponse> {
    const r = await this.send('GET', '/organizations/' + id, null, true, true)
    return new OrganizationResponse(r)
  }

  async getOrganizationBilling (id: string): Promise<BillingResponse> {
    const r = await this.send(
      'GET',
      '/organizations/' + id + '/billing',
      null,
      true,
      true
    )
    return new BillingResponse(r)
  }

  async getOrganizationSubscription (
    id: string
  ): Promise<OrganizationSubscriptionResponse> {
    const r = await this.send(
      'GET',
      '/organizations/' + id + '/subscription',
      null,
      true,
      true
    )
    return new OrganizationSubscriptionResponse(r)
  }

  async getOrganizationLicense (
    id: string,
    installationId: string
  ): Promise<any> {
    return this.send(
      'GET',
      '/organizations/' + id + '/license?installationId=' + installationId,
      null,
      true,
      true
    )
  }

  async getOrganizationTaxInfo (id: string): Promise<TaxInfoResponse> {
    const r = await this.send(
      'GET',
      '/organizations/' + id + '/tax',
      null,
      true,
      true
    )
    return new TaxInfoResponse(r)
  }

  async postOrganization (
    request: OrganizationCreateRequest
  ): Promise<OrganizationResponse> {
    const r = await this.send('POST', '/organizations', request, true, true)
    return new OrganizationResponse(r)
  }

  async putOrganization (
    id: string,
    request: OrganizationUpdateRequest
  ): Promise<OrganizationResponse> {
    const r = await this.send(
      'PUT',
      '/organizations/' + id,
      request,
      true,
      true
    )
    return new OrganizationResponse(r)
  }

  async putOrganizationTaxInfo (
    id: string,
    request: OrganizationTaxInfoUpdateRequest
  ): Promise<any> {
    return this.send(
      'PUT',
      '/organizations/' + id + '/tax',
      request,
      true,
      false
    )
  }

  postLeaveOrganization (id: string): Promise<any> {
    return this.send(
      'POST',
      '/organizations/' + id + '/leave',
      null,
      true,
      false
    )
  }

  async postOrganizationLicense (data: FormData): Promise<OrganizationResponse> {
    const r = await this.send(
      'POST',
      '/organizations/license',
      data,
      true,
      true
    )
    return new OrganizationResponse(r)
  }

  async postOrganizationLicenseUpdate (
    id: string,
    data: FormData
  ): Promise<any> {
    return this.send(
      'POST',
      '/organizations/' + id + '/license',
      data,
      true,
      false
    )
  }

  async postOrganizationApiKey (
    id: string,
    request: PasswordVerificationRequest
  ): Promise<ApiKeyResponse> {
    const r = await this.send(
      'POST',
      '/organizations/' + id + '/api-key',
      request,
      true,
      true
    )
    return new ApiKeyResponse(r)
  }

  async postOrganizationRotateApiKey (
    id: string,
    request: PasswordVerificationRequest
  ): Promise<ApiKeyResponse> {
    const r = await this.send(
      'POST',
      '/organizations/' + id + '/rotate-api-key',
      request,
      true,
      true
    )
    return new ApiKeyResponse(r)
  }

  async postOrganizationUpgrade (
    id: string,
    request: OrganizationUpgradeRequest
  ): Promise<PaymentResponse> {
    const r = await this.send(
      'POST',
      '/organizations/' + id + '/upgrade',
      request,
      true,
      true
    )
    return new PaymentResponse(r)
  }

  async postOrganizationSeat (
    id: string,
    request: SeatRequest
  ): Promise<PaymentResponse> {
    const r = await this.send(
      'POST',
      '/organizations/' + id + '/seat',
      request,
      true,
      true
    )
    return new PaymentResponse(r)
  }

  async postOrganizationStorage (
    id: string,
    request: StorageRequest
  ): Promise<PaymentResponse> {
    const r = await this.send(
      'POST',
      '/organizations/' + id + '/storage',
      request,
      true,
      true
    )
    return new PaymentResponse(r)
  }

  postOrganizationPayment (id: string, request: PaymentRequest): Promise<any> {
    return this.send(
      'POST',
      '/organizations/' + id + '/payment',
      request,
      true,
      false
    )
  }

  postOrganizationVerifyBank (
    id: string,
    request: VerifyBankRequest
  ): Promise<any> {
    return this.send(
      'POST',
      '/organizations/' + id + '/verify-bank',
      request,
      true,
      false
    )
  }

  postOrganizationCancel (id: string): Promise<any> {
    return this.send(
      'POST',
      '/organizations/' + id + '/cancel',
      null,
      true,
      false
    )
  }

  postOrganizationReinstate (id: string): Promise<any> {
    return this.send(
      'POST',
      '/organizations/' + id + '/reinstate',
      null,
      true,
      false
    )
  }

  deleteOrganization (
    id: string,
    request: PasswordVerificationRequest
  ): Promise<any> {
    return this.send('DELETE', '/organizations/' + id, request, true, false)
  }

  // Event APIs

  async getEvents (
    start: string,
    end: string,
    token: string
  ): Promise<ListResponse<EventResponse>> {
    const r = await this.send(
      'GET',
      this.addEventParameters('/events', start, end, token),
      null,
      true,
      true
    )
    return new ListResponse(r, EventResponse)
  }

  async getEventsCipher (
    id: string,
    start: string,
    end: string,
    token: string
  ): Promise<ListResponse<EventResponse>> {
    const r = await this.send(
      'GET',
      this.addEventParameters('/ciphers/' + id + '/events', start, end, token),
      null,
      true,
      true
    )
    return new ListResponse(r, EventResponse)
  }

  async getEventsOrganization (
    id: string,
    start: string,
    end: string,
    token: string
  ): Promise<ListResponse<EventResponse>> {
    const r = await this.send(
      'GET',
      this.addEventParameters(
        '/organizations/' + id + '/events',
        start,
        end,
        token
      ),
      null,
      true,
      true
    )
    return new ListResponse(r, EventResponse)
  }

  async getEventsOrganizationUser (
    organizationId: string,
    id: string,
    start: string,
    end: string,
    token: string
  ): Promise<ListResponse<EventResponse>> {
    const r = await this.send(
      'GET',
      this.addEventParameters(
        '/organizations/' + organizationId + '/users/' + id + '/events',
        start,
        end,
        token
      ),
      null,
      true,
      true
    )
    return new ListResponse(r, EventResponse)
  }

  async postEventsCollect (request: EventRequest[]): Promise<any> {
    const authHeader = await this.getActiveBearerToken()
    const headers = new Headers({
      'Device-Type': this.deviceType,
      Authorization: 'Bearer ' + authHeader,
      'Content-Type': 'application/json; charset=utf-8'
    })
    if (this.customUserAgent != null) {
      headers.set('User-Agent', this.customUserAgent)
    }
    const response = await this.fetch(
      new Request(this.eventsBaseUrl + '/collect', {
        cache: 'no-store',
        credentials: this.getCredentials(),
        method: 'POST',
        body: JSON.stringify(request),
        headers
      })
    )
    if (response.status !== 200) {
      return Promise.reject('Event post failed.')
    }
  }

  // User APIs

  async getUserPublicKey (id: string): Promise<UserKeyResponse> {
    const r = await this.send(
      'GET',
      '/users/' + id + '/public-key',
      null,
      true,
      true
    )
    return new UserKeyResponse(r)
  }

  // HIBP APIs

  async getHibpBreach (username: string): Promise<BreachAccountResponse[]> {
    const r = await this.send(
      'GET',
      '/hibp/breach?username=' + username,
      null,
      true,
      true
    )
    return r.map((a: any) => new BreachAccountResponse(a))
  }

  // Misc

  async postBitPayInvoice (request: BitPayInvoiceRequest): Promise<string> {
    const r = await this.send('POST', '/bitpay-invoice', request, true, true)
    return r as string
  }

  async postSetupPayment (): Promise<string> {
    const r = await this.send('POST', '/setup-payment', null, true, true)
    return r as string
  }

  // Helpers

  async getActiveBearerToken (): Promise<string> {
    let accessToken = await this.tokenService.getToken()
    if (this.tokenService.tokenNeedsRefresh()) {
      const tokenResponse = await this.doRefreshToken()
      accessToken = tokenResponse.accessToken
    }
    return accessToken
  }

  fetch (request: Request): Promise<Response> {
    if (request.method === 'GET') {
      request.headers.set('Cache-Control', 'no-store')
      request.headers.set('Pragma', 'no-cache')
    }
    return this.nativeFetch(request)
  }

  nativeFetch (request: Request): Promise<Response> {
    return fetch(request)
  }

  async preValidateSso (identifier: string): Promise<boolean> {
    if (identifier == null || identifier === '') {
      throw new Error('Organization Identifier was not provided.')
    }
    const headers = new Headers({
      Accept: 'application/json',
      'Device-Type': this.deviceType
    })
    if (this.customUserAgent != null) {
      headers.set('User-Agent', this.customUserAgent)
    }

    const path = `/account/prevalidate?domainHint=${encodeURIComponent(
      identifier
    )}`
    const response = await this.fetch(
      new Request(this.identityBaseUrl + path, {
        cache: 'no-store',
        credentials: this.getCredentials(),
        headers,
        method: 'GET'
      })
    )

    if (response.status === 200) {
      return true
    } else {
      const error = await this.handleError(response, false, true)
      return Promise.reject(error)
    }
  }

  private async send (
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    body: any,
    authed: boolean,
    hasResponse: boolean,
    apiUrl?: string
  ): Promise<any> {
    apiUrl = Utils.isNullOrWhitespace(apiUrl) ? this.apiBaseUrl : apiUrl
    const headers = new Headers({
      'Device-Type': this.deviceType
    })
    if (this.customUserAgent != null) {
      headers.set('User-Agent', this.customUserAgent)
    }

    const requestInit: RequestInit = {
      cache: 'no-store',
      credentials: this.getCredentials(),
      method
    }

    if (authed) {
      const authHeader = await this.getActiveBearerToken()
      headers.set('Authorization', 'Bearer ' + authHeader)
    }
    if (body != null) {
      if (typeof body === 'string') {
        requestInit.body = body
        headers.set(
          'Content-Type',
          'application/x-www-form-urlencoded; charset=utf-8'
        )
      } else if (typeof body === 'object') {
        if (body instanceof FormData) {
          requestInit.body = body
        } else {
          headers.set('Content-Type', 'application/json; charset=utf-8')
          requestInit.body = JSON.stringify(body)
        }
      }
    }
    if (hasResponse) {
      headers.set('Accept', 'application/json')
    }

    requestInit.headers = headers
    const response = await this.fetch(new Request(apiUrl + path, requestInit))

    if (hasResponse && response.status === 200) {
      const responseJson = await response.json()
      return responseJson
    } else if (response.status !== 200) {
      const error = await this.handleError(response, false, authed)
      return Promise.reject(error)
    }
  }

  private async handleError (
    response: Response,
    tokenError: boolean,
    authed: boolean
  ): Promise<ErrorResponse> {
    if (
      authed &&
      ((tokenError && response.status === 400) ||
        response.status === 401 ||
        response.status === 403)
    ) {
      await this.logoutCallback(true)
      return null
    }

    let responseJson: any = null
    if (this.isJsonResponse(response)) {
      responseJson = await response.json()
    } else if (this.isTextResponse(response)) {
      responseJson = { Message: await response.text() }
    }

    return new ErrorResponse(responseJson, response.status, tokenError)
  }

  private async doRefreshToken (): Promise<IdentityTokenResponse> {
    const refreshToken = await this.tokenService.getRefreshToken()
    if (refreshToken == null || refreshToken === '') {
      throw new Error()
    }
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      Accept: 'application/json',
      'Device-Type': this.deviceType
    })
    if (this.customUserAgent != null) {
      headers.set('User-Agent', this.customUserAgent)
    }

    const decodedToken = this.tokenService.decodeToken()
    const response = await this.fetch(
      new Request(this.identityBaseUrl + '/connect/token', {
        body: this.qsStringify({
          grant_type: 'refresh_token',
          client_id: decodedToken.client_id,
          refresh_token: refreshToken
        }),
        cache: 'no-store',
        credentials: this.getCredentials(),
        headers,
        method: 'POST'
      })
    )

    if (response.status === 200) {
      const responseJson = await response.json()
      const tokenResponse = new IdentityTokenResponse(responseJson)
      await this.tokenService.setTokens(
        tokenResponse.accessToken,
        tokenResponse.refreshToken
      )
      return tokenResponse
    } else {
      const error = await this.handleError(response, true, true)
      return Promise.reject(error)
    }
  }

  private qsStringify (params: any): string {
    return Object.keys(params)
      .map(key => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
      })
      .join('&')
  }

  private getCredentials (): RequestCredentials {
    if (!this.isWebClient || this.usingBaseUrl) {
      return 'include'
    }
    return undefined
  }

  private addEventParameters (
    base: string,
    start: string,
    end: string,
    token: string
  ) {
    if (start != null) {
      base += '?start=' + start
    }
    if (end != null) {
      base += base.includes('?') ? '&' : '?'
      base += 'end=' + end
    }
    if (token != null) {
      base += base.includes('?') ? '&' : '?'
      base += 'continuationToken=' + token
    }
    return base
  }

  private isJsonResponse (response: Response): boolean {
    const typeHeader = response.headers.get('content-type')
    return typeHeader != null && typeHeader.includes('application/json')
  }

  private isTextResponse (response: Response): boolean {
    const typeHeader = response.headers.get('content-type')
    return typeHeader != null && typeHeader.includes('text')
  }
}
