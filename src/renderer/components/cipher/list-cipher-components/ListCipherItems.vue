<template>
  <div>
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
              :class="checkedAll ? '!visible' : ''"
              @change="checkAll"
            />
          </div>
          <!-- Check all end -->

          <!-- Multi select action -->
          <div v-if="multipleSelection.length" class="flex items-center">
            <div class="text-black mr-8 whitespace-nowrap">
              {{ multipleSelection.length }}
              {{ $t('data.ciphers.selected_items') }}
            </div>
            <div v-if="deleted">
              <button
                class="btn btn-default btn-xs"
                @click="restoreCiphers(multipleSelection.map(e => e.id))"
              >
                {{ $t('common.restore') }}
              </button>
              <button
                class="btn btn-default btn-xs !text-danger"
                @click="deleteCiphers(multipleSelection.map(e => e.id))"
              >
                {{ $t('common.permanently_delete') }}
              </button>
            </div>
            <div v-else class="">
              <button
                class="btn btn-default btn-xs"
                @click="moveFolders(multipleSelection.map(e => e.id))"
              >
                {{ $t('common.move_folder') }}
              </button>
              <button
                class="btn btn-default btn-xs !text-danger"
                @click="moveTrashCiphers(multipleSelection.map(e => e.id))"
              >
                {{ $t('common.delete') }}
              </button>
            </div>
          </div>
          <!-- Multi select action end -->
        </div>

        <!-- Headers -->
        <div v-for="header in headers" :key="header" class="th">
          {{ header }}
        </div>
        <!-- Headers end -->
      </template>

      <template #default="{ item }">
        <div class="td">
          <div class="flex items-center">
            <!-- Checkbox -->
            <div class="mr-4">
              <el-checkbox
                :disabled="isProtectedCipher(item)"
                :value="item.checked ? true : false"
                :class="item.checked ? '!visible' : ''"
                @change="changeSelection(item)"
              />
            </div>
            <!-- Checkbox end -->

            <!-- Icon -->
            <div
              class="text-[34px] mr-3 flex-shrink-0"
              :class="{ 'filter grayscale': item.isDeleted }"
            >
              <Vnodes :vnodes="getIconCipher(item, 34)" />
            </div>
            <!-- Icon end -->

            <!-- Info block -->
            <div class="flex flex-col overflow-hidden">
              <!-- Name -->
              <a
                class="text-black font-semibold truncate flex items-center"
                :class="{ 'opacity-80': item.isDeleted }"
                @click="
                  routerCipher(item, cipher => addEdit(cipher, cipher.type))
                "
              >
                <span class="overflow-hidden overflow-ellipsis">{{
                  item.name
                }}</span>
                <img
                  v-if="
                    item.organizationId &&
                      (isCipherShared(item.organizationId) ||
                        isCipherSharedWithMe(item.organizationId, organizations))
                  "
                  src="~/assets/images/icons/shares.svg"
                  alt="Shared"
                  :title="$t('common.shared_with_you')"
                  class="inline-block ml-2"
                >
              </a>
              <!-- Name end -->

              <!-- Subtitle -->
              <div class="overflow-hidden overflow-ellipsis">
                {{ getCipherSubtitle(item) }}
              </div>
              <!-- Subtitle end -->
            </div>
            <!-- Info block end -->
          </div>
        </div>

        <!-- Updated time -->
        <div class="td">
          <span class="break-normal">{{
            $moment(item.revisionDate).fromNow()
          }}</span>
        </div>
        <!-- Updated time end -->

        <!-- Actions -->
        <div class="td">
          <div class="col-actions text-right">
            <!-- Go to website -->
            <button
              v-if="!item.isDeleted && item.login.canLaunch"
              class="btn btn-icon btn-xs hover:bg-black-400"
              :title="$t('common.go_to_website')"
              @click="openNewTab(item.login.uri)"
            >
              <i class="fas fa-external-link-square-alt" />
            </button>
            <!-- Go to website end -->

            <!-- Copy -->
            <el-dropdown
              v-if="!item.isDeleted && getCopyableValues(item).length"
              trigger="click"
              :hide-on-click="false"
            >
              <button class="btn btn-icon btn-xs hover:bg-black-400">
                <i class="far fa-clone" />
              </button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(copyKey, index) in getCopyableValues(item)"
                  :key="index"
                  v-clipboard:copy="copyKey.value"
                  v-clipboard:success="clipboardSuccessHandler"
                >
                  {{ $t('common.copy') }} {{ $t(copyKey.label) }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- Copy end -->

            <!-- Share -->
            <button
              v-if="isCipherShareable(item, organizations)"
              class="btn btn-icon btn-xs hover:bg-black-400"
              :title="$t('common.share')"
              @click="shareItem(item)"
            >
              <i class="far fa-share-square" />
            </button>
            <!-- Share end -->

            <!-- Other actions -->
            <el-dropdown
              v-if="!isProtectedCipher(item)"
              trigger="click"
              :hide-on-click="false"
            >
              <button class="btn btn-icon btn-xs hover:bg-black-400">
                <i class="fas fa-ellipsis-h" />
              </button>
              <el-dropdown-menu slot="dropdown">
                <template v-if="!item.isDeleted">
                  <el-dropdown-item
                    v-if="canManageItem(organizations, item)"
                    @click.native="addEdit(item)"
                  >
                    {{ $t('common.edit') }}
                  </el-dropdown-item>
                  <el-dropdown-item divided @click.native="cloneCipher(item)">
                    {{ $t('common.clone') }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="isOwner(organizations, item)"
                    @click.native="moveFolders([item.id])"
                  >
                    {{ $t('common.move_folder') }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="
                      isOwner(organizations, item) &&
                        item.organizationId &&
                        !item.collectionIds.length
                    "
                    @click.native="stopSharing(item)"
                  >
                    {{ $t('data.ciphers.stop_sharing') }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="isOwner(organizations, item)"
                    divided
                    @click.native="moveTrashCiphers([item.id])"
                  >
                    <span class="text-danger">{{ $t('common.delete') }}</span>
                  </el-dropdown-item>
                </template>
                <template v-else-if="isOwner(organizations, item)">
                  <el-dropdown-item @click.native="restoreCiphers([item.id])">
                    {{ $t('common.restore') }}
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="deleteCiphers([item.id])">
                    <span class="text-danger">{{
                      $t('common.permanently_delete')
                    }}</span>
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

    <ShareCipher ref="shareCipher" @upgrade-plan="upgradePlan" />
    <MoveFolder ref="moveFolder" @reset-selection="multipleSelection = []" />
  </div>
</template>
<script>
import { CipherType } from '../../../core/enums/cipherType'
import MoveFolder from '@/components/folder/MoveFolder'
import ShareCipher from '@/components/cipher/ShareCipher'
import Vnodes from '@/components/Vnodes'

export default {
  components: { ShareCipher, Vnodes, MoveFolder },

  props: {
    deleted: {
      type: Boolean,
      default: false
    },
    ciphers: {
      type: Array,
      default: () => []
    },
    organizations: {
      type: Array,
      default: () => []
    },
    restoreCiphers: {
      type: Function,
      default: () => () => {}
    },
    deleteCiphers: {
      type: Function,
      default: () => () => {}
    },
    moveTrashCiphers: {
      type: Function,
      default: () => () => {}
    },
    addEdit: {
      type: Function,
      default: () => () => {}
    },
    cloneCipher: {
      type: Function,
      default: () => () => {}
    }
  },

  data () {
    return {
      CipherType,
      checkedAll: false,
      multipleSelection: []
    }
  },

  computed: {
    headers () {
      return [this.$t('data.ciphers.updated_time'), this.$t('common.actions')]
    }
  },

  methods: {
    checkAll () {
      if (this.checkedAll) {
        this.multipleSelection = []
        this.ciphers.forEach(cipher => {
          if (!this.isProtectedCipher(cipher)) {
            cipher.checked = true
            this.multipleSelection.push(cipher)
          }
        })
      } else {
        this.ciphers.forEach(cipher => {
          cipher.checked = false
        })
        this.multipleSelection = []
      }
    },

    resetSelection () {
      this.ciphers.forEach(cipher => {
        cipher.checked = false
      })
      this.multipleSelection = []
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

    shareItem (cipher) {
      this.$refs.shareCipher.openDialog(cipher)
    },

    upgradePlan () {
      this.$refs.shareCipher.closeDialog()
    },

    moveFolders (ids) {
      if (ids.length === 1) {
        const cipher = this.ciphers.find(c => c.id === ids[0])
        this.$refs.moveFolder.folderId = cipher
          ? cipher.collectionIds && cipher.collectionIds.length
            ? cipher.collectionIds[0]
            : cipher.folderId
          : null
      } else {
        this.$refs.moveFolder.folderId = null
      }
      this.$refs.moveFolder.openDialog(ids)
    },

    async stopSharing (cipher) {
      try {
        let memberId = null
        if (cipher.user) {
          memberId = cipher.user.id
          delete cipher.user
        }
        const { data } = await this.getEncCipherForRequest(cipher, {
          noCheck: true,
          encKey: await this.$cryptoService.getEncKey()
        })

        if (memberId) {
          await this.$axios.$post(
            `cystack_platform/pm/sharing/${cipher.organizationId}/members/${memberId}/stop`,
            {
              folder: null,
              cipher: { ...data, id: cipher.id }
            }
          )
        } else {
          await this.$axios.$post(
            `cystack_platform/pm/sharing/${cipher.organizationId}/stop`,
            {
              folder: null,
              cipher: { ...data, id: cipher.id }
            }
          )
        }

        this.notify(
          this.$tc('data.notifications.update_success', 1, {
            type: this.$tc(`type.${cipher.type}`, 1)
          }),
          'success'
        )
        this.$store.dispatch('LoadMyShares')
      } catch (error) {
        this.notify(
          this.$tc('data.notifications.update_failed', 1, {
            type: this.$tc(`type.${cipher.type}`, 1)
          }),
          'warning'
        )
      }
    }
  }
}
</script>
