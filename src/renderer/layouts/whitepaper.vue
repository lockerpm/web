<template>
  <div class="relative">
    <Header />
    <div class="w-full flex flex-wrap mt-16">
      <div class="bg-[#F5F7F9] pl-3 lg:w-1/5 md:w-1/4 w-full md:min-h-screen min-h-[64px] z-50 ">
        <div class="w-full md:h-screen overflow-y-scroll sticky top-16">
          <!-- Header -->
          <div class="flex flex-wrap pl-4 h-16 items-center">
            <!-- Icon on mobile -->
            <div class="md:hidden block mr-3">
              <a
                id="nav-whitepaper"
                class="landing-font-28 text-black mx-2"
              >
                <i class="fa fa-bars" @click="toggle = !toggle" />
              </a>
            </div>
            <!-- Icon on mobile end -->
            <nuxt-link :to="localePath('/whitepaper')" class="flex items-center">
              <div class="landing-font-24 font-semibold text-[#161922]">
                Whitepaper
              </div>
            </nuxt-link>
          </div>
          <!-- End header -->
          <hr class="line">
          <!-- Whitepaper Menu -->
          <div v-for="(item, index) in categories" :key="index" class="md:block hidden">
            <div v-if="item.articles.length > 0">
              <el-collapse v-model="activeName">
                <el-collapse-item :key="index" :name="(index+1).toString()">
                  <template slot="title">
                    <div :id="item.id" class="text-[#161922] landing-font-14 font-medium">{{ item.titleCategory }}</div>
                  </template>
                  <div class="ml-5" style="border-left: 1px solid #C5C5C8;">
                    <nuxt-link
                      v-for="iItem in item.articles"
                      :id="iItem.id"
                      :key="iItem.id"
                      :to="localePath(`/whitepaper/${iItem.slug + '-'+ iItem.id.split('-').join('')}`)"
                    >
                      <div class="text-[#A2A3A7] font-normal landing-font-14 p-3 " :class="currentArticleId === iItem.id ? 'category-active': ''"> {{ iItem.child }}</div>
                    </nuxt-link>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
            <div v-else class="p-4">
              <nuxt-link
                class="text-[#A2A3A7]"
                :to="localePath(`/whitepaper/${item.slug + '-'+ item.id.split('-').join('')}`)"
              >
                <div class="text-[#161922] font-medium landing-font-14">  {{ item.titleCategory }}</div>
              </nuxt-link>
            </div>
          </div>
          <!-- Whitepaper Menu End -->
        </div>
      </div>
      <div class="md:w-3/4 w-full">
        <nuxt :nuxt-child-key="JSON.stringify(categories)" @articles-id="actionHandler" />
      </div>
    </div>
    <div id="nav-menu-whitepaper" class="hidden fixed overflow-y-scroll top-0 left-0 w-full h-screen bg-[#F5F7F9] z-[100]">
      <!-- OverlayNavMenu header -->
      <div class="flex flex-wrap mt-10 pl-5 mb-4">
        <div class="w-2/3 landing-font-24 font-semibold text-[#161922]">
          Whitepaper
        </div>
        <div class="w-1/3">
          <a
            class="landing-font-28 text-black float-right mr-5"
          >
            <i class="fa fa-times" @click="openCloseToggle()" />
          </a>
        </div>
      </div>
      <!-- End OverlayNavMenu header -->

      <!-- Whitepaper Menu -->
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
                  :to="localePath(`/whitepaper/${iItem.slug + '-'+ iItem.id.split('-').join('')}`)"
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
            :to="localePath(`/whitepaper/${item.slug + '-'+ item.id.split('-').join('')}`)"
          >
            <div class="text-[#161922] font-normal landing-font-14">  {{ item.titleCategory }}</div>
          </nuxt-link>
        </div>
      </div>
      <!-- Whitepaper Menu End -->
    </div>
  </div>
</template>
<script>
import slugify from 'slugify'
import Header from '../components/landing/whitepaper/Header'
export default {
  components: {
    Header
  },
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
      currentArticleId: '',
      toggle: false,
      closeMenu: true
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
  watch: {
    toggle () {
      this.openCloseToggle()
    },
    '$route.path' () {
      this.toggle = false
    }
  },
  methods: {
    actionHandler (e) {
      this.currentArticleId = e
    },
    openCloseToggle () {
      const navMenuWhitepaper = document.getElementById('nav-menu-whitepaper')
      if (navMenuWhitepaper.classList.contains('hidden')) {
        navMenuWhitepaper.classList.remove('hidden')
      } else {
        navMenuWhitepaper.classList.add('hidden')
      }
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
