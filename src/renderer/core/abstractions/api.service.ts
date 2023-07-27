import { PolicyType } from '../../core/enums/policyType'

import { EnvironmentUrls } from '../../core/models/domain/environmentUrls'
import { AttachmentRequest } from '../../core/models/request/attachmentRequest'

import { BitPayInvoiceRequest } from '../../core/models/request/bitPayInvoiceRequest'
import { CipherBulkDeleteRequest } from '../../core/models/request/cipherBulkDeleteRequest'
import { CipherBulkMoveRequest } from '../../core/models/request/cipherBulkMoveRequest'
import { CipherBulkRestoreRequest } from '../../core/models/request/cipherBulkRestoreRequest'
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

import { ApiKeyResponse } from '../../core/models/response/apiKeyResponse'
import { AttachmentResponse } from '../../core/models/response/attachmentResponse'
import { AttachmentUploadDataResponse } from '../../core/models/response/attachmentUploadDataResponse'
import { BillingResponse } from '../../core/models/response/billingResponse'
import { BreachAccountResponse } from '../../core/models/response/breachAccountResponse'
import { CipherResponse } from '../../core/models/response/cipherResponse'
import {
  CollectionGroupDetailsResponse,
  CollectionResponse
} from '../../core/models/response/collectionResponse'
import { DomainsResponse } from '../../core/models/response/domainsResponse'
import {
  EmergencyAccessGranteeDetailsResponse,
  EmergencyAccessGrantorDetailsResponse,
  EmergencyAccessTakeoverResponse,
  EmergencyAccessViewResponse
} from '../../core/models/response/emergencyAccessResponse'
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
  ChallengeResponse,
  TwoFactorWebAuthnResponse
} from '../../core/models/response/twoFactorWebAuthnResponse'
import { TwoFactorYubiKeyResponse } from '../../core/models/response/twoFactorYubiKeyResponse'
import { UserKeyResponse } from '../../core/models/response/userKeyResponse'

import { SendAccessView } from '../../core/models/view/sendAccessView'

export abstract class ApiService {
  urlsSet: boolean
  apiBaseUrl: string
  identityBaseUrl: string
  eventsBaseUrl: string

  setUrls: (urls: EnvironmentUrls) => void
  postIdentityToken: (
    request: TokenRequest
  ) => Promise<IdentityTokenResponse | IdentityTwoFactorResponse>

  refreshIdentityToken: () => Promise<any>

  getProfile: () => Promise<ProfileResponse>
  getUserBilling: () => Promise<BillingResponse>
  getUserSubscription: () => Promise<SubscriptionResponse>
  getTaxInfo: () => Promise<TaxInfoResponse>
  putProfile: (request: UpdateProfileRequest) => Promise<ProfileResponse>
  putTaxInfo: (request: TaxInfoUpdateRequest) => Promise<any>
  postPrelogin: (request: PreloginRequest) => Promise<PreloginResponse>
  postEmailToken: (request: EmailTokenRequest) => Promise<any>
  postEmail: (request: EmailRequest) => Promise<any>
  postPassword: (request: PasswordRequest) => Promise<any>
  setPassword: (request: SetPasswordRequest) => Promise<any>
  postSecurityStamp: (request: PasswordVerificationRequest) => Promise<any>
  deleteAccount: (request: PasswordVerificationRequest) => Promise<any>
  getAccountRevisionDate: () => Promise<number>
  postPasswordHint: (request: PasswordHintRequest) => Promise<any>
  postRegister: (request: RegisterRequest) => Promise<any>
  postPremium: (data: FormData) => Promise<PaymentResponse>
  postIapCheck: (request: IapCheckRequest) => Promise<any>
  postReinstatePremium: () => Promise<any>
  postCancelPremium: () => Promise<any>
  postAccountStorage: (request: StorageRequest) => Promise<PaymentResponse>
  postAccountPayment: (request: PaymentRequest) => Promise<any>
  postAccountLicense: (data: FormData) => Promise<any>
  postAccountKey: (request: UpdateKeyRequest) => Promise<any>
  postAccountKeys: (request: KeysRequest) => Promise<any>
  postAccountVerifyEmail: () => Promise<any>
  postAccountVerifyEmailToken: (request: VerifyEmailRequest) => Promise<any>
  postAccountVerifyPassword: (
    request: PasswordVerificationRequest
  ) => Promise<any>

  postAccountRecoverDelete: (request: DeleteRecoverRequest) => Promise<any>
  postAccountRecoverDeleteToken: (
    request: VerifyDeleteRecoverRequest
  ) => Promise<any>

