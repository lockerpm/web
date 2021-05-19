<template>
  <ListCipher :filter="c => c.folderId === $route.params.folderId" route-name="dashboard" />
</template>

<script>
import ListCipher from '../../../../components/cipher/ListCipher'
export default {
  components: { ListCipher }
}
</script>
