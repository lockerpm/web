<template>
  <div class="lg:ml-20 ml-6">
    <div class="landing-font-42 font-semibold text-[#161922] mb-4 flex items-center">
      <div class="flex-grow">
        {{ titleArticle }}
      </div>
      <div class="p-0 md:hidden block">
        <button
          v-clipboard:copy="linkCopy"
          v-clipboard:success="clipboardSuccessHandler"
        >
          <img src="~/assets/images/landing/whitepaper/Link.svg" class="mx-3">
        </button>
      </div>
    </div>
    <hr class="line">
    <div class="mt-3 italic text-[#A2A3A7] landing-font-14 font-normal">
      {{ $t('whitepaper.content.last_edited_time') }} {{ $moment(lastEditedTime).format('ll') }}
    </div>
    <div class="mt-6">
      <NotionRenderer :block-map="blockMap" full-page katex />
    </div>
    <div v-if="idNextTitle || idPreTitle" class="mt-16 mb-8">
      <ButtonPreNext :index="index" :title-previous="titlePrevious" :title-next="titleNext" :id-pre-title="idPreTitle" :id-next-title="idNextTitle" />
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
  },
  computed: {
    linkCopy () {
      return process.env.baseUrl + this.$route.path
    }
  }
}
</script>
<style>
.line{
  border: 1px solid #E8E8E9;
}
</style>
