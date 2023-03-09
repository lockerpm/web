<template>
  <ListCipher ref="listCipher" route-name="vault" />
</template>

<script>
import ListCipher from '../../components/cipher/ListCipher'
export default {
  components: {
    ListCipher
  },
  async mounted () {
    if (this.$route.query.password && this.$route.query.nextStep === 'save') {
      await this.$refs.listCipher.$refs.chooseCipherType.confirmDialog('Login')
      setTimeout(async () => {
        this.$refs.listCipher.$refs.chooseCipherType.$refs.addEditCipherDialog.cipher.login.password = this.$route.query.password
      }, 500)
    }
  }
}
</script>
