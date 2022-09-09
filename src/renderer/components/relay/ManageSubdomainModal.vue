<template>
  <el-dialog
    title="Manage custom sub-domain"
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
      Your sub-domain: <span class="text-primary text-lg">@{{ currentSubdomain.subdomain }}.maily.org</span>
    </p>

    <div v-if="isEditing">
      <!-- Input -->
      <p class="font-medium mb-2">
        New sub-domain:
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
        Current sub-domain will be permanently deleted when you change to a new sub-domain. All email aliases created from your current sub-domain will also be then deleted when you perform this action.
      </p>
      <!-- Desc end -->
    </div>

    <button
      v-else
      class="btn btn-outline-primary"
      @click.prevent="isEditing = true"
    >
      Change sub-domain
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
    onUpdate: {
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
      this.loading = true
      try {
        await this.$axios.$put(`cystack_platform/relay/subdomains/${this.currentSubdomain.id}`, {
          subdomain: this.newSubdomain
        })
        this.notify('Done', 'success')
        this.onClose()
        this.onUpdate(this.newSubdomain)
      } catch (e) {
        if (e.response.data) {
          let msg = e.response.data.message
          if (e.response.data.details.subdomain) {
            msg = e.response.data.details.subdomain[0]
          }
          this.notify(msg, 'error')
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
