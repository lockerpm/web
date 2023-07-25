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
      <!-- Title -->
      <div class="flex">
        <div class="text-head-4">
          <span class="font-medium">{{ $t('sidebar.your_shares') }}</span>
        </div>
        <div class="mx-6 text-head-4">|</div>
        <div>
          <button
            class="px-4 py-2 flex items-center cursor-pointer btn-outline-primary rounded justify-center font-semibold"
            @click="showNewShareSelection = true"
          >
            <div class="break-normal">
              {{ $t('data.sharing.new_share') }}
            </div>
          </button>
        </div>
      </div>
      <!-- Title end -->

      <!-- Shared count -->
      <div class="uppercase text-head-6">
        <span v-if="collectionsCount">
          <span class="text-primary font-semibold">{{ collectionsCount }}</span>
          {{ $tc('type.Folder', collectionsCount)
          }}<span v-if="sendsCount + sharedCiphersCount">, </span>
        </span>
        <span v-if="sendsCount + sharedCiphersCount">
          <span class="text-primary font-semibold">{{
            sendsCount + sharedCiphersCount
          }}</span>
          {{ $tc('type.0', sendsCount + sharedCiphersCount) }}
        </span>
      </div>
      <!-- Shared count end -->

      <!-- Subnav -->
      <div class="flex mt-6">
        <nuxt-link
          v-for="(item, index) in menuYourShares.filter(item => !item.hide)"
          :key="index"
          :to="localeRoute({ name: item.routeName })"
          active-class="border-b-2 border-primary !text-black"
          class="py-3 text-black-500 font-semibold mr-6 text-[20px]"
          exact
        >
          {{ $t(`sidebar.${item.label}`) }} ({{ item.itemCount }})
          <span v-if="item.pending && item.pending > 0">
            <div class="notification-badge translate-y-[-2px]">
              {{ item.pending }}
            </div>
          </span>
        </nuxt-link>
      </div>
      <!-- Subnav end -->
    </div>
    <!-- Overview (your shares) end -->

    <!-- Dialogs (your shares) -->
    <div v-if="!isSharedWithYou">
      <el-dialog
        :visible.sync="showNewShareSelection"
        width="650px"
        destroy-on-close
        top="5vh"
        custom-class="locker-dialog"
        :close-on-click-modal="false"
        :title="$t('data.sharing.choose_sharing_option')"
        @open="setSuitableShareOption"
      >
        <!-- Body -->
        <div>
          <el-radio-group v-model="newShareOption">
            <el-radio label="in-app" class="w-full mb-6 !flex items-center">
              <div class="pl-3">
                <p class="font-semibold text-[18px] mb-2 text-black">
                  {{ $t('common.in_app_share') }}
                </p>
                <p
                  class="font-normal text-black whitespace-normal leading-[20px]"
                >
                  {{ $t('data.sharing.share_desc') }}
                </p>
              </div>
            </el-radio>
            <el-radio
              v-if="!isOnPremise"
              label="quick"
              class="w-full !flex items-center"
            >
              <div class="pl-3">
                <p class="font-semibold text-[18px] mb-2 text-black">
                  {{ $t('common.quick_share') }}
                </p>
                <p
                  class="font-normal text-black whitespace-normal leading-[20px]"
                >
                  {{ $t('data.sharing.quick_share_desc') }}
                </p>
              </div>
            </el-radio>
          </el-radio-group>
        </div>
        <!-- Body end -->

        <!-- Footer -->
        <div
          slot="footer"
          class="dialog-footer flex items-center border-t border-black-200"
        >
          <button class="btn btn-primary mt-4 w-full" @click="newShare">
            {{ $t('common.continue') }}
          </button>
        </div>
        <!-- Footer end -->
      </el-dialog>

      <QuickShareCipher
        ref="quickShareCipher"
        :cipher-options="allCiphers"
        @shared-cipher="goToQuickSharesList"
      />

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
import QuickShareCipher from '@/components/cipher/shares/quick-shares/QuickShareCipher'
import ShareCipher from '@/components/cipher/shares/your-shares/ShareCipher'

export default {
  components: { QuickShareCipher, ShareCipher },

  data () {
    return {
      showNewShareSelection: false,
      newShareOption: 'in-app'
    }
  },

  computed: {
    menuShares () {
      return [
        {
          label: 'shared_with_you',
          routeName: 'shares-index-index',
          pending: this.pendingShares
        },
        {
          label: 'your_shares',
          routeName: 'shares-index-index-your-shares',
          pending: this.pendingMyShares.length
        }
      ]
    },
    menuYourShares () {
      return [
        {
          label: 'in_app_shares',
          routeName: 'shares-index-index-your-shares',
          itemCount: this.sharedCiphersCount + this.collectionsCount,
          pending: this.pendingMyShares.length
        },
        {
          label: 'quick_shares',
          routeName: 'shares-index-index-quick-shares',
          itemCount: this.sendsCount,
          hide: this.isOnPremise
        }
      ]
    },
    isSharedWithYou () {
      return this.getRouteBaseName() === 'shares-index-index'
    },
    isYourShares () {
      return this.getRouteBaseName() === 'shares-index-index-your-shares'
    },
    isYourQuickShares () {
      return this.getRouteBaseName() === 'shares-index-index-quick-shares'
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

    collectionsCount: {
      async get () {
        if (this.$store.state.syncing) {
          return
        }
        let collections = []
        try {
          collections = (await this.$collectionService.getAll()) || []
        } catch (error) {
          //
        }
        collections = collections.filter(
          item =>
            item.id &&
            this.getTeam(this.organizations, item.organizationId).type ===
              AccountRole.OWNER
        )
        return collections.length
      },
      watch: ['$store.state.syncedCiphersToggle', 'myShares', 'organizations']
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
      this.showNewShareSelection = false
      if (this.newShareOption === 'in-app') {
        this.$refs.shareCipher.openDialog({})
      } else {
        this.$refs.quickShareCipher.openDialog({})
      }
    },

    async getMyShares () {
      this.$store.dispatch('LoadMyShares')
      this.$router.push(
        this.localeRoute({ name: 'shares-index-index-your-shares' })
      )
    },

    async goToQuickSharesList () {
      this.$router.push(
        this.localeRoute({ name: 'shares-index-index-quick-shares' })
      )
    },

    setSuitableShareOption () {
      if (this.isYourQuickShares) {
        this.newShareOption = 'quick'
      } else {
        this.newShareOption = 'in-app'
      }
    }
  }
}
</script>
