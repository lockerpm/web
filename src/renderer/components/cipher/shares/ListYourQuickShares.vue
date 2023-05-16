<template>
  <div v-loading="loading">
    <!-- List Ciphers, Folders, ... -->
    <div
      v-if="!shouldRenderNoCipher"
      class="flex-column-fluid lg:px-28 px-10 mb-20"
    >
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
                        'filter grayscale': isExpired(scope.row)
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
                      @click.prevent="viewCipher(scope.row)"
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

            <!-- Shared with -->
            <el-table-column
              :label="$t('data.ciphers.shared_with')"
              width="200"
            >
              <template slot-scope="scope">
                <span v-if="!scope.row.requireOtp">
                  {{ $t('data.sharing.quick_share.anyone') }}
                </span>

                <span v-else-if="!scope.row.emails.length">
                  {{ $t('data.sharing.quick_share.nobody') }}
                </span>

                <span v-else>
                  <p
                    v-for="item in scope.row.emails.slice(
                      0,
                      scope.row.isExpanded
                        ? scope.row.emails.length + 1
                        : minLengthToCollapse
                    )"
                    :key="item.email"
                    class="break-normal"
                  >
                    {{ item.email }}
                  </p>
                  <a
                    v-if="
                      !scope.row.isExpanded &&
                        scope.row.emails.length > minLengthToCollapse
                    "
                    @click="toggleSendExpansion(scope.row.id)"
                  >
                    <div
                      class="bg-black-50 h-6 w-6 rounded-full text-center mt-1"
                    >
                      {{
                        scope.row.emails.length >= 100 + minLengthToCollapse
                          ? '99+'
                          : `+${scope.row.emails.length - minLengthToCollapse}`
                      }}
                    </div>
                  </a>
                  <a
                    v-if="scope.row.isExpanded"
                    class="text-primary"
                    @click="toggleSendExpansion(scope.row.id)"
                  >
                    {{ $t('common.collapse') }}
                  </a>
                </span>
              </template>
            </el-table-column>
            <!-- Shared with end -->

            <!-- Sharing time -->
            <el-table-column
              :label="$t('data.sharing.quick_share.sharing_time')"
              width="150"
            >
              <template slot-scope="scope">
                <span class="break-normal">
                  {{ $moment(scope.row.creationDate).fromNow() }}
                </span>
              </template>
            </el-table-column>
            <!-- Sharing time end -->

            <!-- Views -->
            <el-table-column
              :label="$tc('data.sharing.quick_share.view', 2)"
              width="150"
            >
              <template slot-scope="scope">
                <span class="break-normal">
                  {{ scope.row.accessCount
                  }}{{
                    scope.row.maxAccessCount
                      ? `/${scope.row.maxAccessCount}`
                      : ''
                  }}
                  {{
                    $tc(
                      'data.sharing.quick_share.view',
                      scope.row.accessCount
                    ).toLowerCase()
                  }}
                </span>
              </template>
            </el-table-column>
            <!-- Views end -->

            <!-- Expire time -->
            <el-table-column
              :label="$t('data.sharing.quick_share.expiration')"
              width="150"
            >
              <template slot-scope="scope">
                <span class="break-normal">
                  {{
                    scope.row.expirationDate
                      ? $moment(scope.row.expirationDate).format(
                        'DD MMMM, YYYY hh:mm A'
                      )
                      : 'N/A'
                  }}
                </span>
              </template>
            </el-table-column>
            <!-- Expire time end -->

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
                      <!-- Copy link -->
                      <el-dropdown-item
                        v-clipboard:copy="getLink(scope.row)"
                        v-clipboard:success="clipboardSuccessHandler"
                      >
                        {{ $t('data.sharing.quick_share.copy_link') }}
                      </el-dropdown-item>
                      <!-- Copy link end -->

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

    <QuickShareCipher ref="quickShareCipher" :cipher-options="allCiphers" />
  </div>
</template>

<script>
import orderBy from 'lodash/orderBy'
import LazyHydrate from 'vue-lazy-hydration'
import ShareNoCipher from '../../../components/cipher/shares/ShareNoCipher'
import QuickShareCipher from '../../../components/cipher/shares/QuickShareCipher'
import { CipherType } from '../../../jslib/src/enums'
import Vnodes from '../../../components/Vnodes'
import { Utils } from '../../../jslib/src/misc/utils.ts'

export default {
  components: {
    ShareNoCipher,
    QuickShareCipher,
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
      lastIndex: 0,
      minLengthToCollapse: 2,
      expandedSend: []
    }
  },

  computed: {
    shouldRenderNoCipher () {
      return !this.sends?.length
    },
    tableData () {
      return (this.sends || []).map(s => ({
        ...s,
        isExpanded: this.expandedSend.includes(s.id)
      }))
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
          console.log(error)
        }
        result = orderBy(result, ['revisionDate'], ['desc']) || []
        this.dataRendered = result.slice(0, 50)
        return result
      },
      watch: ['$store.state.syncingQuickShares']
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
        // remove hidden ciphers
        result = result.filter(cipher =>
          Object.values(this.cipherMapping)
            .filter(m => !m.hideFromCipherList)
            .map(m => m.type)
            .includes(cipher.type)
        )
        return result
      },
      watch: ['$store.state.syncedCiphersToggle']
    }
  },

  methods: {
    viewCipher (send) {
      this.$router.push(
        this.localePath({
          name: 'shares-index-index-quick-shares-id',
          params: {
            id: send.id
          }
        })
      )
    },
    async stopSharing (send) {
      await this.stopQuickSharing(send)
    },
    newShare () {
      this.$refs.quickShareCipher.openDialog({})
    },
    toggleSendExpansion (id) {
      if (this.expandedSend.includes(id)) {
        this.expandedSend = this.expandedSend.filter(i => i !== id)
      } else {
        this.expandedSend.push(id)
      }
    },
    getLink (send) {
      return this.getPublicShareUrl(
        send.accessId,
        Utils.fromBufferToUrlB64(send.key)
      )
    },
    isExpired (send) {
      const expired = send.expirationDate && send.expirationDate <= new Date()
      const maxAccessReached =
        send.maxAccessCount && send.accessCount >= send.maxAccessCount
      return expired || maxAccessReached
    }
  }
}
</script>
