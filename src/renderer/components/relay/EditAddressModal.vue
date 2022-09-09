<template>
  <div>
    <!-- Main modal -->
    <el-dialog
      title="Edit private email"
      :visible="isOpen"
      :before-close="onClose"
      width="600px"
      destroy-on-close
      top="5vh"
      custom-class="locker-dialog"
      :close-on-click-modal="false"
      @open="onOpen"
    >
      <!-- Input -->
      <el-input
        v-if="currentAddress.addressEditable"
        v-model="model.address"
        autofocus
        type="text"
        maxlength="64"
        minlength="6"
        show-word-limit
        class="text-primary"
      >
        <template slot="append">{{ `@${currentAddress.subdomain ? currentAddress.subdomain + '.' : ''}${currentAddress.domain}` }}</template>
      </el-input>
      <!-- Input end -->

      <!-- Options -->
      <p class="font-medium mb-2">
        Configuration:
      </p>
      <el-radio-group v-model="selectedOption" @change="onConfigChange">
        <el-radio label="forward">Forward</el-radio>
        <br>
        <el-radio label="block-spam">Block spam</el-radio>
        <br>
        <el-radio label="block-all">Block all emails</el-radio>
      </el-radio-group>
      <!-- Options end -->

      <!-- Footer -->
      <span slot="footer">
        <button class="btn btn-danger float-left" @click.prevent="dialog.confirmDelete.isOpen = true">
          {{ $t('common.delete') }}
        </button>
        <button class="btn btn-outline-primary mr-2" @click.prevent="onClose">
          {{ $t('common.cancel') }}
        </button>
        <button :disabled="isLoading || !model.address" class="btn btn-primary" @click.prevent="confirmEdit">
          {{ $t('common.save') }}
        </button>
      </span>
      <!-- Footer end -->
    </el-dialog>
    <!-- Main modal end -->

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
        v-html="$t('data.tools.edit_relay_alias.desc', { email: currentAddress.full_address })"
      />
      <br>
      <span class="text-danger">{{ $t('data.tools.edit_relay_alias.warning') }}</span>

      <!-- Footer -->
      <span slot="footer">
        <hr class="border-black-100 mb-4">
        <button class="btn btn-outline-primary mr-2" @click.prevent="dialog.confirmEdit.isOpen = false">
          {{ $t('common.cancel') }}
        </button>
        <button class="btn btn-primary" @click.prevent="updateAddress">
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
      <span class="text-primary font-medium text-lg">{{ currentAddress.full_address }}</span>
      <br>
      <br>
      <span
        class="text-black"
        v-html="$t('data.tools.delete_relay_alias.desc', { email: currentAddress.full_address })"
      />
      <br>
      <span class="text-danger">{{ $t('data.tools.delete_relay_alias.warning') }}</span>

      <!-- Footer -->
      <span slot="footer">
        <hr class="border-black-100 mb-4">
        <button class="btn btn-outline-primary mr-2" @click.prevent="dialog.confirmDelete.isOpen = false">
          {{ $t('common.cancel') }}
        </button>
        <button class="btn btn-primary" @click.prevent="deleteAddress">
          {{ $t('data.tools.delete_relay_alias.confirm') }}
        </button>
      </span>
      <!-- Footer end -->
    </el-dialog>
    <!-- Confirm delete alias end -->
  </div>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: () => false
    },
    onClose: {
      type: Function,
      default: () => {}
    },
    onEdit: {
      type: Function,
      default: () => {}
    },
    currentAddress: {
      type: Object,
      default: () => ({
        addressEditable: false,
        id: 0,
        address: '',
        enabled: true,
        block_spam: false,
        description: '',
        created_time: 0,
        updated_time: null,
        num_forwarded: 0,
        num_blocked: 0,
        num_replied: 0,
        num_spam: 0,
        domain: 'maily.org',
        subdomain: '',
        full_address: ''
      })
    }
  },
  data () {
    return {
      isLoading: false,
      selectedOption: 'forward',
      model: {
        address: '',
        enabled: true,
        block_spam: false
      },
      dialog: {
        confirmEdit: {
          isOpen: false
        },
        confirmDelete: {
          isOpen: false
        }
      }
    }
  },
  methods: {
    onOpen () {
      this.model.address = this.currentAddress.address
      this.model.enabled = this.currentAddress.enabled
      this.model.block_spam = this.currentAddress.block_spam
      if (!this.currentAddress.enabled) {
        this.selectedOption = 'block-all'
      } else if (this.currentAddress.block_spam) {
        this.selectedOption = 'block-spam'
      } else {
        this.selectedOption = 'forward'
      }
    },

    onConfigChange () {
      switch (this.selectedOption) {
      case 'forward':
        this.model.enabled = true
        this.model.block_spam = false
        break
      case 'block-spam':
        this.model.enabled = true
        this.model.block_spam = true
        break
      case 'block-all':
        this.model.enabled = false
        this.model.block_spam = true
        break
      }
    },

    confirmEdit () {
      if (this.currentAddress.address !== this.model.address) {
        this.dialog.confirmEdit.isOpen = true
      } else {
        this.updateAddress()
      }
    },

    async updateAddress () {
      this.loading = true
      this.dialog.confirmEdit.isOpen = false
      try {
        await this.$axios.$put(`cystack_platform/relay/addresses/${this.currentAddress.id}`, this.model)
        this.notify('Done', 'success')
        this.onClose()
        this.onEdit()
      } catch (e) {
        if (e.response.data) {
          let msg = e.response.data.message
          if (e.response.data.details.address) {
            msg = e.response.data.details.address[0]
          }
          this.notify(msg, 'error')
        }
      } finally {
        this.loading = false
      }
    },

    async deleteAddress () {
      this.dialog.confirmDelete.isOpen = false
      this.loading = true
      try {
        await this.$axios.$delete(`cystack_platform/relay/addresses/${this.currentAddress.id}`)
        this.notify(this.$t('data.tools.relay_alias_deleted'), 'success')
        this.onClose()
        this.onEdit()
      } catch {

      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
