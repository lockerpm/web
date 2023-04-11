<template>
  <ListCipher
    route-name="apis"
    :filter="c => c.type === CipherType.APICipher"
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