  postAccountKdf: (request: KdfRequest) => Promise<any>
  getEnterprisePortalSignInToken: () => Promise<string>
  postUserApiKey: (
    id: string,
    request: PasswordVerificationRequest
  ) => Promise<ApiKeyResponse>

  postUserRotateApiKey: (
    id: string,
    request: PasswordVerificationRequest
  ) => Promise<ApiKeyResponse>

  getFolder: (id: string) => Promise<FolderResponse>
  postFolder: (request: FolderRequest) => Promise<FolderResponse>
  putFolder: (id: string, request: FolderRequest) => Promise<FolderResponse>
  deleteFolder: (id: string) => Promise<any>

  getSend: (id: string) => Promise<SendResponse>
  postSendAccess: (
    id: string,
    request: SendAccessRequest,
    apiUrl?: string
  ) => Promise<SendAccessResponse>

  getSends: () => Promise<ListResponse<SendResponse>>
  postSend: (request: SendRequest) => Promise<SendResponse>
  postFileTypeSend: (
    request: SendRequest
  ) => Promise<SendFileUploadDataResponse>

  postSendFile: (sendId: string, fileId: string, data: FormData) => Promise<any>
  /**
   * @deprecated Mar 25 2021: This method has been deprecated in favor of direct uploads.
   * This method still exists for backward compatibility with old server versions.
   */
  postSendFileLegacy: (data: FormData) => Promise<SendResponse>
  putSend: (id: string, request: SendRequest) => Promise<SendResponse>
  putSendRemovePassword: (id: string) => Promise<SendResponse>
  deleteSend: (id: string) => Promise<any>
  getSendFileDownloadData: (
    send: SendAccessView,
    request: SendAccessRequest,
    apiUrl?: string
  ) => Promise<SendFileDownloadDataResponse>

  renewSendFileUploadUrl: (
    sendId: string,
    fileId: string
  ) => Promise<SendFileUploadDataResponse>

  getCipher: (id: string) => Promise<CipherResponse>
  getCipherAdmin: (id: string) => Promise<CipherResponse>
  getAttachmentData: (
    cipherId: string,
    attachmentId: string,
    emergencyAccessId?: string
  ) => Promise<AttachmentResponse>

  getCiphersOrganization: (
    organizationId: string
  ) => Promise<ListResponse<CipherResponse>>

  postCipher: (request: CipherRequest) => Promise<CipherResponse>
  postCipherCreate: (request: CipherCreateRequest) => Promise<CipherResponse>
  postCipherAdmin: (request: CipherCreateRequest) => Promise<CipherResponse>
  putCipher: (id: string, request: CipherRequest) => Promise<CipherResponse>
  putCipherAdmin: (
    id: string,
    request: CipherRequest
  ) => Promise<CipherResponse>

  deleteCipher: (id: string) => Promise<any>
  deleteCipherAdmin: (id: string) => Promise<any>
  deleteManyCiphers: (request: CipherBulkDeleteRequest) => Promise<any>
  deleteManyCiphersAdmin: (request: CipherBulkDeleteRequest) => Promise<any>
  putMoveCiphers: (request: CipherBulkMoveRequest) => Promise<any>
  putShareCipher: (
    id: string,
    request: CipherShareRequest
  ) => Promise<CipherResponse>

  putShareCiphers: (request: CipherBulkShareRequest) => Promise<any>
  putCipherCollections: (
    id: string,
    request: CipherCollectionsRequest
  ) => Promise<any>

  putCipherCollectionsAdmin: (
    id: string,
    request: CipherCollectionsRequest
  ) => Promise<any>

  postPurgeCiphers: (
    request: PasswordVerificationRequest,
    organizationId?: string
  ) => Promise<any>

  postImportCiphers: (request: ImportCiphersRequest) => Promise<any>
  postImportOrganizationCiphers: (
    organizationId: string,
    request: ImportOrganizationCiphersRequest
  ) => Promise<any>

  putDeleteCipher: (id: string) => Promise<any>
  putDeleteCipherAdmin: (id: string) => Promise<any>
  putDeleteManyCiphers: (request: CipherBulkDeleteRequest) => Promise<any>
  putDeleteManyCiphersAdmin: (request: CipherBulkDeleteRequest) => Promise<any>
  putRestoreCipher: (id: string) => Promise<CipherResponse>
  putRestoreCipherAdmin: (id: string) => Promise<CipherResponse>
  putRestoreManyCiphers: (
    request: CipherBulkRestoreRequest
  ) => Promise<ListResponse<CipherResponse>>

