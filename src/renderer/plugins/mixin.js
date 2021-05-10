import Vue from 'vue'
import { nanoid } from 'nanoid'

Vue.mixin({
  data () {
    return {
    }
  },
  computed: {
    language () { return this.$store.state.user.language },
    currentUser () { return this.$store.state.user },
    environment () { return this.$store.state.environment },
    isLoggedIn () {
      return this.$store.state.isLoggedIn
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
        console.log(hashedPassword)
        return hashedPassword
      } catch (e) {
        return ''
      }
    },
    async login () {
      const key = await this.$cryptoService.makeKey(this.masterPassword, this.currentUser.email, 0, 100000)
      const hashedPassword = await this.$cryptoService.hashPassword(this.masterPassword, key)
      const res = await this.$axios.$post('cystack_platform/pm/users/session', {
        client_id: 'web',
        password: hashedPassword,
        device_name: 'chrome',
        device_type: 9,
        device_identifier: this.$cookies.get('device_id')
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
      this.$router.push(this.localeRoute({ path: this.$store.state.previousPath }))
    }
  }
})
