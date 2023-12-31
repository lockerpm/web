<template>
  <div class="content pb-100">
    <div class="w-full flex mt-28 relative z-10">
      <div v-if="post" class="">
        <p class="landing-font-16 text-black">
          <span>
            <nuxt-link
              :to="localePath('/')"
              class="font-semibold text-black hover:no-underline hover:text-primary landing-transition"
            >
              {{ $t('blog.home') }} &nbsp; • &nbsp;
            </nuxt-link>
            <nuxt-link
              :to="localePath('/blog')"
              class="font-semibold text-black hover:no-underline hover:text-primary landing-transition"
            >
              Blog &nbsp; • &nbsp;
            </nuxt-link>
          </span>
          <span v-if="post.title" v-html="post.title.rendered" />
        </p>
      </div>
    </div>
    <section class="w-full h-auto">
      <div v-if="post" class="w-full flex flex-wrap relative">
        <div
          class="w-full static top-0 mt-4 md:w-3/12 md:sticky md:pt-36 md:mt-[-34px]"
          style="height: fit-content"
        >
          <p
            v-if="post.table_of_contents.length"
            class="landing-font-14 text-black font-bold"
          >
            {{ $t('blog.table_of_contents') }}
          </p>
          <div class="w-full flex flex-col pb-2">
            <nuxt-link
              v-for="(item, index) in post.table_of_contents"
              :key="index"
              :to="`#${item.link}`"
              style="width: 100%"
              active-class="current-content"
              class="table-contents-item landing-transition text-14 font-weight-400"
              :style="item.heading == 'h3' ? 'padding-left: 30px' : ''"
            >
              {{ item.text }}
            </nuxt-link>
          </div>
          <div>
            <div class="flex mt-4">
              <p class="landing-font-14 text-black font-bold">
                {{ $t('blog.subscribe_to_update') }}
              </p>
            </div>
            <div class="mt-4">
              <el-form ref="form" :rules="rules" :model="form">
                <el-form-item prop="email">
                  <el-input
                    v-model="form.email"
                    :placeholder="`${$t('blog.enter_email')}`"
                    type="email"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <button
                class="landing-btn landing-font-14 font-normal w-full"
                style="padding-top: 10px; padding-bottom: 10px"
                @click.prevent="subscribeBlog()"
              >
                {{ $t('blog.subscription') }}
              </button>
            </div>
            <p class="landing-font-14 text-black font-bold mb-4 mt-7">
              {{ $t('blog.share') }}
            </p>
            <div class="flex">
              <div
                style="margin-right: 15px; cursor: pointer"
                @click="fbShare()"
              >
                <div class="icon-frame">
                  <img src="~/assets/images/landing/blog/facebook-blue.svg">
                </div>
              </div>
              <div
                style="margin-right: 15px; cursor: pointer"
                @click="twitterShare()"
              >
                <div class="icon-frame">
                  <img src="~/assets/images/landing/blog/twitter-blue.svg">
                </div>
              </div>
              <div style="cursor: pointer" @click="linkedinShare()">
                <div class="icon-frame">
                  <img src="~/assets/images/landing/blog/linkedin-blue.svg">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="post-container w-full md:w-9/12"
          style="padding-left: 3%; padding-right: 3%"
        >
          <div class="flex" style="margin: 42px 0px 12px; flex-wrap: wrap">
            <nobr
              v-for="item in post_categories"
              :key="item.label"
              style="margin: 12px 5px 0px 0px"
            >
              <p class="post-cate-tag">
                {{ item.label }}
              </p>
            </nobr>
          </div>
          <h1
            v-if="post.title"
            class="landing-font-38 text-black font-bold mb-4"
            v-html="post.title.rendered"
          />
          <div class="flex mb-12">
            <img
              v-if="post.user && post.user.avatar_urls"
              :src="post.user.avatar_urls[48]"
              class="rounded-full"
              style="margin-right: 5px"
            >
            <img
              v-else
              src="~/assets/images/landing/blog/cystack_editor.svg"
              style="margin-right: 5px"
            >
            <div>
              <p class="landing-font-14 text-black font-bold mb-0">
                {{ post.user ? post.user.name : 'CyStack Editor' }}
              </p>
              <div class="flex">
                <div v-if="post.user && post.user.description">
                  {{ post.user.description }} &nbsp;|&nbsp;
                </div>
                <p class="landing-font-14 mb-0" style="color: #686868">
                  {{ dateToFormattedString(post.date) }}
                </p>
              </div>
            </div>
          </div>
          <div
            v-if="post.content"
            class="post-content"
            v-html="post.new_content_rendered"
          />
        </div>
      </div>
    </section>
    <section class="py-20">
      <div class="w-full">
        <!-- <div class="column width-1">
          &nbsp;
        </div> -->
        <div
          v-if="relatedPosts.length"
          class="w-full md:w-9/12 mx-auto"
          style="padding-left: 5%"
        >
          <h3 class="landing-font-28 text-black font-bold mb-7">
            {{ $t('blog.related_posts') }}
          </h3>
          <div
            class="w-full grid md:grid-cols-2 grid-cols-1"
            style="margin-left: 0px; row-gap: 50px"
          >
            <div
              v-for="(item, index) in relatedPosts"
              :key="index"
              style="padding-left: 0px; padding-right: 30px"
            >
              <Post :post="item" type="blog" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import cheerio from 'cheerio'