  /**
   * @deprecated Mar 25 2021: This method has been deprecated in favor of direct uploads.
   * This method still exists for backward compatibility with old server versions.
   */
  postCipherAttachmentLegacy: (
    id: string,
    data: FormData
  ) => Promise<CipherResponse>

  /**
   * @deprecated Mar 25 2021: This method has been deprecated in favor of direct uploads.
   * This method still exists for backward compatibility with old server versions.
   */
  postCipherAttachmentAdminLegacy: (
    id: string,
    data: FormData
  ) => Promise<CipherResponse>

  postCipherAttachment: (
    id: string,
    request: AttachmentRequest
  ) => Promise<AttachmentUploadDataResponse>

  deleteCipherAttachment: (id: string, attachmentId: string) => Promise<any>
  deleteCipherAttachmentAdmin: (
    id: string,
    attachmentId: string
  ) => Promise<any>

  postShareCipherAttachment: (
    id: string,
    attachmentId: string,
    data: FormData,
    organizationId: string
  ) => Promise<any>

  renewAttachmentUploadUrl: (
    id: string,
    attachmentId: string
  ) => Promise<AttachmentUploadDataResponse>

  postAttachmentFile: (
    id: string,
    attachmentId: string,
    data: FormData
  ) => Promise<any>

  getCollectionDetails: (
    organizationId: string,
    id: string
  ) => Promise<CollectionGroupDetailsResponse>

  getUserCollections: () => Promise<ListResponse<CollectionResponse>>
  getCollections: (
    organizationId: string
  ) => Promise<ListResponse<CollectionResponse>>

  getCollectionUsers: (
    organizationId: string,
    id: string
  ) => Promise<SelectionReadOnlyResponse[]>

  postCollection: (
    organizationId: string,
    request: CollectionRequest
  ) => Promise<CollectionResponse>

  putCollectionUsers: (
    organizationId: string,
    id: string,
    request: SelectionReadOnlyRequest[]
  ) => Promise<any>

  putCollection: (
    organizationId: string,
    id: string,
    request: CollectionRequest
  ) => Promise<CollectionResponse>

  deleteCollection: (organizationId: string, id: string) => Promise<any>
  deleteCollectionUser: (
    organizationId: string,
    id: string,
    organizationUserId: string
  ) => Promise<any>

  getGroupDetails: (
    organizationId: string,
    id: string
  ) => Promise<GroupDetailsResponse>

  getGroups: (organizationId: string) => Promise<ListResponse<GroupResponse>>
  getGroupUsers: (organizationId: string, id: string) => Promise<string[]>
  postGroup: (
    organizationId: string,
    request: GroupRequest
  ) => Promise<GroupResponse>

  putGroup: (
    organizationId: string,
    id: string,
    request: GroupRequest
  ) => Promise<GroupResponse>

  putGroupUsers: (
    organizationId: string,
    id: string,
    request: string[]
  ) => Promise<any>

  deleteGroup: (organizationId: string, id: string) => Promise<any>
  deleteGroupUser: (
    organizationId: string,
    id: string,
    organizationUserId: string
  ) => Promise<any>

  getPolicy: (
    organizationId: string,
    type: PolicyType
  ) => Promise<PolicyResponse>

  getPolicies: (organizationId: string) => Promise<ListResponse<PolicyResponse>>
  getPoliciesByToken: (
    organizationId: string,
    token: string,
    email: string,
    organizationUserId: string
  ) => Promise<ListResponse<PolicyResponse>>

  putPolicy: (
    organizationId: string,
    type: PolicyType,
    request: PolicyRequest
  ) => Promise<PolicyResponse>

  getOrganizationUser: (
    organizationId: string,
    id: string
  ) => Promise<OrganizationUserDetailsResponse>

  getOrganizationUserGroups: (
    organizationId: string,
    id: string
  ) => Promise<string[]>

  getOrganizationUsers: (
    organizationId: string
  ) => Promise<ListResponse<OrganizationUserUserDetailsResponse>>

  postOrganizationUserInvite: (
    organizationId: string,
    request: OrganizationUserInviteRequest
  ) => Promise<any>

  postOrganizationUserReinvite: (
    organizationId: string,
    id: string
  ) => Promise<any>

  postOrganizationUserAccept: (
    organizationId: string,
    id: string,
    request: OrganizationUserAcceptRequest
  ) => Promise<any>

  postOrganizationUserConfirm: (
    organizationId: string,
    id: string,
    request: OrganizationUserConfirmRequest
  ) => Promise<any>

