<template>
  <ListCipher route-name="cards" :filter="c => c.type === CipherType['Card']" />
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
