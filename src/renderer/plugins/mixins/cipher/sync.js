import Vue from 'vue'
import { SyncResponse } from '../../../core/models/response/syncResponse'

Vue.mixin({
  computed: {
    cipherCount () {
      return this.$store.state.cipherCount
    }
  },

  methods: {
    // NEW METHOD: get by page
    async getSyncData () {
      this.$store.commit('UPDATE_SYNCING', true)
      const pageSize = 100
      try {
        let page = 1
        let allCiphers = []
        const userId = await this.$userService.getUserId()
        this.$messagingService.send('syncStarted')
        while (true) {
          let res = await this.$axios.$get(
            `cystack_platform/pm/sync?paging=1&size=${pageSize}&page=${page}`
          )
          if (res.count && res.count.ciphers) {
            this.$store.commit('UPDATE_CIPHER_COUNT', res.count.ciphers)
          }
          if (res.count && res.count.notDeletedCiphers) {
            this.$store.commit(
              'UPDATE_NOT_DELETED_CIPHER_COUNT',
              res.count.notDeletedCiphers
            )
          }
          const enterprisePolicies = {}
          res.policies.forEach(element => {
            enterprisePolicies[element.policyType] = element
          })
          this.$store.commit('UPDATE_ENTERPRISE_POLICIES', enterprisePolicies)
          res = new SyncResponse(res)
          allCiphers = allCiphers.concat(res.ciphers)
          await this.$syncService.syncProfile(res.profile)
          await this.$syncService.syncFolders(userId, res.folders)
          await this.$syncService.syncCollections(res.collections)
          await this.$syncService.syncSomeCiphers(userId, res.ciphers)
          // await this.$syncService.syncSends(userId, res.sends)
          await this.$syncService.syncSettings(userId, res.domains)
          await this.$syncService.syncPolicies(res.policies)
          await this.$syncService.setLastSync(new Date())
          this.$store.commit('UPDATE_SYNCED_CIPHERS')
          if (page * pageSize >= this.cipherCount) {
            break
          }
          page += 1
        }
        // delete cached cipher if it is not in sync data
        const decryptedCipherCache = this.$cipherService.decryptedCipherCache
        decryptedCipherCache.forEach(function (cipher, i) {
          const syncIndex = allCiphers.findIndex(c => c.id === cipher.id)
          if (syncIndex < 0) {
            decryptedCipherCache.splice(i, 1)
          }
        })
        // this.$cipherService.decryptedCipherCache(decryptedCipherCache)
        this.$messagingService.send('syncCompleted', { successfully: true })
        console.log('sync completed')
      } catch (e) {
        this.$messagingService.send('syncCompleted', { successfully: false })
        this.$store.commit('UPDATE_SYNCED_CIPHERS')
      } finally {
        this.$store.commit('UPDATE_SYNCING', false)
      }
    },

    async syncProfile () {
      try {
        const res = await this.$axios.$get('/cystack_platform/pm/sync/profile')
        await this.$syncService.syncProfile(res)
        this.$store.commit('UPDATE_SYNCED_CIPHERS')
      } catch (e) {
        console.log(e)
      }
    },

    async syncSingleCipher (id) {
      try {
        const res = await this.$axios.$get(
          `/cystack_platform/pm/sync/ciphers/${id}`
        )
        await this.$cipherService.upsert([res])
        if (res.organizationId) {
          await this.syncProfile()
        } else {
          this.$store.commit('UPDATE_SYNCED_CIPHERS')
        }
      } catch (e) {
        const status = e.response?.status
        if (status === 403 || status === 404) {
          await this.$cipherService.delete([id])
          this.$store.commit('UPDATE_SYNCED_CIPHERS')
        } else {
          console.log(e)
        }
      }
    },

    async syncSingleFolder (id) {
      try {
        const res = await this.$axios.$get(
          `/cystack_platform/pm/sync/folders/${id}`
        )
        await this.$folderService.upsert([res])
        this.$store.commit('UPDATE_SYNCED_CIPHERS')
      } catch (e) {
        const status = e.response?.status
        if (status === 404) {
          await this.$folderService.delete([id])
          this.$store.commit('UPDATE_SYNCED_CIPHERS')
        } else {
          console.log(e)
        }
      }
    },

    async syncSingleCollection (id) {
      try {
        const res = await this.$axios.$get(
          `/cystack_platform/pm/sync/collections/${id}`
        )
        await this.$collectionService.upsert([res])
        this.$store.commit('UPDATE_SYNCED_CIPHERS')
      } catch (e) {
        const status = e.response?.status
        if (status === 404) {
          await this.$collectionService.delete([id])
          this.$store.commit('UPDATE_SYNCED_CIPHERS')
        } else {
          console.log(e)
        }
      }
    },

    async syncQuickShares () {
      try {
        // No quick shares for on premise
        if (this.isOnPremise) {
          return
        }
        this.$store.commit('UPDATE_SYNCING_QUICK_SHARES', true)
        const res = await this.$axios.$get(
          'cystack_platform/pm/quick_shares?paging=0'
        )
        const userId = await this.$userService.getUserId()
        await this.$syncService.syncSends(userId, res)
      } catch (error) {
        console.log(error)
      } finally {
        this.$store.commit('UPDATE_SYNCING_QUICK_SHARES', false)
      }
    },

    async syncSingleQuickShare (id) {
      try {
        this.$store.commit('UPDATE_SYNCING_QUICK_SHARES', true)
        const res = await this.$axios.$get(
          `/cystack_platform/pm/quick_shares/${id}`
        )
        await this.$sendService.upsert([res])
      } catch (e) {
        const status = e.response?.status
        if (status === 403 || status === 404) {
          await this.$sendService.delete([id])
        } else {
          console.log(e)
        }
      } finally {
        this.$store.commit('UPDATE_SYNCING_QUICK_SHARES', false)
      }
    }
  }
})
