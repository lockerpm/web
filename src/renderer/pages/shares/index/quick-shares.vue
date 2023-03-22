<template>
  <ListYourQuickShares :filter="c => isCipherQuickShared(c.id)" />
</template>

<script>
import ListYourQuickShares from '@/components/cipher/shares/ListYourQuickShares'
export default {
  components: {
    ListYourQuickShares
  }
}
</script>
