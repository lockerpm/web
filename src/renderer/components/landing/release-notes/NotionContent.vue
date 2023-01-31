<template>
  <div class="w-full flex flex-wrap">
    <!-- ToC -->
    <div
      class="w-full md:w-1/4 pr-0 md:pr-5 relative md:sticky top-0 md:top-[148px]"
      style="align-self: flex-start;"
    >
      <div
        style="overflow-y: scroll; max-height: calc(100vh - 119px); padding-right: 5px"
        v-for="(menu, index) in menus"
        :key="index"
      >
        <a
          class="text-black-700 text-head-5 hover:text-primary font-bold hover:no-underline"
          @click="goto(menu, 'h1')"
        >{{ menu.title }}</a>
        <div class="ml-6 mt-3">
          <a
            v-for="(item, i) in menu.sections"
            :key="i"
            class="text-black hover:text-primary font-bold hover:no-underline"
            @click="goto(item)"
          >
            <p style="font-size: 16px; line-height: 20px; margin-bottom: 1.5rem;">
              {{ item.title }}
            </p>
          </a>
        </div>
      </div>
    </div>
    <!-- ToC end -->

    <!-- Content -->
    <div class="w-full md:w-3/4">
      <NotionRenderer :block-map="blockMapValues" full-page />
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
    menus () {
      const allValues = Object.values(this.blockMap[this.language]).map((item, index) => ({
        ...item,
        title: item.value?.properties?.title[0][0] || '',
        index
      }))
      const headers = allValues.filter(item => item.value.type === 'header').map((h, index) => ({ ...h, stt: index }))
      const sections = allValues.filter(item => item.value.type === 'sub_header').map((s, index) => ({ ...s, stt: index }))
      return headers.map((h, index) => {
        if (index < headers.length - 1) {
          return {
            title: h.title,
            stt: h.stt,
            sections: sections.filter(s => s.index > h.index && s.index < headers[index + 1].index)
          }
        }
        return {
          title: h.title,
          stt: h.stt,
          sections: sections.filter(s => s.index > h.index)
        }
      })
    },

    blockMapValues () {
      const blockMapValues = JSON.parse(JSON.stringify(this.blockMap[this.language]))
      this.menus.forEach(m => {
        m.sections.forEach(s => {
          blockMapValues[s.value.id].value.properties.title[0][0] = `${m.title} - ${s.title}`
        })
      })
      return blockMapValues
    }
  },

  methods: {
    goto (item, heading = 'h2') {
      if (process.client) {
        const sections = document.getElementsByClassName(`notion-${heading}`)
        if (sections[item.stt] && sections[item.stt].innerText.includes(item.title)) {
          window.scroll(0, sections[item.stt].offsetTop - 140)
        }
      }
    }
  }
}
</script>
