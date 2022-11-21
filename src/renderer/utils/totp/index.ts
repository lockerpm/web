const totp = require('totp-generator')

export interface OTPData {
  account?: string
  secret: string
  algorithm?: 'SHA-1' | 'SHA-256' | 'SHA-512' | 'MD-5' | string
  period?: number
  digits?: number
}

export const getTOTP = (otp: OTPData) => {
  try {
    const res = totp(otp.secret, {
      algorithm: otp.algorithm || 'SHA-1',
      period: otp.period || 30,
      digits: otp.digits || 6
    })
    if (!res) {
      console.log(otp.account)
    }
    return res
  } catch (e) {
    console.error(e)
    return 'N/A'
  }
}

// Parse OTP from URI
export const parseOTPUri = (uri: string) => {
  const res: OTPData = {
    account: undefined,
    secret: undefined,
    algorithm: undefined,
    period: undefined,
    digits: undefined
  }

  if (!uri) {
    return res
  }

  const components = uri.split('/')

  if (!components.length) {
    return res
  }

  const data = components[components.length - 1].split('?')

  if (!data.length) {
    return res
  }

  const account = decodeURIComponent(data[0])
  const query = _parseQueryString(data[1])

  res.account = (query.issuer && !account.startsWith(query.issuer)) ? `${query.issuer} (${account})` : account
  res.secret = query.secret
  res.algorithm = _parseAlgorithm(query.algorithm)
  try {
    res.period = parseInt(query.period)
  } catch (e) {
    // Do nothing
  }
  if (!res.period) {
    res.period = 30
  }
  try {
    res.digits = parseInt(query.digits)
  } catch (e) {
    // Do nothing
  }
  if (!res.digits) {
    res.digits = 6
  }

  return res
}

// ------------------ SUPPORT --------------------

const _parseQueryString = (query: string) => {
  const vars = query.split('&')
  const queryString = {
    account: undefined,
    secret: undefined,
    algorithm: undefined,
    period: undefined,
    digits: undefined,
    data: undefined,
    issuer: undefined
  }
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    const key = decodeURIComponent(pair[0])
    const value = decodeURIComponent(pair[1])
    if (typeof queryString[key] === 'undefined') {
      queryString[key] = decodeURIComponent(value)
    } else if (typeof queryString[key] === 'string') {
      const arr = [queryString[key], decodeURIComponent(value)]
      queryString[key] = arr
    } else {
      queryString[key].push(decodeURIComponent(value))
    }
  }
  return queryString
}

const _parseAlgorithm = (algo: string) => {
  if (!algo) {
    return 'SHA-1'
  }

  switch (algo.toLowerCase()) {
  case 'sha1':
    return 'SHA-1'
  case 'sha256':
    return 'SHA-256'
  case 'sha512':
    return 'SHA-512'
  case 'md5':
    return 'MD5'
  }
  return 'SHA-1'
}

export const beautifyName = (name: string) => {
  try {
    if (name.includes(':')) {
      const components = name.split(':')
      const provider = components[0]
      const account = components.slice(1).join(':')
      return `${provider} (${account})`
    }
  } catch (e) {
    return name
  }

  return name
}
