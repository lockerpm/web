<template>
  <div v-loading="loading">
    <!-- List Ciphers, Folders, ... -->
    <div
      v-if="!shouldRenderNoCipher"
      class="flex-column-fluid lg:px-28 py-10 px-10 mb-20"
    >
      <!-- Overview -->
      <div class="mb-10">
        <div class="flex">
          <div class="text-head-4">
            <span class="font-medium">{{ $t('type.your_shares') }}</span>
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
        <div v-if="ciphers" class="uppercase text-head-6">
          <span class="text-primary font-semibold">{{ ciphers.length }}</span>
          {{ $tc('type.0', ciphers.length) }}
        </div>
      </div>
      <!-- Overview end -->

      <!-- List Ciphers -->
      <client-only>
        <LazyHydrate when-visible>
          <el-table
            ref="multipleTable"
            :data="tableData"
            style="width: 100%"
            row-class-name="hover-table-row"
          >
            <!-- Item name -->
            <el-table-column
              prop="name"
              label=""
              min-width="300"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div class="flex items-center">
                  <!-- Icon -->
                  <div>
                    <!-- Item -->
                    <div
                      v-if="scope.row.type"
                      class="text-[34px] mr-3 flex-shrink-0"
                      :class="{ 'filter grayscale': scope.row.isDeleted }"
                    >
                      <Vnodes :vnodes="getIconCipher(scope.row, 34)" />
                    </div>

                    <!-- Folder -->
                    <div v-else>
                      <img
                        src="~/assets/images/icons/folderSolidShare.svg"
                        alt=""
                        class="select-none mr-2"
                      >
                    </div>
                  </div>
                  <!-- Icon end -->

                  <!-- Name -->
                  <div class="flex flex-col">
                    <a
                      class="text-black font-semibold truncate flex items-center"
                      :class="{ 'opacity-80': scope.row.isDeleted }"
                      @click="routerCipher(scope.row, addEdit)"
                    >
                      {{ scope.row.name }}
                      <img
                        v-if="scope.row.organizationId"
                        src="~/assets/images/icons/shares.svg"
                        alt="Shared"
                        title="Your shares"
                        class="inline-block ml-2"
                      >
                    </a>
                    <div v-if="scope.row.type === CipherType.Login">
                      {{ scope.row.subTitle || 'N/A' }}
                    </div>
                  </div>
                  <!-- Name end -->
                </div>
              </template>
            </el-table-column>
            <!-- Item name end -->

            <!-- Type -->
            <el-table-column :label="$t('common.type')" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{
                  CipherType[scope.row.cipher_type] ||
                    CipherType[scope.row.type] ||
                    'Folder'
                }}</span>
              </template>
            </el-table-column>
            <!-- Type end -->

            <!-- Updated time -->
            <el-table-column
              :label="$t('data.ciphers.updated_time')"
              width="150"
            >
              <template slot-scope="scope">
                <span class="break-normal">
                  {{
                    scope.row.revisionDate
                      ? $moment(scope.row.revisionDate).fromNow()
                      : $moment(scope.row.access_time * 1000).fromNow()
                  }}
                </span>
              </template>
            </el-table-column>
            <!-- Updated time end -->

            <!-- Actions -->
            <el-table-column
              :label="$t('common.actions')"
              fixed="right"
              width="auto"
            >
              <template slot-scope="scope">
                <div class="col-actions">
                  <!-- More -->
                  <el-dropdown trigger="click">
                    <button class="btn btn-icon btn-xs hover:bg-black-400">
                      <i class="fas fa-ellipsis-h" />
                    </button>
                    <el-dropdown-menu slot="dropdown">
                      <!-- View share -->
                      <el-dropdown-item @click.native="viewShare(scope.row)">
                        {{ $t('data.ciphers.view_share') }}
                      </el-dropdown-item>
                      <!-- View share end -->

                      <!-- Stop share -->
                      <el-dropdown-item @click.native="stopSharing(scope.row)">
                        {{ $t('data.ciphers.stop_sharing') }}
                      </el-dropdown-item>
                      <!-- Stop share end -->
                    </el-dropdown-menu>
                  </el-dropdown>
                  <!-- More end -->
                </div>
              </template>
            </el-table-column>
            <!-- Actions end -->
          </el-table>
        </LazyHydrate>
      </client-only>
      <!-- List Ciphers end -->
    </div>

    <ShareNoCipher v-else-if="!$store.state.syncing" @add-share="newShare" />
  </div>
