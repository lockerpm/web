<template>
  <div class="flex flex-wrap w-full">
    <div class="w-4/5">
      <NotionContent
        :block-map="blockMap"
        :last-edited-time="last_updated"
        :title-article="title"
        :title-previous="preTitle"
        :title-next="nextTitle"
        :index="index"
        :id-pre-title="idPreTitle"
        :id-next-title="idNextTitle"
      />
    </div>
    <div class="w-1/5">
      <el-button
        plain
        @click="copyUrl"
      >
        <div class="flex flex-wrap mt-[88px] mb-[94px] ml-6">
          <img src="~/assets/images/landing/whitepaper/Link.svg">
          <div class="text-[#161922] landing-font-14 font-normal ml-2">
            {{ $t('whitepaper.content.link') }}
          </div>
        </div>
      </el-button>

      <div v-if="sections.length > 0">
        <div class="flex flext-wrap mb-[14px] ml-6">
          <img src="~/assets/images/landing/whitepaper/textLeft.svg">
          <div class="text-[#A2A3A7] landing-font-14 font-normal">{{ $t('whitepaper.content.title') }}</div>
        </div>
        <div v-for="(item, index) in sections" :key="index" class="landing-font-14 text-black ml-6 mt-3 font-normal">
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import slugify from 'slugify'
import NotionContent from '~/components/landing/whitepaper/NotionContent'
export default {
  components: { NotionContent },
  layout: 'whitepaper',
  props: ['nuxtChildKey'],
  async asyncData ({ route, $axios }) {
    const arr = route.params.articleId.split('-')
    let id = arr[arr.length - 1]
    id = id.slice(0, 8) + '-' + id.slice(8, 12) + '-' + id.slice(12, 16) + '-' + id.slice(16, 20) + '-' + id.slice(20)
    try {
      // get page content, title page
      let [contentBlock, dataArticle] = await Promise.all([
        $axios.$get(`${process.env.baseUrl}/api/content/${id}`),
        $axios.$get(`${process.env.baseUrl}/api/articles/${id}`)
      ])
      contentBlock = contentBlock.data
      dataArticle = dataArticle.title
      return {
        articleId: id,
        last_updated: contentBlock[id].value.last_edited_time,
        blockMap: contentBlock,
        title: dataArticle
      }
    } catch (error) {
      return {
        articleId: '',
        title: '',
        nextTitle: '',
        preTitle: '',
        last_updated: null,
        blockMap: {}
      }
    }
  },
  data () {
    return {
      articleId: null,
      title: '',
      nextTitle: '',
      idNextTitle: '',
      preTitle: '',
      idPreTitle: '',
      last_updated: null,
      blockMap: null,
      tree: JSON.parse(this.nuxtChildKey),
      index: 0,
      type: 0,
      sections: []
    }
  },
  watch: {
    articleId: {
      async handler () {
        this.selectArticles()
        this.getSections()
        this.$parent.$emit('articles-id', this.articleId)
        setTimeout(this.replaceLinkLocal, 300)
      }
    }
  },
  mounted () {
    this.selectArticles()
    this.getSections()
    this.$parent.$emit('articles-id', this.articleId)
    setTimeout(this.replaceLinkLocal, 300)
  },
  methods: {
    selectArticles () {
      let indexParent = this.tree.findIndex(item => item.articles.find(iItem => iItem.id === this.articleId))
      if (indexParent === -1) {
        indexParent = this.tree.findIndex(item => item.id === this.articleId)
      }
      let indexChildArticle = -1
      for (let i = 0; i < this.tree.length; i++) {
        if (this.tree[i].articles.length > 0) {
          for (let j = 0; j < this.tree[i].articles.length; j++) {
            if (this.tree[i].articles[j].id === this.articleId) {
              indexChildArticle = j
              break
            }
          }
        }
      }
      if (indexChildArticle > -1 && indexParent > -1) {
        if (indexParent === 0) {
          if (indexChildArticle === 0) {
            this.nextTitle = this.tree[indexParent].articles[indexChildArticle + 1].child
            this.idNextTitle = this.tree[indexParent].articles[indexChildArticle + 1].id
            this.idPreTitle = ''
            this.preTitle = ''
            this.index = 0
          } else if (indexChildArticle > 0 && indexChildArticle < (this.tree[indexParent].articles.length - 1)) {
            this.nextTitle = this.tree[indexParent].articles[indexChildArticle + 1].child
            this.preTitle = this.tree[indexParent].articles[indexChildArticle - 1].child
            this.idNextTitle = this.tree[indexParent].articles[indexChildArticle + 1].id
            this.idPreTitle = this.tree[indexParent].articles[indexChildArticle - 1].id
            this.index = 1
          } else {
            this.nextTitle = this.tree[indexParent + 1].articles[0].child
            this.idNextTitle = this.tree[indexParent + 1].articles[0].id
            this.preTitle = this.tree[indexParent].articles[indexChildArticle - 1].child
            this.idPreTitle = this.tree[indexParent].articles[indexChildArticle - 1].id
            this.index = 1
          }
        } else if (indexParent > 0 && indexParent < (this.tree.length - 1)) {
          if (indexChildArticle === 0) {
            this.nextTitle = this.tree[indexParent].articles[indexChildArticle + 1].child
            this.idNextTitle = this.tree[indexParent].articles[indexChildArticle + 1].id
            this.preTitle = this.tree[indexParent - 1].articles[this.tree[indexParent - 1].articles.length - 1].child
            this.idPreTitle = this.tree[indexParent - 1].articles[this.tree[indexParent - 1].articles.length - 1].id
            this.index = 1
          } else if (indexChildArticle > 0 && indexChildArticle < (this.tree[indexParent].articles.length - 1)) {
            this.nextTitle = this.tree[indexParent].articles[indexChildArticle + 1].child
            this.idNextTitle = this.tree[indexParent].articles[indexChildArticle + 1].id
            this.preTitle = this.tree[indexParent].articles[indexChildArticle - 1].child
            this.idPreTitle = this.tree[indexParent].articles[indexChildArticle - 1].id
            this.index = 1
          } else if (indexChildArticle > 0 && indexChildArticle === (this.tree[indexParent].articles.length - 1) && this.tree[indexParent + 1].articles.length > 0) {
            this.nextTitle = this.tree[indexParent + 1].articles[0].child
            this.idNextTitle = this.tree[indexParent + 1].articles[0].id
            this.preTitle = this.tree[indexParent].articles[indexChildArticle - 1].child
            this.idPreTitle = this.tree[indexParent].articles[indexChildArticle - 1].id
            this.index = 1
          } else if (indexChildArticle > 0 && indexChildArticle === (this.tree[indexParent].articles.length - 1) && this.tree[indexParent + 1].articles.length === 0) {
            this.nextTitle = this.tree[indexParent + 1].titleCategory
            this.idNextTitle = this.tree[indexParent + 1].id
            this.preTitle = this.tree[indexParent].articles[indexChildArticle - 1].child
            this.idPreTitle = this.tree[indexParent].articles[indexChildArticle - 1].id
            this.index = 1
          }
        } else if (indexParent === (this.tree.length - 1) && indexChildArticle === (this.tree[indexParent].articles.length - 1) && this.tree[indexParent].articles.length > 0) {
          this.preTitle = this.tree[indexParent].articles[indexChildArticle - 1].child
          this.idPreTitle = this.tree[indexParent].articles[indexChildArticle - 1].id
          this.nextTitle = ''
          this.idNextTitle = ''
          this.index = 2
        }
      } else if (indexChildArticle < 0 && indexParent > -1) {
        if (indexParent > 0 && indexParent < (this.tree.length - 1)) {
          if (this.tree[indexParent + 1].articles.length === 0) {
            this.nextTitle = this.tree[indexParent + 1].titleCategory
            this.idNextTitle = this.tree[indexParent + 1].id
          } else if (this.tree[indexParent].articles.length > 0) {
            this.nextTitle = this.tree[indexParent + 1].articles[0].child
            this.idNextTitle = this.tree[indexParent + 1].articles[0].id
          }
          if (this.tree[indexParent - 1].articles.length > 0) {
            this.preTitle = this.tree[indexParent - 1].articles[this.tree[indexParent - 1].articles.length - 1].child
            this.idPreTitle = this.tree[indexParent - 1].articles[this.tree[indexParent - 1].articles.length - 1].id
          } else {
            this.preTitle = this.tree[indexParent - 1].titleCategory
            this.idPreTitle = this.tree[indexParent - 1].id
          }
          this.index = 1
        } else if (indexParent === this.tree.length - 1) {
          if (this.tree[indexParent - 1].articles.length > 0) {
            this.preTitle = this.tree[indexParent - 1].articles[(this.tree[indexParent - 1].articles.length - 1)].child
            this.idPreTitle = this.tree[indexParent - 1].articles[(this.tree[indexParent - 1].articles.length - 1)].id
          } else if (this.tree[indexParent - 1].articles.length === 0) {
            this.preTitle = this.tree[indexParent - 1].titleCategory
            this.idPreTitle = this.tree[indexParent - 1].id
          }
          this.nextTitle = ''
          this.idNextTitle = ''
          this.index = 2
        }
      }
    },
    getSections () {
      if (this.blockMap) {
        // console.log(this.blockMap)
        Object.values(this.blockMap).forEach(item => {
          if (item.value.type === 'sub_header') {
            this.sections.push(item.value.properties.title[0][0])
          }
        })
      }
    },
    copyUrl () {
      const el = document.createElement('textarea')
      el.value = window.location.href
      el.setAttribute('readonly', '')
      el.style.position = 'absolute'
      el.style.left = '-9999px'
      document.body.appendChild(el)
      const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      if (selected) {
        document.getSelection().removeAllRanges()
        document.getSelection().addRange(selected)
      }
      this.$notify.success({
        title: 'Copy link',
        message: 'Copy Link success',
        showClose: false
      })
    },
    replaceLinkLocal () {
      if (process.client) {
        const links = document.querySelectorAll('.notion-page a')
        if (links) {
          for (const link of links) {
            if (link.href.split('://')[1].startsWith(window.location.host)) {
              const id = slugify(link.textContent.trim()) + '-' + link.href.split('/').pop()
              let path = `whitepaper/${id}`
              path = this.locale === 'vi' ? `/${this.locale}/${path}` : `/${path}`
              link.href = path
              link.onclick = e => {
                e.preventDefault()
                this.$router.push(path)
              }
            }
          }
        }
      }
    }
  }
}
</script>
<style>
.el-button{
  border: none;
}
</style>
