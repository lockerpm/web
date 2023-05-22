<template>
  <div
    v-show="visible && notionData && notionData.length"
    class="banner-container"
  >
    <div class="max-w-6xl mx-auto">
      <div class="w-full pr-6 pl-6 flex flex-row md:pl-36">
        <div class="mt-[-5px] mr-2 min-w-[20px]">
          <img
            src="@/assets/images/landing/CaretUp.svg"
            alt=""
            class="cursor-pointer"
            @click="Up()"
          >
          <img
            src="@/assets/images/landing/CaretDown.svg"
            alt=""
            class="cursor-pointer"
            @click="Down()"
          >
        </div>
        <div ref="wrapper" class="test-wrapper text0-active ml-0 md:ml-11">
          <div
            v-for="(item, index) in realData"
            :key="index"
            :class="index != 0 ? 'mt-12' : ''"
          >
            <p class="font-normal text-center parent" style="color: white">
              <span class="new-container"> NEW </span>
              <span class="ellipsis" v-html="item.Text" /> 🎉
              <a
                :href="item.Link"
                style="
                  color: #15d127;
                  text-decoration: none;
                  white-space: nowrap;
                "
                target="_blank"
              >
                {{ $t('landing_banner.read_more') }} <i class="el-icon-right" />
              </a>
            </p>
          </div>
          <div
            v-if="realData && realData.length !== 1 && realData.length !== 0"
            class="mt-12"
          >
            <p class="font-normal text-center parent" style="color: white">
              <span class="new-container"> NEW </span>
              <span class="ellipsis" v-html="realData[0].Text" /> 🎉
              <a
                :href="realData[0].Link"
                style="
                  color: #15d127;
                  text-decoration: none;
                  white-space: nowrap;
                "
                target="_blank"
              >
                {{ $t('landing_banner.read_more') }} <i class="el-icon-right" />
              </a>
            </p>
          </div>
        </div>
        <a class="close-btn min-w-[20px]" @click.prevent="close()">
          <i class="el-icon-close" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopBanner',
  data () {
    return {
      visible: true,
      notionData: [],
      delay: 4000,
      timeoutId: () => {},
      reverse: false,
      count: 0
    }
  },
  computed: {
    url () {
      if (this.$i18n.locale === 'vi') {
        return 'https://locker.io/vi/blog/tien-ich-quan-ly-mat-khau'
      } else {
        return 'https://locker.io/blog/introducing-a-new-locker-password-manager-for-firefox'
      }
    },
    realData () {
      return this.notionData.filter(
        data =>
          data?.Status === 'Active' &&
          ((this.$i18n.locale === 'vi' && data?.Language === 'Vietnamese') ||
            (this.$i18n.locale === 'en' && data?.Language === 'English'))
      )
    }
  },
  mounted () {
    this.myFunction()
  },
  created () {
    this.getNotionData()
  },
  methods: {
    getNotionData () {
      this.$axios.$get(`${process.env.baseUrl}/api/top-banner`).then(res => {
        this.notionData = res.data
      })
    },
    changeTextBaseOnParam () {
      const wrapper = this.$refs.wrapper
      if (!wrapper) {
        return
      }
      wrapper.classList.remove('inactive')
      const remove =
        (this.count + this.realData.length) % (this.realData.length + 1)
      wrapper.classList.remove(`text${remove}-active`)
      wrapper.classList.add(`text${this.count}-active`)
      if (this.count === 0) {
        wrapper.classList.add('inactive')
      }
    },
    myFunction () {
      this.timeoutId = setTimeout(() => {
        const length = this.realData.length + 1
        const newCount = (this.count + 1) % length
        this.count = newCount
        this.changeTextBaseOnParam()
        this.myFunction()
      }, this.delay)
    },
    Up () {
      clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(this.myFunction, this.delay)
      const wrapper = this.$refs.wrapper
      if (!wrapper) {
        return
      }
      if (this.reverse) {
        wrapper.classList.remove('inactive')
        this.reverse = false
      }
      wrapper.classList.remove(`text${this.count}-active`)
      if (this.count === 0) {
        wrapper.classList.add('inactive')
        this.count = this.realData.length
        wrapper.classList.add(`text${this.count}-active`)
        this.reverse = true
        setTimeout(this.Up, 1)
      } else {
        this.count = this.count - 1
        wrapper.classList.add(`text${this.count}-active`)
      }
    },
    Down () {
      clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(this.myFunction, this.delay)
      const wrapper = this.$refs.wrapper
      if (!wrapper) {
        return
      }
      if (this.reverse) {
        wrapper.classList.remove('inactive')
        this.reverse = false
      }
      wrapper.classList.remove(`text${this.count}-active`)
      if (this.count === this.realData.length) {
        wrapper.classList.add('inactive')
        this.count = 0
        wrapper.classList.add(`text${this.count}-active`)
        this.reverse = true
        setTimeout(this.Down, 1)
      } else {
        this.count = this.count + 1
        wrapper.classList.add(`text${this.count}-active`)
      }
    },
    close () {
      this.visible = false
    }
  }
}
</script>

<style scoped>
.banner-container {
  background-color: #222222;
  padding-top: 13px;
  padding-bottom: 13px;
  position: sticky;
  top: 0;
  height: 50px;
  z-index: 1000;
  overflow: hidden;
}
.test-wrapper {
  width: 90%;
  transition: margin-top 0.75s cubic-bezier(0.31, 0.31, 0.56, 0.57);
}
.inactive {
  transition: none;
}
.new-container {
  background-color: #ffc400;
  color: #222222;
  padding: 1px 12px;
  line-height: 22px;
  border-radius: 3px;
  margin-right: 10px;
  font-weight: 600;
}
.close-btn {
  color: white;
  text-decoration: none;
  padding: 0 10px;
  margin-right: -10px;
}
.text0-active {
  margin-top: 0px;
}
.text1-active {
  margin-top: -72px;
}

.text2-active {
  margin-top: -144px;
}

.text3-active {
  margin-top: -216px;
}

.text4-active {
  margin-top: -288px;
}
.text5-active {
  margin-top: -360px;
}
.text6-active {
  margin-top: -432px;
}
.parent {
  display: flex;
  flex-wrap: nowrap;
  overflow: hidden;
}
.parent > span {
  white-space: nowrap;
}
.ellipsis {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
