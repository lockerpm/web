<template>
  <ListCipher
    route-name="servers"
    :filter="c => c.type === CipherType.Server"
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
