import Vue from 'vue'
import { nanoid } from 'nanoid'
import extractDomain from 'extract-domain'
import { CipherType } from '../jslib/src/enums'

Vue.mixin({
  data () {
    return { folders: [] }
  },
  computed: {
    language () { return this.$store.state.user.language },
    currentUser () { return this.$store.state.user },
    currentUserPw () { return this.$store.state.userPw },
    environment () { return this.$store.state.environment },
    isLoggedIn () {
      return this.$store.state.isLoggedIn
    },
    isAllPage () {
      return this.getRouteBaseName() === 'dashboard'
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
        this.$i18n.locale = value
      })
    },
    async logout () {
      console.log('###### LOG OUT')
      await this.$axios.$post('/users/logout')
      await this.$cookies.remove('cs_locker_token')
      this.$store.commit('UPDATE_IS_LOGGEDIN', false)
      this.$router.push(this.localeRoute({ name: 'login' }))
    },
    async lock () {
      await this.$vaultTimeoutService.lock()
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
    async login () {
      try {
        await this.clearKeys()
        const key = await this.$cryptoService.makeKey(this.masterPassword, this.currentUser.email, 0, 100000)
        const hashedPassword = await this.$cryptoService.hashPassword(this.masterPassword, key)
        const res = await this.$axios.$post('cystack_platform/pm/users/session', {
          client_id: 'web',
          password: hashedPassword,
          device_name: this.$platformUtilsService.getDeviceString(),
          device_type: this.$platformUtilsService.getDevice(),
          device_identifier: this.$cookies.get('device_id') || this.randomString()
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
        this.$router.push(this.localeRoute({ path: this.$store.state.currentPath === '/lock' ? '/dashboard' : this.$store.state.currentPath }))
      } catch (e) {
        this.notify('Xác thực thông tin thất bại', 'warning')
      }
    },
    async clearKeys () {
      await this.$cryptoService.clearKeys()
    },
    async getSyncData () {
      try {
        this.$messagingService.send('syncStarted')
        const res = await this.$axios.$get('cystack_platform/pm/sync')
        const userId = await this.$userService.getUserId()
        await this.$syncService.syncProfile(res.profile)
        await this.$syncService.syncFolders(userId, res.folders)
        await this.$syncService.syncCollections(res.collections)
        await this.$syncService.syncCiphers(userId, res.ciphers)
        await this.$syncService.syncSends(userId, res.sends)
        await this.$syncService.syncSettings(userId, res.domains)
        await this.$syncService.syncPolicies(res.policies)
        await this.$syncService.setLastSync(new Date())
        this.$messagingService.send('syncCompleted', { successfully: true })
        this.$store.commit('UPDATE_SYNCED_CIPHERS')
      } catch (e) {
        this.$messagingService.send('syncCompleted', { successfully: false })
        this.$store.commit('UPDATE_SYNCED_CIPHERS')
      }
    },
    async getFolders () {
      return await this.$folderService.getAllDecrypted()
    },
    clipboardSuccessHandler () {
      this.notify(this.$t('common.copied'), 'success')
    },
    getIconCipher (cipher, size = 70) {
      switch (cipher.type) {
      case CipherType.Login:
        if (cipher.login && cipher.login.uris && cipher.login.uris.length) {
          try {
            const domain = extractDomain(cipher.login.uris[0]._uri)
            if (domain) {
              return `<img src="//logo.clearbit.com/${domain}?size=${size}" alt="${domain}" class="rounded mx-auto"/>`
            }
          } catch (e) {
            return this.getIconDefaultCipher('Login', size)
          }
        }
        return this.getIconDefaultCipher('Login', size)
      case CipherType.SecureNote:
        return this.getIconDefaultCipher('SecureNote', size)
      case CipherType.Card:
        return this.getIconDefaultCipher('Card', size)
      case CipherType.Identity:
        return this.getIconDefaultCipher('Identity', size)
      default:
        return ''
      }
    },
    getIconDefaultCipher (type, size = 70) {
      return `<img  src="${require(`~/assets/images/icons/icon_${type}.svg`)}" style="width: ${size}px; height: ${size}px" alt="" class="rounded mx-auto"/>`
    },
    routerCipher (cipher, callbackDeleted) {
      if (cipher.isDeleted) {
        callbackDeleted(cipher)
        return
      }

      if (this.getRouteBaseName() === 'dashboard') {
        this.$router.push(this.localeRoute({
          name: 'dashboard-id',
          params: { id: cipher.id }
        }))
        return
      }
      if (this.getRouteBaseName() === 'dashboard-folders-folderId') {
        this.$router.push(this.localeRoute({
          name: 'dashboard-folders-folderId-id',
          params: { ...this.$route.params, id: cipher.id }
        }))
        return
      }

      let name = ''
      switch (cipher.type) {
      case CipherType.Login:
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
      }
      this.$router.push(this.localeRoute({
        name: name + '-id',
        params: { id: cipher.id }
      }))
    },
    openNewTab (link) {
      window.open(link, '_blank')
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
