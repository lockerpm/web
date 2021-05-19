<template>
  <ListCipher type="Login" route-name="dashboard" />
</template>

<script>
import ListCipher from '../../components/cipher/ListCipher'
export default {
  components: {
    ListCipher
  },
  mounted () {
    this.test()
  },
  methods: {
    async test () {
      const shareKey = await this.$cryptoService.makeShareKey()
      const orgKey = shareKey[0].encryptedString
      const collection = await this.$cryptoService.encrypt('defaultCollection', shareKey[1])
      const collectionName = collection.encryptedString
      console.log(orgKey)
      console.log(collectionName)
    }
  }
}
</script>
