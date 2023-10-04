<template>
  <div v-loading="loading">
    <!-- List Ciphers, Folders, ... -->
    <div
      v-if="!shouldRenderNoCipher"
      class="flex-column-fluid lg:px-28 py-10 md:px-10 px-4 mb-20"
    >
      <!-- Overview -->
      <div class="mb-10">
        <div class="flex">
          <div class="text-head-4">
            <span class="font-medium">{{ $t('sidebar.shared_with_you') }}</span>
          </div>
        </div>
        <div class="uppercase text-head-6 mt-2">
          <span v-if="collections && collections.length">
            <span class="text-primary font-semibold">{{
              collections.length
            }}</span>
            {{ $tc('type.Folder', collections.length)
            }}<span v-if="ciphers && ciphers.length">, </span>
          </span>
          <span v-if="ciphers && ciphers.length">
            <span class="text-primary font-semibold">{{ ciphers.length }}</span>
            {{ $tc('type.0', ciphers.length) }}
          </span>
        </div>
      </div>
      <!-- Overview end -->

      <div class="flex items-center justify-end content-end mb-5">
        <!-- Sort menu -->
        <SortMenu :change-sort="changeSort" :order-string="orderString" />
        <!-- Sort menu end -->
      </div>

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
                  <template
                    v-if="!['invited', 'accepted'].includes(scope.row.status)"
                  >
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
                        class="select-none mr-3"
                        style="width: 34px"
                      >
                    </div>
                  </template>
                  <div v-else>
                    <img
                      src="~/assets/images/icons/icon_any.svg"
                      class="select-none mr-3"
                      style="height: 34px"
                    >
                  </div>
                  <!-- Icon end -->

                  <!-- Name -->
                  <div class="flex flex-col">
                    <a
                      class="text-black font-semibold truncate flex items-center"
                      @click="
                        scope.row.status === 'invited'
                          ? openAcceptDialog(scope.row)
                          : scope.row.type
                            ? routerCipher(scope.row, addEdit)
                            : routerFolder(scope.row)
                      "
                    >
                      {{
                        scope.row.name || $t('data.sharing.encrypted_content')
                      }}
                      <img
                        v-if="scope.row.organizationId"
                        src="~/assets/images/icons/shares.svg"
                        alt="Shared"
                        :title="$t('common.shared_with_you')"
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

            <!-- Owner -->
            <el-table-column
              :label="$t('common.owner')"
              show-overflow-tooltip
              width="150"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.owner
                    ? scope.row.owner.full_name
                    : getTeam(organizations, scope.row.organizationId).name
                }}</span>
              </template>
            </el-table-column>
            <!-- Owner end -->

            <!-- Type -->
            <el-table-column :label="$t('common.type')" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>
                  {{
                    getCipherTypeName(scope.row.cipher_type || scope.row.type)
                  }}
                </span>
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

            <!-- Share status -->
            <el-table-column
              :label="$t('common.status')"
              min-width="120"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span
                  class="label whitespace-normal"
                  :class="{
                    'label-primary-light': scope.row.status === 'confirmed',
                    'label-info': scope.row.status === 'accepted',
                    'label-warning-light': scope.row.status === 'invited',
                    'label-danger-light': scope.row.status === 'expired',
                    'label-success': !scope.row.status
                  }"
                >
                  {{ shareInvitationStatus[`${scope.row.status || 'shared'}`] }}
                </span>
              </template>
            </el-table-column>
            <!-- Share status end -->

            <!-- Permission -->
            <el-table-column
              :label="$t('common.share_type')"
              show-overflow-tooltip
              width="120"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.share_type || 'N/A' }}</span>
              </template>
            </el-table-column>
            <!-- Permission end -->

            <!-- Actions -->
            <el-table-column
              :label="$t('common.actions')"
              fixed="right"
              :width="
                tableData.find(r => r.status === 'invited') ? 230 : 'auto'
              "
            >
              <template slot-scope="scope">
                <div class="col-actions">
                  <!-- Accept/Decline share -->
                  <template v-if="scope.row.status === 'invited'">
                    <div class="flex">
                      <div
                        class="btn btn-primary"
                        @click="acceptShareInvitation(scope.row)"
                      >
                        {{ $t('common.accept') }}
                      </div>
                      <div
                        class="btn btn-default ml-2"
                        @click="rejectShareInvitation(scope.row)"
                      >
                        {{ $t('common.decline') }}
                      </div>
                    </div>
                  </template>
                  <!-- Accept/Decline share end -->

                  <!-- More -->
                  <el-dropdown v-else trigger="click">
                    <button class="btn btn-icon btn-xs hover:bg-black-400">
                      <i class="fas fa-ellipsis-h" />
                    </button>
                    <el-dropdown-menu slot="dropdown">
                      <!-- When item is not invited or accepted (waiting for owner confirmation) -->
                      <template
                        v-if="
                          !['invited', 'accepted'].includes(scope.row.status)
                        "
                      >
                        <!-- Edit -->
                        <template
                          v-if="canManageItem(organizations, scope.row)"
                        >
                          <el-dropdown-item
                            @click.native="
                              scope.row.ciphers
                                ? addEditFolder(scope.row)
                                : addEdit(scope.row)
                            "
                          >
                            {{ $t('common.edit') }}
                          </el-dropdown-item>
                          <!-- Edit end -->
                        </template>
                        <!-- Edit end -->

                        <!-- Action for each type of item -->
                        <template v-if="scope.row.type && !scope.row.isDeleted">
                          <!-- Copy -->
                          <el-dropdown-item
                            v-for="(copyKey, index) in getCopyableValues(
                              scope.row
                            )"
                            :key="index"
                            v-clipboard:copy="copyKey.value"
                            v-clipboard:success="clipboardSuccessHandler"
                            :disabled="!copyKey.value"
                            :divided="
                              index === getCopyableValues(scope.row).length - 1
                            "
                          >
                            {{ $t('common.copy') }} {{ $t(copyKey.label) }}
                          </el-dropdown-item>
                          <!-- Copy end -->

                          <!-- Clone -->
                          <el-dropdown-item
                            @click.native="cloneCipher(scope.row)"
                          >
                            {{ $t('common.clone') }}
                          </el-dropdown-item>
                          <!-- Clone end -->

                          <!-- Move to folder -->
                          <el-dropdown-item
                            divided
                            @click.native="moveFolders([scope.row.id])"
                          >
                            {{ $t('common.move_folder') }}
                          </el-dropdown-item>
                          <!-- Move to folder end -->
                        </template>
                        <!-- Action for each type of item end -->

                        <!-- Leave share -->
                        <template v-if="!scope.row.isDeleted">
                          <el-dropdown-item
                            :divided="!!scope.row.type"
                            @click.native="handleLeaveShare(scope.row)"
                          >
                            <span class="text-danger">{{
                              $t('data.ciphers.leave')
                            }}</span>
                          </el-dropdown-item>
                        </template>
                        <!-- Leave share end -->
                      </template>
                      <!-- When item is not invited or accepted end -->

                      <!-- When item is accepted (waiting for owner confirmation) -->
                      <template v-else-if="scope.row.status === 'accepted'">
                        <el-dropdown-item
                          divided
                          @click.native="handleLeaveShare(scope.row)"
                        >
                          <span class="text-danger">{{
                            $t('data.ciphers.leave')
                          }}</span>
                        </el-dropdown-item>
                      </template>
                      <!-- When item is accepted end -->
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

    <ShareNoCipher v-else-if="!$store.state.syncing" />

    <AddEditCipher ref="addEditCipherDialog" :organizations="organizations" />

    <AddEditFolder ref="addEditFolder" :organizations="organizations" />

    <MoveFolder ref="moveFolder" @reset-selection="multipleSelection = []" />

    <!-- Accept share dialog -->
    <el-dialog
      :title="$t('data.sharing.tips')"
      :visible.sync="dialogAcceptVisible"
      width="40%"
    >
      <span>{{ $t('data.sharing.tips_title') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAcceptVisible = false">{{
          $t('common.cancel')
        }}</el-button>
        <el-button
          type="primary"
          @click="acceptShareInvitation(selectedCipher)"
        >{{ $t('common.accept') }}</el-button>
      </span>
    </el-dialog>
    <!-- Accept share dialog end -->
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import orderBy from 'lodash/orderBy'
import LazyHydrate from 'vue-lazy-hydration'
import AddEditCipher from '../../../components/cipher/AddEditCipher'
import AddEditFolder from '../../folder/AddEditFolder'
import MoveFolder from '../../folder/MoveFolder'
import { CipherType } from '../../../jslib/src/enums/cipherType'
import Vnodes from '../../../components/Vnodes'
import { AccountRole } from '../../../constants'
import SortMenu from '../list-cipher-components/SortMenu.vue'
import ShareNoCipher from './ShareNoCipher'

