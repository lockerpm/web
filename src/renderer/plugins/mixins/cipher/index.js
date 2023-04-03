import Vue from 'vue'
import { CipherType } from '../../../core/enums/cipherType'

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

    async getFolders () {
      return await this.$folderService.getAllDecrypted()
    },

    async getCollections () {
      return await this.$collectionService.getAllDecrypted()
    },

    // Get writable collections
    async getWritableCollections () {
      let collections = []
      try {
        collections = await this.$collectionService.getAllDecrypted()
        const organizations = await this.$userService.getAllOrganizations()
        collections = collections.filter(item => {
          const _type = this.getTeam(organizations, item.organizationId).type
          return _type === 0
        })
      } catch (error) {}
      return collections
    },

    // Get non-writable collections
    async getNonWritableCollections () {
      let collections = []
      try {
        collections = await this.$collectionService.getAllDecrypted()
        const organizations = await this.$userService.getAllOrganizations()
        collections = collections.filter(item => {
          const _type = this.getTeam(organizations, item.organizationId).type
          return _type !== 0
        })
      } catch (error) {}
      return collections
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
