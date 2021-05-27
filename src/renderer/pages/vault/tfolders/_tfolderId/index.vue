<template>
  <ListCipher :filter="c => c.collectionIds.includes($route.params.tfolderId)" route-name="vault" />
</template>

<script>
import ListCipher from '../../../../components/cipher/ListCipher'

export default {
  components: { ListCipher }
}
</script>
