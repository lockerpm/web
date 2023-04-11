import Vue from 'vue'
import { CipherType } from '../../../core/enums/cipherType'
import { CipherMapper } from '../../../constants'

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
      const res = { ...CipherMapper }
      if (!this.isDevOrStaging) {
        const hiddenType = [
          CipherType.DriverLicense,
          CipherType.CitizenID,
          CipherType.Passport,
          CipherType.SocialSecurityNumber,
          CipherType.WirelessRouter,
          CipherType.Server,
          CipherType.APICipher,
          CipherType.Database
        ]
        hiddenType.forEach(cipherType => {
          res[cipherType].hideFromCipherList = true
          res[cipherType].noCreate = true
          res[cipherType].noMenu = true
        })
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

    // Cannot edit/delete/share/export
    isProtectedCipher (cipher) {
      return cipher.type === CipherType.MasterPassword
    }
  }
})
