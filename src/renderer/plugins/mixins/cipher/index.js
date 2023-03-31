import Vue from 'vue'
import { LoginUriView, LoginView } from '../../../jslib/src/models/view'
import { CipherRequest } from '../../../jslib/src/models/request'
import { CipherType } from '../../../core/enums/cipherType'
import { CipherView } from '../../../core/models/view/cipherView'

Vue.mixin({
  computed: {
    notDeletedCipherCount () {
      return this.$store.state.notDeletedCipherCount
    }
  },

  methods: {
    async clearKeys () {
      await this.$cryptoService.clearKeys()
    },

    async createEncryptedMasterPwItem (masterPw, encKey) {
      const cipher = new CipherView()
      cipher.type = CipherType.Login
      const loginData = new LoginView()
      loginData.username = 'locker.io'
      loginData.password = masterPw
      const uriView = new LoginUriView()
      uriView.uri = 'https://locker.io'
      loginData.uris = [uriView]
      cipher.login = loginData
      cipher.name = 'Locker Master Password'
      const cipherEnc = await this.$cipherService.encrypt(cipher, encKey)
      const data = new CipherRequest(cipherEnc)
      data.type = CipherType.MasterPassword
      return data
    },

    async getFolders () {
      return await this.$folderService.getAllDecrypted()
    },

    async getCollections () {
      return await this.$collectionService.getAllDecrypted()
    },

    async getOrganizations () {
      return await this.$userService.getAllOrganizations()
    },

    routerCipher (cipher, callbackDeleted) {
      if (cipher.isDeleted) {
        callbackDeleted(cipher)
        return
      }

      if (this.getRouteBaseName() === 'vault') {
        this.$router.push(
          this.localeRoute({
            name: 'vault-id',
            params: { id: cipher.id }
          })
        )
        return
      }
      if (this.getRouteBaseName() === 'vault-folders-folderId') {
        this.$router.push(
          this.localeRoute({
            name: 'vault-folders-folderId-id',
            params: { ...this.$route.params, id: cipher.id }
          })
        )
        return
      }

      if (this.getRouteBaseName() === 'vault-teams-teamId-tfolders-tfolderId') {
        this.$router.push(
          this.localeRoute({
            name: 'vault-teams-teamId-tfolders-tfolderId-id',
            params: { ...this.$route.params, id: cipher.id }
          })
        )
        return
      }

      let name = ''
      switch (cipher.type) {
      case CipherType.Login:
      case CipherType.MasterPassword:
        name = 'passwords'
        break
      case CipherType.SecureNote:
        name = 'notes'
        break
      case CipherType.Card:
        name = 'cards'
        break
      case CipherType.Identity:
        name = 'identities'
        break
      case 6:
        name = 'crypto-backups'
        break
      case 7:
        name = 'crypto-backups'
        break
      default:
        name = 'vault'
      }
      this.$router.push(
        this.localeRoute({
          name: name + '-id',
          params: { id: cipher.id }
        })
      )
    },

    isProtectedCipher (cipher) {
      return cipher.type === CipherType.MasterPassword
    }
  }
})
