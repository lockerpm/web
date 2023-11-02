import Vue from 'vue'
import numeral from 'numeral'

Vue.mixin({
  data () {
    return {
      initStripeTimeout: null
    }
  },
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
    isLifeTimeUser () {
      return ['pm_lifetime_premium', 'pm_lifetime_family'].includes(
        this.$store.state.currentPlan?.alias
      )
    },
    isFamilyOwner () {
      return ['pm_family', 'pm_lifetime_family'].includes(
        this.$store.state.currentPlan?.alias
      )
    },
    isFamilyUser () {
      return this.$store.state.currentPlan?.is_family
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
    },
    currentYear () {
      return new Date().getFullYear()
    }
  },
  beforeDestroy () {
    clearTimeout(this.initStripeTimeout)
  },
  methods: {
    changeLang (value) {
      this.setupMomentLocale(value)
      this.$store.dispatch('SetLang', value).then(() => {
        this.$i18n.setLocale(value)
        this.$router.push(this.switchLocalePath(value))
      })
    },

    setupMomentLocale (value) {
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
    },

    changeLocale (value) {
      this.$i18n.setLocale(value)
    },

    async logout (options) {
      console.log('###### LOG OUT')

      if (
        (!this.isOnPremise || this.$store.state.isLoggedInOnPremise) &&
        !options?.noApiCall
      ) {
        await this.$axios.$post('/users/logout')
      }

      if (this.isOnPremise) {
        this.clearOnPremiseCookies()
      }

      await this.$cryptoService.clearKeys()
      await this.$userService.clear()
      await this.$cookies.remove('cs_locker_token')
      this.$store.commit('CLEAR_ALL_DATA')
      this.$router.push(this.localeRoute({ name: 'index' }))
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

    async login (options) {
      // options?: {
      //   extraData?: { [key: string]: any }
      //   isOtp?: boolean
      //   key?: SymmetricCryptoKey
      //   hashedPassword?: string
      // }

      const lockerDeviceId = this.$cookies.get('device_id')
      const deviceIdentifier = lockerDeviceId || this.randomString()
      if (!lockerDeviceId) {
        const expireTime = 50 * 365 * 24 * 3600
        this.$cookies.set('device_id', deviceIdentifier, {
          maxAge: expireTime,
          domain: 'locker.io'
        })
      }
      try {
        await this.clearKeys()
        const key =
          options?.key ||
          (await this.$cryptoService.makeKey(
            this.masterPassword,
            this.currentUser.email,
            0,
            100000
          ))
        const hashedPassword =
          options?.hashedPassword ||
          (await this.$cryptoService.hashPassword(this.masterPassword, key))
        let payload = {
          email: this.isOnPremise ? this.currentUser.email : undefined,
          client_id: 'web',
          password: hashedPassword,
          device_name: this.$platformUtilsService.getDeviceString(),
          device_type: this.$platformUtilsService.getDevice(),
          device_identifier: deviceIdentifier
        }
        if (options?.extraData) {
          payload = { ...payload, ...options.extraData }
        }
        const res = await this.$axios.$post(
          `cystack_platform/pm/users/session${options?.isOtp ? '/otp' : ''}`,
          payload
        )

        // Is 2FA required
        if (res.is_factor2) {
          return {
            ...res,
            key
          }
        }

        // Else continue
        this.$messagingService.send('loggedIn')

        if (this.isOnPremise) {
          this.$axios.setToken(res.access_token, 'Bearer')
          await this.$cookies.set('cs_locker_token', res.access_token, {
            path: '/',
            domain: 'locker.io',
            ...(this.environment === '' ? { secure: true } : { secure: false })
          })
          this.$store.commit('UPDATE_IS_LOGGEDIN_ON_PREMISE', true)
          this.disconnectDesktopSocket()
        }

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
        let path = this.$store.state.currentPath
        const IGNORED_PATHS = [
          '/lock',
          '/authenticate',
          '/on-premise-create-master-pw'
        ]
        if (
          IGNORED_PATHS.some(
            p => path.startsWith(p) || path.startsWith(`/${this.locale}${p}`)
          )
        ) {
          path = '/vault'
        }
        if (path === '/' && this.isOnPremise) {
          path = '/vault'
        }
        this.$router.push(
          this.localeRoute({
            path
          })
        )
      } catch (e) {
        console.log(e)
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
      const regex = /^(ftp|http|https):\/\/[^ "]+$/
      if (regex.test(link)) {
        window.open(link, '_blank')
      } else {
        this.notify(this.$t('errors.invalid_url'), 'warning')
      }
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

    filterPassword (value, showPassword) {
      if (value && !showPassword) {
        let result = ''
        for (let i = 0; i < value.length; i++) {
          if (value[i] === ' ') {
            result += ' '
          } else {
            result += '*'
          }
        }
        return result
      }
      return value
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

      // Card declined
      if (response?.data?.code === '7009') {
        this.notify(this.$t('errors.7009'), 'error')
        return true
      }

      return false
    },

    initStripe () {
      try {
        this.stripe = Stripe(this.$config.stripeKey)
        this.elements = this.stripe.elements({})
        this.$nextTick(() => {
          this.cardNumber = this.elements.create('cardNumber', {
            classes: { base: 'form-control form-control-sm !py-[10px]' }
          })
          this.cardNumber.mount(this.$refs.cardNumber)
          this.cardExpiry = this.elements.create('cardExpiry', {
            classes: {
              base: 'form-control form-control-sm bg-white !py-[10px]'
            }
          })
          this.cardExpiry.mount(this.$refs.cardExpiry)
          this.cardCvc = this.elements.create('cardCvc', {
            classes: {
              base: 'form-control form-control-sm bg-white !py-[10px]'
            }
          })
          this.cardCvc.mount(this.$refs.cardCvc)
          this.cardNumber.on('change', event => {
            this.eventChangeNumber = event
          })
          this.cardExpiry.on('change', event => {
            this.eventChangeExpiry = event
          })
          this.cardCvc.on('change', event => {
            this.eventChangeCvc = event
          })
        })
      } catch (error) {
        console.log(error)
        this.initStripeTimeout = setTimeout(() => {
          this.initStripe()
        }, 2000)
      }
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