export default {
  components: {
    AddEditCipher,
    AddEditFolder,
    MoveFolder,
    ShareNoCipher,
    // eslint-disable-next-line vue/no-unused-components
    VueContext: () => import('../../../plugins/vue-context'),
    Vnodes,
    LazyHydrate,
    SortMenu
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
      multipleSelection: [],
      loading: false,
      context: '',
      dataRendered: [],
      lastIndex: 0,
      selectedCipher: {},
      dialogAcceptVisible: false,
      orderField: 'revisionDate',
      orderDirection: 'desc'
    }
  },

  computed: {
    shareInvitationStatus () {
      return this.$t('data.sharing')
    },
    shouldRenderNoCipher () {
      const haveCipher =
        this.ciphers?.length ||
        this.collections?.length ||
        this.invitations?.length
      return !haveCipher && !this.searchText
    },
    tableData () {
      return this.invitations.concat(this.collections || [], this.ciphers || [])
    },
    invitations () {
      return this.shareInvitations.map(item => {
        const shareType =
          item.share_type === 'Edit'
            ? this.$t('data.ciphers.editable')
            : item.share_type === 'View'
              ? this.$t('data.ciphers.viewable')
              : this.$t('data.ciphers.only_use')
        return {
          ...item,
          share_type: shareType
        }
      })
    },
    orderString () {
      return `${this.orderField}_${this.orderDirection}`
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
    organizations: {
      async get () {
        const result = await this.$userService.getAllOrganizations()
        return result
      },
      watch: ['$store.state.syncedCiphersToggle']
    },
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
        } catch (error) {}
        result = result.filter(item => !item.collectionIds.length)
        result = result.filter(
          item =>
            this.getTeam(this.organizations, item.organizationId).type !== 0
        )
        result = result.map(item => {
          const i = this.parseNotesOfNewTypes(item)
          const org = this.getTeam(this.organizations, item.organizationId)
          return {
            ...i,
            subTitle: item.subTitle,
            share_type:
              org.type === AccountRole.ADMIN
                ? this.$t('data.ciphers.editable')
                : item.viewPassword
                  ? this.$t('data.ciphers.viewable')
                  : this.$t('data.ciphers.only_use')
          }
        })
        result =
          orderBy(
            result,
            [
              'user.status',
              c =>
                this.orderField === 'name'
                  ? c.name && c.name.toLowerCase()
                  : c.revisionDate
            ],
            ['desc', this.orderDirection]
          ) || []
        this.dataRendered = result.slice(0, 50)
        return result
      },
      watch: [
        '$store.state.syncedCiphersToggle',
        'deleted',
        'searchText',
        'filter',
        'invitations',
        'myShares',
        'orderField',
        'orderDirection'
      ]
    },
    collections: {
      async get () {
        if (this.$store.state.syncing) {
          return
        }
        let collections = []
        try {
          collections = (await this.$collectionService.getAllDecrypted()) || []
        } catch (error) {
          //
        }
        collections = collections.filter(
          item =>
            item.id &&
            this.getTeam(this.organizations, item.organizationId).type !==
              AccountRole.OWNER
        )
        collections = collections.map(item => {
          const org = this.getTeam(this.organizations, item.organizationId)
          return {
            ...item,
            share_type:
              org.type === AccountRole.ADMIN
                ? this.$t('data.ciphers.editable')
                : !item.hidePasswords
                  ? this.$t('data.ciphers.viewable')
                  : this.$t('data.ciphers.only_use')
          }
        })
        collections.forEach(f => {
          f.ciphersCount = 0
          f.ciphers = []
        })
        collections = orderBy(
          collections,
          [
            c =>
              this.orderField === 'name'
                ? c.name && c.name.toLowerCase()
                : c.revisionDate
          ],
          [this.orderDirection]
        )
        return collections
      },
      watch: ['searchText', 'ciphers', 'orderField', 'orderDirection']
    }
  },

  methods: {
    cloneCipher (cipher) {
      const _cipher = cloneDeep(cipher)
      delete _cipher.id
      this.$refs.addEditCipherDialog.openDialog(_cipher, true)
    },
    moveFolders (ids) {
      this.$refs.moveFolder.openDialog(ids)
    },
    addEditFolder (folder, shouldRedirect = false) {
      this.$refs.addEditFolder.openDialog(folder, shouldRedirect)
    },
    addEdit (cipher) {
      this.$refs.addEditCipherDialog.openDialog(cloneDeep(cipher))
    },
    async acceptShareInvitation (cipher) {
      try {
        await this.$axios.$put(
          `cystack_platform/pm/sharing/invitations/${cipher.id}`,
          { status: 'accept' }
        )
        this.$store.dispatch('LoadMyShareInvitations')
        this.notify(
          this.$t('data.notifications.accept_invitation_success'),
          'success'
        )
      } catch (e) {
        this.notify(
          this.$t('data.notifications.accept_invitation_failed'),
          'warning'
        )
      } finally {
        this.dialogAcceptVisible = false
      }
    },
    async rejectShareInvitation (cipher) {
      try {
        await this.$axios.$put(
          `cystack_platform/pm/sharing/invitations/${cipher.id}`,
          { status: 'reject' }
        )
        this.$store.dispatch('LoadMyShareInvitations')
        this.notify(this.$t('data.notifications.reject_invitation'), 'success')
      } catch (e) {
        this.notify(
          this.$t('data.notifications.reject_invitation_failed'),
          'warning'
        )
      }
    },
    async handleLeaveShare (cipher) {
      this.$confirm(
        this.$tc('data.notifications.leave_share', 1),
        this.$t('common.warning'),
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      ).then(async () => {
        await this.leaveShare(cipher)
      })
    },
    openAcceptDialog (item) {
      this.selectedCipher = item
      this.dialogAcceptVisible = true
    },
    changeSort (orderField, orderDirection) {
      this.orderField = orderField
      this.orderDirection = orderDirection
    }
  }
}
</script>
