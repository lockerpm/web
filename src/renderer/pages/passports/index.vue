<template>
  <ListCipher
    route-name="passports"
    :filter="c => c.type === CipherType.Passport"
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
