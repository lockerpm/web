<template>
  <div class="md:pt-[180px] pt-36 pb-20">
    <h1 class="text-left font-bold text-black landing-font-50 max-w-[890px] mb-20">
      {{ $t('common.release_notes') }}
    </h1>
    <NotionContent :block-map="blockMap" />
  </div>
</template>
<script>
import NotionContent from '~/components/landing/release-notes/NotionContent'

export default {
  components: {
    NotionContent
  },
  layout: 'landing',

  scrollToTop: true,

  // async asyncData ({ $notion }) {
  //   const [vi, en] = await Promise.all([
  //     $notion.getPageBlocks('65b0656c-2496-4e35-ae16-ae5bd0fd4993'),
  //     $notion.getPageBlocks('c33126d163e34dd0b90e28d0b74e0a3d')
  //   ])
  //   return { blockMap: { vi, en } }
  // },

  data () {
    return {
      blockMap: {
        vi: {},
        en: {}
      }
    }
  },

  fetch ({ redirect, i18n }) {
    redirect(301, `https://support.locker.io/${i18n.locale}/locker-general/release-notes`)
  },

  head () {
    return {
      title: 'Release Notes'
    }
  }
}
</script>

<style scoped>

</style>
