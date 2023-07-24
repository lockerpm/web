<template>
  <div class="mb-10">
    <div class="flex justify-between">
      <div class="flex items-center">
        <!-- Breadcrumb -->
        <div class="text-head-4">
          <template v-if="getRouteBaseName() === 'vault-folders-folderId'">
            <nuxt-link
              class="font-medium hover:no-underline"
              :to="localeRoute({ name: 'vault' })"
            >
              {{ $t('sidebar.vault') }}
            </nuxt-link>
            <span class="font-medium">
              &nbsp; / &nbsp; {{ folder.name || collection.name }}
            </span>
          </template>
          <template v-else-if="getRouteBaseName() === 'vault'">
            <span class="font-medium">{{ $t('common.all_items') }}</span>
          </template>
          <template v-else-if="getRouteBaseName() === 'trash'">
            <span class="font-medium">Trash</span>
          </template>
          <template v-else>
            <span class="font-medium">
              {{ $tc(`type.${type}`, 2) }}
            </span>
          </template>
        </div>
        <!-- Breadcrumb end -->

        <!-- Add new button -->
        <div v-if="canAddItem" class="flex items-center">
          <div class="mx-6 text-head-4 mb-[5px]">|</div>
          <div class="self-center">
            <!-- Choose type to add -->
            <template v-if="routeName === 'vault'">
              <!-- Button for tutorial -->
              <el-popover
                v-model="addBtnDropdownVisible"
                placement="bottom"
                width="150"
                trigger="manual"
              >
                <button
                  id="vault__add-btn"
                  slot="reference"
                  class="btn btn-outline-primary"
                  :class="{ hidden: !$store.state.tutorial.isActive }"
                  @click="addBtnDropdownVisible = !addBtnDropdownVisible"
                >
                  <i class="el-icon-plus text-lg" />
                  <span class="ml-3 break-all">{{ $t('common.add_new') }}</span>
                </button>
                <div style="margin: -12px; padding: 10px 0">
                  <div
                    v-for="item in addNewOptions"
                    :id="`vault__add-btn__${item.value}`"
                    :key="item.value"
                    class="text-black hover:bg-black-100 w-full cursor-pointer"
                    style="padding: 11px 20px; transition: all ease 0.2s"
                    @click="handleVaultAddButton(item.value)"
                  >
                    <p>
                      {{ item.label }}
                    </p>
                  </div>
                </div>
              </el-popover>
              <!-- Button for tutorial end -->

              <!-- Normal button -->
              <el-dropdown trigger="click">
                <button
                  class="btn btn-outline-primary"
                  :class="{ hidden: $store.state.tutorial.isActive }"
                >
                  <i class="el-icon-plus text-lg" />
                  <span class="ml-3 break-all">{{ $t('common.add_new') }}</span>
                </button>
                <el-dropdown-menu slot="dropdown">
                  <div v-for="item in addNewOptions" :key="item.value">
                    <el-dropdown-item
                      :value="item.value"
                      class="flex items-center justify-between"
                      @click.native="handleVaultAddButton(item.value)"
                    >
                      {{ item.label }}
                    </el-dropdown-item>
                  </div>
                </el-dropdown-menu>
              </el-dropdown>
              <!-- Normal button end -->
            </template>

            <!-- Choose type to add end -->

            <!-- Add a specific type -->
            <template v-else>
              <button class="btn btn-outline-primary" @click="handleAddButton">
                <i class="el-icon-plus text-lg" />
                <span class="ml-3 break-all">{{ $t('common.add_new') }}</span>
              </button>
            </template>
            <!-- Add a specific type end -->
          </div>
        </div>
        <!-- Add new button end -->
      </div>

      <!-- view folder button -->
      <div v-if="getRouteBaseName() === 'vault'" class="self-center">
        <button
          class="btn btn-icon hover:bg-[#E5E5E5]"
          :class="viewFolder ? 'bg-[#E5E5E5]' : ''"
          @click="toggleViewFolder()"
        >
          <!-- <i v-if="!viewFolder" class="fas fa-folder-open" @click="viewFolder=true" /> -->
          {{ $t('common.view_folder') }}
          <span><i
            :class="viewFolder ? 'fas' : 'far'"
            class="fa-folder cursor-pointer"
          /></span>
        </button>
      </div>
      <!-- view folder button -->
    </div>

    <!-- number of items -->
    <div v-if="ciphers && !viewFolder" class="uppercase text-head-6">
      <span class="text-primary font-semibold">
        {{ itemsCount }}
      </span>
      {{ $tc('type.0', ciphers.length) }}
    </div>
    <div v-if="folders && viewFolder" class="uppercase text-head-6">
      <span class="text-primary font-semibold">{{
        folders.length + collections.length
      }}</span>
      {{ $tc('type.Folder', folders.length + collections.length) }}
    </div>
    <!-- number of items end -->
  </div>
