<template>
  <ListCipher route-name="shares" :filter="c => c.organizationId" />
</template>

<script>
import ListCipher from '../../components/cipher/ListCipher'
export default {
  components: {
    ListCipher
  },
  mounted () {
  },
  methods: {
  }
}
</script>
