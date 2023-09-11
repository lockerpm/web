<template>
  <div
    class="flex flex-col flex-column-fluid relative bg-[#FBFBFC] min-h-screen"
  >
    <div class="flex-column-fluid lg:px-28 py-10 md:px-10 px-4 mb-20">
      <div class="mb-5">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="localeRoute({ name: 'tools' })">
            {{ $t('sidebar.tools') }}
          </el-breadcrumb-item>
          <el-breadcrumb-item
            :to="localeRoute({ name: 'tools-password-health' })"
          >
            {{ $t('data.tools.password_health') }}
          </el-breadcrumb-item>
          <el-breadcrumb-item
            v-if="getRouteBaseName() === 'tools-password-health-weak'"
            :to="localeRoute({ name: 'tools-password-health-weak' })"
            class="capitalize"
          >
            {{ $t('data.tools.weak_passwords') }}
          </el-breadcrumb-item>
          <el-breadcrumb-item
            v-if="getRouteBaseName() === 'tools-password-health-reused'"
            :to="localeRoute({ name: 'tools-password-health-reused' })"
            class="capitalize"
          >
            {{ $t('data.tools.reused_passwords') }}
          </el-breadcrumb-item>
          <el-breadcrumb-item
            v-if="getRouteBaseName() === 'tools-password-health-exposed'"
            :to="localeRoute({ name: 'tools-password-health-exposed' })"
            class="capitalize"
          >
            {{ $t('data.tools.exposed_passwords') }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <LazyHydrate when-visible>
        <div
          v-if="getRouteBaseName() === 'tools-password-health'"
          v-loading="loading"
          class="setting-wrapper"
        >
          <div
            class="setting-section setting-section--hover"
            @click="go({ name: 'tools-password-health-weak' })"
          >
            <div class="setting-section-header">
              <div class="flex items-center">
                <div
                  class="w-[48px] h-[48px] flex items-center justify-center rounded-full text-head-5 text-white mr-3"
                  :class="{
                    'bg-danger':
                      weakPasswordCiphers && weakPasswordCiphers.length >= 1,
                    'bg-success':
                      weakPasswordCiphers && weakPasswordCiphers.length === 0
                  }"
                >
                  <span
                    v-if="weakPasswordCiphers && weakPasswordCiphers.length"
                  >
                    <span v-if="weakPasswordCiphers.length > 99">99+</span>
                    <span v-else>{{ weakPasswordCiphers.length }}</span>
                  </span>
                  <span v-else>0</span>
                </div>
                <div>
                  <button
                    class="setting-title cursor-pointer"
                    @click="go({ name: 'tools-password-health-weak' })"
                  >
                    {{ $t('data.tools.weak_passwords') }}
                  </button>
                  <div class="setting-description">
                    {{ $t('data.tools.weak_passwords_desc') }}
                  </div>
                </div>
              </div>
              <div>
                <button
                  class="btn btn-icon !text-black-600"
                  @click="go({ name: 'tools-password-health-weak' })"
                >
                  <i class="fa fa-chevron-right" />
                </button>
              </div>
            </div>
          </div>
          <div
            class="setting-section setting-section--hover"
            @click="go({ name: 'tools-password-health-reused' })"
          >
            <div class="setting-section-header">
              <div class="flex items-center">
                <div
                  class="w-[48px] h-[48px] flex items-center justify-center rounded-full text-head-5 text-white mr-3"
                  :class="{
                    'bg-danger':
                      reusedPasswordCiphers &&
                      reusedPasswordCiphers.length >= 1,
                    'bg-success':
                      reusedPasswordCiphers &&
                      reusedPasswordCiphers.length === 0
                  }"
                >
                  <span
                    v-if="reusedPasswordCiphers && reusedPasswordCiphers.length"
                  >
                    <span v-if="reusedPasswordCiphers.length > 99">99+</span>
                    <span v-else>{{ reusedPasswordCiphers.length }}</span>
                  </span>
                  <span v-else>0</span>
                </div>
                <div>
                  <button
                    class="setting-title cursor-pointer"
                    @click="go({ name: 'tools-password-health-reused' })"
                  >
                    {{ $t('data.tools.reused_passwords') }}
                  </button>
                  <div class="setting-description">
                    {{ $t('data.tools.reused_passwords_desc') }}
                  </div>
                </div>
              </div>
              <div>
                <button
                  class="btn btn-icon !text-black-600"
                  @click="go({ name: 'tools-password-health-reused' })"
                >
                  <i class="fa fa-chevron-right" />
                </button>
              </div>
            </div>
          </div>
          <div
            class="setting-section setting-section--hover"
            @click="go({ name: 'tools-password-health-exposed' })"
          >
            <div class="setting-section-header">
              <div class="flex items-center">
                <img
                  src="~/assets/images/icons/icon_tools_pw_breach.svg"
                  alt=""
                  class="mr-3"
                >
                <div>
                  <button
                    class="setting-title cursor-pointer"
                    @click="go({ name: 'tools-password-health-exposed' })"
                  >
                    {{ $t('data.tools.exposed_passwords') }}
                  </button>
                  <div class="setting-description">
                    {{ $t('data.tools.exposed_passwords_desc') }}
                  </div>
                </div>
              </div>
              <div>
                <button
                  class="btn btn-icon !text-black-600"
                  @click="go({ name: 'tools-password-health-exposed' })"
                >
                  <i class="fa fa-chevron-right" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </LazyHydrate>
      <nuxt-child
        :weak-password-ciphers="weakPasswordCiphers"
        :reused-password-ciphers="reusedPasswordCiphers"
        :password-strength-map="passwordStrengthMap"
        :password-use-map="passwordUseMap"
      />
    </div>
  </div>
