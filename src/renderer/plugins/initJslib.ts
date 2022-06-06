import { BroadcasterMessagingService } from '../services/broadcasterMessaging.service';
import { HtmlStorageService } from '../services/htmlStorage.service';
import { I18nService } from '../services/i18n.service';
import { MemoryStorageService } from '../services/memoryStorage.service';
import { WebPlatformUtilsService } from '../services/webPlatformUtils.service';

import { BroadcasterService } from '../jslib/src/services/broadcaster.service';
import { ApiService } from '../jslib/src/services/api.service';
import { AppIdService } from '../jslib/src/services/appId.service';
import { AuditService } from '../jslib/src/services/audit.service';
// import { AuthService } from '../jslib/src/services/auth.service';
import { CipherService } from '../jslib/src/services/cipher.service';
import { CollectionService } from '../jslib/src/services/collection.service';
import { ConsoleLogService } from '../jslib/src/services/consoleLog.service';
// import { ConstantsService } from '../jslib/src/services/constants.service';
import { ContainerService } from '../jslib/src/services/container.service';
import { CryptoService } from '../jslib/src/services/crypto.service';
// import { EnvironmentService } from '../jslib/src/services/environment.service';
// import { EventService as EventLoggingService } from '../jslib/src/services/event.service';
import { ExportService } from '../jslib/src/services/export.service';
import { FileUploadService } from '../jslib/src/services/fileUpload.service';
import { FolderService } from '../jslib/src/services/folder.service';
import { ImportService } from '../jslib/src/services/import.service';
// import { NotificationsService } from '../jslib/src/services/notifications.service';
import { PasswordGenerationService } from '../jslib/src/services/passwordGeneration.service';
import { PolicyService } from '../jslib/src/services/policy.service';
import { SearchService } from '../jslib/src/services/search.service';
import { MySearchService } from "../core/services/search.service"
import { SendService } from '../jslib/src/services/send.service';
import { SettingsService } from '../jslib/src/services/settings.service';
import { StateService } from '../jslib/src/services/state.service';
import { SyncService } from '../jslib/src/services/sync.service';
import { MySyncService } from "../core/services/sync.service";
import { TokenService } from '../jslib/src/services/token.service';
// import { TotpService } from '../jslib/src/services/totp.service';
import { UserService } from '../jslib/src/services/user.service';
import { VaultTimeoutService } from '../jslib/src/services/vaultTimeout.service';
import { WebCryptoFunctionService } from '../jslib/src/services/webCryptoFunction.service';

// import { ApiService as ApiServiceAbstraction } from '../jslib/src/abstractions/api.service';
import { AuditService as AuditServiceAbstraction } from '../jslib/src/abstractions/audit.service';
// import { AuthService as AuthServiceAbstraction } from '../jslib/src/abstractions/auth.service';
import { CipherService as CipherServiceAbstraction } from '../jslib/src/abstractions/cipher.service';
import { CollectionService as CollectionServiceAbstraction } from '../jslib/src/abstractions/collection.service';
import { CryptoService as CryptoServiceAbstraction } from '../jslib/src/abstractions/crypto.service';
import { CryptoFunctionService as CryptoFunctionServiceAbstraction } from '../jslib/src/abstractions/cryptoFunction.service';
// import { EnvironmentService as EnvironmentServiceAbstraction } from '../jslib/src/abstractions/environment.service';
// import { EventService as EventLoggingServiceAbstraction } from '../jslib/src/abstractions/event.service';
import { ExportService as ExportServiceAbstraction } from '../jslib/src/abstractions/export.service';
// import { FileUploadService as FileUploadServiceAbstraction }  from '../jslib/src/abstractions/fileUpload.service';
import { FolderService as FolderServiceAbstraction } from '../jslib/src/abstractions/folder.service';
// import { I18nService as I18nServiceAbstraction } from '../jslib/src/abstractions/i18n.service';
import { ImportService as ImportServiceAbstraction } from '../jslib/src/abstractions/import.service';
// import { MessagingService as MessagingServiceAbstraction } from '../jslib/src/abstractions/messaging.service';
// import { NotificationsService as NotificationsServiceAbstraction } from '../jslib/src/abstractions/notifications.service';
import {
    PasswordGenerationService as PasswordGenerationServiceAbstraction,
} from '../jslib/src/abstractions/passwordGeneration.service';
// import { PasswordRepromptService as PasswordRepromptServiceAbstraction } from '../jslib/src/abstractions/passwordReprompt.service';
// import { PlatformUtilsService as PlatformUtilsServiceAbstraction } from '../jslib/src/abstractions/platformUtils.service';
// import { PolicyService as PolicyServiceAbstraction } from '../jslib/src/abstractions/policy.service';
import { SearchService as SearchServiceAbstraction } from '../jslib/src/abstractions/search.service';
// import { SendService as SendServiceAbstraction } from '../jslib/src/abstractions/send.service';
import { SettingsService as SettingsServiceAbstraction } from '../jslib/src/abstractions/settings.service';
// import { StateService as StateServiceAbstraction } from '../jslib/src/abstractions/state.service';
import { StorageService as StorageServiceAbstraction } from '../jslib/src/abstractions/storage.service';
import { SyncService as SyncServiceAbstraction } from '../jslib/src/abstractions/sync.service';
// import { TokenService as TokenServiceAbstraction } from '../jslib/src/abstractions/token.service';
// import { TotpService as TotpServiceAbstraction } from '../jslib/src/abstractions/totp.service';
// import { UserService as UserServiceAbstraction } from '../jslib/src/abstractions/user.service';
import { VaultTimeoutService as VaultTimeoutServiceAbstraction } from '../jslib/src/abstractions/vaultTimeout.service';
import { MyCipherService } from '../core/services/myCipherService';
// import { PasswordRepromptService } from '../jslib/src/services/passwordReprompt.service';