</template>
<script>
import find from 'lodash/find'
import { CipherType } from '../../../core/enums/cipherType'

export default {
  props: {
    routeName: {
      type: String,
      default: 'passwords'
    },
    ciphers: {
      type: Array,
      default: () => []
    },
    folders: {
      type: Array,
      default: () => []
    },
    collections: {
      type: Array,
      default: () => []
    },
    organizations: {
      type: Array,
      default: () => []
    },
    addEdit: {
      type: Function,
      default: () => () => {}
    },
    addEditFolder: {
      type: Function,
      default: () => () => {}
    },
    viewFolder: {
      type: Boolean,
      default: () => false
    },
    toggleViewFolder: {
      type: Function,
      default: () => () => {}
    }
  },

  data () {
    return {
      // For tutorial
      addBtnDropdownVisible: false
    }
  },

  computed: {
    addNewOptions () {
      const res = this.cipherTypesList
        .filter(m => !m.noCreate && !m.hideFromCipherList)
        .map(m => ({
          label: this.$tc(`type.${m.type}`, 1),
          value: m.type
        }))
      return [
        ...res,
        {
          label: this.$tc('type.Folder', 1),
          value: 'Folder'
        }
      ]
    },

    type () {
      const cipherMap = Object.values(this.cipherMapping).find(
        m => m.routeName === this.routeName
      )
      if (cipherMap) {
        return cipherMap.friendlyName || cipherMap.type
      }
      switch (this.routeName) {
      case 'vault':
        return 'Vault'
      case 'shares':
        return 'Shares'
      case 'trash':
        return 'Trash'
      default:
        return null
      }
    },

    folder () {
      if (this.folders) {
        return (
          find(this.folders, e => e.id === this.$route.params.folderId) || {}
        )
      }
      return {}
    },

    collection () {
      if (this.collections) {
        return (
          find(this.collections, e => e.id === this.$route.params.folderId) || {
            name: 'Unassigned Folder'
          }
        )
      }
      return {}
    },

    writeableCollections () {
      if (!this.collections || !this.organizations) {
        return []
      }
      return this.collections.filter(item => {
        const _type = this.getTeam(this.organizations, item.organizationId).type
        return _type === 0
      })
    },

    canAddItem () {
      let res = !['shares', 'trash'].includes(this.routeName)
      const collection = find(
        this.collections,
        e => e.id === this.$route.params.folderId
      )
      if (collection) {
        res &= this.writeableCollections.some(c => c.id === collection.id)
      }
      return res
    },

    itemsCount () {
      if (this.$store.state.syncing && this.type) {
        if (this.type === 'Vault' && this.notDeletedCipherCount?.total) {
          return (
            this.notDeletedCipherCount.total -
              this.notDeletedCipherCount?.ciphers[CipherType.TOTP] || 0
          )
        }
        if (
          this.type === 'Trash' &&
          this.notDeletedCipherCount?.total &&
          this.cipherCount
        ) {
          return this.cipherCount - this.notDeletedCipherCount.total
        }
        if (this.type === 'Login') {
          let pwCount =
            this.notDeletedCipherCount?.ciphers[CipherType.Login] || 0
          pwCount +=
            this.notDeletedCipherCount?.ciphers[CipherType.MasterPassword] || 0
          if (pwCount) {
            return pwCount
          }
        }
        if (this.notDeletedCipherCount?.ciphers[CipherType[this.type]]) {
          return this.notDeletedCipherCount.ciphers[CipherType[this.type]]
        }
      }
      return this.ciphers.length
    }
  },

  watch: {
    '$store.state.tutorial.currentStepId' (newVal) {
      if (newVal !== 'add-pw-2') {
        this.addBtnDropdownVisible = false
      }
    }
  },

  beforeDestroy () {
    if (this.$store.state.tutorial.isActive) {
      const currentStep = this.$tutorial.getCurrentStep()
      if (currentStep.id.startsWith('add-pw')) {
        this.$tutorial.hide()
        this.$store.commit('UPDATE_TUTORIAL', { isActive: false })
      }
    }
  },

  methods: {
    handleVaultAddButton (type) {
      this.addBtnDropdownVisible = false
      if (type === 'Folder') {
        this.addEditFolder()
      } else {
        this.addEdit({}, type)
      }
    },

    handleAddButton () {
      if (
        this.getRouteBaseName() === 'vault-tfolders-tfolderId' &&
        !this.collection.readOnly
      ) {
        this.addEdit(
          {
            organizationId: this.collection.organizationId
          },
          this.type
        )
      } else {
        this.addEdit({}, this.type)
      }
    }
  }
}
</script>
