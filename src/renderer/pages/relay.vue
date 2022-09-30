<template>
  <div class="flex flex-col flex-column-fluid relative bg-[#FBFBFC]">
    <div class="flex-column-fluid lg:px-28 py-10 px-10 mb-20">
      <!-- Breadcrumb -->
      <div class="mb-5">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <!-- <el-breadcrumb-item
            :to="localeRoute({name: 'tools'})"
          >
            Tools
          </el-breadcrumb-item> -->
          <el-breadcrumb-item
            :to="localeRoute({name: 'relay'})"
          >
            {{ `${$t('data.tools.relay')}${isPremium ? ' Premium' : ''}` }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- Breadcrumb end -->

      <!-- Info -->
      <div class="setting-wrapper">
        <div class="setting-section">
          <!-- Root Email -->
          <div class="setting-section-header">
            <div>
              {{ $t('data.tools.relay_your_root_email') }} <strong>{{ currentUser.email }}</strong>
            </div>
            <div />
          </div>
          <!-- Root Email end -->

          <div class="setting-section-body">
            <ul class="list-disc ml-5">
              <li>
                {{ $t('data.tools.relay_desc_1') }}
              </li>
              <li>
                {{ isPremium ? $t('data.tools.relay_desc_2_premium') : $t('data.tools.relay_desc_2') }}
              </li>
              <li>
                {{ isPremium ? $t('data.tools.relay_desc_3_premium') : $t('data.tools.relay_desc_3') }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- Info end -->

      <!-- Count + add -->
      <div class="flex justify-between items-center mb-5">
        <p>
          {{ $t('data.tools.relay_your_alias_addresses') }} ({{ `${addresses.length}${!isPremium ? '/' + limit : ''})` }}
        </p>
        <div class="flex items-center">
          <!-- subdomain -->
          <template v-if="isPremium">
            <el-switch :value="useSubdomain" @change="toggleUseSubdomain" />
            <p class="ml-2">
              {{ $t('data.tools.relay_use_subdomain') }}
            </p>
            <button
              :disabled="loading"
              class="btn btn-outline-primary mx-3"
              @click="openManageSubdomain"
            >
              {{ $t('data.tools.relay_manage_subdomain') }}
            </button>
          </template>
          <!-- subdomain end -->

          <button
            :disabled="loading || (!isPremium && addresses.length >= limit)"
            class="btn btn-primary"
            @click="addAddress"
          >
            {{ $t('data.tools.relay_new_alias') }}
          </button>
        </div>
      </div>
      <!-- Count + add end -->

      <!-- Addresses -->
      <div v-loading="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="(item, index) in addresses"
          :key="item.id"
          class="setting-wrapper"
          style="margin-bottom: 0"
        >
          <div class="setting-section">
            <!-- Top -->
            <div class="setting-section-header">
              <div class="flex flex-row justify-between w-full">
                <div>
                  <p class="font-medium">
                    {{ item.full_address }}
                    <span>
                      <button
                        v-clipboard:copy="item.full_address"
                        v-clipboard:success="clipboardSuccessHandler"
                        class="btn btn-icon btn-xs btn-action"
                      >
                        <i class="far fa-copy" />
                      </button>
                    </span>
                  </p>

                  <p class="text-black-500">
                    {{$t('common.created')}} {{ $moment(item.created_time * 1000).format('MMM DD, YYYY') }}
                  </p>
                </div>

                <a
                  class="text-black font-medium hover:text-black mt-0.5"
                  @click="startEditing(item, index)"
                >
                  <i class="far fa-edit" /> {{ $t('common.edit') }}
                </a>
              </div>
            </div>
            <!-- Top end -->

            <div class="setting-section-body">
              <div class="flex flex-row items-center">
                <div class="flex flex-1 justify-center" style="border-right: 1px solid #E8E8E9">
                  <p><strong>{{ item.num_forwarded }}</strong> <span class="text-black-500">{{ $t('data.tools.relay_address.forwarded') }}</span></p>
                </div>
                <div class="flex flex-1 justify-center" style="border-right: 1px solid #E8E8E9">
                  <p><strong>{{ item.num_blocked }}</strong> <span class="text-black-500">{{ $t('data.tools.relay_address.blocked') }}</span></p>
                </div>
                <div class="px-4">
                  <div style="background-color: #E4F0E699; padding: 6px 16px; border-radius: 100px">
                    <p class="text-primary">
                      {{ getBlockingMode(item) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Addresses end -->
    </div>

    <!--  DIALOGS  -->

    <!-- Create subdomain -->
    <CreateSubdomainModal
      :is-open="modals.createSubdomain.isVisible"
      :on-close="() => modals.createSubdomain.isVisible = false"
      :on-create="getSubdomains"
    />
    <!-- Create subdomain end -->

    <!-- Manage subdomain -->
    <ManageSubdomainModal
      :current-subdomain="subdomains[0]"
      :is-open="modals.manageSubdomain.isVisible"
      :on-close="() => modals.manageSubdomain.isVisible = false"
      :on-edit="onSubdomainEdited"
    />
    <!-- Manage subdomain end -->

    <!-- Edit address -->
    <EditAddressModal
      :is-open="modals.editAddress.isVisible"
      :on-close="() => modals.editAddress.isVisible = false"
      :current-address="selectedAddress"
      :on-edit="getAddresses"
    />
    <!-- Edit address end -->

    <!--  DIALOGS END  -->
  </div>
</template>

<script>
import CreateSubdomainModal from '../components/relay/CreateSubdomainModal'
import ManageSubdomainModal from '../components/relay/ManageSubdomainModal'
import EditAddressModal from '../components/relay/EditAddressModal'

export default {
  components: {
    CreateSubdomainModal,
    ManageSubdomainModal,
    EditAddressModal
  },
  data () {
    return {
      limit: 5,
      loading: false,
      isEditing: false,
      address: '',
      addresses: [],
      selectedAddress: {},
      subdomains: [],
      useSubdomain: false,
      modals: {
        createSubdomain: {
          isVisible: false
        },
        manageSubdomain: {
          isVisible: false
        },
        editAddress: {
          isVisible: false
        }
      }
    }
  },
  computed: {
    isPremium () {
      return this.currentUserPw.pwd_user_type !== 'personal'
    }
  },
  mounted () {
    this.getAddresses()
    this.getUseSubdomain()
    this.getSubdomains()
  },
  methods: {
    // List addresses
    async getAddresses () {
      this.loading = true
      try {
        this.addresses = await this.$axios.$get('cystack_platform/relay/addresses', {
          params: {
            paging: 0
          }
        })
      } catch {

      } finally {
        this.loading = false
      }
    },

    // Create address
    async addAddress () {
      this.loading = true
      try {
        const res = await this.$axios.$post('cystack_platform/relay/addresses')
        const addresses = [...this.addresses]
        addresses.push(res)
        this.addresses = [...addresses]
        this.notify(this.$t('data.tools.relay_alias_added'), 'success')
      } catch {

      } finally {
        this.loading = false
      }
    },

    // Use subdomain

    async getUseSubdomain () {
      this.loading = true
      try {
        const res = await this.$axios.$get('cystack_platform/relay/subdomains/use_subdomain')
        this.useSubdomain = res.use_relay_subdomain
      } catch {

      } finally {
        this.loading = false
      }
    },
    async toggleUseSubdomain (isEnabled) {
      this.loading = true
      try {
        await this.$axios.$put('cystack_platform/relay/subdomains/use_subdomain', {
          use_relay_subdomain: isEnabled
        })
        this.notify('Done', 'success')
        this.useSubdomain = isEnabled
        if (this.subdomains.length === 0) {
          this.modals.createSubdomain.isVisible = true
        }
      } catch {

      } finally {
        this.loading = false
      }
    },

    // Manage subdomain

    openManageSubdomain () {
      if (this.subdomains.length === 0) {
        this.modals.createSubdomain.isVisible = true
      } else {
        this.modals.manageSubdomain.isVisible = true
      }
    },

    async getSubdomains () {
      this.loading = true
      try {
        this.subdomains = await this.$axios.$get('cystack_platform/relay/subdomains', {
          params: {
            paging: 0
          }
        })
      } catch {

      } finally {
        this.loading = false
      }
    },

    onSubdomainEdited (oldSubdomain) {
      this.getSubdomains()
      this.addresses = this.addresses.filter(a => a.subdomain !== oldSubdomain)
    },

    // Edit address
    startEditing (item, index) {
      this.selectedAddress = item
      if (index === 0) {
        this.selectedAddress.addressEditable = true
      }
      this.modals.editAddress.isVisible = true
    },

    getBlockingMode (item) {
      let text = ''
      if (!item.enabled) {
        text = this.$t('data.tools.relay_address.block_all')
      } else if (item.block_spam) {
        text = this.$t('data.tools.relay_address.block_spam')
      } else {
        text = this.$t('data.tools.relay_address.forward')
      }
      return text
    }
  }
}
</script>
