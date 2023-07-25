import Vue from 'vue'
import extractDomain from 'extract-domain'
import { Avatar } from 'element-ui'
import { CipherType } from '../../../core/enums/cipherType'
import { WALLET_APP_LIST } from '../../../utils/crypto/applist/index'

Vue.mixin({
  methods: {
    async weakPasswordScores () {
      const weakPasswordScores = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 }
      const allCiphers = await this.$cipherService.getAllDecrypted()
      const isUserNameNotEmpty = c => {
        return c.login.username != null && c.login.username.trim() !== ''
      }
      allCiphers.forEach(c => {
        if (
          c.type !== CipherType.Login ||
          c.login.password == null ||
          c.login.password === '' ||
          c.isDeleted ||
          c.organizationId
        ) {
          return
        }
        const hasUserName = isUserNameNotEmpty(c)
        let userInput = []
        if (hasUserName) {
          const atPosition = c.login.username.indexOf('@')
          if (atPosition > -1) {
            userInput = userInput
              .concat(
                c.login.username
                  .substr(0, atPosition)
                  .trim()
                  .toLowerCase()
                  .split(/[^A-Za-z0-9]/)
              )
              .filter(i => i.length >= 3)
          } else {
            userInput = c.login.username
              .trim()
              .toLowerCase()
              .split(/[^A-Za-z0-9]/)
              .filter(i => i.length >= 3)
          }
        }
        const result = this.$passwordGenerationService.passwordStrength(
          c.login.password,
          userInput.length > 0 ? userInput : null
        )
        weakPasswordScores[result.score]++
      })
      await this.$axios.$put('/cystack_platform/pm/users/me', {
        scores: weakPasswordScores
      })
      return weakPasswordScores
    },

    getIconCipher (cipher, size = 70, defaultIcon = false) {
      switch (cipher.type) {
      case CipherType.Login:
      case CipherType.MasterPassword:
        if (!defaultIcon) {
          if (cipher.login && cipher.login.uris && cipher.login.uris.length) {
            try {
              const domain = extractDomain(cipher.login.uris[0]._uri)
              if (domain) {
                return this.$createElement(
                  Avatar,
                  {
                    props: {
                      src: `${process.env.logoUrl}${domain}?size=${size}`,
                      size,
                      alt: domain,
                      shape: 'square'
                    }
                  },
                  [
                    this.$createElement('img', {
                      attrs: {
                        src: require('~/assets/images/icons/icon_Login.svg')
                      }
                    })
                  ]
                )
              }
            } catch (e) {
              return this.getIconDefaultCipher('Login', size)
            }
          }
        }
        return this.getIconDefaultCipher('Login', size)
      case CipherType.SecureNote:
        return this.getIconDefaultCipher('SecureNote', size)
      case CipherType.Card:
        return this.getIconDefaultCipher('Card', size)
      case CipherType.Identity:
        return this.getIconDefaultCipher('Identity', size)
      case CipherType.TOTP:
        return this.getIconDefaultCipher('Authenticator', size, 'png')
      case CipherType.CryptoWallet:
        if (!defaultIcon) {
          if (cipher.cryptoWallet && cipher.cryptoWallet.walletApp) {
            try {
              const selectedApp = WALLET_APP_LIST.find(
                a => a.alias === cipher.cryptoWallet.walletApp.alias
              )
              return this.$createElement(
                Avatar,
                {
                  props: {
                    src: selectedApp.logo,
                    size,
                    alt: selectedApp.name,
                    shape: 'square'
                  }
                },
                [
                  this.$createElement('img', {
                    attrs: {
                      src: require('~/assets/images/icons/icon_CryptoWallet.svg')
                    }
                  })
                ]
              )
            } catch (e) {
              return this.getIconDefaultCipher('CryptoWallet', size)
            }
          }
        }
        return this.getIconDefaultCipher('CryptoWallet', size)
      case CipherType.DriverLicense:
        return this.getIconDefaultCipher('DriverLicense', size)
      case CipherType.CitizenID:
        return this.getIconDefaultCipher('CitizenId', size)
      case CipherType.Passport:
        return this.getIconDefaultCipher('Passport', size)
      case CipherType.SocialSecurityNumber:
        return this.getIconDefaultCipher('ssn', size)
      case CipherType.WirelessRouter:
        return this.getIconDefaultCipher('Router', size)
      case CipherType.Server:
        return this.getIconDefaultCipher('Server', size)
      case CipherType.APICipher:
        return this.getIconDefaultCipher('Api', size)
      case CipherType.Database:
        return this.getIconDefaultCipher('Database', size)
      case 'Shares':
        return this.getIconDefaultCipher('Shares', size)
      case 'Trash':
        return this.getIconDefaultCipher('Trash', size)
      case 'Vault':
        return this.getIconDefaultCipher('Dashboard', size)
      default:
        return this.getIconDefaultCipher('any', size)
      }
    },

    getIconDefaultCipher (type, size = 70, extension = 'svg') {
      return this.$createElement('img', {
        attrs: {
          src: require(`~/assets/images/icons/icon_${type}.${extension}`),
          style: `height: ${size}px`,
          class: 'rounded mx-auto'
        }
      })
    },

    getCipherTypeName (cipherType) {
      if (CipherType[cipherType]) {
        return this.$tc(`type.${cipherType}`, 1)
      }
      return cipherType ? 'N/A' : this.$tc('type.Folder', 1)
    }
  }
})
