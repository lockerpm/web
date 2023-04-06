<template>
  <ListSharedWithYou route-name="shares" :filter="c => c.organizationId" />
</template>

<script>
import ListSharedWithYou from '@/components/cipher/shares/ListSharedWithYou'
export default {
  components: {
    ListSharedWithYou
  }
}
</script>
