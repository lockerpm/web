<template>
  <div>
    <TopBanner />
    <Header />
    <div class="max-w-6xl mx-auto">
      <div class="w-full px-6">
        <nuxt />
      </div>
    </div>
    <Footer v-if="$route.path != '/whitepaper'" />
  </div>
</template>

<script>
import Header from '../components/landing/Header'
import Footer from '../components/landing/Footer'
import TopBanner from '../components/landing/TopBanner'

if (process.env.CS_ENV !== 'web') {
  // eslint-disable-next-line no-var
  var { remote } = require('electron')
}

export default {
  components: {
    Header,
    Footer,
    TopBanner
  },
  data () {
    return {
      externalContent: ''
    }
  },
  head () {
    // this.$i18n.locale = this.lang
    return {
      htmlAttrs: {
        lang: this.locale
        // lang: this.currentUser.language
      },
      title: this.$t(`${this.mappings}.head_title`),
      meta: [
        { hid: 'viewport', name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.$t(`${this.mappings}.head_title`)
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${process.env.baseUrl}${this.$route.fullPath}`
        },
        {
          hid: 'og:locale',
          property: 'og:locale',
          content: this.locale === 'vi' ? 'vi' : 'en'
        },
        {
          hid: 'og:locale:alternate',
          property: 'og:locale:alternate',
          content: this.locale === 'vi' ? 'en' : 'vi'
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.$t(`${this.mappings}.head_title`)
        },
        {
          hid: 'twitter:url',
          name: 'twitter:url',
          content: `${process.env.baseUrl}${this.$route.fullPath}`
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
          content: 'https://locker.io/preview.png'
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: 'https://locker.io/preview.png'
        },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image'
        }
      ],
      link: [
        { rel: 'alternate', hreflang: this.locale, href: this.getAlternatePath(this.locale) }
        // { rel: 'alternate', hreflang: 'vi', href: this.getAlternatePath('vi') }
      ]
    }
  },
  computed: {
    // currentUser () {
    //   return this.$store.state.user
    // },
    mappings () {
      const path = this.$route.path
      if (path === '/benefits' || path === `/${this.locale}/benefits`) { return 'how_it_works' }
      if (path === '/features' || path === `/${this.locale}/features`) { return 'features' }
      if (path === '/plan' || path === `/${this.locale}/plan`) { return 'plan' }
      if (path === '/download' || path === `/${this.locale}/download`) { return 'download' }
      if (path === '/contact' || path === `/${this.locale}/contact`) { return 'landing_contact' }
      if (path === '/blog' || path === `/${this.locale}/blog`) { return 'blog' }
      if (path === '/password-generator' || path === `/${this.locale}/password-generator`) { return 'password_generator' }
      if (path === '/security' || path === `/${this.locale}/security`) { return 'security' }
      if (path === '/password-health-checker' || path === `/${this.locale}/password-health-checker`) { return 'password_health_checker' }
      if (path === '/comparison' || path === `/${this.locale}/comparison`) { return 'comparison' }
      if (path === '/refer-friend' || path === `/${this.locale}/refer-friend`) { return 'refer_friend' }
      if (path === '/about-us' || path === `/${this.locale}/about-us`) { return 'about_us' }
      return 'landing'
    }
  },
  mounted () {
    // this.$store.dispatch('LoadCurrentUser')
    // this.$store.dispatch('LoadCurrentUserPw')
  },
  methods: {
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

<style>
.landing-btn {
  @apply hover:no-underline transition duration-200 ease-in-out text-white hover:text-white hover:bg-green-hover;
  display: inline-block;
  padding: 13px 20px;
  min-width: 160px;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  border-radius: 5px;
  background-color: #268334;
}

.landing-btn2 {
  @apply hover:no-underline hover:bg-green transition duration-200 ease-in-out text-green hover:text-white;
  display: inline-block;
  padding: 13px 20px;
  min-width: 160px;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #268334;
}

.landing-transition {
  @apply transition duration-200 ease-in-out;
}
.landing-font-72{
  font-size: 72px;
  line-height: 66px;
}
.landing-font-60{
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
.landing-font-48 {
  font-size: 48px;
  line-height: 54px;
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
.landing-font-24{
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
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}
</style>
