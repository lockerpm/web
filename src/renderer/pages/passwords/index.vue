<template>
  <ListCipher route-name="passwords" :filter="c => [CipherType.Login, CipherType.MasterPassword].includes(c.type)" />
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
