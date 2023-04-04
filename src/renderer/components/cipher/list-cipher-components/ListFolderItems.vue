<template>
  <div>
    <client-only>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-5 gap-6"
      >
        <!-- Collection - Shared -->
        <template v-for="item in collections">
          <div
            v-if="
              searchText.length <= 1 ||
                (searchText.length > 1 && item.ciphersCount > 0)
            "
            :key="item.id"
            class="px-4 py-4 flex items-center cursor-pointer rounded border border-[#E6E6E8] hover:border-primary"
            :title="item.name"
          >
            <!-- Icon -->
            <img
              src="~/assets/images/icons/folderSolidShare.svg"
              alt=""
              class="select-none mr-2"
              @click="routerFolder(item)"
            >
            <!-- Icon end -->

            <!-- Name + count -->
            <div
              class="font-semibold truncate select-none line-clamp-1 flex-1"
              @click="routerFolder(item)"
            >
              {{ item.name }}
              <div class="text-black-500">
                {{ item.ciphersCount }}
                {{ item.ciphersCount > 1 ? 'items' : 'item' }}
              </div>
            </div>
            <!-- Name + count end -->

            <!-- Actions -->
            <el-dropdown v-if="!isProtectedCipher(item)" trigger="click">
              <button class="btn btn-icon btn-xs hover:bg-black-400">
                <i class="fas fa-ellipsis-h" />
              </button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="canManageItem(organizations, item)"
                  @click.native="addEditFolder(item, false)"
                >
                  {{ $t('common.rename') }}
                </el-dropdown-item>

                <el-dropdown-item
                  v-if="isOwner(organizations, item)"
                  @click.native="shareFolder(item)"
                >
                  {{ $t('common.share') }}
                </el-dropdown-item>

                <el-dropdown-item
                  v-if="item.organizationId && isOwner(organizations, item)"
                  @click.native="stopSharing(item)"
                >
                  {{ $t('data.ciphers.stop_sharing') }}
                </el-dropdown-item>

                <el-dropdown-item
                  v-if="canManageItem(organizations, item)"
                  @click.native="deleteFolder(item)"
                >
                  <span class="text-danger">{{ $t('common.delete') }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- Actions end -->
          </div>
        </template>
        <!-- Collection - Shared end -->

        <!-- Folder -->
        <template v-for="item in folders">
          <div
            v-if="
              searchText.length <= 1 ||
                (searchText.length > 1 && item.ciphersCount > 0)
            "
            :key="item.id"
            class="px-4 py-4 flex items-center cursor-pointer rounded border border-[#E6E6E8] hover:border-primary"
            :title="item.name"
          >
            <!-- Icon -->
            <img
              src="~/assets/images/icons/folderSolid.svg"
              alt=""
              class="select-none mr-2"
              @click="routerFolder(item)"
            >
            <!-- Icon end -->

            <!-- Name + count -->
            <div
              class="font-semibold truncate select-none line-clamp-1 flex-1"
              @click="routerFolder(item)"
            >
              {{ item.name }}
              <div class="text-black-500">
                {{ item.ciphersCount }}
                {{ item.ciphersCount > 1 ? 'items' : 'item' }}
              </div>
            </div>
            <!-- Name + count end -->

            <!-- Actions -->
            <el-dropdown v-if="!isProtectedCipher(item)" trigger="click">
              <button class="btn btn-icon btn-xs hover:bg-black-400">
                <i class="fas fa-ellipsis-h" />
              </button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="canManageItem(organizations, item)"
                  @click.native="addEditFolder(item, false)"
                >
                  {{ $t('common.rename') }}
                </el-dropdown-item>

                <el-dropdown-item
                  v-if="isOwner(organizations, item)"
                  @click.native="shareFolder(item)"
                >
                  {{ $t('common.share') }}
                </el-dropdown-item>

                <el-dropdown-item
                  v-if="item.organizationId && isOwner(organizations, item)"
                  @click.native="stopSharing(item)"
                >
                  {{ $t('data.ciphers.stop_sharing') }}
                </el-dropdown-item>

                <el-dropdown-item
                  v-if="canManageItem(organizations, item)"
                  @click.native="deleteFolder(item)"
                >
                  <span class="text-danger">{{ $t('common.delete') }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- Actions end -->
          </div>
        </template>
        <!-- Folder end -->
      </div>
    </client-only>

    <ShareFolder ref="shareFolder" />
  </div>
</template>
<script>
import ShareFolder from '@/components/folder/ShareFolder'

export default {
  components: { ShareFolder },

  props: {
    collections: {
      type: Array,
      default: () => []
    },
    organizations: {
      type: Array,
      default: () => []
    },
    folders: {
      type: Array,
      default: () => []
    },
    addEditFolder: {
      type: Function,
      default: () => () => {}
    },
    deleteFolder: {
      type: Function,
      default: () => () => {}
    }
  },

  methods: {
    shareFolder (folder) {
      this.$refs.shareFolder.openDialog(folder)
    },

    async stopSharing (folder) {
      try {
        let memberId = null
        if (folder.user) {
          memberId = folder.user.id
          delete folder.user
        }
        let folderNameEnc = await this.$cryptoService.encrypt(folder.name)
        folderNameEnc = folderNameEnc.encryptedString

        // Encrypt ciphers with self key
        const personalKey = await this.$cryptoService.getEncKey()
        const ciphers = await Promise.all(
          folder.ciphers.map(async cipher => {
            const { data } = await this.getEncCipherForRequest(cipher, {
              noCheck: true,
              encKey: personalKey
            })
            return {
              id: cipher.id,
              ...data
            }
          })
        )
        const payload = {
          folder: {
            id: folder.id,
            name: folderNameEnc,
            ciphers
          }
        }
        if (memberId) {
          await this.$axios.$post(
            `cystack_platform/pm/sharing/${folder.organizationId}/members/${memberId}/stop`,
            payload
          )
        } else {
          await this.$axios.$post(
            `cystack_platform/pm/sharing/${folder.organizationId}/stop`,
            payload
          )
        }
        this.notify(
          this.$tc('data.notifications.update_success', 1, {
            type: this.$tc('type.Folder', 1)
          }),
          'success'
        )
        this.$store.dispatch('LoadMyShares')
      } catch (error) {
        this.notify(
          this.$tc('data.notifications.update_failed', 1, {
            type: this.$tc('type.Folder', 1)
          }),
          'warning'
        )
      }
    }
  }
}
</script>
