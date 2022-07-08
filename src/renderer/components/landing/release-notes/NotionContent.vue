<template>
  <div class="w-full flex flex-wrap">
    <!-- ToC -->
    <div
      class="w-full md:w-1/4 pr-0 md:pr-5 relative md:sticky top-0 md:top-[119px]"
      style="align-self: flex-start;"
    >
      <div style="overflow-y: scroll; max-height: calc(100vh - 119px); padding-right: 5px">
        <a
          v-for="(item, index) in sections"
          :key="index"
          class="text-black hover:text-primary font-bold hover:no-underline"
          @click="goto(index)"
        >
          <p style="font-size: 16px; line-height: 20px; margin-bottom: 1.5rem;">
            {{ item }}
          </p>
        </a>
      </div>
    </div>
    <!-- ToC end -->

    <!-- Content -->
    <div class="w-full md:w-3/4">
      <NotionRenderer :block-map="blockMap[language]" full-page />
    </div>
    <!-- Content end -->
  </div>
</template>

<script>
export default {
  props: {
    blockMap: {
      type: Object,
      default: () => ({ vi: null, en: null })
    }
  },

  computed: {
    sections () {
      const sections = []
      if (this.blockMap[this.language]) {
        Object.values(this.blockMap[this.language]).forEach(item => {
          if (item.value.type === 'sub_header') {
            sections.push(item.value.properties.title[0][0])
          }
        })
      }
      return sections
    }
  },

  methods: {
    goto (index) {
      if (process.client) {
        const sections = document.querySelectorAll('h2')
        if (sections[index]) {
          window.scroll(0, sections[index].offsetTop - 114)
        }
        // $([document.documentElement, document.body]).animate({
        //   scrollTop: $(`h2:eq(${index})`).offset().top - 90
        // }, 500)
      }
    }
  }
}
</script>
