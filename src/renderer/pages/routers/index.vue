<template>
  <ListCipher
    route-name="routers"
    :filter="c => c.type === CipherType.WirelessRouter"
  />
</template>

<script>
import ListCipher from '../../components/cipher/ListCipher'
import { CipherType } from '../../core/enums/cipherType'
export default {
  components: {
    ListCipher
  },
  data () {
    return {
      CipherType
    }
  },
  mounted () {
    if (this.currentUser.email === 'duchm@cystack.net') {
      console.log(this.$config.isStaging)
      console.log(this.$config.isProd)
      console.log(this.$config.test)
      console.log(this.$config.test2)
      console.log(this.$config.test3)
    }
  }
}
</script>