</template>

<script>
import orderBy from 'lodash/orderBy'
import LazyHydrate from 'vue-lazy-hydration'
import ShareNoCipher from '../../../components/cipher/shares/ShareNoCipher'
import { CipherType } from '../../../jslib/src/enums'
import Vnodes from '../../../components/Vnodes'

CipherType.TOTP = 5
CipherType.MasterPassword = 8
CipherType.CryptoBackup = 7
CipherType[7] = 'Crypto Backup'

export default {
  components: {
    ShareNoCipher,
    // eslint-disable-next-line vue/no-unused-components
    VueContext: () => import('../../../plugins/vue-context'),
    Vnodes,
    LazyHydrate
  },

  props: {
    filter: {
      type: Function,
      default: null
    }
  },

  data () {
    return {
      CipherType,
      loading: false,
      context: '',
      publicKey: '',
      dataRendered: [],
      lastIndex: 0,
      userFingerPrint: '',
      selectedUser: {},
      loadingConfirm: false,
      dialogConfirmVisible: false,
      selectedCipher: {},
      isItemInUrlOpened: false
    }
  },

  computed: {
    shouldRenderNoCipher () {
      const haveCipher = this.ciphers?.length
      return !haveCipher && !this.searchText
    },
    tableData () {
      return this.ciphers || []
    }
  },

  watch: {
    '$store.state.syncing' () {
      if (this.$store.state.syncing) {
        this.loading = true
      } else {
        this.loading = false
      }
    }
  },

  async mounted () {
    // Load more data when scrolling
    this.context = 'VueContext'
    window.onscroll = () => {
      const bottomOfWindow =
        Math.max(
          window.pageYOffset,
          document.documentElement.scrollTop,
          document.body.scrollTop
        ) +
          window.innerHeight +
          500 >=
        document.documentElement.scrollHeight

      if (bottomOfWindow) {
        this.lastIndex += 50
        if (this.lastIndex <= this.ciphers?.length) {
          this.dataRendered = this.dataRendered.concat(
            this.ciphers.slice(this.lastIndex, this.lastIndex + 50)
          )
        }
      }
    }
  },

  asyncComputed: {
    ciphers: {
      async get () {
        const deletedFilter = c => {
          return c.isDeleted === false
        }
        let result = []
        try {
          result =
            (await this.$searchService.searchCiphers(
              this.searchText,
              [this.filter, deletedFilter],
              null
            )) || []
        } catch (error) {
          //
        }
        result = orderBy(result, ['user.status'], ['desc']) || []
        this.dataRendered = result.slice(0, 50)
        return result
      },
      watch: [
        '$store.state.syncedCiphersToggle',
        'searchText',
        'filter',
        'myQuickShares'
      ]
    }
  },

  methods: {
    viewShare (cipher) {
      this.selectedCipher = cipher
      this.$refs.shareCipher.openDialog(cipher)
    },
    async stopSharing (cipher) {
      try {
        console.log(cipher)
        this.notify(this.$t('data.notifications.stop_share_success'), 'success')
        await this.getMyShares()
      } catch (error) {
        this.notify(this.$t('errors.something_went_wrong'), 'warning')
        console.log(error)
      }
    },
    newShare () {
      this.$refs.shareCipher.openDialog({})
    },
    async getMyShares () {
      this.$store.dispatch('LoadMyQuickShares')
    }
  }
}
</script>
