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
  // friendlyName: used for translation of old types
  // hideFromCipherList: hide from load all ciphers + add new options
  // noCreate: cannot create new item of this type + hide from add new options
  // noMenu: hide from sidebar
  // group: group cipher type to display in side menu or nav menu + its order in menu

  const res = {}
  res[CipherType.Login] = {
    type: CipherType.Login,
    routeName: 'passwords',
    label: 'passwords',
    friendlyName: 'Login',
    freeLimit: 100,
    csvTypeName: 'login',
    group: 'other'
  }
  res[CipherType.MasterPassword] = {
    type: CipherType.MasterPassword,
    routeName: 'passwords',
    label: 'passwords',
    noMenu: true,
    noCreate: true,
    group: 'other'
  }
  res[CipherType.SecureNote] = {
    type: CipherType.SecureNote,
    routeName: 'notes',
    label: 'notes',
    friendlyName: 'SecureNote',
    freeLimit: 50,
    csvTypeName: 'note',
    group: 'other'
  }
  res[CipherType.Card] = {
    type: CipherType.Card,
    routeName: 'cards',
    label: 'cards',
    friendlyName: 'Card',
    freeLimit: 5,
    csvTypeName: 'card',
    group: 'other'
  }
  res[CipherType.Identity] = {
    type: CipherType.Identity,
    routeName: 'identities',
    label: 'identities',
    friendlyName: 'Identity',
    freeLimit: 10,
    csvTypeName: 'identity',
    group: 'identity'
  }
  res[CipherType.TOTP] = {
    type: CipherType.TOTP,
    noMenu: true,
    hideFromCipherList: true,
    csvTypeName: 'totp',
    group: 'other'
  }
  res[CipherType.CryptoWallet] = {
    type: CipherType.CryptoWallet,
    routeName: 'crypto-backups',
    label: 'crypto_backups',
    freeLimit: 5,
    csvTypeName: 'crypto-wallet',
    group: 'other'
  }
  res[CipherType.DriverLicense] = {
    type: CipherType.DriverLicense,
    routeName: 'driver-licenses',
    label: 'driver-licenses',
    freeLimit: 5,
    csvTypeName: 'driver-license',
    group: 'identity'
  }
  res[CipherType.CitizenID] = {
    type: CipherType.CitizenID,
    routeName: 'citizen-ids',
    label: 'citizen-ids',
    freeLimit: 5,
    csvTypeName: 'citizen-id',
    group: 'identity'
  }
  res[CipherType.Passport] = {
    type: CipherType.Passport,
    routeName: 'passports',
    label: 'passports',
    freeLimit: 5,
    csvTypeName: 'passport',
    group: 'identity'
  }
  res[CipherType.SocialSecurityNumber] = {
    type: CipherType.SocialSecurityNumber,
    routeName: 'ssns',
    label: 'ssns',
    freeLimit: 5,
    csvTypeName: 'social-security-number',
    group: 'identity'
  }
  res[CipherType.WirelessRouter] = {
    type: CipherType.WirelessRouter,
    routeName: 'routers',
    label: 'routers',
    freeLimit: 5,
    csvTypeName: 'wireless-router',
    group: 'dev'
  }
  res[CipherType.Server] = {
    type: CipherType.Server,
    routeName: 'servers',
    label: 'servers',
    freeLimit: 5,
    csvTypeName: 'server',
    group: 'dev'
  }
  res[CipherType.APICipher] = {
    type: CipherType.APICipher,
    routeName: 'apis',
    label: 'apis',
    freeLimit: 5,
    csvTypeName: 'api-cipher',
    group: 'dev'
  }
  res[CipherType.Database] = {
    type: CipherType.Database,
    routeName: 'databases',
    label: 'databases',
    freeLimit: 5,
    csvTypeName: 'database',
    group: 'dev'
  }
  return res
})()
