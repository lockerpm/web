/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */
import path from 'path'
import fs from 'fs'
import viVee from 'vee-validate/dist/locale/vi.json'
import enVee from 'vee-validate/dist/locale/en.json'
import axios from 'axios'
import cheerio from 'cheerio'

const isStaging = process.env.CS_ENVIRONMENT === 'staging'

module.exports = {
  ssr: true,
  target: 'server',
  head: {
    htmlAttrs: {
      class: 'text-black'
    },
    title: 'Locker Password Manager - Your Digital Vault',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      {
        name: 'facebook-domain-verification',
        content: '0sr0e0pcpy6rzcr5fm0lundi04suai'
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
    link: [{ rel: 'icon', type: 'shortcut icon', href: '/favicon.ico' }],
    script: [
      { src: '/js/intercom.js' },
      { src: 'https://whitehub.net/tracking/visitCyStack.js', body: true }
    ]
  },
  loading: false,
  plugins: [
    { ssr: true, src: '@/plugins/router.js' },
    { ssr: true, src: '@/plugins/axios.js' },
    { ssr: false, src: '@/plugins/localStorage.js' },
    { ssr: false, src: '@/plugins/initJslib.ts' },
    { ssr: false, src: '@/plugins/asyncComputed.js' },
    { ssr: false, src: '@/plugins/vue-native-socket.js' },
    { ssr: false, src: '@/plugins/tutorial.js' },

    // Mixins
    { ssr: true, src: '@/plugins/mixins/index.js' },
    { ssr: true, src: '@/plugins/mixins/onboarding.js' },
    { ssr: true, src: '@/plugins/mixins/utils.js' },
    { ssr: true, src: '@/plugins/mixins/cipher/index.js' },
    { ssr: true, src: '@/plugins/mixins/cipher/policy.js' },
    { ssr: true, src: '@/plugins/mixins/cipher/sharing.js' },
    { ssr: true, src: '@/plugins/mixins/cipher/sync.js' },
    { ssr: true, src: '@/plugins/mixins/cipher/utils.js' },
    { ssr: true, src: '@/plugins/mixins/cipher/data.js' },
    { ssr: true, src: '@/plugins/mixins/cipher/crud.js' },
    { ssr: true, src: '@/plugins/onpremise/mixins.js' },

    // UI
    { ssr: false, src: '@/plugins/ui/circle-countdown-timer.js' },
    { ssr: false, src: '@/plugins/ui/clipboard.js' },
    { ssr: true, src: '@/plugins/ui/element.js' },
    { ssr: true, src: '@/plugins/ui/fontawesome.js' },
    { ssr: true, src: '@/plugins/ui/katex.js' },
    { ssr: true, src: '@/plugins/ui/vee.js' },
    { ssr: false, src: '@/plugins/ui/vue-virtual-scroller.js' },
    { ssr: false, src: '@/plugins/ui/youtube.js' },
    { ssr: false, src: '@/plugins/ui/vue-carousel.js' }
  ],
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/moment',
    'vue-notion/nuxt'
  ],
  modules: [
    '@nuxtjs/axios',
    'nuxt-i18n',
    'cookie-universal-nuxt',
    'nuxt-client-init-module',
    '@nuxtjs/recaptcha',
    '@nuxtjs/gtm',
    '@nuxtjs/feed',
    'vue-social-sharing/nuxt',
    '@nuxtjs/sentry',
    'nuxt-user-agent'
  ],
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
    disabled: process.env.NODE_ENV === 'development',
    initialize: process.env.NODE_ENV === 'production'
  },
  tailwindcss: {
    jit: true
  },
  css: [
    '@/assets/css/app.scss',
    '~/static/assets/css/notion-overwrite.css',
    '@/assets/flags/flags.css'
  ],
  i18n: {
    locales: ['en', 'vi'],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    vuex: {
      syncLocale: true
    },
    vueI18n: {
      fallbackLocale: 'en',
      messages: {
        en: { ...require('./locales/en.js'), ...enVee },
        vi: { ...require('./locales/vi.js'), ...viVee }
      }
    }
  },
  env: {
    CS_ENV: 'web',
    nodeEnv: process.env.NODE_ENV,
    baseUrl: process.env.BASE_URL || 'https://locker.io',
    idUrl: process.env.BASE_ID_URL || 'https://id.locker.io',
    environment: process.env.CS_ENVIRONMENT || '',
    wsUrl: process.env.WS_URL || 'wss://api.locker.io/ws',
    desktopWsUrl: process.env.DESKTOP_WS_URL || 'ws://localhost:1040',
    logoUrl: process.env.LOGO_URL || 'https://locker.io/logo/',
    blogUrl:
      process.env.BLOG_API_URL ||
      'https://blog.cystack.org/locker/wp-json/wp/v2',
    extensionId: [
      'cmajindocfndlkpkjnmjpjoilibjgmgh',
      'hciabnakeampkoldeohkfcbadmgcmebl',
      'iapmepfhjobeehklaegdejhmmejkmhph'
    ],
    baseApiUrl: process.env.BASE_API_URL || 'https://api.locker.io/v3',
    extensionLink:
      'https://chrome.google.com/webstore/detail/locker-free-password-mana/cmajindocfndlkpkjnmjpjoilibjgmgh',
    iosLink:
      'https://apps.apple.com/us/app/locker-password-manager/id1586927301',
    androidLink:
      'https://play.google.com/store/apps/details?id=com.cystack.locker',
    lockerEnterprise:
      process.env.ENTERPRISE_URL || 'https://enterprise.locker.io',
    stripePayment:
      process.env.STRIPE_PAYMENT_LINK ||
      'https://buy.stripe.com/test_aEU4jYbbud6D8wwbII?prefilled_promo_code=LKPERSONAL50'
  },
  server: {
    host: '0.0.0.0',
    https: process.env.ENABLE_HTTPS
      ? {
        key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
        cert: fs.readFileSync(path.resolve(__dirname, 'server.crt'))
      }
      : undefined
  },
  axios: {
    baseURL: process.env.BASE_API_URL || 'https://api.locker.io/v3'
  },
  router: {},
  moment: {
    defaultLocale: 'en',
    locales: ['vi']
  },
  build: {
    transpile: ['vee-validate/dist/rules'],
    babel: {
      plugins: [
        ['@babel/plugin-proposal-private-methods', { loose: true }],
        ['@babel/plugin-proposal-private-property-in-object', { loose: true }]
      ]
    }
  },
  publicRuntimeConfig: {
    recaptcha: {
      hideBadge: true,
      siteKey: process.env.RECAPTCHA_KEY,
      version: 3
    },
    stripeKey:
      isStaging ||
      process.env.nodeEnv === 'development' ||
      process.env.NODE_ENV === 'development'
        ? process.env.STRIPE_KEY_STAGING
        : process.env.STRIPE_KEY,
    cloudflare:
      process.env.nodeEnv === 'development' || isStaging
        ? {
          id: process.env.ACCESS_CLIENT_ID,
          secret: process.env.ACCESS_CLIENT_SECRET
        }
        : null
  },
  gtm: {
    id: 'GTM-K5Q6595'
  },
  feed: [
    // A default feed configuration object
    {
      path: '/feed.xml', // The route to your feed.
      async create (feed) {
        feed.options = {
          title: 'Locker blog',
          link: 'https://locker.io/feed.xml',
          description: 'This is Locker feed!'
        }

        const posts = await axios.get(
          'https://blog.cystack.org/locker/wp-json/wp/v2/posts?_embed=1&per_page=9&categories=8,13,18,54,25'
        )
        if (posts.data) {
          posts.data.forEach(post => {
            let featuredImage = null
            try {
              featuredImage = post._embedded['wp:featuredmedia']['0'].source_url
            } catch (error) {
              const $ = cheerio.load(post.content.rendered)
              const images = $('img').attr('src')
              if (images) {
                featuredImage = images.replace(/-[0-9]+x[0-9]+/g, '')
              }
            }
            const $_ = cheerio.load(post.excerpt.rendered)
            const desc = $_('p').text()
            feed.addItem({
              title: post.title.rendered,
              id: `https://locker.io/blog/${post.slug}`,
              link: `https://locker.io/blog/${post.slug}`,
              published: new Date(Date.parse(post.modified_gmt)),
              author: [
                {
                  name: 'CyStack',
                  email: 'support@cystack.net'
                }
              ],
              description: desc,
              image: featuredImage || ''
            })
          })
        }

        feed.addCategory('Locker blog')

        feed.addContributor({
          name: 'CyStack',
          email: 'support@cystack.net',
          link: 'https://locker.io/'
        })
      }, // The create function (see below)
      cacheTime: 1000 * 60 * 15, // How long should the feed be cached
      type: 'rss2', // Can be: rss2, atom1, json1
      data: ['Some additional data'] // Will be passed as 2nd argument to `create` function
    }
  ],
  serverMiddleware: [
    { path: '/api', handler: '~/server-middleware/rest.js' },
    { path: '/api/content', handler: '~/server-middleware/notion.js' },
    { path: '/api/top-banner', handler: '~/server-middleware/topBanner.js' },
    {
      path: '/api/testimonials',
      handler: '~/server-middleware/testimonials.js'
    },
    {
      path: '/api/bottom-banner',
      handler: '~/server-middleware/bottomBanner.js'
    }
  ]
}
