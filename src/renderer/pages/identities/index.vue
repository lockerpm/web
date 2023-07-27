<template>
  <ListCipher
    route-name="identities"
    :filter="c => c.type === CipherType['Identity']"
  />
</template>

<script>
import ListCipher from '../../components/cipher/ListCipher'
import { CipherType } from '../../core/enums'
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
