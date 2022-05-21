<template>
  <div class="md:pt-[180px] pt-36 pb-20">
    <h1 class="text-left font-bold text-black landing-font-50 max-w-[890px] mb-20">
      Terms
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
      $notion.getPageBlocks('d3ac76becef0490d943f8bb7d27a9cae'),
      $notion.getPageBlocks('d3ac76becef0490d943f8bb7d27a9cae')
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
      title: 'Terms | Locker'
    }
  }
}
</script>

<style scoped>

</style>
