<template>
  <div class="btn-pre-next">
    <div v-if="index === 0" class="bg-[#FFFFFF] md:mr-0 mr-5">
      <nuxt-link
        class="btn-navigation btn-next"
        style="border-radius: 4px"
        :to="localePath(`/whitepaper/${convertNextTitle + '-'+ idNextTitle.split('-').join('')}`)"
      >
        <div class="w-full">
          <div class="btn-label">
            Next
          </div>
          <div class="title">
            {{ titleNext }}
          </div>
        </div>
      </nuxt-link>
    </div>
    <div v-if="index === 1">
      <div class="grid md:grid-cols-2 grid-cols-1 items-center p-4 gap-x-[22px]">
        <div class="hover-btn">
          <nuxt-link
            class="btn-navigation btn-prev"
            style="border-radius: 4px"
            :to="localePath(`/whitepaper/${convertPreTitle + '-'+ idPreTitle.split('-').join('')}`)"
          >
            <div class="w-full">
              <div class="btn-label">
                Previous
              </div>
              <div class="title">
                {{ titlePrevious }}
              </div>
            </div>
          </nuxt-link>
        </div>
        <div class="hover-btn mt-4 md:mt-0">
          <nuxt-link
            class="btn-navigation btn-next"
            style="border-radius: 4px"
            :to="localePath(`/whitepaper/${convertNextTitle + '-'+ idNextTitle.split('-').join('')}`)"
          >
            <div class="w-full">
              <div class="btn-label">
                Next
              </div>
              <div class="title">
                {{ titleNext }}
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
    <div v-if="index === 2" class="bg-[#FFFFFF] hover-btn md:mr-0 mr-5">
      <nuxt-link
        class="btn-navigation btn-prev"
        style="border-radius: 4px"
        :to="localePath(`/whitepaper/${convertPreTitle + '-'+ idPreTitle.split('-').join('')}`)"
      >
        <div class="w-full">
          <div class="btn-label">
            Previous
          </div>
          <div class="title">
            {{ titlePrevious }}
          </div>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>
<script>
import slugify from 'slugify'
export default {
  props: {
    index: {
      type: Number,
      default: 0
    },
    titlePrevious: String,
    titleNext: String,
    idNextTitle: String,
    idPreTitle: String
  },
  computed: {
    convertPreTitle () {
      if (this.titlePrevious != null) {
        return slugify(this.titlePrevious)
      }
      return null
    },
    convertNextTitle () {
      if (this.titleNext != null) {
        return slugify(this.titleNext)
      }
      return null
    }
  }
}
</script>
<style lang="scss">
.btn-navigation {
  @apply flex flex-wrap items-center p-4;
  .title {
    @apply text-primary font-bold text-head-6 mt-2 max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap;
  }
  .btn-label {
    @apply text-black font-normal;
  }
  &.btn-next{
    @apply text-right;
    .title {
      &:after {
      content: ' »'
    }
    }
  }
  &.btn-prev{
    @apply text-left;
    .title {
      &:before {
      content: '« '
    }
    }
  }
}
.btn-navigation:hover{
  border: 1px solid #268334;
  border-radius: 4px;
}
.btn-navigation:hover {
  .title{
    color: #39a549 !important;
  }
  i {
    color: #268334 !important;
  }
}
a{
  text-decoration: none !important;
}
.btn-pre-next a{
  @apply  border-[1px] border-solid border-[#A2A3A7];
  /*height: 107px;*/
}

</style>
