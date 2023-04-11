<template>
  <ListCipher
    route-name="driver-licenses"
    :filter="c => c.type === CipherType.DriverLicense"
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
