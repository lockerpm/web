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
        <div v-if="sends" class="uppercase text-head-6">
          <span class="text-primary font-semibold">{{ sends.length }}</span>
          {{ $tc('type.0', sends.length) }}
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
                    <div
                      class="text-[34px] mr-3 flex-shrink-0"
                      :class="{
                        'filter grayscale': scope.row.cipher.isDeleted
                      }"
                    >
                      <Vnodes :vnodes="getIconCipher(scope.row.cipher, 34)" />
                    </div>
                  </div>
                  <!-- Icon end -->

                  <!-- Name -->
                  <div class="flex flex-col">
                    <a
                      class="text-black font-semibold truncate flex items-center"
                      :class="{ 'opacity-80': scope.row.cipher.isDeleted }"
                      @click.prevent="viewCipher(scope.row.cipher)"
                    >
                      {{ scope.row.cipher.name }}
                    </a>
                    <div v-if="scope.row.cipher.type === CipherType.Login">
                      {{ scope.row.cipher.subTitle || 'N/A' }}
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
                  CipherType[scope.row.cipher.cipher_type] ||
                    CipherType[scope.row.cipher.type] ||
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
                      : $moment(scope.row.creationDate * 1000).fromNow()
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

    <ShareNoCipher
      v-else-if="!$store.state.syncingQuickShares"
      @add-share="newShare"
    />
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

  data () {
    return {
      CipherType,
      loading: false,
      context: '',
      dataRendered: [],
      lastIndex: 0
    }
  },

  computed: {
    shouldRenderNoCipher () {
      return !this.sends?.length
    },
    tableData () {
      return this.sends || []
    }
  },

  watch: {
    '$store.state.syncingQuickShares' () {
      if (this.$store.state.syncingQuickShares) {
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
    sends: {
      async get () {
        let result = []
        try {
          result = (await this.$sendService.getAllDecrypted()) || []
        } catch (error) {
          //
        }
        result = orderBy(result, ['revisionDate'], ['desc']) || []
        this.dataRendered = result.slice(0, 50)
        return result
      },
      watch: ['$store.state.syncingQuickShares']
    }
  },

  methods: {
    viewCipher (cipher) {
      console.log(cipher)
    },
    viewShare (send) {
      console.log(send)
      // this.$refs.shareCipher.openDialog(cipher)
    },
    async stopSharing (send) {
      try {
        console.log(send)
        this.notify(this.$t('data.notifications.stop_share_success'), 'success')
      } catch (error) {
        this.notify(this.$t('errors.something_went_wrong'), 'warning')
        console.log(error)
      }
    },
    newShare () {
      // this.$refs.shareCipher.openDialog({})
    }
  }
}
</script>
