<template>
  <div class="mx-auto">
    <div class="text-head-4 font-semibold mb-4">
      {{ $t('data.settings.import_export') }}
    </div>
    <ImportExport />
  </div>
</template>

<script>
import ImportExport from '../../components/setting/ImportExport'
export default {
  components: {
    ImportExport
  }
}
</script>
