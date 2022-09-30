<template>
  <el-dialog
    :title="$t('data.tools.relay_subdomain.create_subdomain')"
    :visible="isOpen"
    :before-close="onClose"
    width="600px"
    destroy-on-close
    top="5vh"
    custom-class="locker-dialog"
    :close-on-click-modal="false"
    @open="subdomain = ''"
  >
    <!-- Input -->
    <p class="font-medium mb-2">
      {{ $t('data.tools.relay_subdomain.new_subdomain') }}:
    </p>
    <el-input
      v-model="subdomain"
      autofocus
      type="text"
      maxlength="64"
      minlength="3"
      show-word-limit
      class="text-primary"
    >
      <template slot="prepend">@</template>
      <template slot="append">.maily.org</template>
    </el-input>
    <!-- Input end -->

    <!-- Desc -->
    <p class="mt-2" v-html="$t('data.tools.relay_subdomain.create_desc')" />
    <!-- Desc end -->

    <!-- Footer -->
    <span slot="footer">
      <button class="btn btn-outline-primary mr-2" @click.prevent="onClose">
        {{ $t('common.cancel') }}
      </button>
      <button :disabled="isLoading || !subdomain" class="btn btn-primary" @click.prevent="createDomain">
        {{ $t('common.next') }}
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
    onCreate: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      isLoading: false,
      subdomain: ''
    }
  },
  methods: {
    async createDomain () {
      this.isLoading = true
      try {
        await this.$axios.$post('cystack_platform/relay/subdomains', {
          subdomain: this.subdomain
        })
        this.notify(this.$t('common.done'), 'success')
        this.onClose()
        this.onCreate()
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
