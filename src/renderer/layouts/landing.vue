<template>
  <div>
    <TopBanner />
    <!-- <TetHolidayClosing /> -->
    <AutoPopup />

    <Header />

    <!-- Cookies agreement -->
    <div v-if="showCookie != 'false'" id="cookie-bar" class="cookie-bar">
      <div class="cookie-bar__wrap">
        <div class="cookie-bar__msg-wrap">
          <div class="cookie-bar__msg">
            <p class="landing-font-18 font-bold mb-3">
              {{ $t('cookie.title') }}
            </p>
            <p class="landing-font-14 mb-4" v-html="$t('cookie.desc')" />
            <nuxt-link
              :to="localePath('/privacy')"
              class="landing-font-14 text-primary"
            >
              {{ $t('cookie.learn_more') }}
            </nuxt-link>
          </div>
          <div class="cookie-bar__manage">
            <button class="cookie-bar__btn" @click="offCookie">
              {{ $t('cookie.accept') }}
            </button>
          </div>
        </div>
        <div class="cookie-bar__close" @click="offCookie">
          <i class="el-icon-close" />
        </div>
      </div>
    </div>
    <!-- Cookies agreement end -->

    <!-- Content -->
    <div class="max-w-6xl mx-auto">
      <div class="w-full px-6">
        <nuxt />
      </div>
    </div>
    <!-- Content end -->

    <Footer id="footer" />
  </div>
</template>

<script>
import Header from '../components/landing/Header'
import Footer from '../components/landing/Footer'
import TopBanner from '../components/landing/TopBanner'
import AutoPopup from '../components/landing/AutoPopup'

if (process.env.CS_ENV !== 'web') {
  // eslint-disable-next-line no-var
  var { remote } = require('electron')
}

export default {
  components: {
    Header,
    Footer,
    TopBanner,
    AutoPopup
  },
  data () {
    return {
      externalContent: '',
      showCookie: 'false'
    }
  },
  head () {
    // this.$i18n.locale = this.lang
    const locale = (() => {
      switch (this.locale) {
      case 'vi':
        return 'vi_VN'
      case 'zh':
        return 'zh_TW'
      default:
        return 'en_US'
      }
    })()
    return {
      htmlAttrs: {
        lang: this.locale
        // lang: this.currentUser.language
      },
      title: this.$t(`${this.mappings}.head_title`),
      link: [{ rel: 'canonical', href: `https://locker.io${this.$route.path}` }],
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.$t(`${this.mappings}.head_title`)
        },
        {
          hid: 'og:locale',
          property: 'og:locale',
          content: locale
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.$t(`${this.mappings}.head_title`)
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('landing.title')
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.$t('landing.title')
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.$t('landing.title')
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `https://locker.io/preview-${this.locale}.png`
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: `https://locker.io/preview-${this.locale}.png`
        }
      ],
      script: [{ src: 'https://js.stripe.com/v3/' }]
    }
  },
  computed: {
    // currentUser () {
    //   return this.$store.state.user
    // },
    mappings () {
      const path = this.$route.path
      if (path === '/benefits' || path === `/${this.locale}/benefits`) {
        return 'how_it_works'
      }
      if (path === '/features' || path === `/${this.locale}/features`) {
        return 'features'
      }
      if (path === '/pricing' || path === `/${this.locale}/pricing`) {
        return 'plan'
      }
      if (path === '/download' || path === `/${this.locale}/download`) {
        return 'download'
      }
      if (path === '/contact' || path === `/${this.locale}/contact`) {
        return 'landing_contact'
      }
      if (path === '/blog' || path === `/${this.locale}/blog`) {
        return 'blog'
      }
      if (
        path === '/password-generator' ||
        path === `/${this.locale}/password-generator`
      ) {
        return 'password_generator'
      }
      if (path === '/security' || path === `/${this.locale}/security`) {
        return 'security'
      }
      if (
        path === '/password-health-checker' ||
        path === `/${this.locale}/password-health-checker`
      ) {
        return 'password_health_checker'
      }
      if (path === '/comparison' || path === `/${this.locale}/comparison`) {
        return 'comparison'
      }
      if (path === '/refer-friend' || path === `/${this.locale}/refer-friend`) {
        return 'refer_friend'
      }
      if (path === '/about-us' || path === `/${this.locale}/about-us`) {
        return 'about_us'
      }
      if (
        path === '/master-password' ||
        path === `/${this.locale}/master-password`
      ) {
        return 'landing_master_password'
      }
      if (path === '/affiliate' || path === `/${this.locale}/affiliate`) {
        return 'landing_affiliate'
      }
      return 'landing'
    }
  },
  mounted () {
    this.setupMomentLocale(this.locale)
    this.showCookie = this.checkCookie()
  },
  methods: {
    checkCookie () {
      const deviceId = this.$cookies.get('device_id')
      return localStorage.getItem(`${deviceId}_cookie`)
    },
    offCookie () {
      const deviceId = this.$cookies.get('device_id')
      localStorage.setItem(`${deviceId}_cookie`, 'false')
      this.showCookie = 'false'
    },
    openURL (url) {
      if (remote) {
        remote.shell.openExternal(url)
      }
    },
    getAlternatePath (lang) {
      let path = ''
      if (lang === 'en') {
        if (this.locale === 'en') {
          path = `${process.env.baseUrl}${this.$route.path}`
        } else {
          path = `${process.env.baseUrl}${this.$route.path.slice(3)}`
        }
      } else if (this.locale === 'en') {
        path = `${process.env.baseUrl}/${lang}${this.$route.path}`
      } else {
        path = `${process.env.baseUrl}${this.$route.path}`
      }

      return path.endsWith('/') ? path.slice(0, -1) : path
    }
  }
}
</script>

