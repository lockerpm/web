<template>
  <div id="blog" class="pb-25 pt-20">
    <section class="full-width min-w-[380px] h-auto pt-20 pb-24" style="background-color: #F3F5F8;">
      <div class="blog-intro max-w-6xl px-6 mx-auto flex flex-wrap h-auto">
        <div class="w-full md:w-1/2 mt-12">
          <h1 class="landing-font-44 text-black-800 font-bold mb-5">
            {{ $t('blog.intro') }}
          </h1>
          <p class="landing-font-16 text-black-600 mb-8">
            {{ $t('blog.desc') }}
          </p>
          <div class="w-full flex" style="margin-left: 0px; flex-wrap: nowrap;">
            <el-form ref="form" :rules="rules" :inline="true" :model="form" class="w-10/12">
              <el-form-item prop="email" style="width:62%">
                <el-input
                  v-model="form.email"
                  :placeholder="`${$t('blog.enter_email')}`"
                  type="email"
                  clearable
                />
              </el-form-item>
              <el-form-item style="width: 29%">
                <button class="blog-btn text-14 text-white" style="transform: translateX(-20px)" @click.prevent="subscribeBlog()">
                  {{ $t('blog.subscription') }}
                </button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="w-full md:w-1/2" style="margin-top: 40px; margin-left:auto; max-height: 325px">
          <img src="~/assets/images/landing/blog/intro-img.svg">
        </div>
      </div>
    </section>

    <section id="blog-body" class="py-20">
      <div class="w-full pb-0">
        <div class="projects-catalog">
          <div id="imageSlider1" class="catalog-slider flex justify-between">
            <span class="landing-font-16 md:hidden" style="padding: 6px 20px 5px 0px; cursor: pointer" @click="showPre()"><i class="fas fa-angle-left" /></span>
            <div class="catalog-cover" style="width: 70%">
              <ul id="sliderWrapper1" class="catalog-list corporate-projects">
                <li
                  v-for="(item, index) in blog_categories"
                  :key="index"
                  :class="item.id===category?'text-primary':''"
                  class="catalog-item landing-transition landing-font-16 font-bold uppercase"
                  @click="category=item.id"
                >
                  {{ item.label }}
                </li>
              </ul>
            </div>
            <span class="landing-font-16 md:hidden" style="padding: 6px 20px 5px; cursor: pointer" @click="showNext"><i class="fas fa-angle-right" /></span>
            <el-input
              v-model="query"
              :placeholder="`${$t('blog.search')}`"
              style="margin-bottom: 7px; width: 15%;"
              @input="searchPosts"
            >
              <i
                slot="suffix"
                class="el-icon-search el-input__icon text-20 font-weight-700 text-black"
              />
            </el-input>
          </div>
        </div>
      </div>
      <div class="w-full flex justify-between mt-5">
        <h3 class="landing-font-28 text-black-800 font-bold mb-8">
          {{ $t('blog.most_recent') }}
        </h3>
      </div>
      <!-- Posts -->
      <div v-loading="postLoading" class="blog-container w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[30px] gap-y-[30px]">
        <div v-for="(item, index) in posts" :key="index" class="">
          <Post :post="item" type="blog" />
        </div>
      </div>
      <!-- Posts end -->
      <div class="w-full text-center" style="margin-top: 60px">
        <el-button class="landing-btn" :loading="loadingMore" :disabled="loadMoreDisabled" :style="loadMoreDisabled?'display: none !important': ''" @click="loadMore()">
          {{ $t('blog.read_more') }}
        </el-button>
      </div>
    </section>

    <section class="md:mt-36 mt-24">
      <div
        class="w-full rounded py-[40px] px-[65px] flex justify-between align-middle md:flex-row flex-col"
        style="background-color: #f5f6f7"
      >
        <p class=" md:max-w-[490px] md:text-left md:mb-0 landing-font-28 font-semibold max-w-max text-center mb-6 ">
          {{ $t('landing.cta1.title') }}
        </p>

        <nuxt-link
          class="landing-btn"
          :to="localeRoute({name: $t('landing.cta1.btn.link')})"
          style="align-self: center"
        >
          {{ $t('landing.cta1.btn.text') }}
        </nuxt-link>
      </div>
    </section>
    <SubscribeSuccessful ref="subscribeSuccessful" />
    <!-- CTA end -->
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import cheerio from 'cheerio'
import debounce from 'lodash/debounce'
import Post from '~/components/landing/blog/Post'
import SubscribeSuccessful from '~/components/landing/blog/SubscribeSuccessful'
export default {
  components: {
    Post,
    SubscribeSuccessful
  },

  layout: 'landing',

  scrollToTop: true,

  async asyncData (context) {
    const language = context.store.state.i18n.locale
    try {
      // Get language tag
      const result = await axios.get(`${process.env.blogUrl}/tags?slug=${language}`)
      const tagId = result.data[0].id

      // Get posts and users
      const [postsRes, usersRes] = await Promise.all([
        axios.get(`${process.env.blogUrl}/posts?_embed=1&per_page=9&tags=${tagId}&categories=8,13,18,54,25`),
        axios.get(`${process.env.blogUrl}/users`)
      ])

      const posts = []
      const data = postsRes.data
      const userArray = usersRes.data

      data.forEach(async post => {
        let featuredImage = ''
        try {
          featuredImage = post._embedded['wp:featuredmedia']['0'].source_url
        } catch (error) {
        }
        if (!featuredImage) {
          const $ = cheerio.load(post.content.rendered)
          const images = $('img').attr('src')
          if (images) {
            featuredImage = images.replace(/-[0-9]+x[0-9]+/g, '')
          }
        }
        const $_ = cheerio.load(post.excerpt.rendered)
        const desc = $_('p').text()
        posts.push({
          ...post,
          featured_image: featuredImage,
          user: userArray.find(author => author.id === post.author),
          desc
        })
      })

      return {
        posts,
        users: userArray,
        localeTagId: tagId
      }
    } catch (error) {
      console.log(error)
    }
  },

  data () {
    return {
      form: {
        email: ''
      },
      rules: {
        email: [
          { required: true, message: 'Please input Email', trigger: 'blur' },
          { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
        ]
      },
      query: '',
      category: this.$t('blog.categories')[0].id,
      page: 1,
      loadingMore: false,
      loadMoreDisabled: false,
      postLoading: false,
      posts: [],
      localeTagId: null
    }
  },

  computed: {
    locale () { return this.$store.state.i18n.locale }
  },

  watch: {
    '$route.query.category' (newValue) {
      console.log(newValue)
      const category = this.blog_categories.find(cate => cate.slug === newValue)
      if (category) {
        this.category = category.id
      } else {
        this.category = this.$t('blog.categories')[0].id
      }
    },
    category (newValue) {
      this.changeCategory(newValue)
    }
  },

  mounted () {
    if (this.$route.query.category) {
      const category = this.blog_categories.find(cate => cate.slug === this.$route.query.category)
      if (category) {
        this.category = category.id
      }
    }
  },

  methods: {
    showPre () {
      const slider = document.querySelector('.catalog-list')
      if (slider) {
        const scrollLeft = slider.scrollLeft || 0
        slider.scroll({
          left: scrollLeft - 150,
          behavior: 'smooth'
        })
      }
    },

    showNext () {
      const slider = document.querySelector('.catalog-list')
      if (slider) {
        const scrollLeft = slider.scrollLeft || 0
        slider.scroll({
          left: scrollLeft + 150,
          behavior: 'smooth'
        })
      }
    },

    async subscribeBlog () {
      if (this.$refs.form) {
        const isValid = await this.$refs.form.validate()
        if (!isValid) {
          return
        }
      } else {
        return
      }
      try {
        await this.subscribe(this.form.email)
        this.$refs.subscribeSuccessful.openDialog()
      } catch (error) {
        this.$message({
          message: this.$t('landing_contact.messages.error_occurred'),
          type: 'error'
        })
      }
    },

    async getTagBySlug (tagSlug) {
      try {
        if (tagSlug === this.locale && this.localeTagId) {
          return this.localeTagId
        }
        const result = await axios.get(`${process.env.blogUrl}/tags?slug=${tagSlug}`)
        return result.data[0]
      } catch (error) {
        return null
      }
    },

    async changeCategory (id) {
      window.scroll({
        top: 650,
        left: 0,
        behavior: 'smooth'
      })
      this.category = id
      this.postLoading = true
      this.loadMoreDisabled = false
      this.page = 1
      this.query = ''
      try {
        const localeTagId = await this.getTagBySlug(this.locale)
        const url = `${process.env.blogUrl}/posts?_embed=1&per_page=9&tags=${localeTagId}&categories=${this.category}`
        const { data } = await axios.get(url)
        if (data.length < 9) {
          this.loadMoreDisabled = true
        } else {
          this.loadMoreDisabled = false
        }
        this.posts = data.map(this.mapFeatures)
      } catch (error) {
        console.log(error)
        this.notify(this.$t('errors.something_went_wrong'), 'warning')
      }
      this.postLoading = false
    },

    async loadMore () {
      this.loadingMore = true
      this.page += 1
      try {
        const localeTagId = await this.getTagBySlug(this.locale)
        const url = `${process.env.blogUrl}/posts?_embed=1&per_page=9&page=${this.page}&tags=${localeTagId}&search=${this.query}&categories=${this.category}`
        const newData = await axios.get(url)
        const newPosts = newData.data.map(this.mapFeatures)
        if (newPosts.length < 9) {
          this.loadMoreDisabled = true
        } else {
          this.loadMoreDisabled = false
        }
        this.posts = this.posts.concat(newPosts)
      } catch (error) {
        this.loadMoreDisabled = true
      }
      this.loadingMore = false
    },

    dateToFormattedString (date) {
      return moment(date).format('DD MMM YYYY')
    },

    mapFeatures (post) {
      let featuredImage = ''
      try {
        featuredImage = post._embedded['wp:featuredmedia']['0'].source_url
      } catch (error) {
      }
      if (!featuredImage) {
        const $ = cheerio.load(post.content.rendered)
        const images = $('img').attr('src')
        if (images) {
          featuredImage = images.replace(/-[0-9]+x[0-9]+/g, '')
        }
      }
      const $_ = cheerio.load(post.excerpt.rendered)
      const desc = $_('p').text()
      return {
        ...post,
        featured_image: featuredImage,
        desc,
        user: this.users.find(user => user.id === post.author)
      }
    },

    searchPosts: debounce(async function () {
      window.scroll({
        top: 650,
        left: 0,
        behavior: 'smooth'
      })
      this.postLoading = true
      this.loadMoreDisabled = false
      this.page = 1
      try {
        const localeTagId = await this.getTagBySlug(this.locale)
        const url = `${process.env.blogUrl}/posts?_embed=1&per_page=9&tags=${localeTagId}&search=${this.query}&categories=${this.category}`
        const { data } = await axios.get(url)
        if (data.length < 9) {
          this.loadMoreDisabled = true
        } else {
          this.loadMoreDisabled = false
        }
        this.posts = data.map(this.mapFeatures)
      } catch (error) {
        console.log(error)
        this.notify(this.$t('errors.something_went_wrong'), 'warning')
      }
      this.postLoading = false
    }, 800)
  }
}
</script>

<style>
.blog-btn {
  @apply hover:no-underline transition duration-200 ease-in-out text-white hover:text-white hover:bg-primary-HOVER whitespace-nowrap;
  display: inline-block;
  padding: 9px 24px;
  text-align: center;
  height: 40px;
  font-weight: 600;
  font-size: 14px !important;
  line-height: 22px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  background-color: #268334;
}
.blog-intro .el-input__inner {
  height: 40px;
}
#blog-body .el-input {
  height: 40px;
}
#blog-body .el-radio-button__inner {
  border: 1px solid transparent !important;
  padding: 12px 14px;
  border-radius: 5px;
}
#blog-body .el-radio-button:first-child .el-radio-button__inner{
  border-left: 0px !important;
}
#blog-body .el-radio-button__orig-radio:checked + .el-radio-button__inner{
  background-color: #F3F5F8;
  color: #072245;
  font-weight: bold;
  box-shadow: -1px 0 0 0 #fff;
}
.blog-container{
  justify-content: space-between;
  row-gap: 50px;
}
.btn-load {
    border-radius: 5px;
    width: 160px;
    padding: 8px 0 8px;
    font-weight: bold;
}
.ebook-img {
  background-color: rgba(0,0,0,0.5);
}
.projects-catalog .catalog-slider {
  margin: 0px 0px;
}

.projects-catalog .catalog-cover {
  position: relative;
  cursor: pointer;
}

.projects-catalog ul {
  white-space: nowrap;
  overflow-x: hidden;
  margin-bottom: 0px;
}

.projects-catalog li {
  width: 75%;
  height: 200px;
}

li.catalog-item {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.projects-catalog li {
  display: inline-block;
  margin: 0 24px 0 0;
  width: fit-content;
  height: 40px;
  padding-top: 7px;
}
.projects-catalog li:hover{
  @apply text-primary;
}
.featured-bg {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}
.blog-intro .el-form-item__content {
  width: 100%;
}
</style>
