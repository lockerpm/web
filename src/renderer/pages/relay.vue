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
              <div class="flex flex-row justify-between items-center w-full">
                <div
                  v-if="isEditing && index === 0"
                  class="form-group flex flex-row items-center"
                  style="margin-bottom: 0; flex: 1"
                >
                  <el-input
                    v-model="address"
                    autofocus
                    type="text"
                    maxlength="64"
                    minlength="6"
                    show-word-limit
                  />
                  <p class="font-medium ml-2 mr-3">
                    @{{ item.domain }}
                  </p>
                </div>

                <div v-else>
                  <p class="font-medium" style="line-height: 40px">
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
                </div>

                <template v-if="index === 0">
                  <div
                    v-if="isEditing"
                  >
                    <button
                      class="btn btn-icon btn-xs btn-action"
                      style="margin-right: 0"
                      @click="isEditing = false"
                    >
                      <i class="fas fa-times text-danger" />
                    </button>
                    <button
                      class="btn btn-icon btn-xs btn-action"
                      style="margin-right: 0"
                      @click="selectToEdit(item)"
                    >
                      <i class="fas fa-check text-success" />
                    </button>
                  </div>

                  <a
                    v-else
                    class="text-black hover:text-black"
                    @click="startEditing(item.address)"
                  >
                    <i class="far fa-edit" /> {{ $t('common.edit') }}
                  </a>
                </template>
              </div>
            </div>
            <!-- Top end -->

            <div class="setting-section-body">
              <hr class="border-black-100">
              <div class="flex flex-row items-center justify-between mt-2">
                <div>
                  <p class="text-xs">
                    {{ $t('common.created_date') }}
                  </p>
                  <p class="font-medium">
                    {{ $moment(item.created_time * 1000).format('MMM DD, YYYY') }}
                  </p>
                </div>

                <a class="text-danger hover:text-danger" @click.prevent="selectToDelete(item)">
                  {{ $t('common.delete') }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Addresses end -->
    </div>

    <!--  DIALOGS  -->

    <!-- Confirm edit alias -->
    <el-dialog
      :title="$t('data.tools.edit_relay_alias.title')"
      :visible.sync="dialog.confirmEdit.isOpen"
      width="600px"
      destroy-on-close
      top="5vh"
      custom-class="locker-dialog"
      :close-on-click-modal="false"
    >
      <span
        class="text-black"
        v-html="$t('data.tools.edit_relay_alias.desc', { email: dialog.confirmEdit.data.full_address })"
      />
      <br>
      <span class="text-danger">{{ $t('data.tools.edit_relay_alias.warning') }}</span>

      <!-- Footer -->
      <span slot="footer">
        <hr class="border-black-100 mb-4">
        <button class="btn btn-outline-primary mr-2" @click.prevent="dialog.confirmEdit.isOpen = false">
          {{ $t('common.cancel') }}
        </button>
        <button :disabled="loading" class="btn btn-primary" @click.prevent="editAddress(dialog.confirmEdit.data.id)">
          {{ $t('data.tools.edit_relay_alias.confirm') }}
        </button>
      </span>
      <!-- Footer end -->
    </el-dialog>
    <!-- Confirm edit alias end -->

    <!-- Confirm delete alias -->
    <el-dialog
      :title="$t('data.tools.delete_relay_alias.title')"
      :visible.sync="dialog.confirmDelete.isOpen"
      width="600px"
      destroy-on-close
      top="5vh"
      custom-class="locker-dialog"
      :close-on-click-modal="false"
    >
      <span class="text-primary font-medium text-lg">{{ dialog.confirmDelete.data.full_address }}</span>
      <br>
      <br>
      <span
        class="text-black"
        v-html="$t('data.tools.delete_relay_alias.desc', { email: dialog.confirmDelete.data.full_address })"
      />
      <br>
      <span class="text-danger">{{ $t('data.tools.delete_relay_alias.warning') }}</span>

      <!-- Footer -->
      <span slot="footer">
        <hr class="border-black-100 mb-4">
        <button class="btn btn-outline-primary mr-2" @click.prevent="dialog.confirmDelete.isOpen = false">
          {{ $t('common.cancel') }}
        </button>
        <button :disabled="loading" class="btn btn-primary" @click.prevent="deleteAddress(dialog.confirmDelete.data.id)">
          {{ $t('data.tools.delete_relay_alias.confirm') }}
        </button>
      </span>
      <!-- Footer end -->
    </el-dialog>
    <!-- Confirm delete alias end -->

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
      :on-update="getSubdomains"
    />
    <!-- Manage subdomain end -->

    <!--  DIALOGS END  -->
  </div>
</template>

<script>
import CreateSubdomainModal from '../components/relay/CreateSubdomainModal'
import ManageSubdomainModal from '../components/relay/ManageSubdomainModal'

export default {
  components: {
    CreateSubdomainModal,
    ManageSubdomainModal
  },
  data () {
    return {
      limit: 5,
      loading: false,
      isEditing: false,
      address: '',
      addresses: [],
      subdomains: [],
      useSubdomain: false,
      dialog: {
        confirmEdit: {
          isOpen: false,
          data: {}
        },
        confirmDelete: {
          isOpen: false,
          data: {}
        }
      },
      modals: {
        createSubdomain: {
          isVisible: false
        },
        manageSubdomain: {
          isVisible: false
        }
      }
    }
  },
  computed: {
    isPremium () {
      return this.currentUserPw.pwd_user_type !== 'free'
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

    // Edit address

    startEditing (address) {
      this.isEditing = true
      this.address = address
    },
    selectToEdit (item) {
      if (item.address === this.address) {
        this.isEditing = false
        return
      }
      this.dialog.confirmEdit.data = item
      this.dialog.confirmEdit.isOpen = true
    },
    async editAddress (id) {
      this.dialog.confirmEdit.isOpen = false
      this.loading = true
      try {
        await this.$axios.$put(`cystack_platform/relay/addresses/${id}`, {
          address: this.address
        })
        this.notify(this.$t('data.tools.relay_alias_edited'), 'success')
        const addresses = [...this.addresses]
        const item = addresses.find(i => i.id === id)
        item.address = this.address
        item.full_address = this.address + '@' + item.domain
        this.addresses = [...addresses]
        this.isEditing = false
      } catch (e) {
        let message = e.message
        if (e.response.data) {
          message = e.response.data.message
          if (e.response.data.details && e.response.data.details.address) {
            message = e.response.data.details.address[0]
          }
        }
        this.notify(message, 'error')
      } finally {
        this.loading = false
      }
    },

    // Delete address

    selectToDelete (item) {
      this.dialog.confirmDelete.data = item
      this.dialog.confirmDelete.isOpen = true
    },
    async deleteAddress (id) {
      this.dialog.confirmDelete.isOpen = false
      this.loading = true
      try {
        await this.$axios.$delete(`cystack_platform/relay/addresses/${id}`)
        this.notify(this.$t('data.tools.relay_alias_deleted'), 'success')
        this.addresses = this.addresses.filter(i => i.id !== id)
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
        console.log(this.subdomains)
      } catch {

      } finally {
        this.loading = false
      }
    }
  }
}
</script>
