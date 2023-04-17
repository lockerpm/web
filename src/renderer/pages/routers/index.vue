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
      console.log(process.env.nodeEnv)
      console.log(this.$config.stripeKey)
      console.log(this.$config.cloudflare)
      this.$sentry.captureException(new Error('example'))
    }
  }
}
</script>
