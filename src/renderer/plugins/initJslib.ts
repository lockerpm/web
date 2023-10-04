import { BroadcasterMessagingService } from "../services/broadcasterMessaging.service";
import { HtmlStorageService } from "../services/htmlStorage.service";
import { I18nService } from "../services/i18n.service";
import { MemoryStorageService } from "../services/memoryStorage.service";
import { WebPlatformUtilsService } from "../services/webPlatformUtils.service";

import { BroadcasterService } from "../jslib/src/services/broadcaster.service";
import { ApiService } from "../jslib/src/services/api.service";
import { AppIdService } from "../jslib/src/services/appId.service";
import { AuditService } from "../jslib/src/services/audit.service";
import { CollectionService } from "../jslib/src/services/collection.service";
import { ConsoleLogService } from "../jslib/src/services/consoleLog.service";
import { ContainerService } from "../jslib/src/services/container.service";
import { ExportService } from "../jslib/src/services/export.service";
import { FileUploadService } from "../jslib/src/services/fileUpload.service";
import { FolderService } from "../jslib/src/services/folder.service";
import { ImportService } from "../jslib/src/services/import.service";
import { PasswordGenerationService } from "../jslib/src/services/passwordGeneration.service";
import { PolicyService } from "../jslib/src/services/policy.service";
import { SearchService } from "../jslib/src/services/search.service";
import { SendService } from "../jslib/src/services/send.service";
import { SettingsService } from "../jslib/src/services/settings.service";
import { StateService } from "../jslib/src/services/state.service";
import { SyncService } from "../jslib/src/services/sync.service";
import { TokenService } from "../jslib/src/services/token.service";
import { UserService } from "../jslib/src/services/user.service";
import { VaultTimeoutService } from "../jslib/src/services/vaultTimeout.service";
import { WebCryptoFunctionService } from "../jslib/src/services/webCryptoFunction.service";
import { CryptoFunctionService as CryptoFunctionServiceAbstraction } from "../jslib/src/abstractions/cryptoFunction.service";
import { StorageService as StorageServiceAbstraction } from "../jslib/src/abstractions/storage.service";
import { CipherService } from "../jslib/src/services/cipher.service";
import { CryptoService } from "../jslib/src/services/crypto.service";
import { TotpService } from "../jslib/src/services/totp.service";

const i18nService = new I18nService(window.navigator.language, "locales");
const stateService = new StateService();
const broadcasterService = new BroadcasterService();
const messagingService = new BroadcasterMessagingService(broadcasterService);
const platformUtilsService = new WebPlatformUtilsService(
  i18nService,
  messagingService
);
const storageService: StorageServiceAbstraction = new HtmlStorageService(
  platformUtilsService
);
const secureStorageService: StorageServiceAbstraction =
  new MemoryStorageService();
const cryptoFunctionService: CryptoFunctionServiceAbstraction =
  new WebCryptoFunctionService(window, platformUtilsService);
const consoleLogService = new ConsoleLogService(false);
const cryptoService = new CryptoService(
  storageService,
  platformUtilsService.isDev() ? storageService : secureStorageService,
  cryptoFunctionService,
  platformUtilsService,
  consoleLogService
);

const tokenService = new TokenService(storageService);
const appIdService = new AppIdService(storageService);
const apiService = new ApiService(
  tokenService,
  platformUtilsService,
  async (expired: boolean) =>
    messagingService.send("logout", { expired: expired })
);
const userService = new UserService(tokenService, storageService);
const settingsService = new SettingsService(userService, storageService);
export let searchService: SearchService = null;
const fileUploadService = new FileUploadService(consoleLogService, apiService);
const cipherService = new CipherService(
  cryptoService,
  userService,
  settingsService,
  apiService,
  fileUploadService,
  storageService,
  i18nService,
  () => searchService
);
const folderService = new FolderService(
  cryptoService,
  userService,
  apiService,
  storageService,
  i18nService,
  cipherService
);
const collectionService = new CollectionService(
  cryptoService,
  userService,
  storageService,
  i18nService
);
searchService = new SearchService(
  cipherService,
  consoleLogService,
  i18nService
);
const policyService = new PolicyService(userService, storageService);
const sendService = new SendService(
  cryptoService,
  cipherService,
  userService,
  storageService,
  i18nService,
  cryptoFunctionService
);
const vaultTimeoutService = new VaultTimeoutService(
  cipherService,
  folderService,
  collectionService,
  cryptoService,
  platformUtilsService,
  storageService,
  messagingService,
  searchService,
  userService,
  tokenService,
  null,
  async () => messagingService.send("logout", { expired: false })
);
const syncService = new SyncService(
  userService,
  apiService,
  settingsService,
  folderService,
  cipherService,
  cryptoService,
  collectionService,
  storageService,
  messagingService,
  policyService,
  sendService,
  async (expired: boolean) =>
    messagingService.send("logout-11111", { expired: expired })
);
const passwordGenerationService = new PasswordGenerationService(
  cryptoService,
  storageService,
  policyService
);
const containerService = new ContainerService(cryptoService);
const exportService = new ExportService(
  folderService,
  cipherService,
  apiService
);
const importService = new ImportService(
  cipherService,
  folderService,
  apiService,
  i18nService,
  collectionService,
  platformUtilsService
);
const auditService = new AuditService(cryptoFunctionService, apiService);
containerService.attachToWindow(window);
const totpService = new TotpService(storageService, cryptoFunctionService)

export default async ({ app, store }, inject) => {
  await (storageService as HtmlStorageService).init();
  vaultTimeoutService.init(true);

  inject("cryptoService", cryptoService);
  inject("cipherService", cipherService);
  inject("userService", userService);
  inject("syncService", syncService);
  inject("tokenService", tokenService);
  inject("searchService", searchService);
  inject("containerService", containerService);
  inject("platformUtilsService", platformUtilsService);
  inject("vaultTimeoutService", vaultTimeoutService);
  inject("broadcasterService", broadcasterService);
  inject("messagingService", messagingService);
  inject("folderService", folderService);
  inject("collectionService", collectionService);
  inject("passwordGenerationService", passwordGenerationService);
  inject("storageService", storageService);
  inject("exportService", exportService);
  inject("importService", importService);
  inject("auditService", auditService);
  inject("cryptoFunctionService", cryptoFunctionService);
  inject("sendService", sendService);
  inject("totpService", totpService);
};
