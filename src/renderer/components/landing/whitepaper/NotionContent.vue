<template>
  <div class="lg:ml-[57px] md:ml-[25px] ml-[20px] ml-8">
    <div class="landing-font-42 font-semibold text-[#161922] mb-4">{{ titleArticle }}</div>
    <hr class="line">
    <div class="mt-6">
      <NotionRenderer :block-map="blockMap" full-page />
    </div>
    <div class="mt-16 mb-8">
      <ButtonPreNext :index="index" :title-previous="titlePrevious" :title-next="titleNext" :id-pre-title="idPreTitle" :id-next-title="idNextTitle" />
    </div>
    <hr class="line">
    <div class="mt-6 text-[#A2A3A7] landing-font-14 font-normal">
      {{ $t('whitepaper.content.last_edited_time') }} {{ $moment(lastEditedTime).format('ll') }}
    </div>
  </div>
</template>
<script>
import ButtonPreNext from '~/components/landing/whitepaper/ButtonPreNext'
export default {
  components: { ButtonPreNext },
  props: {
    blockMap: {
      type: Object,
      default: () => ({})
    },
    titleArticle: {
      type: String,
      default: ''
    },
    lastEditedTime: null,
    index: {
      type: Number,
      default: 0
    },
    titlePrevious: String,
    titleNext: String,
    idPreTitle: String,
    idNextTitle: String
  }
}
</script>
<style>
.line{
  border: 1px solid #E8E8E9;
}
</style>
