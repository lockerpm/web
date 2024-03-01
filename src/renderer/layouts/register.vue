<template>
  <div>
    <Header />
    <div class="max-w-6xl mx-auto">
      <div class="w-full px-6">
        <nuxt />
      </div>
    </div>
    <Footer id="footer" />
  </div>
</template>

<script>
import Header from '../components/landing/Header'
import Footer from '../components/landing/Footer'

export default {
  components: {
    Header,
    Footer
  },
  data () {
    return {
      externalContent: '',
      showCookie: 'false'
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
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.$t(`${this.mappings}.head_title`)
        },
        {
          hid: 'og:locale',
          property: 'og:locale',
          content: this.locale === 'vi' ? 'vi_VN' : 'en_US'
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
        }
      ]
    }
  },
  computed: {
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
    // Set scroll event
    const header = document.getElementById('header')
    document.addEventListener('scroll', function () {
      const scrollPos = window.scrollY
      if (scrollPos > 10) {
        header.classList.add('shadow-lg')
        header.classList.remove('bg-transparent')
        header.classList.add('bg-white')
      } else {
        header.classList.remove('shadow-lg')
        header.classList.add('bg-transparent')
        header.classList.remove('bg-white')
      }
    })
  },
  methods: {
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
</style>
