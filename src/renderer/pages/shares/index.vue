<template>
  <div class="flex flex-col flex-column-fluid relative">
    <!-- Navigation Menu -->
    <div class="navigation-bar">
      <nuxt-link
        v-for="(item, index) in menuShares"
        :key="index"
        :to="localeRoute({ name: item.routeName })"
        active-class="navigation-item__active"
        class="navigation-item"
        :class="{
          'navigation-item__active': index === 1 && !isSharedWithYou
        }"
        exact
      >
        {{ $t(`sidebar.${item.label}`) }}
        <span v-if="item.pending && item.pending > 0">
          <div class="notification-badge">{{ item.pending }}</div>
        </span>
      </nuxt-link>
    </div>
    <!-- Navigation Menu end -->

    <!-- Overview (your shares) -->
    <div v-if="!isSharedWithYou" class="flex-column-fluid lg:px-28 py-10 px-10">
      <div class="flex">
        <div class="text-head-4">
          <span class="font-medium">{{ $t('sidebar.your_shares') }}</span>
        </div>
        <div class="mx-6 text-head-4">|</div>
        <div>
          <button
            class="px-4 py-2 flex items-center cursor-pointer btn-outline-primary rounded justify-center font-semibold"
            @click="newShare"
          >
            <div class="break-normal">
              {{ $t('data.sharing.new_share') }}
            </div>
          </button>
        </div>
      </div>
      <div class="uppercase text-head-6">
        <span class="text-primary font-semibold">{{
          sendsCount + sharedCiphersCount
        }}</span>
        {{ $tc('type.0', sendsCount + sharedCiphersCount) }}
      </div>

      <div class="flex mt-6">
        <nuxt-link
          v-for="(item, index) in menuYourShares"
          :key="index"
          :to="localeRoute({ name: item.routeName })"
          active-class="border-b-2 border-primary !text-black"
          class="py-3 text-black-500 font-semibold mr-6 text-[20px]"
          exact
        >
          {{ $t(`sidebar.${item.label}`) }} ({{ item.itemCount }})
          <span v-if="item.pending && item.pending > 0">
            <div class="notification-badge">{{ item.pending }}</div>
          </span>
        </nuxt-link>
      </div>
    </div>
    <!-- Overview (your shares) end -->

    <!-- Dialogs (your shares) -->
    <div v-if="!isSharedWithYou">
      <QuickShareCipher ref="quickShareCipher" :cipher-options="allCiphers" />

      <ShareCipher
        ref="shareCipher"
        :cipher-options="allCiphers"
        @shared-cipher="getMyShares"
      />
    </div>
    <!-- Dialogs (your shares) end -->

    <!-- Content -->
    <nuxt-child />
    <!-- Content end -->
  </div>
</template>

<script>
import { AccountRole } from '@/constants'
import QuickShareCipher from '@/components/cipher/shares/QuickShareCipher'
import ShareCipher from '@/components/cipher/shares/ShareCipher'

export default {
  components: { QuickShareCipher, ShareCipher },

  computed: {
    menuShares () {
      return [
        {
          label: 'shared_with_you',
          routeName: 'shares-index',
          pending: this.pendingShares
        },
        {
          label: 'your_shares',
          routeName: 'shares-index-your-shares'
        }
      ]
    },
    menuYourShares () {
      return [
        {
          label: 'in_app_shares',
          routeName: 'shares-index-your-shares',
          itemCount: this.sharedCiphersCount
        },
        {
          label: 'quick_shares',
          routeName: 'shares-index-quick-shares',
          itemCount: this.sendsCount
        }
      ]
    },
    isSharedWithYou () {
      return this.getRouteBaseName() === 'shares-index'
    },
    isYourShares () {
      return this.getRouteBaseName() === 'shares-index-your-shares'
    },
    isYourQuickShares () {
      return this.getRouteBaseName() === 'shares-index-quick-shares'
    }
  },

  asyncComputed: {
    sendsCount: {
      async get () {
        let result = []
        try {
          result = (await this.$sendService.getAll()) || []
        } catch (error) {
          console.log(error)
        }
        return result.length
      },
      watch: ['$store.state.syncingQuickShares']
    },

    organizations: {
      async get () {
        const result = await this.$userService.getAllOrganizations()
        return result
      },
      watch: ['$store.state.syncedCiphersToggle']
    },

    sharedCiphersCount: {
      async get () {
        const filter = c =>
          c.isDeleted === false &&
          c.organizationId &&
          this.isCipherShared(c.organizationId)
        let result = []
        try {
          result =
            (await this.$searchService.searchCiphers(
              this.searchText,
              [filter],
              null
            )) || []
        } catch (error) {
          //
        }
        result = result.filter(item => !item.collectionIds.length)
        result = result.filter(
          item =>
            this.getTeam(this.organizations, item.organizationId).type ===
            AccountRole.OWNER
        )
        return result.length
      },
      watch: ['$store.state.syncedCiphersToggle', 'searchText', 'myShares']
    },

    allCiphers: {
      async get () {
        const deletedFilter = c => {
          return c.isDeleted === false
        }
        let result = []
        try {
          result =
            (await this.$searchService.searchCiphers(
              '',
              [this.isCipherQuickShareable, deletedFilter],
              null
            )) || []
        } catch (error) {}
        return result
      },
      watch: ['$store.state.syncedCiphersToggle']
    }
  },

  methods: {
    newShare () {
      if (this.isYourShares) {
        this.$refs.shareCipher.openDialog({})
      } else {
        this.$refs.quickShareCipher.openDialog({})
      }
    },
    async getMyShares () {
      this.$store.dispatch('LoadMyShares')
    }
  }
}
</script>
