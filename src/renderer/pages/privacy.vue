<template>
  <div class="md:pt-[180px] pt-36 pb-20">
    <h1 class="text-left font-bold text-black landing-font-50 max-w-[890px] mb-20">
      {{ $t('common.privacy_policy') }}
    </h1>

    <NotionContent :block-map="blockMap" />
  </div>
</template>
`
<script>
import NotionContent from '~/components/landing/terms/NotionContent'

export default {
  components: {
    NotionContent
  },
  layout: 'landing',

  scrollToTop: true,

  async asyncData ({ $notion }) {
    const [vi, en] = await Promise.all([
      $notion.getPageBlocks('93dc34fc5704460482a41694775e25eb'),
      $notion.getPageBlocks('bfc002b3ca1449499936ade0dd7913f4')
    ])
    return { blockMap: { vi, en } }
  },

  data () {
    return {
      docPrefix: 'landing.code_of_conduct',
      blockMap: {
        vi: null,
        en: null
      }
    }
  },

  head () {
    return {
      title: 'Privacy Policy | Locker Password Manager'
    }
  }
}
</script>

<style scoped>

</style>