  putOrganizationUser: (
    organizationId: string,
    id: string,
    request: OrganizationUserUpdateRequest
  ) => Promise<any>

  putOrganizationUserGroups: (
    organizationId: string,
    id: string,
    request: OrganizationUserUpdateGroupsRequest
  ) => Promise<any>

  putOrganizationUserResetPasswordEnrollment: (
    organizationId: string,
    userId: string,
    request: OrganizationUserResetPasswordEnrollmentRequest
  ) => Promise<any>

  deleteOrganizationUser: (organizationId: string, id: string) => Promise<any>

  getSync: () => Promise<SyncResponse>
  postImportDirectory: (
    organizationId: string,
    request: ImportDirectoryRequest
  ) => Promise<any>

  getSettingsDomains: () => Promise<DomainsResponse>
  putSettingsDomains: (
    request: UpdateDomainsRequest
  ) => Promise<DomainsResponse>

  getTwoFactorProviders: () => Promise<ListResponse<TwoFactorProviderResponse>>
  getTwoFactorOrganizationProviders: (
    organizationId: string
  ) => Promise<ListResponse<TwoFactorProviderResponse>>

  getTwoFactorAuthenticator: (
    request: PasswordVerificationRequest
  ) => Promise<TwoFactorAuthenticatorResponse>

  getTwoFactorEmail: (
    request: PasswordVerificationRequest
  ) => Promise<TwoFactorEmailResponse>

  getTwoFactorDuo: (
    request: PasswordVerificationRequest
  ) => Promise<TwoFactorDuoResponse>

  getTwoFactorOrganizationDuo: (
    organizationId: string,
    request: PasswordVerificationRequest
  ) => Promise<TwoFactorDuoResponse>

  getTwoFactorYubiKey: (
    request: PasswordVerificationRequest
  ) => Promise<TwoFactorYubiKeyResponse>

  getTwoFactorWebAuthn: (
    request: PasswordVerificationRequest
  ) => Promise<TwoFactorWebAuthnResponse>

  getTwoFactorWebAuthnChallenge: (
    request: PasswordVerificationRequest
  ) => Promise<ChallengeResponse>

  getTwoFactorRecover: (
    request: PasswordVerificationRequest
  ) => Promise<TwoFactorRecoverResponse>

  putTwoFactorAuthenticator: (
    request: UpdateTwoFactorAuthenticatorRequest
  ) => Promise<TwoFactorAuthenticatorResponse>

  putTwoFactorEmail: (
    request: UpdateTwoFactorEmailRequest
  ) => Promise<TwoFactorEmailResponse>

  putTwoFactorDuo: (
    request: UpdateTwoFactorDuoRequest
  ) => Promise<TwoFactorDuoResponse>

  putTwoFactorOrganizationDuo: (
    organizationId: string,
    request: UpdateTwoFactorDuoRequest
  ) => Promise<TwoFactorDuoResponse>

  putTwoFactorYubiKey: (
    request: UpdateTwoFactorYubioOtpRequest
  ) => Promise<TwoFactorYubiKeyResponse>

  putTwoFactorWebAuthn: (
    request: UpdateTwoFactorWebAuthnRequest
  ) => Promise<TwoFactorWebAuthnResponse>

  deleteTwoFactorWebAuthn: (
    request: UpdateTwoFactorWebAuthnDeleteRequest
  ) => Promise<TwoFactorWebAuthnResponse>

  putTwoFactorDisable: (
    request: TwoFactorProviderRequest
  ) => Promise<TwoFactorProviderResponse>

  putTwoFactorOrganizationDisable: (
    organizationId: string,
    request: TwoFactorProviderRequest
  ) => Promise<TwoFactorProviderResponse>

  postTwoFactorRecover: (request: TwoFactorRecoveryRequest) => Promise<any>
  postTwoFactorEmailSetup: (request: TwoFactorEmailRequest) => Promise<any>
  postTwoFactorEmail: (request: TwoFactorEmailRequest) => Promise<any>

  getEmergencyAccessTrusted: () => Promise<
    ListResponse<EmergencyAccessGranteeDetailsResponse>
  >

  getEmergencyAccessGranted: () => Promise<
    ListResponse<EmergencyAccessGrantorDetailsResponse>
  >

  getEmergencyAccess: (
    id: string
  ) => Promise<EmergencyAccessGranteeDetailsResponse>

  getEmergencyGrantorPolicies: (
    id: string
  ) => Promise<ListResponse<PolicyResponse>>

  putEmergencyAccess: (
    id: string,
    request: EmergencyAccessUpdateRequest
  ) => Promise<any>

