<template>
  <nuxt-link :to="localePath(`/blog/${post.slug}`)" class="hover:no-underline">
    <div class="flex post-card">
      <!-- Featured img -->
      <div class="post-img">
        <img :src="post.featured_image" :alt="post.title.rendered">
      </div>
      <!-- Featured img end -->

      <div style="padding: 0 14px 20px 16px">
        <!-- Categories -->
        <div class="flex" style="margin: 12px 0px 12px; flex-wrap: wrap">
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
        <!-- Categories end -->

        <h3
          class="landing-font-22 text-black-800 font-bold post-title line-clamp-2"
          v-html="post.title.rendered"
        />

        <!-- Author -->
        <div class="flex">
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
            <p class="landing-font-14 text-black-800 font-bold mb-0">
              {{ post.user ? post.user.name : 'CyStack Editor' }}
            </p>
            <p class="landing-font-14 mb-0" style="color: #686868">
              {{ $moment(post.date).format('DD MMM YYYY') }}
            </p>
          </div>
        </div>
        <!-- Author end -->
      </div>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    post_categories () {
      let categories = []
      categories = this.blog_categories
        .slice(1)
        .filter(item => this.post.categories.includes(parseInt(item.id)))
      return categories
    }
  }
}
</script>

<style scoped>
.post-card {
  position: relative;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  --tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  border-radius: 4px;
}

.post-card:hover .post-title {
  @apply text-primary;
  transition: ease-in-out;
  transition-duration: 200ms;
}
.post-desc {
  /* height: 50px;
  overflow-y: hidden;
  margin-bottom: 65px; */
  margin-bottom: 65px;
}
.line-clamp-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.post-img {
  width: 100%;
  height: 182px;
}

.post-img img {
  width: 100%;
  height: 100%;
  border-radius: 5px 5px 0px 0px;
  object-fit: cover;
}
.post-title {
  /* display: block; */
  max-width: 100%;
  height: auto;
  margin: 0 auto 16px;
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
</style>
