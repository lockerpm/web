<template>
  <ListCipher
    route-name="crypto-backups"
    :filter="c => c.type === CipherType.CryptoWallet"
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
  }
}
</script>
