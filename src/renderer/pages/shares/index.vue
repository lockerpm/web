<template>
  <ListSharedCipher route-name="shares" :filter="c => c.organizationId" />
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
