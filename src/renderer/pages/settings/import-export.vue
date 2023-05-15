<template>
  <div class="w-full">
    <div class="text-head-4 font-semibold mb-2">
      {{ $t('data.settings.import_export') }}
    </div>
    <div class="text-lg text-black-600 mb-4">
      {{ $t('data.settings.account_desc') }}
    </div>
    <ImportItems />
    <ExportItems />
  </div>
</template>

<script>
import ImportItems from '../../components/setting/ImportItems.vue'
import ExportItems from '../../components/setting/ExportItems.vue'

export default {
  components: {
    ImportItems,
    ExportItems
  }
}
</script>
