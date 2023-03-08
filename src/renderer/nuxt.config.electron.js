/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  ssr: false,
  target: 'static',
  // ssr: false,
  // target: 'static',
  head: {
    htmlAttrs: {
      class: 'text-black'
    },
    title: 'Locker',
    meta: [{ charset: 'utf-8' }]
  },
  loading: false,
  plugins: [
    { ssr: true, src: '@/plugins/axios.js' },
    { ssr: true, src: '@/plugins/mixin.js' },
    { ssr: false, src: '@/plugins/localStorage.js' },
    { ssr: true, src: '@/plugins/icons.js' },
    { ssr: true, src: '@/plugins/element.js' },
    { ssr: false, src: '@/plugins/initJslib.ts' },
    { ssr: false, src: '@/plugins/asyncComputed.js' }
  ],
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/tailwindcss'],
  modules: [
    '@nuxtjs/axios',
    'nuxt-i18n',
    'cookie-universal-nuxt',
    'nuxt-client-init-module'
  ],
  tailwindcss: {
    jit: true
  },
  css: ['@/assets/css/app.scss'],
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
        en: require('./locales/en.js'),
        vi: require('./locales/vi.js')
      }
    }
  },
  env: {
    CS_ENV: 'electron',
    baseUrl: process.env.BASE_URL || 'http://demo.cystack.net:3011',
    idUrl:
      process.env.BASE_ID_URL ||
      'https://id.cystack.net' ||
      'http://demo.cystack.net:3002',
    staticUrl: process.env.STATIC_URL || '',
    stripeKey: isProd ? process.env.STRIPE_KEY : process.env.STRIPE_KEY_STAGING,
    environment: process.env.CS_ENVIRONMENT || ''
  },
  axios: {
    baseURL:
      process.env.BASE_API_URL ||
      'http://192.168.0.186:9000/v3' ||
      'https://api.cystack.net/v3' ||
      'http://gateway.staging.cystack.org/v3'
  }
}
