<template>
  <div class="w-full flex flex-wrap">
    <div class="w-1/5 bg-[#F5F7F9] pl-8 py-8">
      <div class="mb-4">
        <img src="~/assets/images/landing/whitepaper/logo.png">
      </div>
      <div>
        <div v-for="(item, index) in categories" :key="index">
          <div v-if="item.articles.length > 0">
            <el-collapse v-model="activeName">
              <el-collapse-item :key="index" :name="(index+1).toString()">
                <template slot="title">
                  <div :id="item.id" class="text-[#161922] landing-font-14 font-normal">{{ item.titleCategory }}</div>
                </template>
                <div class="ml-5" style="border-left: 1px solid #C5C5C8;">
                  <nuxt-link
                    v-for="iItem in item.articles"
                    :id="iItem.id"
                    :key="iItem.id"
                    :to="localePath(`/whitepaper/articles/${iItem.slug + '-'+ iItem.id.split('-').join('')}`)"
                  >
                    <div class="text-[#A2A3A7] font-normal landing-font-14 p-3 " :class="currentArticleId === iItem.id ? 'category-active': ''"> {{ iItem.child }}</div>
                  </nuxt-link>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div v-else class="p-4">
            <nuxt-link
              class="text-[#A2A3A7] font-normal landing-font-14"
              :to="localePath(`/whitepaper/articles/${item.slug + '-'+ item.id.split('-').join('')}`)"
            >
              <div class="text-[#161922] font-normal landing-font-14">  {{ item.titleCategory }}</div>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <div class="w-4/5">
      <nuxt :nuxt-child-key="JSON.stringify(categories)" @articles-id="actionHandler" />
    </div>
  </div>
</template>
<script>
import slugify from 'slugify'
export default {
  props: {
    active: {
      type: String,
      default: '0'
    }
  },
  data () {
    return {
      activeName: ['1'],
      categories: [],
      currentArticleId: ''
    }
  },
  async fetch () {
    const language = this.$store.state.i18n.locale
    const result = await this.$axios.$get(`${process.env.baseUrl}/api/articles?language=${language}`)
    const data = result.data
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key])
    // khoi tao list categories
    for (const index in data) {
      if (data[index].children.length > 0) {
        const articleChild = []
        for (const child in data[index].children) {
          articleChild.push({
            child: data[index].children[child].child_page.title,
            id: data[index].children[child].id,
            slug: slugify(data[index].children[child].child_page.title || '')
          })
        }
        this.categories.push({
          titleCategory: data[index].child_page.title,
          articles: articleChild
        })
      } else {
        this.categories.push({
          id: data[index].id,
          titleCategory: data[index].child_page.title,
          slug: slugify(data[index].child_page.title || ''),
          articles: []
        })
      }
    }
  },
  // computed () {
  //   this.storage()
  // },
  methods: {
    actionHandler (e) {
      this.currentArticleId = e
    }
    // storage () {
    //   if (process.client) {
    //     if (localStorage.getItem('activeName') === null) {
    //       localStorage.setItem('activeName', '1')
    //     } else {
    //       this.activeName = localStorage.getItem('activeName')
    //     }
    //   }
    // },
    // handleChange (val) {
    //   console.log(val)
    // }
  }
}
</script>
<style>
.el-collapse-item__header .el-collapse-item__arrow{
  display: block !important;
  color: #A2A3A7;
}
.el-collapse {
  border: none !important;
}
.category-active{
  background: #FFFFFF;
  color: #268334 !important;
}
.category-next-active{
  background: #E8E8E9;
}
</style>
