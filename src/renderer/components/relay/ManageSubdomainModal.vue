<template>
  <el-dialog
    :title="$t('data.tools.relay_subdomain.manage_subdomain')"
    :visible="isOpen"
    :before-close="onClose"
    width="600px"
    destroy-on-close
    top="5vh"
    custom-class="locker-dialog"
    :close-on-click-modal="false"
    @open="onOpen"
  >
    <p class="mb-2">
      {{ $t('data.tools.relay_subdomain.your_subdomain') }}: <span class="text-primary text-lg">@{{ currentSubdomain.subdomain }}.maily.org</span>
    </p>

    <div v-if="isEditing">
      <!-- Input -->
      <p class="font-medium mb-2">
        {{ $t('data.tools.relay_subdomain.new_subdomain') }}:
      </p>
      <el-input
        v-model="newSubdomain"
        autofocus
        type="text"
        maxlength="64"
        minlength="3"
        show-word-limit
        class="text-primary"
      >
        <template slot="prepend"><span class="text-primary">@</span></template>
        <template slot="append"><span class="text-primary">.maily.org</span></template>
      </el-input>
      <!-- Input end -->

      <!-- Desc -->
      <p class="mt-2">
        {{ $t('data.tools.relay_subdomain.edit_desc') }}
      </p>
      <!-- Desc end -->
    </div>

    <button
      v-else
      class="btn btn-outline-primary"
      @click.prevent="isEditing = true"
    >
      {{ $t('data.tools.relay_subdomain.change_subdomain') }}
    </button>

    <!-- Footer -->
    <span slot="footer">
      <button class="btn btn-outline-primary mr-2" @click.prevent="onClose">
        {{ $t('common.cancel') }}
      </button>
      <button
        v-if="isEditing"
        :disabled="isLoading || !newSubdomain || newSubdomain === currentSubdomain.subdomain"
        class="btn btn-primary"
        @click.prevent="updateDomain"
      >
        {{ $t('common.save') }}
      </button>
    </span>
    <!-- Footer end -->
  </el-dialog>
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
    currentSubdomain: {
      type: Object,
      default: () => ({
        id: 0,
        subdomain: ''
      })
    }
  },
  data () {
    return {
      isLoading: false,
      isEditing: false,
      newSubdomain: ''
    }
  },
  methods: {
    onOpen () {
      this.newSubdomain = this.currentSubdomain.subdomain
      this.isEditing = false
    },
    async updateDomain () {
      this.isLoading = true
      try {
        await this.$axios.$put(`cystack_platform/relay/subdomains/${this.currentSubdomain.id}`, {
          subdomain: this.newSubdomain
        })
        this.notify(this.$t('common.done'), 'success')
        this.onClose()
        this.onEdit(this.currentSubdomain.subdomain)
      } catch (e) {
        if (e.response.data) {
          let msg = e.response.data.message
          if (e.response.data.details.subdomain) {
            msg = e.response.data.details.subdomain[0]
          }
          this.notify(msg, 'error')
        }
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
