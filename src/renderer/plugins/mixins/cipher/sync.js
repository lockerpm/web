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
          await this.$syncService.syncSends(userId, res.sends)
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
    }

    // OLD METHOD: get all
    // async getSyncData () {
    //   this.$store.commit('UPDATE_SYNCING', true)
    //   try {
    //     const userId = await this.$userService.getUserId()
    //     // partial sync if no ciphers in storage
    //     if (this.$cipherService.decryptedCipherCache === null) {
    //       try {
    //         this.$messagingService.send('syncStarted')
    //         let res = await this.$axios.$get('cystack_platform/pm/sync?paging=1&size=50&page=1')
    //         if (res.count && res.count.ciphers) {
    //           this.$store.commit('UPDATE_CIPHER_COUNT', res.count.ciphers)
    //         }
    //         res = new SyncResponse(res)
    //         await this.$syncService.syncProfile(res.profile)
    //         await this.$syncService.syncFolders(userId, res.folders)
    //         await this.$syncService.syncCollections(res.collections)
    //         await this.$syncService.syncCiphers(userId, res.ciphers)
    //         await this.$syncService.syncSends(userId, res.sends)
    //         await this.$syncService.syncSettings(userId, res.domains)
    //         await this.$syncService.syncPolicies(res.policies)
    //         await this.$syncService.setLastSync(new Date())
    //         this.$messagingService.send('syncCompleted', { successfully: true })
    //         this.$store.commit('UPDATE_SYNCED_CIPHERS')
    //       } catch (error) {
    //         this.$messagingService.send('syncCompleted', { successfully: false })
    //         this.$store.commit('UPDATE_SYNCED_CIPHERS')
    //       }
    //     }
    //     this.$messagingService.send('syncStarted')
    //     let res = await this.$axios.$get('cystack_platform/pm/sync')
    //     if (res.count && res.count.ciphers) {
    //       this.$store.commit('UPDATE_CIPHER_COUNT', res.count.ciphers)
    //     }
    //     res = new SyncResponse(res)
    //     // const userId = await this.$userService.getUserId()
    //     await this.$syncService.syncProfile(res.profile)
    //     await this.$syncService.syncFolders(userId, res.folders)
    //     await this.$syncService.syncCollections(res.collections)
    //     await this.$syncService.syncCiphers(userId, res.ciphers)
    //     await this.$syncService.syncSends(userId, res.sends)
    //     await this.$syncService.syncSettings(userId, res.domains)
    //     await this.$syncService.syncPolicies(res.policies)
    //     await this.$syncService.setLastSync(new Date())
    //     this.$messagingService.send('syncCompleted', { successfully: true })
    //     console.log('sync completed')
    //     this.$store.commit('UPDATE_SYNCED_CIPHERS')
    //     // console.log('PUT scores')
    //     // console.log('PUT scores completed')
    //   } catch (e) {
    //     this.$messagingService.send('syncCompleted', { successfully: false })
    //     this.$store.commit('UPDATE_SYNCED_CIPHERS')
    //   } finally {
    //     this.$store.commit('UPDATE_SYNCING', false)
    //   }
    // },
  }
})
