<template>
  <div>
    <!-- Sorry -->
    <div v-if="isInvalid">
      <h1>Sorry no data</h1>
    </div>
    <!-- Sorry end -->

    <!-- Cipher detail -->
    <div v-else v-loading="isLoading">
      <DetailQuickSharedCipherContent :cipher-data="send.cipher" />
    </div>
    <!-- Cipher detail end -->
  </div>
</template>
<script>
import { Utils } from '../../../jslib/src/misc/utils'
import { Cipher } from '../../../core/models/domain/cipher'
import DetailQuickSharedCipherContent from '@/components/cipher/shares/DetailQuickSharedCipherContent.vue'

export default {
  components: { DetailQuickSharedCipherContent },

  layout: 'white',

  async asyncData ({ $axios, params }) {
    try {
      const res = await $axios.$get(
        `cystack_platform/pm/quick_shares/${params.id}/access`
      )
      if (res.require_otp) {
        return {
          requireOtp: true
        }
      }
      return {
        send: res
      }
    } catch (e) {
      console.log(e)
      return {
        isInvalid: true
      }
    }
  },

  data () {
    return {
      isLoading: false,
      requireOtp: false,
      isInvalid: false,
      send: {
        cipher: {},
        key: null
      }
    }
  },

  mounted () {
    const key = this.$route.hash ? this.$route.hash.replace('#', '') : null
    if (!this.requireOtp && !this.isInvalid && key) {
      this.decryptCipher(this.send.cipher, key)
    } else {
      this.send.key = key
    }
  },

  methods: {
    async decryptCipher (cipher, key) {
      try {
        this.isLoading = true
        const decKey = await this.$cryptoService.makeSendKey(
          Utils.fromUrlB64ToArray(key)
        )
        const encCipher = new Cipher(cipher)
        const cipherView = await encCipher.decrypt(decKey)
        this.send.cipher = cipherView
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
<style scoped></style>
