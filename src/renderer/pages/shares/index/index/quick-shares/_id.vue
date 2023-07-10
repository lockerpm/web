<template>
  <div class="flex flex-col flex-grow relative">
    <div class="flex-grow lg:px-28 py-4 px-10 mb-20">
      <!-- Breadcrumb -->
      <div class="flex items-center justify-between">
        <el-breadcrumb class="truncate" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
            :to="localeRoute({ name: 'shares-index-index-quick-shares' })"
          >
            {{ $t('sidebar.quick_shares') }}
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            {{ send.cipher.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- Breadcrumb end -->

      <DetailQuickSharedCipherContent
        :cipher-data="send.cipher"
        :emails="send.emails"
      />
    </div>
  </div>
</template>
<script>
import find from 'lodash/find'
import orderBy from 'lodash/orderBy'
import DetailQuickSharedCipherContent from '@/components/cipher/shares/quick-shares/DetailQuickSharedCipherContent.vue'

export default {
  components: { DetailQuickSharedCipherContent },

  data () {
    return {
      loading: false
    }
  },

  computed: {
    send () {
      return (
        find(this.sends, e => e.id === this.$route.params.id) || {
          cipher: {},
          emails: []
        }
      )
    }
  },

  watch: {
    '$store.state.syncingQuickShares' () {
      if (this.$store.state.syncingQuickShares) {
        this.loading = true
      } else {
        this.loading = false
      }
    }
  },

  asyncComputed: {
    sends: {
      async get () {
        let result = []
        try {
          result = (await this.$sendService.getAllDecrypted()) || []
        } catch (error) {
          //
        }
        result = orderBy(result, ['revisionDate'], ['desc']) || []
        this.dataRendered = result.slice(0, 50)
        return result
      },
      watch: ['$store.state.syncingQuickShares']
    }
  }
}
</script>
<style scoped></style>
