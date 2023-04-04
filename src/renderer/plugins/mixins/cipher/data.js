import Vue from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import { CipherType } from '../../../core/enums/cipherType'
import { CipherRequest } from '@/jslib/src/models/request'
import { SecureNote } from '@/jslib/src/models/domain'

Vue.mixin({
  computed: {
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
    }
  },

  methods: {
    parseNotesOfNewTypes (originalCipher) {
      const cipher = cloneDeep(originalCipher)
      try {
        if (cipher.type === CipherType.CryptoWallet) {
          cipher.cryptoWallet = JSON.parse(cipher.notes)
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
      }

      return []
    }
  }
})
