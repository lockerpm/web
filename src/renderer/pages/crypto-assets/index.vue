<template>
  <ListCipher route-name="crypto-assets" :filter="c => c.type === 6 || c.type === 7" />
</template>

<script>
import ListCipher from '../../components/cipher/ListCipher'
import { CipherType } from '../../jslib/src/enums'
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
