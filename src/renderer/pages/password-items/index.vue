<template>
  <ListCipher
    route-name="password-items"
    :filter="
      c => [CipherType.Login, CipherType.MasterPassword].includes(c.type)
    "
  />
</template>

<script>
import ListCipher from '../../components/cipher/ListCipher'
import { CipherType } from '../../jslib/src/enums/cipherType'
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