<style lang="scss">
.landing-btn {
  @apply hover:no-underline transition duration-200 ease-in-out text-white hover:text-white hover:bg-green-hover font-semibold text-center;
  display: inline-block;
  padding: 10px 24px;
  font-size: 16px;
  border-radius: 5px;
  background-color: #268334;
  &:disabled {
    background-color: #268334;
    &:hover {
      background-color: #268334;
    }
  }
}

.landing-btn2 {
  @apply hover:no-underline hover:bg-green transition duration-200 ease-in-out text-green hover:text-white font-semibold text-center;
  display: inline-block;
  padding: 9px 23px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #268334;
}

.landing-transition {
  @apply transition duration-200 ease-in-out;
}
.landing-font-72 {
  font-size: 72px;
  line-height: 66px;
}
.landing-font-60 {
  font-size: 60px;
  line-height: 72px;
}
.landing-font-56 {
  font-size: 56px;
  line-height: 64px;
}
.landing-font-50 {
  font-size: 50px;
  line-height: 66px;
}
.landing-font-52 {
  font-size: 52px;
  line-height: 66px;
}
.landing-font-48 {
  font-size: 48px;
  line-height: 54px;
}
.landing-font-45 {
  font-size: 45px;
  line-height: 60px;
}
.landing-font-44 {
  font-size: 44px;
  line-height: 53px;
}
.landing-font-42 {
  font-size: 42px;
  line-height: 56px;
}
.landing-font-38 {
  font-size: 38px;
  line-height: 45px;
}
.landing-font-34 {
  font-size: 34px;
  line-height: 40px;
}
.landing-font-32 {
  font-size: 32px;
  line-height: 36px;
}
.landing-font-28 {
  font-size: 28px;
  line-height: 32px;
}
.landing-font-24 {
  font-size: 24px;
  line-height: 29px;
}
.landing-font-22 {
  font-size: 22px;
  line-height: 26px;
}
.landing-font-20 {
  font-size: 20px;
  line-height: 32px;
}
.landing-font-18 {
  font-size: 18px;
  line-height: 30px;
}
.landing-font-16 {
  font-size: 16px;
  line-height: 26px;
}
.landing-font-15 {
  font-size: 15px;
}
.landing-font-14 {
  font-size: 14px;
  line-height: 24px;
}
.landing-font-14-2 {
  font-size: 14px;
  line-height: 16px;
}
.landing-font-12 {
  font-size: 12px;
  line-height: 26px;
}
.landing-bg-green {
  background-color: #00a893;
}
@media screen and (max-width: 960px) {
  .landing-font-50 {
    font-size: 45px !important;
    line-height: 60px !important;
  }
}
.full-width {
  width: calc(100vw - 4px);
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  overflow-x: hidden;
}
#cookie-bar {
  position: fixed;
  width: 100%;
  bottom: 0px;
  opacity: 1;
  background-color: #fff;
  -webkit-box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  z-index: 90;
  -webkit-transition: bottom 0.7s, opacity 0.8s;
  transition: bottom 0.7s, opacity 0.8s;
}
#cookie-bar .cookie-bar__wrap {
  @apply max-w-6xl;
  position: relative;
  margin: 0 auto;
}
#cookie-bar .cookie-bar__msg-wrap {
  flex-direction: column;
  display: block;
  height: auto;
  padding: 20px;
  justify-content: space-between;
}
#cookie-bar .cookie-bar__msg {
  padding-bottom: 24px;
}
#cookie-bar .cookie-bar__manage {
  width: 100%;
  padding: 0;
  display: block;
  text-align: right;
}

#cookie-bar .cookie-bar__btn {
  @apply bg-primary;
  padding: 8.425px 56.96px;
  border-radius: 20px !important;
  font-size: 14px !important;
  line-height: 19px !important;
  color: #fff !important;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.7) !important;
  margin: 0px !important;
}
#cookie-bar .cookie-bar__close {
  position: absolute;
  top: 12px;
  right: 16px;
  width: 32px;
  height: 32px;
  padding: 8px;
  font-size: 18px;
  cursor: pointer;
}
</style>
