<template>
  <ListCipher route-name="shares" :filter="c => c.organizationId === currentUserPw.default_personal_id" />
</template>

<script>
import ListCipher from '../components/cipher/ListCipher'
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
