<template>
  <ListYourShares
    :filter="c => c.organizationId && isCipherShared(c.organizationId)"
  />
</template>

<script>
import ListYourShares from '@/components/cipher/shares/your-shares/ListYourShares'
export default {
  components: {
    ListYourShares
  }
}
</script>