import slugify from 'slugify'
import Post from '~/components/landing/blog/Post'

export default {
  components: { Post },

  layout: 'landing',

  scrollToTop: true,

  async asyncData ({ store, params, error }) {
    try {
      const slug = encodeURIComponent(params.slug)
      const language = store.state.i18n.locale

      // Get post by slug + get users + language tag
      const [postRes, usersRes, langRes] = await Promise.all([
        axios.get(
          `${process.env.blogUrl}/posts?_embed&slug=${slug}&categories=8,13,18,54,25`
        ),
        axios.get(`${process.env.blogUrl}/users`),
        axios.get(`${process.env.blogUrl}/tags?slug=${language}`)
      ])

      const data = postRes.data
      if (data.length === 0) {
        error({ statusCode: 404 })
        return
      }

      const userArray = usersRes.data
      const languageTagId = langRes.data[0].id
      const relatedPosts = []
      const categoryIds = data[0].categories
      let categories = []

      try {
        // Get categories + related posts
        const [relateResult, ...categoriesRes] = await Promise.all([
          axios.get(
            `${process.env.blogUrl}/posts?_embed&exclude=${
              data[0].id
            }&categories=${categoryIds.toString()}&tags=${languageTagId}&per_page=2`
          ),
          ...categoryIds.map(async id => {
            const res = await axios.get(
              `${process.env.blogUrl}/categories/${id}`
            )
            return res.data
          })
        ])

        categories = categoriesRes

        // Process related results
        relateResult.data.forEach(async element => {
          let featuredImage = ''
          try {
            featuredImage =
              element._embedded['wp:featuredmedia']['0'].source_url
          } catch (error) {}
          if (!featuredImage) {
            const $ = cheerio.load(element.content.rendered)
            const images = $('img').attr('src')
            if (images) {
              featuredImage = images.replace(/-[0-9]+x[0-9]+/g, '')
            }
          }
          const $_ = cheerio.load(element.excerpt.rendered)
          const desc = $_('p').text()

          relatedPosts.push({
            ...element,
            featured_image: featuredImage,
            user: userArray.find(user => user.id === element.author),
            desc
          })
        })
      } catch (error) {
        console.log(error)
      }

      // Process post
      return {
        post: data.map(post => {
          const $ = cheerio.load(post.content.rendered)
          let featuredImage = ''
          try {
            featuredImage = post._embedded['wp:featuredmedia']['0'].source_url
          } catch (error) {}
          if (!featuredImage) {
            const $ = cheerio.load(post.content.rendered)
            const images = $('img').attr('src')
            if (images) {
              featuredImage = images.replace(/-[0-9]+x[0-9]+/g, '')
            }
          }
          const $_ = cheerio.load(post.excerpt.rendered)
          const desc = $_('p').text()
          const tableOfContents = []
          $('h2, h3').each(function (i, e) {
            const title = $(e).text()
            const slug = slugify(title, { locale: 'vi', lower: true })
            tableOfContents[i] = {
              text: $(e).text(),
              link: slug,
              heading: e.name
            }
            $(this).attr('id', slug)
          })
          if (!tableOfContents.length) {
            $('h1').each(function (i, e) {
              const title = $(e).text()
              const slug = slugify(title, { locale: 'vi', lower: true })
              tableOfContents[i] = {
                text: title,
                link: slug
              }
              $(this).attr('id', slug)
            })
          }
          return {
            ...post,
            new_content_rendered: $.html(),
            desc,
            featured_image: featuredImage,
            user: userArray.find(user => user.id === post.author),
            table_of_contents: tableOfContents
          }
        })[0],
        categories: categories.map(item => item.name),
        relatedPosts
      }
    } catch (error) {
      console.log(error)
      error({ statusCode: 404 })
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
          {
            type: 'email',
            message: 'Please input correct email address',
            trigger: ['blur', 'change']
          }
        ]
      },
      relatedPosts: [],
      post: null
    }
  },
  head () {
    const getPostDescription = tx => {
      if (!tx) {
        return ''
      }
      let res = tx
      try {
        res = this.$sanitize(res, { allowedTags: [] }) // Remove tags
        res = res.replaceAll('’', "'")
      } catch (error) {}
      return res
    }

    return {
      title: this.post.title.rendered + ' | Locker',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: getPostDescription(this.post.excerpt.rendered)
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: getPostDescription(this.post.excerpt.rendered)
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.post.title.rendered + ' | Locker'
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.post.title.rendered + ' | Locker'
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: getPostDescription(this.post.excerpt.rendered)
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.post.featured_image
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: this.post.featured_image
        },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image'
        }
      ]
    }
  },
  computed: {
    post_categories () {
      return this.blog_categories
        .slice(1)
        .filter(item => this.post.categories.includes(parseInt(item.id)))
    }
  },
  async mounted () {
    // this.post = await this.loadPost()
  },
  methods: {
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
        this.$message({
          message: this.$t('landing_contact.messages.request_has_been_sent'),
          type: 'success'
        })
      } catch (error) {
        this.$message({
          message: this.$t('landing_contact.messages.error_occurred'),
          type: 'error'
        })
      }
    },
    async getTagBySlug (tagSlug) {
      try {
        const result = await axios.get(
          `${process.env.blogUrl}/tags?slug=${tagSlug}`
        )
        return result.data[0]
      } catch (error) {
        return {}
      }
    },
    dateToFormattedString (date) {
      return moment(date).format('ll')
    },
    fbShare (winWidth = 520, winHeight = 350) {
      const url = 'https://locker.io/' + this.$route.fullPath
      const winTop = screen.height / 2 - winHeight / 2
      const winLeft = screen.width / 2 - winWidth / 2
      window.open(
        'http://www.facebook.com/sharer.php?u=' + url,
        'sharer',
        'top=' +
          winTop +
          ',left=' +
          winLeft +
          ',toolbar=0,status=0,width=' +
          winWidth +
          ',height=' +
          winHeight
      )
    },
    twitterShare (winWidth = 520, winHeight = 400) {
      const url = 'https://locker.io/' + this.$route.fullPath
      const winTop = screen.height / 2 - winHeight / 2
      const winLeft = screen.width / 2 - winWidth / 2
      window.open(
        'https://twitter.com/intent/tweet?url=' + url,
        'sharer',
        'top=' +
          winTop +
          ',left=' +
          winLeft +
          ',toolbar=0,status=0,width=' +
          winWidth +
          ',height=' +
          winHeight
      )
    },
    linkedinShare (winWidth = 520, winHeight = 500) {
      const url = 'https://locker.io/' + this.$route.fullPath
      const winTop = screen.height / 2 - winHeight / 2
      const winLeft = screen.width / 2 - winWidth / 2
      window.open(
        'https://www.linkedin.com/sharing/share-offsite/?url=' + url,
        'sharer',
        'top=' +
          winTop +
          ',left=' +
          winLeft +
          ',toolbar=0,status=0,width=' +
          winWidth +
          ',height=' +
          winHeight
      )
    }
  }
}
</script>

