import Vue from 'vue'
import numeral from 'numeral'

Vue.mixin({
  computed: {
    language () {
      return this.$store.state.user.language
    },
    locale () {
      return this.$store.state.i18n.locale
    },
    currentUser () {
      return this.$store.state.user
    },
    currentUserPw () {
      return this.$store.state.userPw
    },
    environment () {
      return this.$store.state.environment
    },
    isLoggedIn () {
      return this.$store.state.isLoggedIn
    },
    isAllPage () {
      return this.getRouteBaseName() === 'vault'
    },
    isEnterpriseMember () {
      return this.$store.state.userPw.pwd_user_type === 'enterprise'
    },
    isEnterpriseAdminOrOwner () {
      return (
        this.teams.length &&
        ['primary_admin', 'admin'].includes(this.teams[0].role)
      )
    },
    isPremiumFeaturesAvailable () {
      return (
        this.$store.state.userPw.pwd_user_type === 'enterprise' ||
        this.$store.state.currentPlan.alias !== 'pm_free'
      )
    },
    searchText () {
      return this.$store.state.searchText
    },
    teams () {
      return this.$store.state.teams || []
    },
    currentOrg () {
      // return find(this.teams, team => team.id === this.$route.params.teamId) || {}
      return this.teams.length ? this.teams[0] : {}
    },
    currentPlan () {
      return this.$store.state.currentPlan
    },
    blog_categories () {
      return this.$t('blog.categories')
    },
    extensionLoggedIn () {
      return this.$store.state.extensionLoggedIn
    },
    enterpriseInvitations () {
      return this.$store.state.enterpriseInvitations
    },
    enterpriseUrl () {
      return process.env.lockerEnterprise
    },
    isDevOrStaging () {
      return (
        process.env.environment === 'staging' ||
        process.env.NODE_ENV !== 'production'
      )
    }
  },
  methods: {
    changeLang (value) {
      if (value === 'vi') {
        this.$moment.locale('vi', {
          months:
            'tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12'.split(
              '_'
            ),
          monthsShort:
            'Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12'.split(
              '_'
            ),
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
      this.$store.commit('CLEAR_ALL_DATA')
      this.$router.push(this.localeRoute({ name: 'login' }))
      window.Intercom('shutdown')
      window.intercomSettings = {
        app_id: 'hjus3ol6',
        api_base: 'https://hjus3ol6.intercom-messenger.com'
      }
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

    async login () {
      const lockerDeviceId = this.$cookies.get('locker_device_id')
      const deviceIdentifier = lockerDeviceId || this.randomString()
      if (!lockerDeviceId) {
        const expireTime = 50 * 365 * 24 * 3600
        this.$cookies.set('locker_device_id', deviceIdentifier, {
          maxAge: expireTime
        })
      }
      try {
        await this.clearKeys()
        const key = await this.$cryptoService.makeKey(
          this.masterPassword,
          this.currentUser.email,
          0,
          100000
        )
        const hashedPassword = await this.$cryptoService.hashPassword(
          this.masterPassword,
          key
        )
        const res = await this.$axios.$post(
          'cystack_platform/pm/users/session',
          {
            client_id: 'web',
            password: hashedPassword,
            device_name: this.$platformUtilsService.getDeviceString(),
            device_type: this.$platformUtilsService.getDevice(),
            device_identifier: deviceIdentifier
          }
        )
        this.$messagingService.send('loggedIn')
        await this.$tokenService.setTokens(res.access_token, res.refresh_token)
        await this.$userService.setInformation(
          this.$tokenService.getUserId(),
          this.currentUser.email,
          0,
          100000
        )
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
            const encMasterPwItem = await this.createEncryptedMasterPwItem(
              this.masterPassword
            )
            const passwordStrength =
              this.$passwordGenerationService.passwordStrength(
                this.masterPassword,
                ['cystack']
              ) || {}
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
        this.$router.push(
          this.localeRoute({
            path:
              this.$store.state.currentPath === '/lock'
                ? '/vault'
                : this.$store.state.currentPath
          })
        )
      } catch (e) {
        // Wrong master pw
        if (!e.response?.data?.message || e.response?.data?.code === '0004') {
          this.notify(this.$t('errors.invalid_master_password'), 'warning')
          return
        }

        // Force join enterprise
        if (
          e.response?.data?.code === '1011' &&
          this.$route.name.startsWith('set-master-password')
        ) {
          this.$router.push(
            this.localeRoute({ name: 'lock', query: { joinEnterprise: '1' } })
          )
          return
        }

        // Force 2FA
        if (e.response?.data?.code === '1012') {
          this.notEnable2FA = true
          if (this.$route.name.startsWith('set-master-password')) {
            this.$router.push(this.localeRoute({ name: 'lock' }))
          }
          return
        }

        // Enterprise expired
        if (e.response?.data?.code === '1010') {
          // Don't notify
          return
        }

        // Default
        this.notify(e.response.data.message, 'warning')
      }
    },

    openNewTab (link) {
      if (!link.match(/^https?:\/\//i)) {
        link = 'http://' + link
      }
      window.open(link, '_blank')
    },

    // Blog subscribe
    subscribe (email) {
      const payload = {
        email,
        subscribed: true,
        service: 'locker-blog-subscribe'
      }
      return this.$axios.put(
        'https://tracking.cystack.net/v2/email/subscription',
        payload
      )
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

    openIntercom () {
      if (window.Intercom) {
        window.Intercom('show')
      }
    },

    handleApiError (response, extraData = {}) {
      const { type } = extraData

      // Limit reached
      if (response?.data?.code === '5002') {
        this.notify(
          this.$t('errors.5002', { type: this.$tc(`type.${type}`, 1) }),
          'error'
        )
        this.$store.commit('UPDATE_NOTICE', { showPleaseUpgrade: true })
        return true
      }

      // Team is locked
      if (response?.data?.code === '3003') {
        this.notify(this.$t('errors.3003'), 'error')
        return true
      }

      // Delete too much items
      if (response?.data?.code === '5001') {
        this.notify(this.$t('errors.5001'), 'error')
        return true
      }

      return false
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
