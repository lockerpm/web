<template>
  <ListCipher route-name="trash" :deleted="true" />
</template>

<script>
import ListCipher from '../components/cipher/ListCipher'
export default {
  components: {
    ListCipher
  }
}
</script>
