<template>
  <div class="relative">
    <Header />
    <div class="w-full flex flex-wrap md:mt-0 mt-16">
      <div class="bg-[#F5F7F9] lg:w-1/5 md:w-[30%] w-full md:h-screen h-16 z-50 sticky top-0 flex flex-col justify-between">
        <div class="w-full pl-3 flex-grow overflow-y-scroll">
          <!-- Header -->
          <div class="flex flex-wrap pl-4 h-16 items-center md:hidden">
            <!-- Icon on mobile -->
            <div class="mr-3">
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
          <!-- Whitepaper Menu -->
          <div id="whitepaper-menu" class="mt-[88px]">
            <div v-for="(item, index) in categories" :key="index" class="md:block hidden">
              <div v-if="item.articles.length > 0">
                <el-collapse v-model="activeName">
                  <el-collapse-item :key="index" :name="(index+1).toString()">
                    <template slot="title">
                      <div :id="item.id" class="text-[#161922] landing-font-16 font-medium">{{ item.titleCategory }}</div>
                    </template>
                    <div class="ml-5" style="border-left: 1px solid #C5C5C8;">
                      <nuxt-link
                        v-for="iItem in item.articles"
                        :id="iItem.id"
                        :key="iItem.id"
                        :to="localePath(`/whitepaper/${iItem.slug + '-'+ iItem.id.split('-').join('')}`)"
                      >
                        <div class="text-[#A2A3A7] font-normal landing-font-16 p-3 hover:bg-[#eceff1]" :class="currentArticleId === iItem.id ? 'category-active': ''"> {{ iItem.child }}</div>
                      </nuxt-link>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
              <div v-else class="hover:bg-[#eceff1]">
                <nuxt-link
                  class="text-[#A2A3A7]"
                  :to="localePath(`/whitepaper/${item.slug + '-'+ item.id.split('-').join('')}`)"
                >
                  <div class="text-[#161922] font-medium landing-font-16 p-5">  {{ item.titleCategory }}</div>
                </nuxt-link>
              </div>
            </div>
          </div>
          <!-- Whitepaper Menu End -->
        </div>
        <div class="hidden md:block sticky bottom-0 px-5 py-3 mr-[1px] border-t-[1px] border-r-[1px] border-solid border-[#C5C5C8]">
          <!-- Language switcher -->
          <div
            :class="locale==='vi'?'opacity-06':''"
            :style="{paddingLeft: locale==='vi'?'34px': '12px'}"
            class="text-sm text-black-600 font-normal hover:text-green"
            style="cursor: pointer;"
            @click="setLocale('en')"
          >
            <span v-show="locale!=='vi'" class="mr-2"><i class="fas fa-location-arrow" /></span>English
          </div>
          <div
            :class="locale==='en'?'opacity-06':''"
            :style="{paddingLeft: locale!=='vi'?'34px': '12px'}"
            class="text-sm text-black-600 font-normal hover:text-green"
            style="margin-top: 11px; cursor: pointer;"
            @click="setLocale('vi')"
          >
            <span v-show="locale==='vi'" class="mr-2"><i class="fas fa-location-arrow" /></span>Vietnamese
          </div>

          <!-- Language switcher end -->
        </div>
      </div>
      <div class="md:w-[70%] w-full">
        <nuxt :nuxt-child-key="JSON.stringify(categories)" @articles-id="actionHandler" />
      </div>
    </div>

    <!-- OverlayNavMenu -->
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
        <div v-else class="p-5">
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
    <!-- OverlayNavMenu End -->
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
          id: data[index].id,
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
  head () {
    return {
      htmlAttrs: {
        lang: this.locale
        // lang: this.currentUser.language
      },
      title: 'Whitepaper - Locker Password Manager',
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Whitepaper - Locker Password Manager'
        },
        {
          hid: 'og:locale',
          property: 'og:locale',
          content: this.locale === 'vi' ? 'vi_VN' : 'en_US'
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: 'Whitepaper - Locker Password Manager'
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('landing.title')
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.$t('landing.title')
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.$t('landing.title')
        }
      ]
    }
  },
  computed: {
    language () {
      return this.$store.state.user.language
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
    },
    setLocale (locale) {
      this.changeLang(locale)
      setTimeout(() => {
        if (locale === 'en') {
          window.location.replace('/whitepaper')
          return
        }
        if (locale === 'vi') {
          window.location.replace('/vi/whitepaper')
        }
      }, 200)
    },
    getAlternatePath (lang) {
      let path = ''
      if (lang === 'en') {
        if (this.locale === 'en') {
          path = `${process.env.baseUrl}${this.$route.path}`
        } else {
          path = `${process.env.baseUrl}${this.$route.path.slice(3)}`
        }
      } else if (this.locale === 'en') {
        path = `${process.env.baseUrl}/${lang}${this.$route.path}`
      } else {
        path = `${process.env.baseUrl}${this.$route.path}`
      }

      return path.endsWith('/') ? path.slice(0, -1) : path
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
  @apply text-black font-bold;
  /* background: #FFFFFF;
  color: #268334 !important; */
}
.category-next-active{
  background: #E8E8E9;
}
#whitepaper-menu .el-collapse-item__arrow {
  @apply text-black-600;
  font-size: 20px;
  font-weight: 600;
}
</style>
