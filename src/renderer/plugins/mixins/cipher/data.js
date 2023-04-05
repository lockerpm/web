import Vue from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import { CipherType } from '../../../core/enums/cipherType'
import { toDriverLicenseData } from '../../../utils/new-types/driver-license'
import { toCryptoWalletData } from '../../../utils/crypto'
import { toCitizenIdData } from '../../../utils/new-types/citizen-id'
import { toPassportData } from '../../../utils/new-types/passport'
import { toSocialSecurityNumberData } from '../../../utils/new-types/ssn'
import { toWirelessRouterData } from '../../../utils/new-types/router'
import { toServerData } from '../../../utils/new-types/server'
import { CipherRequest } from '@/jslib/src/models/request'
import { SecureNote } from '@/jslib/src/models/domain'

Vue.mixin({
  computed: {
    // ----------------- CARD -----------------

    cardBrandOptions () {
      return [
        { label: '----', value: null, icon: '' },
        { label: 'Visa', value: 'Visa', icon: 'fab fa-cc-visa' },
        {
          label: 'Mastercard',
          value: 'Mastercard',
          icon: 'fab fa-cc-mastercard'
        },
        { label: 'American Express', value: 'Amex', icon: 'fab fa-cc-amex' },
        { label: 'Discover', value: 'Discover', icon: 'fab fa-cc-discover' },
        {
          label: 'Diners Club',
          value: 'Diners Club',
          icon: 'fab fa-cc-diners-club'
        },
        { label: 'JCB', value: 'JCB', icon: 'fab fa-cc-jcb' },
        {
          label: 'Maestro',
          value: 'Maestro',
          icon: require('~/assets/images/icons/cards/meastro.svg'),
          iconType: 'img'
        },
        {
          label: 'UnionPay',
          value: 'UnionPay',
          icon: require('~/assets/images/icons/cards/unionpay.svg'),
          iconType: 'img'
        },
        { label: this.$t('other'), value: 'Other', icon: 'fas fa-credit-card' }
      ]
    },

    cardExpMonthOptions () {
      return [
        { label: '----', value: null },
        { label: '01', value: '1' },
        { label: '02', value: '2' },
        { label: '03', value: '3' },
        { label: '04', value: '4' },
        { label: '05', value: '5' },
        { label: '06', value: '6' },
        { label: '07', value: '7' },
        { label: '08', value: '8' },
        { label: '09', value: '9' },
        { label: '10', value: '10' },
        { label: '11', value: '11' },
        { label: '12', value: '12' }
      ]
    },

    // ----------------- IDENTITY -----------------

    identityTitleOptions () {
      return [
        { label: '-- ' + this.$t('common.select') + ' --', value: null },
        { label: this.$t('common.mr'), value: 'mr' },
        { label: this.$t('common.mrs'), value: 'mrs' },
        { label: this.$t('common.ms'), value: 'ms' },
        { label: this.$t('common.dr'), value: 'dr' }
      ]
    },

    // ----------------- CITIZEN ID -----------------

    sexOptions () {
      return [
        { label: this.$t('common.male'), value: 't' },
        { label: this.$t('common.female'), value: 'f' },
        { label: this.$t('common.other'), value: 'o' }
      ]
    }
  },

  methods: {
    parseNotesOfNewTypes (originalCipher) {
      const cipher = cloneDeep(originalCipher)
      try {
        if (cipher.type === CipherType.CryptoWallet) {
          cipher.cryptoWallet = toCryptoWalletData(cipher.notes)
        }
        if (cipher.type === CipherType.DriverLicense) {
          cipher.driverLicense = toDriverLicenseData(cipher.notes)
        }
        if (cipher.type === CipherType.CitizenID) {
          cipher.citizenId = toCitizenIdData(cipher.notes)
        }
        if (cipher.type === CipherType.Passport) {
          cipher.passport = toPassportData(cipher.notes)
        }
        if (cipher.type === CipherType.SocialSecurityNumber) {
          cipher.ssn = toSocialSecurityNumberData(cipher.notes)
        }
        if (cipher.type === CipherType.WirelessRouter) {
          cipher.router = toWirelessRouterData(cipher.notes)
        }
        if (cipher.type === CipherType.Server) {
          cipher.server = toServerData(cipher.notes)
        }
      } catch (error) {
        //
      }
      return cipher
    },

    async getEncCipherForRequest (originalCipher, extraData = {}) {
      const cipher = cloneDeep(originalCipher)

      // user cannot add item to shared folders, but can add item to their sharing folder
      // -> create new = only sharing folders; update = both sharing and shared folders
      const {
        writeableCollections,
        nonWriteableCollections,
        cloneMode,
        isNewCipher,
        noCheck, // Just need to get an encrypted item without checking collections, etc
        encKey // Encryption key
      } = extraData

      // Change type to Note for new cipher types to encrypt first
      if (cipher.type === CipherType.CryptoWallet) {
        if (cipher.cryptoWallet) {
          cipher.notes = JSON.stringify({
            ...cipher.cryptoWallet,
            notes: cipher.notes
          })
        }
      }
      if (cipher.type === CipherType.DriverLicense) {
        if (cipher.driverLicense) {
          cipher.notes = JSON.stringify({
            ...cipher.driverLicense,
            notes: cipher.notes
          })
        }
      }
      if (cipher.type === CipherType.CitizenID) {
        if (cipher.citizenId) {
          cipher.notes = JSON.stringify({
            ...cipher.citizenId,
            notes: cipher.notes
          })
        }
      }
      if (cipher.type === CipherType.Passport) {
        if (cipher.passport) {
          cipher.notes = JSON.stringify({
            ...cipher.passport,
            notes: cipher.notes
          })
        }
      }
      if (cipher.type === CipherType.SocialSecurityNumber) {
        if (cipher.ssn) {
          cipher.notes = JSON.stringify({
            ...cipher.ssn,
            notes: cipher.notes
          })
        }
      }
      if (cipher.type === CipherType.WirelessRouter) {
        if (cipher.router) {
          cipher.notes = JSON.stringify({
            ...cipher.router,
            notes: cipher.notes
          })
        }
      }
      if (cipher.type === CipherType.Server) {
        if (cipher.server) {
          cipher.notes = JSON.stringify({
            ...cipher.server,
            notes: cipher.notes
          })
        }
      }
      if (this.newCipherTypes.includes(cipher.type)) {
        cipher.type = CipherType.SecureNote
        cipher.secureNote = new SecureNote(cipher.secureNote, true)
        cipher.secureNote.type = 0
      }

      if (!noCheck) {
        // Check if current folder is a collection (shared folder) or remove from old collection if move back to folder
        if (cipher.folderId) {
          const collections = isNewCipher
            ? writeableCollections
            : [...writeableCollections, ...nonWriteableCollections]
          const collection = collections.find(c => c.id === cipher.folderId)
          if (collection) {
            cipher.organizationId = collection.organizationId
            cipher.folderId = null
            cipher.collectionIds = [collection.id]
          } else {
            cipher.collectionIds = []

            // Remove org in clone mode
            if (cloneMode) {
              cipher.organizationId = null
            }
          }
        }

        // Remove orgId if item move out of collection to a folder or no folder
        if (cipher.organizationId) {
          const prevCollection = writeableCollections.find(
            c => c.organizationId === cipher.organizationId
          )
          if (
            prevCollection &&
            (cipher.folderId || !cipher.collectionIds.length)
          ) {
            cipher.organizationId = null
            cipher.collectionIds = []
          }
        }
      }

      // Encrypt cipher
      const cipherEnc = await this.$cipherService.encrypt(cipher, encKey)
      const data = new CipherRequest(cipherEnc)

      // Change type back after encryption
      data.type = originalCipher.type
      cipher.type = originalCipher.type

      return {
        data,
        collectionIds: cipher.collectionIds
      }
    },

    getCipherSubtitle (item) {
      if (item.type === CipherType.CryptoWallet && item.cryptoWallet) {
        return item.cryptoWallet.username
      }
      if (item.type === CipherType.DriverLicense && item.driverLicense) {
        return item.driverLicense.fullName
      }
      if (item.type === CipherType.CitizenID && item.citizenId) {
        return item.citizenId.fullName
      }
      if (item.type === CipherType.Passport && item.passport) {
        return item.passport.fullName
      }
      if (item.type === CipherType.SocialSecurityNumber && item.ssn) {
        return item.ssn.fullName
      }
      if (item.type === CipherType.WirelessRouter && item.router) {
        return item.router.deviceName
      }
      if (item.type === CipherType.Server && item.server) {
        return item.server.username
      }
      return item.subTitle
    },

    getCopyableValues (item) {
      switch (item.type) {
      case CipherType.Login:
        return [
          {
            value: item.login.username,
            label: 'common.username'
          },
          {
            value: item.login.password,
            label: 'common.password'
          }
        ]

      case CipherType.MasterPassword:
        return [
          {
            value: item.login.password,
            label: 'common.password'
          }
        ]
      case CipherType.SecureNote:
        return [
          {
            value: item.notes,
            label: 'common.note'
          }
        ]

      case CipherType.CryptoWallet:
        if (!item.cryptoWallet) {
          return []
        }
        return [
          {
            value: item.cryptoWallet.seed,
            label: 'data.ciphers.seed'
          },
          {
            value: item.cryptoWallet.address,
            label: 'data.ciphers.wallet_address'
          },
          {
            value: item.cryptoWallet.privateKey,
            label: 'data.ciphers.private_key'
          },
          {
            value: item.cryptoWallet.password,
            label: 'data.ciphers.password_pin'
          }
        ]

      case CipherType.DriverLicense:
        if (!item.driverLicense) {
          return []
        }
        return [
          {
            value: item.driverLicense.idNO,
            label: 'data.ciphers.drive_license.no'
          },
          {
            value: item.driverLicense.fullName,
            label: 'common.fullname'
          },
          {
            value: item.driverLicense.class,
            label: 'data.ciphers.drive_license.class'
          },
          {
            value: item.driverLicense.validUntil,
            label: 'data.ciphers.drive_license.valid_until'
          },
          {
            value: item.driverLicense.vehicleClass,
            label: 'data.ciphers.drive_license.vehicle_class'
          },
          {
            value: item.driverLicense.beginningDate,
            label: 'data.ciphers.drive_license.beginning_date'
          },
          {
            value: item.driverLicense.issuedBy,
            label: 'data.ciphers.drive_license.issued_by'
          }
        ]

      case CipherType.CitizenID:
        if (!item.citizenId) {
          return []
        }
        return [
          {
            value: item.citizenId.idNo,
            label: 'data.ciphers.citizen_id.id_no'
          },
          {
            value: item.citizenId.fullName,
            label: 'common.fullname'
          },
          {
            value: item.citizenId.placeOfOrigin,
            label: 'data.ciphers.citizen_id.place_of_origin'
          },
          {
            value: item.citizenId.placeOfResidence,
            label: 'data.ciphers.citizen_id.place_of_residence'
          },
          {
            value: item.citizenId.expiryDate,
            label: 'data.ciphers.citizen_id.expiry_date'
          },
          {
            value: item.citizenId.dateOfIssue,
            label: 'data.ciphers.citizen_id.date_of_issue'
          },
          {
            value: item.citizenId.issueBy,
            label: 'data.ciphers.citizen_id.issued_by'
          }
        ]

      case CipherType.Passport:
        if (!item.passport) {
          return []
        }
        return [
          {
            value: item.passport.passportID,
            label: 'data.ciphers.passport_type.passport_id'
          },
          {
            value: item.passport.code,
            label: 'data.ciphers.passport_type.code'
          },
          {
            value: item.passport.fullName,
            label: 'common.fullname'
          },
          {
            value: item.passport.idNumber,
            label: 'data.ciphers.passport_type.id_number'
          },
          {
            value: item.passport.placeOfIssue,
            label: 'data.ciphers.passport_type.place_of_issue'
          }
        ]

      case CipherType.SocialSecurityNumber:
        if (!item.ssn) {
          return []
        }
        return [
          {
            value: item.ssn.fullName,
            label: 'common.fullname'
          },
          {
            value: item.ssn.socialSecurityNumber,
            label: 'data.ciphers.ssn'
          },
          {
            value: item.ssn.dateOfIssue,
            label: 'data.ciphers.passport_type.date_of_issue'
          },
          {
            value: item.ssn.contry,
            label: 'common.nationality'
          }
        ]

      case CipherType.WirelessRouter:
        if (!item.router) {
          return []
        }
        return [
          {
            value: item.router.deviceName,
            label: 'data.ciphers.router.device_name'
          },
          {
            value: item.router.ipAddress,
            label: 'data.ciphers.router.router_ip_address'
          },
          {
            value: item.router.adminUsername,
            label: 'data.ciphers.router.admin_username'
          },
          {
            value: item.router.adminPassword,
            label: 'data.ciphers.router.admin_password'
          },
          {
            value: item.router.wifiSSID,
            label: 'data.ciphers.router.wifi_ssid'
          },
          {
            value: item.router.wifiPassword,
            label: 'data.ciphers.router.wifi_pw'
          }
        ]

      case CipherType.Server:
        if (!item.server) {
          return []
        }
        return [
          {
            value: item.server.host,
            label: 'data.ciphers.server.host'
          },
          {
            value: item.server.publicKey,
            label: 'data.ciphers.server.public_key'
          },
          {
            value: item.server.privateKey,
            label: 'data.ciphers.server.private_key'
          },
          {
            value: item.server.username,
            label: 'common.username'
          },
          {
            value: item.server.password,
            label: 'common.password'
          }
        ]
      }

      return []
    }
  }
})