const i18nService = new I18nService(window.navigator.language, 'locales');
const stateService = new StateService();
const broadcasterService = new BroadcasterService();
const messagingService = new BroadcasterMessagingService(broadcasterService);
const platformUtilsService = new WebPlatformUtilsService(i18nService, messagingService);
const storageService: StorageServiceAbstraction = new HtmlStorageService(platformUtilsService);
const secureStorageService: StorageServiceAbstraction = new MemoryStorageService();
const cryptoFunctionService: CryptoFunctionServiceAbstraction = new WebCryptoFunctionService(window,
    platformUtilsService);
const consoleLogService = new ConsoleLogService(false);
const cryptoService = new CryptoService(storageService,
    platformUtilsService.isDev() ? storageService : secureStorageService, cryptoFunctionService, platformUtilsService,
    consoleLogService);

const tokenService = new TokenService(storageService);
const appIdService = new AppIdService(storageService);
const apiService = new ApiService(tokenService, platformUtilsService,
    async (expired: boolean) => messagingService.send('logout', { expired: expired }));
const userService = new UserService(tokenService, storageService);
const settingsService = new SettingsService(userService, storageService);
export let searchService: SearchService = null;
export let mySearchService: MySearchService = null;
const fileUploadService = new FileUploadService(consoleLogService, apiService);
const cipherService = new CipherService(cryptoService, userService, settingsService, apiService, fileUploadService, storageService, i18nService, () => searchService);
const myCipherService = new MyCipherService(
  cryptoService,
  userService,
  settingsService,
  apiService,
  fileUploadService,
  storageService,
  i18nService,
  () => mySearchService
);
const folderService = new FolderService(cryptoService, userService, apiService, storageService,
    i18nService, cipherService);
const collectionService = new CollectionService(cryptoService, userService, storageService, i18nService);
searchService = new SearchService(cipherService, consoleLogService, i18nService);
mySearchService = new MySearchService(myCipherService, consoleLogService, i18nService);
const policyService = new PolicyService(userService, storageService);
const sendService = new SendService(cryptoService, userService, apiService, fileUploadService, storageService,
    i18nService, cryptoFunctionService);
const vaultTimeoutService = new VaultTimeoutService(myCipherService, folderService, collectionService,
    cryptoService, platformUtilsService, storageService, messagingService, mySearchService, userService, tokenService,
    null, async () => messagingService.send('logout', { expired: false }));
const syncService = new SyncService(userService, apiService, settingsService, folderService,
    cipherService, cryptoService, collectionService, storageService, messagingService, policyService,
  sendService, async (expired: boolean) => messagingService.send('logout-11111', { expired: expired }));
const mySyncService = new MySyncService(userService, apiService, settingsService, folderService,
    myCipherService, cryptoService, collectionService, storageService, messagingService, policyService,
    sendService, async (expired: boolean) => messagingService.send('logout-11111', { expired: expired }));
const passwordGenerationService = new PasswordGenerationService(cryptoService, storageService, policyService);
// const totpService = new TotpService(storageService, cryptoFunctionService);
const containerService = new ContainerService(cryptoService);
// const authService = new AuthService(cryptoService, apiService,
//     userService, tokenService, appIdService, i18nService, platformUtilsService, messagingService, vaultTimeoutService,
//     consoleLogService);
const exportService = new ExportService(folderService, cipherService, apiService);
const importService = new ImportService(cipherService, folderService, apiService, i18nService, collectionService,
    platformUtilsService);
// const notificationsService = new NotificationsService(userService, syncService, appIdService,
//     apiService, vaultTimeoutService, async () => messagingService.send('logout', { expired: true }), consoleLogService);
// const environmentService = new EnvironmentService(apiService, storageService, notificationsService);
const auditService = new AuditService(cryptoFunctionService, apiService);
// const eventLoggingService = new EventLoggingService(storageService, apiService, userService, cipherService);
// const passwordRepromptService = new PasswordRepromptService(i18nService, cryptoService, platformUtilsService);
containerService.attachToWindow(window);
// const IdleTimeout = 60000 * 10 // 10 minutes

export default async ({ app, store }, inject) => {
    await (storageService as HtmlStorageService).init();
    vaultTimeoutService.init(true);

    inject('cryptoService', cryptoService)
    inject('cipherService', cipherService)
    inject('userService', userService)
    inject('syncService', syncService)
    inject("mySyncService", mySyncService);
    inject('tokenService', tokenService)
    inject('searchService', searchService)
    inject("mySearchService", mySearchService);
    inject('containerService', containerService)
    inject('platformUtilsService', platformUtilsService)
    inject('vaultTimeoutService', vaultTimeoutService)
    inject('broadcasterService', broadcasterService)
    inject('messagingService', messagingService)
    inject('folderService', folderService)
    inject('collectionService', collectionService)
    inject('passwordGenerationService', passwordGenerationService)
    inject('storageService', storageService)
    inject('exportService', exportService)
    inject('importService', importService)
    inject('auditService', auditService)
    inject('myCipherService', myCipherService)

}
