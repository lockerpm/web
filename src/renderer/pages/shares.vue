<template>
  <div>
    <ListCipher :filter="c => c.organizationId === currentUserPw.default_personal_id" />
  </div>
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
