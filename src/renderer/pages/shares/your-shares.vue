<template>
  <ListSharedCipher
    route-name="shares"
    :filter="c => c.organizationId && getSharedCipherMembers(c.organizationId).length > 0"
  />
</template>

<script>
import ListSharedCipher from '../../components/cipher/ListSharedCipher'
export default {
  components: {
    ListSharedCipher
  },
  mounted () {
  },
  methods: {
  }
}
</script>
