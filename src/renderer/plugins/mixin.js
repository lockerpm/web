import Vue from 'vue'
import { nanoid } from 'nanoid'
import extractDomain from 'extract-domain'
import find from 'lodash/find'
import numeral from 'numeral'
import { Avatar } from 'element-ui'
import { LoginUriView, LoginView } from '../jslib/src/models/view'
import { CipherRequest } from '../jslib/src/models/request'
import { CipherType } from '../core/enums/cipherType'
import { SyncResponse } from '../core/models/response/syncResponse'
import { WALLET_APP_LIST } from '../utils/crypto/applist/index'
import { CipherView } from '../core/models/view/cipherView'

// Vue.use(Image)
Vue.mixin({
  data () {
    return { folders: [] }
  },
  computed: {
    language () { return this.$store.state.user.language },
    locale () { return this.$store.state.i18n.locale },
    currentUser () { return this.$store.state.user },
    currentUserPw () { return this.$store.state.userPw },
    environment () { return this.$store.state.environment },
    isLoggedIn () {
      return this.$store.state.isLoggedIn
    },
    isAllPage () {
      return this.getRouteBaseName() === 'vault'
    },
    searchText () { return this.$store.state.searchText },
    teams () { return this.$store.state.teams || [] },
    currentOrg () {
      // return find(this.teams, team => team.id === this.$route.params.teamId) || {}
      return this.teams.length ? this.teams[0] : {}
    },
    currentPlan () {
      return this.$store.state.currentPlan
    },
    cipherCount () {
      return this.$store.state.cipherCount
    },
    pendingShares () {
      return this.$store.state.pendingShares
    },
    blog_categories () {
      return this.$t('blog.categories')
    },
    extensionLoggedIn () {
      return this.$store.state.extensionLoggedIn
    },
    myShares () {
      return this.$store.state.myShares
    },
    shareInvitations () {
      return this.$store.state.shareInvitations
    },
    enterpriseInvitations () {
      return this.$store.state.enterpriseInvitations
    },
    enterprisePolicies () {
      return this.$store.state.enterprisePolicies
    },
    enterpriseUrl () {
      return process.env.lockerEnterprise
    }
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    changeLang (value) {
      if (value === 'vi') {
        this.$moment.locale('vi', {
          months: 'tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12'.split('_'),
          monthsShort: 'Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12'.split('_'),
          relativeTime: {
            future: '%s tới',
            past: '%s trước',
            s: 'Vài giây',
            m: '1 phút',
            mm: '%d phút',
            h: '1 giờ',
            hh: '%d giờ',
            d: '1 ngày',
            dd: '%d ngày',
            M: '1 tháng',
            MM: '%d tháng',
            y: '1 năm',
            yy: '%d năm'
          },
          longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D MMMM [năm] YYYY',
            LLL: 'D MMMM [năm] YYYY HH:mm',
            LLLL: 'dddd, D MMMM [năm] YYYY HH:mm',
            l: 'DD/M/YYYY',
            ll: 'D MMM YYYY',
            lll: 'D MMM YYYY HH:mm',
            llll: 'ddd, D MMM YYYY HH:mm'
          },
          week: {
            dow: 1 // Monday is the first day of the week.
          }
        })
      } else {
        this.$moment.locale('en')
      }
      this.$store.dispatch('SetLang', value).then(() => {
        this.$i18n.setLocale(value)
        this.$router.push(this.switchLocalePath(value))
      })
    },
    changeLocale (value) {
      this.$i18n.setLocale(value)
    },
    async logout () {
      console.log('###### LOG OUT')
      await this.$axios.$post('/users/logout')
      await this.$cryptoService.clearKeys()
      await this.$userService.clear()
      await this.$cookies.remove('cs_locker_token')
      this.$store.commit('UPDATE_IS_LOGGEDIN', false)
      this.$router.push(this.localeRoute({ name: 'login' }))
      window.Intercom('shutdown')
      window.intercomSettings = { app_id: 'hjus3ol6', api_base: 'https://hjus3ol6.intercom-messenger.com' }
      window.Intercom('boot', { app_id: 'hjus3ol6' })
    },
    async lock () {
      await Promise.all([
        this.$cryptoService.clearKey(),
        this.$cryptoService.clearOrgKeys(true),
        this.$cryptoService.clearKeyPair(true),
        this.$cryptoService.clearEncKey(true)
      ])

      this.$folderService.clearCache()
      this.$cipherService.clearCache()
      this.$collectionService.clearCache()
      this.$searchService.clearIndex()
      this.$router.push(this.localeRoute({ name: 'lock' }))
    },
    randomString () {
      return nanoid()
    },
    notify (message, type, html = false, duration = 8000) {
      this.$notify({
        title: this.$t(`common.${type}`),
        message,
        type,
        duration,
        dangerouslyUseHTMLString: html,
        top: 50
      })
    },
    async genKey (masterPassword, email) {
      try {
        const key = await this.$cryptoService.makeKey(masterPassword, email, 0, 100000)
        const hashedPassword = await this.$cryptoService.hashPassword(masterPassword, key)
        return hashedPassword
      } catch (e) {
        return ''
      }
    },
    async createEncryptedMasterPwItem (masterPw, encKey) {
      const cipher = new CipherView()
      cipher.type = CipherType.Login
      const loginData = new LoginView()
      loginData.username = 'locker.io'
      loginData.password = masterPw
      const uriView = new LoginUriView()
      uriView.uri = 'https://locker.io'
      loginData.uris = [uriView]
      cipher.login = loginData
      cipher.name = 'Locker Master Password'
      const cipherEnc = await this.$cipherService.encrypt(cipher, encKey)
      const data = new CipherRequest(cipherEnc)
      data.type = CipherType.MasterPassword
      return data
    },
    async login () {
      const lockerDeviceId = this.$cookies.get('locker_device_id')
      const deviceIdentifier = lockerDeviceId || this.randomString()
      if (!lockerDeviceId) {
        const expireTime = 50 * 365 * 24 * 3600
        this.$cookies.set('locker_device_id', deviceIdentifier, { maxAge: expireTime })
      }
      try {
        await this.clearKeys()
        const key = await this.$cryptoService.makeKey(this.masterPassword, this.currentUser.email, 0, 100000)
        const hashedPassword = await this.$cryptoService.hashPassword(this.masterPassword, key)
        const res = await this.$axios.$post('cystack_platform/pm/users/session', {
          client_id: 'web',
          password: hashedPassword,
          device_name: this.$platformUtilsService.getDeviceString(),
          device_type: this.$platformUtilsService.getDevice(),
          device_identifier: deviceIdentifier
        })
        this.$messagingService.send('loggedIn')
        await this.$tokenService.setTokens(res.access_token, res.refresh_token)
        await this.$userService.setInformation(this.$tokenService.getUserId(), this.currentUser.email, 0, 100000)
        await this.$cryptoService.setKey(key)
        await this.$cryptoService.setKeyHash(hashedPassword)
        await this.$cryptoService.setEncKey(res.key)
        await this.$cryptoService.setEncPrivateKey(res.private_key)

        if (this.$vaultTimeoutService != null) {
          this.$vaultTimeoutService.biometricLocked = false
        }
        // this.$messagingService.send('unlocked')

        // Create master pw item if not exists
        if (res.has_no_master_pw_item) {
          try {
            const encMasterPwItem = await this.createEncryptedMasterPwItem(this.masterPassword)
            const passwordStrength = this.$passwordGenerationService.passwordStrength(this.masterPassword, ['cystack']) || {}
            await this.$axios.$post('cystack_platform/pm/ciphers/vaults', {
              ...encMasterPwItem,
              score: passwordStrength.score,
              collectionIds: []
            })
          } catch (e) {
            console.log(e)
            // this.errors = (e.response && e.response.data && e.response.data.details) || {}
          }
        }

        this.$store.commit('UPDATE_SYNCING', true)
        this.$router.push(this.localeRoute({ path: this.$store.state.currentPath === '/lock' ? '/vault' : this.$store.state.currentPath }))
      } catch (e) {
        if (e.response && e.response.data && e.response.data.message && e.response.data.code !== '0004') {
          this.notify(e.response.data.message, 'warning')
        } else {
          this.notify(this.$t('errors.invalid_master_password'), 'warning')
        }
      }
    },
    async clearKeys () {
      await this.$cryptoService.clearKeys()
    },
    async getSyncData () {
      this.$store.commit('UPDATE_SYNCING', true)
      const pageSize = 100
      try {
        let page = 1
        let allCiphers = []
        const userId = await this.$userService.getUserId()
        this.$messagingService.send('syncStarted')
        while (true) {
          let res = await this.$axios.$get(`cystack_platform/pm/sync?paging=1&size=${pageSize}&page=${page}`)
          if (res.count && res.count.ciphers) {
            this.$store.commit('UPDATE_CIPHER_COUNT', res.count.ciphers)
          }
          const enterprisePolicies = {}
          res.policies.forEach(element => {
            enterprisePolicies[element.policyType] = element
          })
          this.$store.commit('UPDATE_ENTERPRISE_POLICIES', enterprisePolicies)
          res = new SyncResponse(res)
          allCiphers = allCiphers.concat(res.ciphers)
          await this.$syncService.syncProfile(res.profile)
          await this.$syncService.syncFolders(userId, res.folders)
          await this.$syncService.syncCollections(res.collections)
          await this.$syncService.syncSomeCiphers(userId, res.ciphers)
          await this.$syncService.syncSends(userId, res.sends)
          await this.$syncService.syncSettings(userId, res.domains)
          await this.$syncService.syncPolicies(res.policies)
          await this.$syncService.setLastSync(new Date())
          this.$store.commit('UPDATE_SYNCED_CIPHERS')
          if (page * pageSize >= this.cipherCount) {
            break
          }
          page += 1
        }
        // delete cached cipher if it is not in sync data
        const decryptedCipherCache = this.$cipherService.decryptedCipherCache
        decryptedCipherCache.forEach(function (cipher, i) {
          const syncIndex = allCiphers.findIndex(c => c.id === cipher.id)
          if (syncIndex < 0) {
            decryptedCipherCache.splice(i, 1)
          }
        })
        // this.$cipherService.decryptedCipherCache(decryptedCipherCache)
        this.$messagingService.send('syncCompleted', { successfully: true })
        console.log('sync completed')
      } catch (e) {
        this.$messagingService.send('syncCompleted', { successfully: false })
        this.$store.commit('UPDATE_SYNCED_CIPHERS')
      } finally {
        this.$store.commit('UPDATE_SYNCING', false)
      }
    },
    // async getSyncData () {
    //   this.$store.commit('UPDATE_SYNCING', true)
    //   try {
    //     const userId = await this.$userService.getUserId()
    //     // partial sync if no ciphers in storage
    //     if (this.$cipherService.decryptedCipherCache === null) {
    //       try {
    //         this.$messagingService.send('syncStarted')
    //         let res = await this.$axios.$get('cystack_platform/pm/sync?paging=1&size=50&page=1')
    //         if (res.count && res.count.ciphers) {
    //           this.$store.commit('UPDATE_CIPHER_COUNT', res.count.ciphers)
    //         }
    //         res = new SyncResponse(res)
    //         await this.$syncService.syncProfile(res.profile)
    //         await this.$syncService.syncFolders(userId, res.folders)
    //         await this.$syncService.syncCollections(res.collections)
    //         await this.$syncService.syncCiphers(userId, res.ciphers)
    //         await this.$syncService.syncSends(userId, res.sends)
    //         await this.$syncService.syncSettings(userId, res.domains)
    //         await this.$syncService.syncPolicies(res.policies)
    //         await this.$syncService.setLastSync(new Date())
    //         this.$messagingService.send('syncCompleted', { successfully: true })
    //         this.$store.commit('UPDATE_SYNCED_CIPHERS')
    //       } catch (error) {
    //         this.$messagingService.send('syncCompleted', { successfully: false })
    //         this.$store.commit('UPDATE_SYNCED_CIPHERS')
    //       }
    //     }
    //     this.$messagingService.send('syncStarted')
    //     let res = await this.$axios.$get('cystack_platform/pm/sync')
    //     if (res.count && res.count.ciphers) {
    //       this.$store.commit('UPDATE_CIPHER_COUNT', res.count.ciphers)
    //     }
    //     res = new SyncResponse(res)
    //     // const userId = await this.$userService.getUserId()
    //     await this.$syncService.syncProfile(res.profile)
    //     await this.$syncService.syncFolders(userId, res.folders)
    //     await this.$syncService.syncCollections(res.collections)
    //     await this.$syncService.syncCiphers(userId, res.ciphers)
    //     await this.$syncService.syncSends(userId, res.sends)
    //     await this.$syncService.syncSettings(userId, res.domains)
    //     await this.$syncService.syncPolicies(res.policies)
    //     await this.$syncService.setLastSync(new Date())
    //     this.$messagingService.send('syncCompleted', { successfully: true })
    //     console.log('sync completed')
    //     this.$store.commit('UPDATE_SYNCED_CIPHERS')
    //     // console.log('PUT scores')
    //     // console.log('PUT scores completed')
    //   } catch (e) {
    //     this.$messagingService.send('syncCompleted', { successfully: false })
    //     this.$store.commit('UPDATE_SYNCED_CIPHERS')
    //   } finally {
    //     this.$store.commit('UPDATE_SYNCING', false)
    //   }
    // },
    async weakPasswordScores () {
      const weakPasswordScores = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 }
      const allCiphers = await this.$cipherService.getAllDecrypted()
      const isUserNameNotEmpty = c => {
        return c.login.username != null && c.login.username.trim() !== ''
      }
      allCiphers.forEach(c => {
        if (c.type !== CipherType.Login || c.login.password == null || c.login.password === '' || c.isDeleted || c.organizationId) {
          return
        }
        const hasUserName = isUserNameNotEmpty(c)
        let userInput = []
        if (hasUserName) {
          const atPosition = c.login.username.indexOf('@')
          if (atPosition > -1) {
            userInput = userInput.concat(
              c.login.username.substr(0, atPosition).trim().toLowerCase().split(/[^A-Za-z0-9]/))
              .filter(i => i.length >= 3)
          } else {
            userInput = c.login.username.trim().toLowerCase().split(/[^A-Za-z0-9]/)
              .filter(i => i.length >= 3)
          }
        }
        const result = this.$passwordGenerationService.passwordStrength(c.login.password,
          userInput.length > 0 ? userInput : null)
        weakPasswordScores[result.score]++
      })
      await this.$axios.$put('/cystack_platform/pm/users/me', {
        scores: weakPasswordScores
      })
      return weakPasswordScores
    },
    async getFolders () {
      return await this.$folderService.getAllDecrypted()
    },
    async getCollections () {
      return await this.$collectionService.getAllDecrypted()
    },
    async getOrganizations () {
      return await this.$userService.getAllOrganizations()
    },
    clipboardSuccessHandler () {
      this.notify(this.$t('common.copied'), 'success')
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
                return (this.$createElement(Avatar, {
                  props: {
                    src: `${process.env.logoUrl}${domain}?size=${size}`,
                    size,
                    alt: domain,
                    shape: 'square'
                  }
                }, [
                  this.$createElement('img', {
                    attrs: {
                      src: require('~/assets/images/icons/icon_Login.svg')
                    }
                  })
                ]))
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
      case 6:
        return this.getIconDefaultCipher('CryptoAccount', size)
      case 7:
        if (!defaultIcon) {
          if (cipher.cryptoWallet && cipher.cryptoWallet.walletApp) {
            try {
              const selectedApp = WALLET_APP_LIST.find(a => a.alias === cipher.cryptoWallet.walletApp.alias)
              return (this.$createElement(Avatar, {
                props: {
                  src: selectedApp.logo,
                  size,
                  alt: selectedApp.name,
                  shape: 'square'
                }
              }, [
                this.$createElement('img', {
                  attrs: {
                    src: require('~/assets/images/icons/icon_CryptoWallet.svg')
                  }
                })
              ]))
            } catch (e) {
              return this.getIconDefaultCipher('CryptoWallet', size)
            }
          }
        }
        return this.getIconDefaultCipher('CryptoWallet', size)
      case 'Shares':
        return this.getIconDefaultCipher('Shares', size)
      case 'Trash':
        return this.getIconDefaultCipher('Trash', size)
      case 'Vault':
        return this.getIconDefaultCipher('Dashboard', size)
      default:
        return ''
      }
    },
    getIconDefaultCipher (type, size = 70) {
      return this.$createElement('img', {
        attrs: {
          src: require(`~/assets/images/icons/icon_${type}.svg`),
          style: `height: ${size}px`,
          class: 'rounded mx-auto'
        }
      })
    },
    routerCipher (cipher, callbackDeleted) {
      if (cipher.isDeleted) {
        callbackDeleted(cipher)
        return
      }

      if (this.getRouteBaseName() === 'vault') {
        this.$router.push(this.localeRoute({
          name: 'vault-id',
          params: { id: cipher.id }
        }))
        return
      }
      if (this.getRouteBaseName() === 'vault-folders-folderId') {
        this.$router.push(this.localeRoute({
          name: 'vault-folders-folderId-id',
          params: { ...this.$route.params, id: cipher.id }
        }))
        return
      }

      if (this.getRouteBaseName() === 'vault-teams-teamId-tfolders-tfolderId') {
        this.$router.push(this.localeRoute({
          name: 'vault-teams-teamId-tfolders-tfolderId-id',
          params: { ...this.$route.params, id: cipher.id }
        }))
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
      }
      this.$router.push(this.localeRoute({
        name: name + '-id',
        params: { id: cipher.id }
      }))
    },
    isOwner (teams, cipher) {
      if (cipher.organizationId) {
        const team = this.getTeam(teams, cipher.organizationId)
        if (team.type === 0) {
          return true
        }
        return false
      }
      return true
    },
    getTeam (teams, orgId) {
      return find(teams, e => e.id === orgId) || {}
    },
    // isOwner (teams, item) {
    //   const team = this.getTeam(teams, item.organizationId)
    //   if (team.id) {
    //     return team.type === 0
    //   }
    //   return true
    // },
    canManageItem (teams, item) {
      const team = this.getTeam(teams, item.organizationId)
      // if (team.organization_id) {
      //   return ['owner', 'admin', 'manager'].includes(team.role)
      // }
      if (team.id) {
        return [0, 1].includes(team.type)
      }
      return true
    },
    canViewItem (teams, item) {
      const team = this.getTeam(teams, item.organizationId)
      if (team.id) {
        return [0, 1, 3].includes(team.type) || item.viewPassword
      }
      return true
    },
    canManageFolder (teams, item) {
      const team = this.getTeam(teams, item.organizationId)
      if (team.organization_id) {
        return ['owner', 'admin'].includes(team.role)
      }
      return true
    },
    openNewTab (link) {
      if (!link.match(/^https?:\/\//i)) {
        link = 'http://' + link
      }
      window.open(link, '_blank')
      // this.$platformUtilsService.launchUri(link)
    },
    sanitizeUrl (connectionUrl) {
      if (connectionUrl.startsWith('//')) {
        const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws'
        connectionUrl = `${scheme}:${connectionUrl}`
      }

      return connectionUrl
    },
    // Blog subscribe
    subscribe (email) {
      const payload = {
        email,
        subscribed: true,
        service: 'locker-blog-subscribe'
      }
      return this.$axios.put('https://tracking.cystack.net/v2/email/subscription', payload)
    },
    validateEmail (email) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true
      }
      return false
    },
    goToInstall (app) {
      switch (app) {
      case 'extension':
        window.open(process.env.extensionLink, '_blank')
        break
      case 'android':
        window.open(process.env.androidLink, '_blank')
        break
      case 'ios':
        window.open(process.env.iosLink, '_blank')
        break
      default:
        this.$router.push(this.localeRoute({ name: 'download' }))
      }
    },
    // Check password policy
    checkPasswordPolicy (password, policy_type = 'password_requirement') {
      const violations = []
      if (!this.enterprisePolicies) {
        return violations
      }
      const policy = this.enterprisePolicies[policy_type]
      if (policy && policy.enabled) {
        if (policy.config.minLength && password.length < policy.config.minLength) {
          violations.push(
            this.$t('data.password_policies.min_password_length', { length: policy.config.minLength })
          )
        }
        if (policy.config.requireSpecialCharacter) {
          const reg = /(?=.*[!@#$%^&*])/
          const check = reg.test(password)
          if (!check) {
            violations.push(this.$t('data.password_policies.requires_special'))
          }
        }
        if (policy.config.requireLowerCase) {
          const reg = /[a-z]/
          const check = reg.test(password)
          if (!check) {
            violations.push(this.$t('data.password_policies.requires_lowercase'))
          }
        }
        if (policy.config.requireUpperCase) {
          const reg = /[A-Z]/
          const check = reg.test(password)
          if (!check) {
            violations.push(this.$t('data.password_policies.requires_uppercase'))
          }
        }
        if (policy.config.requireDigit) {
          const reg = /[1-9]/
          const check = reg.test(password)
          if (!check) {
            violations.push(this.$t('data.password_policies.requires_number'))
          }
        }
      }
      return violations
    },
    listPasswordPolicy (policy_type = 'password_requirement') {
      const res = []
      if (!this.enterprisePolicies) {
        return []
      }
      const policy = this.enterprisePolicies[policy_type]
      if (policy && policy.enabled) {
        if (policy.config.minLength) {
          res.push(
            this.$t('data.password_policies.min_password_length', { length: policy.config.minLength })
          )
        }
        if (policy.config.requireSpecialCharacter) {
          res.push(this.$t('data.password_policies.requires_special'))
        }
        if (policy.config.requireLowerCase) {
          res.push(this.$t('data.password_policies.requires_lowercase'))
        }
        if (policy.config.requireUpperCase) {
          res.push(this.$t('data.password_policies.requires_uppercase'))
        }
        if (policy.config.requireDigit) {
          res.push(this.$t('data.password_policies.requires_number'))
        }
      }
      return res
    },
    openIntercom () {
      if (window.Intercom) { window.Intercom('show') }
    }
  }
})

Vue.filter('filterPassword', function (value, showPassword) {
  if (value && !showPassword) {
    let result = ''
    for (let i = 0; i < value.length; i++) {
      result += '*'
    }
    return result
  }
  return value
})

Vue.filter('filterString', function (value) {
  return value
})

Vue.filter('formatPercentage', function (value) {
  if (!Number.isNaN(value)) {
    return numeral(value).format('0.[00]')
  }
  return 0
})

Vue.filter('formatNumber', function (value) {
  if (!Number.isNaN(value)) {
    return numeral(value).format('0,0.[00]')
  }
  return 0
})
