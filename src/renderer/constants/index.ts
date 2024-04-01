import { CipherType } from '../jslib/src/enums/cipherType'

export const MIN_MASTER_PW_LEN = 8

export class AccountRole {
  static OWNER = 0
  static ADMIN = 1
  static MANAGER = 3
  static MEMBER = 2
}

export enum PlanPeriod {
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export const CipherMapper = (() => {
  // Notes: do not add friendly name for new cipher types
  // friendlyName: used for translation of old types
  // hideFromCipherList: hide from load all ciphers + add new options
  // noCreate: cannot create new item of this type + hide from add new options
  // noMenu: hide from sidebar
  // group: group cipher type to display in side menu or nav menu + its order in menu
  // revertToNote: convert back to note

  const res: {
    [type: number]: {
      type: CipherType
      routeName?: string
      label?: string
      friendlyName?: string
      freeLimit?: number
      csvTypeName?: string
      group: string
      hideFromCipherList?: boolean
      noCreate?: boolean
      noMenu?: boolean
      revertToNote?: boolean
    }
  } = {}

  res[CipherType.Login] = {
    type: CipherType.Login,
    routeName: 'password-items',
    label: 'passwords',
    friendlyName: 'Login',
    freeLimit: 100,
    csvTypeName: 'login',
    group: 'other'
  }
  res[CipherType.MasterPassword] = {
    type: CipherType.MasterPassword,
    routeName: 'password-items',
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
    freeLimit: 10,
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
    group: 'identity',
    noMenu: true,
    noCreate: true,
    revertToNote: true
  }
  res[CipherType.CitizenID] = {
    type: CipherType.CitizenID,
    routeName: 'citizen-ids',
    label: 'citizen-ids',
    freeLimit: 5,
    csvTypeName: 'citizen-id',
    group: 'identity',
    noMenu: true,
    noCreate: true,
    revertToNote: true
  }
  res[CipherType.Passport] = {
    type: CipherType.Passport,
    routeName: 'passports',
    label: 'passports',
    freeLimit: 5,
    csvTypeName: 'passport',
    group: 'identity',
    noMenu: true,
    noCreate: true,
    revertToNote: true
  }
  res[CipherType.SocialSecurityNumber] = {
    type: CipherType.SocialSecurityNumber,
    routeName: 'ssns',
    label: 'ssns',
    freeLimit: 5,
    csvTypeName: 'social-security-number',
    group: 'identity',
    noMenu: true,
    noCreate: true,
    revertToNote: true
  }
  res[CipherType.WirelessRouter] = {
    type: CipherType.WirelessRouter,
    routeName: 'routers',
    label: 'routers',
    freeLimit: 5,
    csvTypeName: 'wireless-router',
    group: 'dev',
    noMenu: true,
    noCreate: true,
    revertToNote: true
  }
  res[CipherType.Server] = {
    type: CipherType.Server,
    routeName: 'servers',
    label: 'servers',
    freeLimit: 5,
    csvTypeName: 'server',
    group: 'dev',
    noMenu: true,
    noCreate: true,
    revertToNote: true
  }
  res[CipherType.APICipher] = {
    type: CipherType.APICipher,
    routeName: 'apis',
    label: 'apis',
    freeLimit: 5,
    csvTypeName: 'api-cipher',
    group: 'dev',
    noMenu: true,
    noCreate: true,
    revertToNote: true
  }
  res[CipherType.Database] = {
    type: CipherType.Database,
    routeName: 'databases',
    label: 'databases',
    freeLimit: 5,
    csvTypeName: 'database',
    group: 'dev',
    noMenu: true,
    noCreate: true,
    revertToNote: true
  }
  return res
})()