  deleteEmergencyAccess: (id: string) => Promise<any>
  postEmergencyAccessInvite: (
    request: EmergencyAccessInviteRequest
  ) => Promise<any>

  postEmergencyAccessReinvite: (id: string) => Promise<any>
  postEmergencyAccessAccept: (
    id: string,
    request: EmergencyAccessAcceptRequest
  ) => Promise<any>

  postEmergencyAccessConfirm: (
    id: string,
    request: EmergencyAccessConfirmRequest
  ) => Promise<any>

  postEmergencyAccessInitiate: (id: string) => Promise<any>
  postEmergencyAccessApprove: (id: string) => Promise<any>
  postEmergencyAccessReject: (id: string) => Promise<any>
  postEmergencyAccessTakeover: (
    id: string
  ) => Promise<EmergencyAccessTakeoverResponse>

  postEmergencyAccessPassword: (
    id: string,
    request: EmergencyAccessPasswordRequest
  ) => Promise<any>

  postEmergencyAccessView: (id: string) => Promise<EmergencyAccessViewResponse>

  getOrganization: (id: string) => Promise<OrganizationResponse>
  getOrganizationBilling: (id: string) => Promise<BillingResponse>
  getOrganizationSubscription: (
    id: string
  ) => Promise<OrganizationSubscriptionResponse>

  getOrganizationLicense: (id: string, installationId: string) => Promise<any>
  getOrganizationTaxInfo: (id: string) => Promise<TaxInfoResponse>
  postOrganization: (
    request: OrganizationCreateRequest
  ) => Promise<OrganizationResponse>

  putOrganization: (
    id: string,
    request: OrganizationUpdateRequest
  ) => Promise<OrganizationResponse>

  putOrganizationTaxInfo: (
    id: string,
    request: OrganizationTaxInfoUpdateRequest
  ) => Promise<any>

  postLeaveOrganization: (id: string) => Promise<any>
  postOrganizationLicense: (data: FormData) => Promise<OrganizationResponse>
  postOrganizationLicenseUpdate: (id: string, data: FormData) => Promise<any>
  postOrganizationApiKey: (
    id: string,
    request: PasswordVerificationRequest
  ) => Promise<ApiKeyResponse>

  postOrganizationRotateApiKey: (
    id: string,
    request: PasswordVerificationRequest
  ) => Promise<ApiKeyResponse>

  postOrganizationUpgrade: (
    id: string,
    request: OrganizationUpgradeRequest
  ) => Promise<PaymentResponse>

  postOrganizationSeat: (
    id: string,
    request: SeatRequest
  ) => Promise<PaymentResponse>

  postOrganizationStorage: (id: string, request: StorageRequest) => Promise<any>
  postOrganizationPayment: (id: string, request: PaymentRequest) => Promise<any>
  postOrganizationVerifyBank: (
    id: string,
    request: VerifyBankRequest
  ) => Promise<any>

  postOrganizationCancel: (id: string) => Promise<any>
  postOrganizationReinstate: (id: string) => Promise<any>
  deleteOrganization: (
    id: string,
    request: PasswordVerificationRequest
  ) => Promise<any>

  getPlans: () => Promise<ListResponse<PlanResponse>>
  getTaxRates: () => Promise<ListResponse<TaxRateResponse>>

  getEvents: (
    start: string,
    end: string,
    token: string
  ) => Promise<ListResponse<EventResponse>>

  getEventsCipher: (
    id: string,
    start: string,
    end: string,
    token: string
  ) => Promise<ListResponse<EventResponse>>

  getEventsOrganization: (
    id: string,
    start: string,
    end: string,
    token: string
  ) => Promise<ListResponse<EventResponse>>

  getEventsOrganizationUser: (
    organizationId: string,
    id: string,
    start: string,
    end: string,
    token: string
  ) => Promise<ListResponse<EventResponse>>

  postEventsCollect: (request: EventRequest[]) => Promise<any>

  deleteSsoUser: (organizationId: string) => Promise<any>
  getSsoUserIdentifier: () => Promise<string>

  getUserPublicKey: (id: string) => Promise<UserKeyResponse>

  getHibpBreach: (username: string) => Promise<BreachAccountResponse[]>

  postBitPayInvoice: (request: BitPayInvoiceRequest) => Promise<string>
  postSetupPayment: () => Promise<string>

  getActiveBearerToken: () => Promise<string>
  fetch: (request: Request) => Promise<Response>
  nativeFetch: (request: Request) => Promise<Response>

  preValidateSso: (identifier: string) => Promise<boolean>
}
