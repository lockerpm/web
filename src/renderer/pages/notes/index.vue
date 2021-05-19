<template>
  <ListCipher route-name="notes" :filter="c => c.type === CipherType['SecureNote']" />
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
