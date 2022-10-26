<template>
  <div>
    <!-- Main modal -->
    <el-dialog
      :title="$t('data.tools.relay_address.edit_title')"
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
        <template slot="append">
          <span class="text-primary">
            {{ `@${currentAddress.subdomain ? currentAddress.subdomain + '.' : ''}${currentAddress.domain}` }}
          </span>
        </template>
      </el-input>
      <!-- Input end -->

      <!-- Options -->
      <div>
        <p class="font-medium mb-2 mt-3">
          {{ $t('common.configuration') }}
        </p>
        <el-radio-group
          v-model="selectedOption"
          :disabled="!isPremium"
          class="w-full"
          @change="onConfigChange"
        >
          <el-radio label="forward" class="w-full py-2" style="display: flex">
            <span class="block">
              <span class="font-medium block text-black mb-1">{{ $t('data.tools.relay_address.forward') }}</span>
              <span class="text-black-500">{{ $t('data.tools.relay_address.forward_desc') }}</span>
            </span>
          </el-radio>
          <el-radio label="block-spam" class="w-full py-2" style="display: flex">
            <span class="block">
              <span class="font-medium block text-black mb-1">{{ $t('data.tools.relay_address.block_spam') }}</span>
              <span class="text-black-500">{{ $t('data.tools.relay_address.block_spam_desc') }}</span>
            </span>
          </el-radio>
          <el-radio label="block-all" class="w-full py-2" style="display: flex">
            <span class="block">
              <span class="font-medium block text-black mb-1">{{ $t('data.tools.relay_address.block_all') }}</span>
              <span class="text-black-500">{{ $t('data.tools.relay_address.block_all_desc') }}</span>
            </span>
          </el-radio>
        </el-radio-group>
      </div>
      <!-- Options end -->

      <!-- Footer -->
      <span slot="footer">
        <hr style="border-top: 1px solid #E8E8E9" class="mb-4">
        <a
          class="text-danger font-medium float-left hover:text-danger"
          @click.prevent="dialog.confirmDelete.isOpen = true"
        >
          <i class="fa fa-trash-alt" /> &nbsp;
          {{ $t('common.delete') }}
        </a>
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
  computed: {
    isPremium () {
      return this.isPremiumFeaturesAvailable
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
      this.isLoading = true
      this.dialog.confirmEdit.isOpen = false
      try {
        await this.$axios.$put(`cystack_platform/relay/addresses/${this.currentAddress.id}`, this.model)
        this.notify(this.$t('common.done'), 'success')
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
        this.isLoading = false
      }
    },

    async deleteAddress () {
      this.dialog.confirmDelete.isOpen = false
      this.isLoading = true
      try {
        await this.$axios.$delete(`cystack_platform/relay/addresses/${this.currentAddress.id}`)
        this.notify(this.$t('data.tools.relay_alias_deleted'), 'success')
        this.onClose()
        this.onEdit()
      } catch {

      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
