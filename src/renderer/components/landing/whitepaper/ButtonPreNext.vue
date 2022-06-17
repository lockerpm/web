<template>
  <div>
    <div v-if="index === 0" class="bg-[#FFFFFF]">
      <nuxt-link
        class="flex flex-wrap items-center p-4 hover-btn"
        style="box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25), 0px 0px 2px rgba(0, 0, 0, 0.25); border-radius: 4px"
        :to="localePath(`/whitepaper/articles/${convertNextTitle + '-'+ idNextTitle.split('-').join('')}`)"
      >
        <div class="w-5/6">
          <div class="text-[#A2A3A7] font-normal landing-font-16">
            Next
          </div>
          <div class="text-[#161922] font-normal landing-font-16 mt-2 title">
            {{ titleNext }}
          </div>
        </div>
        <div class="relative w-1/6">
          <img class="absolute top-[-8px] right-0" src="~/assets/images/landing/whitepaper/arrow-right.svg">
        </div>
      </nuxt-link>
    </div>
    <div v-if="index === 1">
      <div class="grid grid-cols-2 items-center p-4 gap-x-[22px]">
        <nuxt-link
          class="flex flex-wrap items-center p-4 hover-btn"
          style="box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25), 0px 0px 2px rgba(0, 0, 0, 0.25); border-radius: 4px"
          :to="localePath(`/whitepaper/articles/${convertPreTitle + '-'+ idPreTitle.split('-').join('')}`)"
        >
          <div class="w-1/6">
            <img src="~/assets/images/landing/whitepaper/arrow-left.svg">
          </div>
          <div class="w-5/6">
            <div class="float-right">
              <div class="text-[#A2A3A7] font-normal landing-font-16">
                Previous
              </div>
              <div class="text-[#161922] font-normal landing-font-16 mt-2 title">
                {{ titlePrevious }}
              </div>
            </div>
          </div>
        </nuxt-link>
        <nuxt-link
          class="flex flex-wrap items-center p-4 hover-btn"
          style="box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25), 0px 0px 2px rgba(0, 0, 0, 0.25); border-radius: 4px"
          :to="localePath(`/whitepaper/articles/${convertNextTitle + '-'+ idNextTitle.split('-').join('')}`)"
        >
          <div class="w-5/6">
            <div class="text-[#A2A3A7] font-normal landing-font-16">
              Next
            </div>
            <div class="text-[#161922] font-normal landing-font-16 mt-2 title">
              {{ titleNext }}
            </div>
          </div>
          <div class="relative w-1/6">
            <img class="absolute top-[-8px] right-0" src="~/assets/images/landing/whitepaper/arrow-right-color.svg">
          </div>
        </nuxt-link>
      </div>
    </div>
    <div v-if="index === 2" class="bg-[#FFFFFF]">
      <nuxt-link
        class="flex flex-wrap items-center p-4 hover-btn"
        style="box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25), 0px 0px 2px rgba(0, 0, 0, 0.25); border-radius: 4px"
        :to="localePath(`/whitepaper/articles/${convertPreTitle + '-'+ idPreTitle.split('-').join('')}`)"
      >
        <div class="w-1/6">
          <img src="~/assets/images/landing/whitepaper/arrow-right.svg">
        </div>
        <div class="w-5/6">
          <div class="float-right">
            <div class="text-[#A2A3A7] font-normal landing-font-16">
              Previous
            </div>
            <div class="text-[#161922] font-normal landing-font-16 mt-2 title">
              {{ titlePrevious }}
            </div>
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
<style>
.hover-btn:hover{
  border: 1px solid #268334;
  border-radius: 4px;
}
.hover-btn:hover .title{
  color: #268334 !important;
}
</style>
