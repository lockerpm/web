<template>
  <el-dialog
    title="Create new subdomain"
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
      New subdomain:
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
    <p class="mt-2">
      Custom sub-domain allows you to create custom email domain. <br>
      <i>Example: viktor@viktor-agency.maily.org</i>
    </p>
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
      this.loading = true
      try {
        await this.$axios.$post('cystack_platform/relay/subdomains', {
          subdomain: this.subdomain
        })
        this.notify('Done', 'success')
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
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
