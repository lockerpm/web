<template>
  <div class="flex flex-col flex-column-fluid relative bg-[#FBFBFC]">
    <div class="flex-column-fluid lg:px-28 py-10 px-10 mb-20">
      <!-- Breadcrumb -->
      <div class="mb-5">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
            :to="localeRoute({name: 'tools'})"
          >
            Tools
          </el-breadcrumb-item>
          <el-breadcrumb-item
            :to="localeRoute({name: 'tools-relay'})"
          >
            Relay
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
              Your root email: <strong>{{ currentUser.email }}</strong>
            </div>
            <div />
          </div>
          <!-- Root Email end -->

          <div class="setting-section-body">
            <ul class="list-disc ml-5">
              <li>
                All emails to your alias addresses will be forwarded to your root email.
              </li>
              <li>
                You can create up to 5 alias addresses for your use.
              </li>
              <li>
                You have one customizable alias
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- Info end -->

      <!-- Count + add -->
      <div class="flex justify-between items-center mb-5">
        <p>
          Your alias addresses ({{ addresses.length }}/{{ limit }})
        </p>
        <button
          :disabled="loading || addresses.length >= limit"
          class="btn btn-primary"
          @click="addAddress"
        >
          New alias
        </button>
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
                    min-length="6"
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
                      <i class="far fa-times text-danger" />
                    </button>
                    <button
                      class="btn btn-icon btn-xs btn-action"
                      style="margin-right: 0"
                      @click="editAddress(item.id)"
                    >
                      <i class="far fa-check text-success" />
                    </button>
                  </div>

                  <a
                    v-else
                    class="text-black hover:text-black"
                    @click="startEditing(item.address)"
                  >
                    <i class="far fa-edit" /> Edit
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
                    Created
                  </p>
                  <p class="font-medium">
                    {{ $moment(item.created_time * 1000).format('MMM DD, YYYY') }}
                  </p>
                </div>

                <a class="text-danger hover:text-danger" @click.prevent="deleteAddress(item.id)">
                  Delete
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Addresses end -->
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      limit: 5,
      loading: false,
      isEditing: false,
      address: '',
      addresses: []
    }
  },
  mounted () {
    this.getAddresses()
  },
  methods: {
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
    async addAddress () {
      this.loading = true
      try {
        const res = await this.$axios.$post('cystack_platform/relay/addresses')
        const addresses = [...this.addresses]
        addresses.push(res)
        this.addresses = [...addresses]
      } catch {

      } finally {
        this.loading = false
      }
    },
    startEditing (address) {
      this.isEditing = true
      this.address = address
    },
    async editAddress (id) {
      this.isEditing = false
      this.loading = true
      try {
        await this.$axios.$put(`cystack_platform/relay/addresses/${id}`, {
          address: this.address
        })
        this.notify(this.$t('common.success'), 'success')
        const addresses = [...this.addresses]
        const item = addresses.find(i => i.id === id)
        item.address = this.address
        item.full_address = this.address + '@' + item.domain
        this.addresses = [...addresses]
      } catch {

      } finally {
        this.loading = false
      }
    },
    async deleteAddress (id) {
      this.$alert('Are you sure?', 'Delete domain', {
        confirmButtonText: this.$t('common.delete'),
        callback: async action => {
          if (action === 'confirm') {
            this.loading = true
            try {
              await this.$axios.$delete(`cystack_platform/relay/addresses/${id}`)
              this.notify(this.$t('common.success'), 'success')
              this.addresses = this.addresses.filter(i => i.id !== id)
            } catch {

            } finally {
              this.loading = false
            }
          }
        }
      })
    }
  }
}
</script>