<style lang="scss">
.icon-frame {
  height: 40px;
  width: 40px;
  border: 1px solid #e4e6eb;
  border-radius: 5px;
}
.post-content {
  font-size: 16px;
  line-height: 28px;
  p {
    margin-bottom: 16px;
  }
  .wp-block-image {
    margin-bottom: 16px;
    img {
      margin-bottom: 8px;
    }
    figcaption {
      @apply italic text-sm text-center;
    }
  }
}
.post-content > ul {
  display: block;
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 40px;
}
div.post-content > h1,
div.post-content > h2,
div.post-content > h3,
div.post-content > h4,
div.post-content > h5,
div.post-content > h6 {
  @apply text-black;
  font-weight: 700 !important;
  padding-top: 30px !important;
  margin-bottom: 20px;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif !important;
}
div.post-content > h2,
div.post-content > h1 {
  font-size: 32px;
  line-height: 36px;
}
div.post-content > h3 {
  font-size: 22px;
  line-height: 26px;
}
div.post-content > h4 {
  font-size: 20px;
  line-height: 32px;
}
div.post-content > h3,
div.post-content > h2 {
  padding-top: 150px !important;
  margin-top: -120px;
}
div.post-content a {
  color: #0266f9 !important;
  font-weight: 500 !important;
}
div.post-content pre {
  background: #f3f5f8;
  color: #072245;
  border-radius: 0.25em;
  padding: 0.15em 0.4em;
  font-weight: 400 !important;
  vertical-align: middle;
  border: 1px solid #e1eaef;
}
div.post-content blockquote {
  font-size: 1.8rem;
  line-height: 1.8;
  background-color: #f3f5f8;
  padding: 0.8em 0.8em;
  color: #072245;
  border-radius: 0.5em;
}
.table-contents-item {
  @apply hover:no-underline;
  color: #686868;
  padding: 12px 0px 12px 16px;
  border-radius: 3px;
  cursor: pointer;
}
.table-contents-item:hover,
.current-content {
  @apply text-primary;
  background-color: #f3f5f8;
}
.post-cate-tag {
  font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif !important;
  padding: 6px 8px;
  border-radius: 4px;
  margin-bottom: 0px;
  font-size: 12px;
  color: #6b778c;
  background-color: #ebecf0;
  font-weight: 700;
  line-height: 12px;
}
.post-content .has-white-color {
  color: #fff;
}
.post-content ol.has-background,
.post-content ul.has-background {
  padding: 1.25em 2.375em;
  margin-left: 0px;
}
.post-content .wptb-table-container {
  width: 100%;
  overflow-x: scroll;
}
.post-content .wp-block-button .wp-block-button__link {
  transition: background 150ms ease-in-out;
  border: none;
  font-size: 0.88889em;
  line-height: 1.2;
  box-sizing: border-box;
  font-weight: bold;
  text-decoration: none;
  padding: 0.76rem 1rem;
  outline: none;
  border-radius: 5px;
  color: white !important;
}

.post-content .wptb-table-container table td {
  padding: 15px;
  width: 100px;
}

.post-content .wptb-ph-element {
  width: inherit;
  margin: 0 auto;
}

.post-content .wptb-table-container p {
  margin-bottom: 0px;
}
.post-content .wptb-preview-table {
  width: 100%;
  .wptb-text-container,
  .wptb-list-container {
    @apply w-full px-2;
    li {
      list-style: disc;
    }
  }
}
.post-content ol {
  list-style: auto !important;
  padding-left: 1rem;
}
</style>
