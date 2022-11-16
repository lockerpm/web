<template>
  <div
    v-loading="loading"
    class="flex flex-col flex-column-fluid relative"
  >
    <!-- List OTP -->
    <div
      v-if="!shouldRenderNoCipher"
      class="flex-column-fluid lg:px-28 py-10 md:px-10 px-4 mb-20"
    >
      <!-- Overview -->
      <div class="mb-10">
        <!-- Breadcrumb -->
        <div class="text-head-4">
          <span class="font-medium">
            {{ $t('type.TOTP') }}
          </span>
        </div>
        <!-- Breadcrumb end -->

        <!-- number of items -->
        <div
          v-if="ciphers"
          class="uppercase text-head-6"
        >
          <span class="text-primary font-semibold">
            {{ itemsCount }}
          </span>
          {{ $tc('type.0', ciphers.length) }}
        </div>
        <!-- number of items end -->
      </div>
      <!-- Overview end -->

      <div class="flex items-center justify-end content-end mb-5">
        <!-- Sort menu -->
        <div class="header-actions">
          <div class="flex">
            <el-dropdown trigger="click" class="self-center">
              <div class="text-sm text-black-600 font-semibold">
                {{ $t('data.ciphers.sort_by') }} <i class="el-icon-caret-bottom el-icon--right" />
              </div>
              <el-dropdown-menu slot="dropdown" class="w-[200px] ">
                <el-dropdown-item
                  v-if="isSearching"
                  class="flex items-center justify-between"
                  @click.native="changeSort('', '')"
                >
                  <span>{{ $t('data.ciphers.most_relevant') }}</span>
                  <i v-if="orderString==='_'" class="fa fa-check" />
                </el-dropdown-item>
                <el-dropdown-item
                  class="flex items-center justify-between"
                  @click.native="changeSort('name', 'asc')"
                >
                  <span>{{ $t('data.ciphers.name') }} {{ $t('data.ciphers.ascending') }}</span>
                  <i v-if="orderString==='name_asc'" class="fa fa-check" />
                </el-dropdown-item>
                <el-dropdown-item
                  class="flex items-center justify-between"
                  @click.native="changeSort('name', 'desc')"
                >
                  <span>{{ $t('data.ciphers.name') }} {{ $t('data.ciphers.descending') }}</span>
                  <i v-if="orderString==='name_desc'" class="fa fa-check" />
                </el-dropdown-item>
                <el-dropdown-item
                  class="flex items-center justify-between"
                  @click.native="changeSort('revisionDate', 'asc')"
                >
                  <span>{{ $t('data.ciphers.time') }} {{ $t('data.ciphers.ascending') }}</span>
                  <i v-if="orderString==='revisionDate_asc'" class="fa fa-check" />
                </el-dropdown-item>
                <el-dropdown-item
                  class="flex items-center justify-between"
                  @click.native="changeSort('revisionDate', 'desc')"
                >
                  <span>{{ $t('data.ciphers.time') }} {{ $t('data.ciphers.descending') }}</span>
                  <i v-if="orderString==='revisionDate_desc'" class="fa fa-check" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>

      <!-- List Ciphers -->
      <client-only>
        <RecycleScroller
          ref="list"
          page-mode
          :item-size="65"
          :items="ciphers || []"
        >
          <template slot="before">
            <div class="th flex">
              <!-- Check all -->
              <div class="self-center mr-1">
                <el-checkbox
                  v-model="checkedAll"
                  :class="checkedAll?'!visible':''"
                  @change="checkAll"
                />
              </div>
              <!-- Check all end -->

              <div
                v-if="multipleSelection.length"
                class="flex items-center "
              >
                <div class="text-black mr-8 whitespace-nowrap">
                  {{ multipleSelection.length }} {{ $t('data.ciphers.selected_items') }}
                </div>
                <div>
                  <button
                    class="btn btn-default btn-xs !text-danger"
                    @click="deleteCiphers(multipleSelection.map(e => e.id))"
                  >
                    {{ $t('common.permanently_delete') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Headers -->
            <div
              v-for="header in headers"
              :key="header"
              class="th"
            >
              {{ header }}
            </div>
            <!-- Headers end -->
          </template>

          <template #default="{item}">
            <div class="td">
              <div class="flex items-center">
                <!-- Checkbox -->
                <div class="mr-4">
                  <el-checkbox
                    :value="!!item.checked"
                    :class="item.checked ? '!visible' : ''"
                    @change="changeSelection(item)"
                  />
                </div>
                <!-- Checkbox end -->

                <!-- Info -->
                <OTPInfoBlock
                  :name="item.name"
                  :otp-data="item.otpData"
                />
                <!-- Info end -->
              </div>
            </div>

            <!-- Updated time -->
            <div class="td">
              <span class="break-normal">{{ $moment(item.revisionDate).fromNow() }}</span>
            </div>
            <!-- Updated time end -->

            <!-- Actions -->
            <div class="td">
              <div class="col-actions text-right">
                <!-- Copy -->
                <el-dropdown
                  trigger="click"
                  :hide-on-click="false"
                >
                  <button class="btn btn-icon btn-xs hover:bg-black-400">
                    <i class="far fa-clone" />
                  </button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-clipboard:copy="getOtp(item.otpData)"
                      v-clipboard:success="clipboardSuccessHandler"
                    >
                      {{ $t('common.copy') }} OTP
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <!-- Copy end -->

                <!-- Other actions -->
                <el-dropdown
                  trigger="click"
                  :hide-on-click="false"
                >
                  <button class="btn btn-icon btn-xs hover:bg-black-400">
                    <i class="fas fa-ellipsis-h" />
                  </button>
                  <el-dropdown-menu slot="dropdown">
                    <template v-if="!item.isDeleted">
                      <el-dropdown-item @click.native="addEdit(item)">
                        {{ $t('common.edit') }}
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="deleteCiphers([item.id])">
                        <span class="text-danger">{{ $t('common.permanently_delete') }}</span>
                      </el-dropdown-item>
                    </template>
                  </el-dropdown-menu>
                </el-dropdown>
                <!-- Other actions end -->
              </div>
            </div>
            <!-- Actions end -->
          </template>
        </RecycleScroller>
      </client-only>
      <!-- List Ciphers end -->
    </div>
    <!-- List OTP end -->

    <!-- No cipher -->
    <NoCipher
      v-else-if="!$store.state.syncing"
      type="TOTP"
      @add-cipher="handleAddButton"
    />
    <!-- No cipher end -->

    <AddEditOTP
      ref="addEditOTPDialog"
      @reset-selection="multipleSelection = []"
    />
  </div>
</template>

<script>
import orderBy from 'lodash/orderBy'
import cloneDeep from 'lodash/cloneDeep'
import NoCipher from '../components/cipher/NoCipher'
import { CipherType } from '../core/enums/cipherType.ts'
import { parseOTPUri, getTOTP } from '../utils/totp/index.ts'
import AddEditOTP from '../components/cipher/AddEditOTP'
import OTPInfoBlock from '../components/cipher/OTPInfoBlock'

export default {
  components: { OTPInfoBlock, AddEditOTP, NoCipher },

  data () {
    return {
      loading: true,
      orderField: 'revisionDate',
      orderDirection: 'desc',
      multipleSelection: [],
      checkedAll: false
    }
  },

  computed: {
    headers () {
      return [this.$t('data.ciphers.updated_time'), this.$t('common.actions')]
    },

    filteredCiphers () {
      return this.ciphers || []
    },

    shouldRenderNoCipher () {
      const haveCipher = this.filteredCiphers.length
      return !haveCipher && !this.searchText
    },

    orderString () {
      return `${this.orderField}_${this.orderDirection}`
    },

    isSearching () {
      return this.searchText && this.searchText.trim().length > 0
    },

    itemsCount () {
      if (this.$store.state.syncing) {
        if (this.notDeletedCipherCount?.ciphers[CipherType.TOTP]) {
          return this.notDeletedCipherCount.ciphers[CipherType.TOTP]
        }
      }
      return this.ciphers.length
    }
  },

  watch: {
    ciphers () {
      if (this.ciphers) {
        this.loading = false
      }
    },
    isSearching (newVal) {
      if (newVal) {
        this.changeSort('', '')
      } else {
        this.changeSort('revisionDate', 'desc')
      }
    }
  },

  asyncComputed: {
    ciphers: {
      async get () {
        let result = []
        try {
          const filter = c => c.type === CipherType.TOTP
          result = await this.$searchService.searchCiphers(this.searchText, [filter], null) || []
        } catch (error) {
        }
        result = result.map(item => {
          try {
            item.otpData = parseOTPUri(item.notes)
          } catch (error) {
            console.log(error)
          }
          return {
            ...item,
            checked: false
          }
        })
        if (this.orderField && this.orderDirection) {
          result = orderBy(result, [c => this.orderField === 'name' ? (c.name && c.name.toLowerCase()) : c.revisionDate], [this.orderDirection]) || []
        }
        // this.dataRendered = result.slice(0, 50)
        // this.renderIndex = 50
        return result
      },
      watch: ['$store.state.syncedCiphersToggle', 'deleted', 'searchText', 'filter', 'orderField', 'orderDirection']
    }
  },

  methods: {
    addEdit (cipher) {
      this.$refs.addEditOTPDialog.openDialog(cloneDeep(cipher))
    },
    handleAddButton () {
      window.open('/download', '_blank')
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    changeSelection (item) {
      item.checked = !item.checked || false
      if (item.checked) {
        this.multipleSelection.push(item)
      } else {
        const index = this.multipleSelection.indexOf(item)
        if (index > -1) {
          this.multipleSelection.splice(index, 1)
        }
      }
    },
    deleteCiphers (ids) {
      this.$refs.addEditOTPDialog.deleteCiphers(ids)
    },
    changeSort (orderField, orderDirection) {
      this.orderField = orderField
      this.orderDirection = orderDirection
    },
    checkAll () {
      if (this.checkedAll) {
        this.multipleSelection = []
        this.ciphers.forEach(cipher => {
          cipher.checked = true
          this.multipleSelection.push(cipher)
        })
      } else {
        this.ciphers.forEach(cipher => {
          cipher.checked = false
          this.multipleSelection = []
        })
      }
    },
    getOtp (otpData) {
      return getTOTP(otpData)
    }
  }
}
</script>

<style scoped>

</style>
