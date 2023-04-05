import Vue from 'vue'
import { CipherType } from '../../../core/enums/cipherType'

Vue.mixin({
  computed: {
    notDeletedCipherCount () {
      return this.$store.state.notDeletedCipherCount
    },

    newCipherTypes () {
      return [
        CipherType.TOTP,
        CipherType.CryptoWallet,
        CipherType.DriverLicense,
        CipherType.CitizenID,
        CipherType.Passport,
        CipherType.SocialSecurityNumber,
        CipherType.WirelessRouter,
        CipherType.Server,
        CipherType.APICipher,
        CipherType.Database
      ]
    },

    cipherMapping () {
      // Notes: do not add friendly name for new cipher types
      // Friendly name only used for translation of old types
      const res = {}
      res[CipherType.Login] = {
        type: CipherType.Login,
        routeName: 'passwords',
        label: 'passwords',
        friendlyName: 'Password'
      }
      res[CipherType.MasterPassword] = {
        type: CipherType.MasterPassword,
        routeName: 'passwords',
        label: 'passwords',
        noMenu: true,
        noCreate: true
      }
      res[CipherType.SecureNote] = {
        type: CipherType.SecureNote,
        routeName: 'notes',
        label: 'notes',
        friendlyName: 'Note'
      }
      res[CipherType.Card] = {
        type: CipherType.Card,
        routeName: 'cards',
        label: 'cards',
        friendlyName: 'Card'
      }
      res[CipherType.Identity] = {
        type: CipherType.Identity,
        routeName: 'identities',
        label: 'identities',
        friendlyName: 'Identity'
      }
      res[CipherType.TOTP] = {
        type: CipherType.TOTP,
        noMenu: true,
        hideFromCipherList: true
      }
      res[CipherType.CryptoWallet] = {
        type: CipherType.CryptoWallet,
        routeName: 'crypto-backups',
        label: 'crypto_backups',
        friendlyName: 'CryptoBackup'
      }
      res[CipherType.DriverLicense] = {
        type: CipherType.DriverLicense,
        routeName: 'driver-licenses',
        label: 'driver_licenses'
      }
      return res
    },

    cipherRoutes () {
      return Object.values(this.cipherMapping)
        .filter(v => !!v.routeName)
        .map(v => v.routeName)
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

      const name = this.cipherMapping[cipher.type].routeName || 'vault'
      this.$router.push(
        this.localeRoute({
          name: name + '-id',
          params: { id: cipher.id }
        })
      )
    },

    routerFolder (item) {
      this.$router.push(
        this.localeRoute({
          name: 'vault-folders-folderId',
          params: { folderId: item.id }
        })
      )
    },

    // Cannot edit/delete/share
    isProtectedCipher (cipher) {
      return cipher.type === CipherType.MasterPassword
    }
  }
})
