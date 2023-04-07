import { CipherType } from '../core/enums/cipherType'

export const MIN_MASTER_PW_LEN = 8

export class AccountRole {
  static OWNER = 0
  static ADMIN = 1
  static MANAGER = 3
  static MEMBER = 2
}

export const CipherMapper = (() => {
  // Notes: do not add friendly name for new cipher types
  // Friendly name only used for translation of old types
  const res = {}
  res[CipherType.Login] = {
    type: CipherType.Login,
    routeName: 'passwords',
    label: 'passwords',
    friendlyName: 'Password',
    freeLimit: 100,
    csvTypeName: 'login'
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
    friendlyName: 'Note',
    freeLimit: 50,
    csvTypeName: 'note'
  }
  res[CipherType.Card] = {
    type: CipherType.Card,
    routeName: 'cards',
    label: 'cards',
    friendlyName: 'Card',
    freeLimit: 5,
    csvTypeName: 'card'
  }
  res[CipherType.Identity] = {
    type: CipherType.Identity,
    routeName: 'identities',
    label: 'identities',
    friendlyName: 'Identity',
    freeLimit: 10,
    csvTypeName: 'identity'
  }
  res[CipherType.TOTP] = {
    type: CipherType.TOTP,
    noMenu: true,
    hideFromCipherList: true,
    csvTypeName: 'totp'
  }
  res[CipherType.CryptoWallet] = {
    type: CipherType.CryptoWallet,
    routeName: 'crypto-backups',
    label: 'crypto_backups',
    freeLimit: 5,
    csvTypeName: 'crypto-wallet'
  }
  res[CipherType.DriverLicense] = {
    type: CipherType.DriverLicense,
    routeName: 'driver-licenses',
    label: 'driver-licenses',
    freeLimit: 5,
    csvTypeName: 'driver-license'
  }
  res[CipherType.CitizenID] = {
    type: CipherType.CitizenID,
    routeName: 'citizen-ids',
    label: 'citizen-ids',
    freeLimit: 5,
    csvTypeName: 'citizen-id'
  }
  res[CipherType.Passport] = {
    type: CipherType.Passport,
    routeName: 'passports',
    label: 'passports',
    freeLimit: 5,
    csvTypeName: 'passport'
  }
  res[CipherType.SocialSecurityNumber] = {
    type: CipherType.SocialSecurityNumber,
    routeName: 'ssns',
    label: 'ssns',
    freeLimit: 5,
    csvTypeName: 'social-security-number'
  }
  res[CipherType.WirelessRouter] = {
    type: CipherType.WirelessRouter,
    routeName: 'routers',
    label: 'routers',
    freeLimit: 5,
    csvTypeName: 'wireless-router'
  }
  res[CipherType.Server] = {
    type: CipherType.Server,
    routeName: 'servers',
    label: 'servers',
    freeLimit: 5,
    csvTypeName: 'server'
  }
  res[CipherType.APICipher] = {
    type: CipherType.APICipher,
    routeName: 'apis',
    label: 'apis',
    freeLimit: 5,
    csvTypeName: 'api-cipher'
  }
  res[CipherType.Database] = {
    type: CipherType.Database,
    routeName: 'databases',
    label: 'databases',
    freeLimit: 5,
    csvTypeName: 'database'
  }
  return res
})()