</template>

<script>
import LazyHydrate from 'vue-lazy-hydration'
import { CipherType } from '../../core/enums'
// import Worker from '../../plugins/password-health.worker'

// const worker = new Worker()
export default {
  components: { LazyHydrate },
  data () {
    return {
      passwordStrengthCache: new Map(),
      passwordStrengthMap: new Map(),
      passwordUseMap: new Map(),
      weakPasswordCiphers: [],
      reusedPasswordCiphers: [],
      ciphers: [],
      loading: false,
      loadingWeak: false,
      loadingReused: false
    }
  },
  watch: {
    isPremiumFeaturesAvailable (newValue) {
      if (!newValue) {
        this.$router.push('/vault')
      }
    },
    '$store.state.syncedCiphersToggle' () {
      this.$cipherService.getAllDecrypted().then(result => {
        this.ciphers = result
        this.loading = true
        setTimeout(() => {
          this.weakPasswordCiphers = this.getWeakPasswordCiphers()
          this.reusedPasswordCiphers = this.getReusedPasswordCiphers()
          this.loading = false
        }, 100)
      })
    }
  },
  async mounted () {
    if (!this.isPremiumFeaturesAvailable) {
      this.$router.push('/vault')
    }
    this.loading = true
    this.ciphers = await this.$cipherService.getAllDecrypted()
    setTimeout(() => {
      this.weakPasswordCiphers = this.getWeakPasswordCiphers()
      this.reusedPasswordCiphers = this.getReusedPasswordCiphers()
      this.loading = false
    }, 300)
    // worker.onmessage = ({ data }) => {
    //   this.reusedPasswordCiphers = data.reused
    //   this.passwordUseMap = data.use_map
    // }
  },
  // asyncComputed: {
  //   weakPasswordCiphers: {
  //     async get () {
  //       this.loadingWeak = true
  //       const startTime = Date.now()
  //       const allCiphers = await this.$cipherService.getAllDecrypted()
  //       const weakPasswordCiphers = []
  //       const isUserNameNotEmpty = c => {
  //         return c.login.username != null && c.login.username.trim() !== ''
  //       }
  //       const getCacheKey = c => {
  //         return c.login.password + '_____' + (isUserNameNotEmpty(c) ? c.login.username : '')
  //       }

  //       allCiphers.forEach(c => {
  //         this.passwordStrengthCache = new Map()
  //         if (c.type !== CipherType.Login || c.login.password == null || c.login.password === '' || c.isDeleted) {
  //           return
  //         }
  //         const hasUserName = isUserNameNotEmpty(c)
  //         const cacheKey = getCacheKey(c)
  //         if (!this.passwordStrengthCache.has(cacheKey)) {
  //           let userInput = []
  //           if (hasUserName) {
  //             const atPosition = c.login.username.indexOf('@')
  //             if (atPosition > -1) {
  //               userInput = userInput.concat(
  //                 c.login.username.substr(0, atPosition).trim().toLowerCase().split(/[^A-Za-z0-9]/))
  //                 .filter(i => i.length >= 3)
  //             } else {
  //               userInput = c.login.username.trim().toLowerCase().split(/[^A-Za-z0-9]/)
  //                 .filter(i => i.length >= 3)
  //             }
  //           }
  //           const result = this.$passwordGenerationService.passwordStrength(c.login.password,
  //             userInput.length > 0 ? userInput : null)
  //           this.passwordStrengthCache.set(cacheKey, result.score)
  //         }
  //         const score = this.passwordStrengthCache.get(cacheKey)
  //         if (score != null && score <= 2) {
  //           this.passwordStrengthMap.set(c.id, score)
  //           weakPasswordCiphers.push(c)
  //         }
  //       })
  //       weakPasswordCiphers.sort((a, b) => {
  //         return this.passwordStrengthCache.get(getCacheKey(a)) -
  //             this.passwordStrengthCache.get(getCacheKey(b))
  //       })
  //       this.loadingWeak = false
  //       console.log(Date.now() - startTime)
  //       return weakPasswordCiphers
  //     },
  //     watch: ['$store.state.syncedCiphersToggle']
  //   },
  //   reusedPasswordCiphers: {
  //     async get () {
  //       this.loadingReused = true
  //       console.log('reusedpass')
  //       const allCiphers = await this.$cipherService.getAllDecrypted()
  //       const ciphersWithPasswords = []
  //       this.passwordUseMap = new Map()
  //       allCiphers.forEach(c => {
  //         if (c.type !== CipherType.Login || c.login.password == null || c.login.password === '' || c.isDeleted) {
  //           return
  //         }
  //         ciphersWithPasswords.push(c)
  //         if (this.passwordUseMap.has(c.login.password)) {
  //           this.passwordUseMap.set(c.login.password, this.passwordUseMap.get(c.login.password) + 1)
  //         } else {
  //           this.passwordUseMap.set(c.login.password, 1)
  //         }
  //       })
  //       const reusedPasswordCiphers = ciphersWithPasswords.filter(c =>
  //         this.passwordUseMap.has(c.login.password) && this.passwordUseMap.get(c.login.password) > 1)
  //       this.loadingReused = false
  //       return reusedPasswordCiphers
  //     },
  //     watch: ['$store.state.syncedCiphersToggle']
  //   }
  // },
  methods: {
    go (route) {
      this.$router.push(this.localeRoute(route))
    },
    getWeakPasswordCiphers () {
      const allCiphers = this.ciphers
      const weakPasswordCiphers = []
      const isUserNameNotEmpty = c => {
        return c.login.username != null && c.login.username.trim() !== ''
      }
      const getCacheKey = c => {
        return (
          c.login.password +
          '_____' +
          (isUserNameNotEmpty(c) ? c.login.username : '')
        )
      }

      allCiphers.forEach(c => {
        // this.passwordStrengthCache = new Map()
        if (c.type !== CipherType.Login || c.isDeleted) {
          return
        }
        // const hasUserName = isUserNameNotEmpty(c)
        const cacheKey = getCacheKey(c)
        if (!this.passwordStrengthCache.has(cacheKey)) {
          // let userInput = []
          // if (hasUserName) {
          //   const atPosition = c.login.username.indexOf('@')
          //   if (atPosition > -1) {
          //     userInput = userInput.concat(
          //       c.login.username.substr(0, atPosition).trim().toLowerCase().split(/[^A-Za-z0-9]/))
          //       .filter(i => i.length >= 3)
          //   } else {
          //     userInput = c.login.username.trim().toLowerCase().split(/[^A-Za-z0-9]/)
          //       .filter(i => i.length >= 3)
          //   }
          // }
          const result = this.$passwordGenerationService.passwordStrength(
            c.login.password
          )
          this.passwordStrengthCache.set(cacheKey, result ? result.score : -1)
        }
        const score = this.passwordStrengthCache.get(cacheKey)
        if (score != null && score <= 2) {
          this.passwordStrengthMap.set(c.id, score)
          weakPasswordCiphers.push(c)
        }
      })
      weakPasswordCiphers.sort((a, b) => {
        return (
          this.passwordStrengthCache.get(getCacheKey(a)) -
          this.passwordStrengthCache.get(getCacheKey(b))
        )
      })
      return weakPasswordCiphers
    },
    getReusedPasswordCiphers () {
      const allCiphers = this.ciphers
      const ciphersWithPasswords = []
      this.passwordUseMap = new Map()
      allCiphers.forEach(c => {
        if (
          c.type !== CipherType.Login ||
          c.login.password == null ||
          c.login.password === '' ||
          c.isDeleted
        ) {
          return
        }
        ciphersWithPasswords.push(c)
        if (this.passwordUseMap.has(c.login.password)) {
          this.passwordUseMap.set(
            c.login.password,
            this.passwordUseMap.get(c.login.password) + 1
          )
        } else {
          this.passwordUseMap.set(c.login.password, 1)
        }
      })
      const reusedPasswordCiphers = ciphersWithPasswords.filter(
        c =>
          this.passwordUseMap.has(c.login.password) &&
          this.passwordUseMap.get(c.login.password) > 1
      )
      return reusedPasswordCiphers
    }
  }
}
</script>
