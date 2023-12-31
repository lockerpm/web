<template>
  <div class="md:mt-16 mt-4">
    <div class="flex lg:ml-20 ml-6 pt-10">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <nuxt-link
            :to="localePath('/whitepaper')"
            class="landing-font-14 !text-blue hover:no-underline"
          >
            Whitepaper
          </nuxt-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item v-if="parent.id">
          <nuxt-link
            :to="localePath(`/whitepaper/${parent.link}`)"
            class="landing-font-14 !text-blue hover:no-underline"
          >
            {{ parent.title }}
          </nuxt-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <nuxt-link
            :to="localePath($route.path)"
            class="landing-font-14 !text-blue hover:no-underline"
          >
            {{ title }}
          </nuxt-link>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="flex flex-wrap w-full relative">
      <div class="lg:w-4/5 md:w-3/4 w-full md:pr-20 pr-4 pt-6">
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
      <div class="lg:w-1/5 md:w-1/4 w-full h-full md:order-last order-first pt-6 mt-6 md:block hidden sticky top-[88px]">
        <div
          class="p-0 mb-8 cursor-pointer"
          @click="copyUrl"
        >
          <div class="md:flex inline-block flex-wrap md:ml-[21px] ml-0" style="border-left: 1px solid #C5C5C8;">
            <img src="~/assets/images/landing/whitepaper/Link.svg" class="md:block inline-block ml-6">
            <div class="text-[#161922] landing-font-14 font-normal ml-2 md:block inline-block">
              {{ $t('whitepaper.content.link') }}
            </div>
          </div>
        </div>
        <div v-if="sections.length > 0" class="mt-8 ml-[21px]" style="border-left: 1px solid #C5C5C8;">
          <div class="flex flex-nowrap mb-[14px] ml-6">
            <img src="~/assets/images/landing/whitepaper/textLeft.svg">
            <div class="text-[#A2A3A7] landing-font-14 font-normal">{{ $t('whitepaper.content.title') }}</div>
          </div>
          <div v-for="(item, index) in sections" :key="index" class="mt-3 ml-6">
            <a class="landing-font-16 text-black" @click="goto(item.id)">
              {{ item.text }}
            </a>
          </div>
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
      // let parent = null
      // if (!['a1a608a7-6565-44de-9307-2f227be8f0f9', '6bc9281b-2a03-4878-9cab-d6e4d698547e'].includes(dataArticle.parent)) {
      //   parent = await $axios.$get(`${process.env.baseUrl}/api/articles/${dataArticle.parent}`)
      // }
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
      sections: [],
      loading: false,
      parent: {}
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
      const parentObj = this.tree[indexParent]
      if (parentObj) {
        this.parent = {
          title: parentObj.titleCategory,
          id: parentObj.id,
          link: slugify(parentObj.titleCategory || '') + '-' + parentObj.id.split('-').join('')
        }
      }
      if (indexParent === -1) {
        indexParent = this.tree.findIndex(item => item.id === this.articleId)
      }
      if (this.tree.length && indexParent === -1) {
        return this.$nuxt.error({ statusCode: 404 })
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
      // if (this.blockMap) {
      //   Object.values(this.blockMap).forEach(item => {
      //     if (item.value.type === 'sub_header') {
      //       this.sections.push(item.value.properties.title[0][0])
      //     }
      //   })
      // }
      setTimeout(() => {
        const subHeaders = document.querySelectorAll('h2')
        subHeaders.forEach(e => {
          const text = e.innerText
          const id = slugify(text, { lower: true, locale: 'vi' })
          this.sections.push({
            text,
            id
          })
          e.id = id
        })
      }, 300)
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
        message: 'Copied successfully',
        showClose: true
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
    },
    goto (el) {
      const $ = document.getElementById(el)
      window.scroll({
        top: $.offsetTop - 40,
        left: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>
<style>
.el-button{
  border: none;
  padding: 0px !important;
  height: 20px;
  border-radius: 0px !important;
}
</style>
