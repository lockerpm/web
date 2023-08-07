
import { ApiService } from '../abstractions/api.service'
import { AppIdService } from '../abstractions/appId.service'
import { EnvironmentService } from '../abstractions/environment.service'
import { LogService } from '../abstractions/log.service'
import { NotificationsService as NotificationsServiceAbstraction } from '../abstractions/notifications.service'
import { SyncService } from '../abstractions/sync.service'
import { UserService } from '../abstractions/user.service'
import { VaultTimeoutService } from '../abstractions/vaultTimeout.service'

export class NotificationsService implements NotificationsServiceAbstraction {
  private url: string
  private connected = false
  private inited = false
  private inactive = false
  private reconnectTimer: any = null

  constructor (
    private userService: UserService,
    private syncService: SyncService,
    private appIdService: AppIdService,
    private apiService: ApiService,
    private vaultTimeoutService: VaultTimeoutService,
    private logoutCallback: () => Promise<void>,
    private logService: LogService
  ) {}

  async init (environmentService: EnvironmentService): Promise<void> {

  }

  async updateConnection (sync = false): Promise<void> {

  }

  async reconnectFromActivity (): Promise<void> {

  }

  async disconnectFromInactivity (): Promise<void> {

  }
}
