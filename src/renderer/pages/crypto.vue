<template>
  <div>
    <section class="bg-welcome full-width h-auto pt-[76px] bg-center bg-cover bg-no-repeat" :style="{backgroundImage: `url(${require(`~/assets/images/landing/crypto/bg-frame.png`)})`}">
      <div class="max-w-6xl mx-auto px-6">
        <div class="flex items-center">
          <div>
            <div class="landing-font-52 font-bold text-[#161922]">
              {{ $t('crypto.bg_welcome.title') }}
            </div>
            <div class="my-4">
              <img src="~/assets/images/landing/crypto/line.png">
            </div>
            <div class="landing-font-20 font-normal text-[#3A3A3A]">
              {{ $t('crypto.bg_welcome.subtitle') }}
            </div>
            <div class="mt-[66px] mb-[137px]">
              <nuxt-link
                class="landing-btn"
                :to="localePath({name: $t('crypto.bg_welcome.btn.link')})"
                style="align-self: center"
              >
                {{ $t('crypto.bg_welcome.btn.text') }}
              </nuxt-link>
            </div>
          </div>
          <div class="w-[75%]">
            <img src="~/assets/images/landing/crypto/bg_welcome.png">
          </div>
        </div>
      </div>
    </section>
    <section class="items-introduce-crypto py-[120px]">
      <div v-for="(item, index) in $t('crypto.introduce_crypto.items')" :key="index" class="grid md:grid-cols-2 grid-cols-1 items-center" :class="index === 1 ? 'my-[100px] md:gap-x-[120px] gap-y-[60px]' :'md:gap-x-[40px] gap-y-[60px]'">
        <div :class="index === 1 ? '!order-last': ''" class="md:order-first order-last">
          <div class="font-bold landing-font-38 text-[#161922] mb-5">
            {{ item.title }}
          </div>
          <div class="text-[#5A6176] landing-font-18 font-normal mb-[40px]">
            {{ item.desc }}
          </div>
          <div>
            <nuxt-link
              class="landing-btn"
              :to="localePath({name: $t('crypto.introduce_crypto.btn.link')})"
              style="align-self: center"
            >
              {{ $t('crypto.introduce_crypto.btn.text') }}
            </nuxt-link>
          </div>
        </div>
        <div>
          <img :src="require(`~/assets/images/landing/crypto/${item.img}`)">
        </div>
      </div>
    </section>
    <section class="system-security py-[120px]">
      <div class="font-bold text-[#161922] landing-font-38 mb-6 text-center">
        {{ $t('crypto.security_system.title') }}
      </div>
      <div class="font-normal landing-font-22 text-[#000000] mb-[100px] text-center">
        {{ $t('crypto.security_system.desc') }}
      </div>
      <div class="grid md:grid-cols-3 grid-cols-1 md:grid-flow-col items-center gap-x-[28px]">
        <div class="order-0 grid gap-y-[83px]">
          <div v-for="(item, index) in $t('crypto.security_system.list_item_services.left')" :key="index" class="items-center">
            <div class="flex">
              <div>
                <img :src="require(`~/assets/images/landing/crypto/${item.icon_1}`)" class="icon-sys">
              </div>
              <div class="font-normal landing-font-16 text-[#000000] ml-3">
                {{ item.desc }}
              </div>
            </div>
          </div>
        </div>
        <div class="md:order-1 order-first">
          <div class="grid md:grid-rows-4 grid-rows-1 md:gap-y-[35px] gap-y-[60px]">
            <div class="grid md:grid-cols-3 grid-rows-1">
              <div class="md:block hidden">
                <img src="~/assets/images/landing/crypto/icon_left_top.png">
              </div>
              <div class="md:block hidden" />
              <div class="md:block hidden">
                <img src="~/assets/images/landing/crypto/icon_right_top.png">
              </div>
            </div>
            <div class="grid md:grid-cols-6 grid-cols-1 items-center row-span-3">
              <div class="md:block hidden">
                <img src="~/assets/images/landing/crypto/icon_line_left.png">
              </div>
              <div class="col-span-4">
                <img src="~/assets/images/landing/crypto/icon_center.png">
              </div>
              <div class="md:block hidden">
                <img src="~/assets/images/landing/crypto/icon_line_right.png">
              </div>
            </div>
            <div class="grid md:grid-cols-3 grid-cols-1">
              <div class="md:block hidden">
                <img src="~/assets/images/landing/crypto/icon_left_bottom.png">
              </div>
              <div class="md:block hidden" />
              <div class="md:block hidden">
                <img src="~/assets/images/landing/crypto/icon_right_bottom.png">
              </div>
            </div>
          </div>
        </div>
        <div class="grid order-2 md:gap-y-[135px] gap-y-[60px]">
          <div v-for="(item, index) in $t('crypto.security_system.list_item_services.right')" :key="item.icon_1.toString()" class="items-center" :class="index === 0 ? 'md:mt-0 mt-[60px]' : ''">
            <div class="flex">
              <div>
                <img :src="require(`~/assets/images/landing/crypto/${item.icon_1}`)" :style="index === 0 ? 'width: 24px; height: 40px': (index === 1 ? 'width: 24px; height: 36px' : 'width: 30px; height: 30px') ">
              </div>
              <div class="font-normal landing-font-16 text-[#000000] ml-3">
                {{ item.desc }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="locker-start py-[120px] full-width h-auto bg-[#F8F9FA]">
      <div class="max-w-6xl mx-auto px-6">
        <div class="landing-font-38 font-bold text-[#161922] text-center mb-[72px]">
          {{ $t('crypto.locker_start.title') }}
        </div>
        <div class="process-tab">
          <div class="text-center menu-tab-menu" style="margin-bottom: 88px;">
            <el-radio-group v-model="tabPosition">
              <el-radio-button v-for="(item, index) in $t('crypto.locker_start.list_tabs')" :key="index" :label="index.toString()" :class="index === 0 ? 'border-span-0': (index === 2 ? 'border-span-2': '')">
                <template>
                  <div class="font-semibold landing-font-20 text-center uppercase">{{ item.tab_name }}</div>
                </template>
              </el-radio-button>
            </el-radio-group>
          </div>
          <div v-show="tabPosition" class="grid md:grid-cols-2 grid-cols-1 md:gap-x-[130px] gap-y-[60px]">
            <div v-if="tabPosition === currentPosition">
              <img :src="require(`~/assets/images/landing/crypto/${$t('crypto.locker_start.list_tabs')[Number(tabPosition)].list_process[Number(indexImage)].img}`)">
            </div>
            <div v-else @change="indexImage = '0'">
              <img :src="require(`~/assets/images/landing/crypto/${$t('crypto.locker_start.list_tabs')[Number(tabPosition)].list_process[0].img}`)">
            </div>
            <div>
              <div v-for="(item, idx) in $t('crypto.locker_start.list_tabs')[Number(tabPosition)].list_process" :key="idx" class="">
                <div>
                  <div v-if="currentPosition === tabPosition" class="flex">
                    <div :class="( idx.toString() === indexImage) ? 'text-[#FFFFFF]' : 'text-[#979797]'" @click="displayImage(idx)">
                      <span class="index-image bg-[#DFDFDF] landing-font-16 py-2 px-[15px] h-[42px]" style="border-radius: 50%" :class="( idx.toString() === indexImage) ? 'bg-[#268334]' : 'bg-[#DFDFDF]'">
                        {{ idx + 1 }}
                      </span>
                      <div v-if="(idx + 1) < $t('crypto.locker_start.list_tabs')[Number(tabPosition)].list_process.length " :class="item.detail != '' ? 'button-index-detail': 'button-index'" :style="( idx.toString() === indexImage) ? 'border-left-color:#268334' : 'border-left-color: #DFDFDF'" />
                    </div>
                    <div class="ml-4">
                      <div class="landing-font-18 font-semibold" :class="( idx.toString() === indexImage) ? 'text-[#268334]' : 'text-[#979797]'">
                        {{ item.name_item }}
                      </div>
                      <div v-if="item.detail !== ''" class="mt-2">
                        <div v-for="(sub_item, i) in item.detail" :key="i.toString()+sub_item" class="mb-1 flex" :class="( idx.toString() === indexImage) ? 'text-[#268334]' : 'text-[#979797]'">
                          <div class="icon-elipse" :class="( idx.toString() === indexImage) ? 'border-color-[#268334]' : 'border-color-[#979797]'" />
                          <div class="landing-font-14 font-normal ml-2">{{ sub_item }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="flex" @change="indexImage = '0'">
                    <div :class="( idx === 0) ? 'text-[#FFFFFF]' : 'text-[#979797]'" @click="displayImage(idx)">
                      <span class="index-image landing-font-16 py-2 px-[15px] h-[42px]" style="border-radius: 50%" :class="( idx === 0) ? 'bg-[#268334]' : 'bg-[#DFDFDF]'">
                        {{ idx + 1 }}
                      </span>
                      <div v-if="(idx + 1) < $t('crypto.locker_start.list_tabs')[Number(tabPosition)].list_process.length " :class="item.detail != '' ? 'button-index-detail': 'button-index'" :style="( idx === 0) ? 'border-left-color:#268334' : 'border-left-color: #DFDFDF'" />
                    </div>
                    <div class="ml-4">
                      <div class="landing-font-18 font-semibold" :class="( idx === 0) ? 'text-[#268334]' : 'text-[#979797]'">
                        {{ item.name_item }}
                      </div>
                      <div v-if="item.detail !== ''" class="mt-2">
                        <div v-for="(sub_item, i) in item.detail" :key="i.toString()+sub_item" class="mb-1 flex" :class="( idx === 0) ? 'text-[#268334]' : 'text-[#979797]'">
                          <div class="icon-elipse" :class="( idx === 0) ? 'border-color-[#268334]' : 'border-color-[#979797]'" />
                          <div class="landing-font-14 font-normal ml-2">{{ sub_item }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="py-[120px]">
      <div
        class="w-full rounded-lg py-[56px] px-[72px] flex justify-between align-middle md:flex-row flex-col bg-[#F5F6F7]"
      >
        <div>
          <h2 class="landing-font-28 font-bold mb-3 sm:text-left text-center">{{ $t('crypto.cta.title') }}</h2>
        </div>
        <nuxt-link
          class="landing-btn"
          :to="localeRoute({name: $t('crypto.cta.btn.link')})"
          style="align-self: center"
        >
          {{ $t('crypto.cta.btn.text') }}
        </nuxt-link>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  layout: 'landing',
  data () {
    return {
      tabPosition: '0',
      indexImage: '0',
      currentPosition: '0',
      itemClicked: '0'
    }
  },
  methods: {
    displayImage (idx) {
      this.currentPosition = this.tabPosition
      this.indexImage = idx.toString()
    }
  }
}
</script>
<style>
.locker-start .process-tab .menu-tab-menu .el-radio-group{
  background: rgba(0, 0, 0, 0.04);
  border-radius: 50px;
}
.locker-start .process-tab .menu-tab-menu .el-radio-button__inner{
  background: rgba(0, 0, 0, 0.04);
  padding: 20px;
  border: none !important;
}
.locker-start .process-tab .menu-tab-menu .el-radio-button__orig-radio:checked + .el-radio-button__inner{
  color: #268334;
  background: #FFFFFF;
  border-radius: 50px;
  box-shadow: none !important;
}
.locker-start .process-tab .menu-tab-menu .is-active{
  background: rgba(0, 0, 0, 0.04);
}
.locker-start .process-tab .menu-tab-menu .el-radio-button__orig-radio {
  border-radius: 50px;
  border: none !important;
  background: rgba(0, 0, 0, 0.04);
  box-shadow: none !important;
}
.border-span-0 span{
  border-top-left-radius: 50px !important;
  border-bottom-left-radius: 50px !important;
}
.locker-start .process-tab .is-active.border-span-0{
  border-top-left-radius: 50px !important;
  border-bottom-left-radius: 50px !important;
}
.locker-start .process-tab .is-active.border-span-2{
  border-top-right-radius: 50px !important;
  border-bottom-right-radius: 50px !important;
}
.border-span-2 span{
  border-top-right-radius: 50px !important;
  border-bottom-right-radius: 50px !important;
}
.button-index{
  border-left-width: 2px;
  border-left-style: dashed;
  height: 72px;
  margin-left: 17px;
}
.button-index-detail{
  border-left-width: 2px;
  border-left-style: dashed;
  height: 135px;
  margin-left: 17px;
}
.change-color-current-process{
  color: #268334 !important;
}
.icon-elipse{
  border-width: 1px;
  border-style: solid;
  height:6px;
  width: 6px;
  border-radius: 50%;
  margin-top: 10px;
}
@media screen and (max-width: 767px){
  .locker-start .process-tab .menu-tab-menu .el-radio-group{
    background:#F8F9FA ;
  }
  .locker-start .process-tab .menu-tab-menu .el-radio-button{
    margin-bottom: 30px;
  }
  .locker-start .process-tab .menu-tab-menu .el-radio-button__inner{
    padding: 10px;
  }
  .locker-start .process-tab .menu-tab-menu  .el-radio-button__inner>div{
    font-size: 14px;
  }
  .border-span-0 span{
   border-radius: 0px;
  }
  .border-span-2 span{
    border-radius: 0px;
  }
  .locker-start .process-tab .is-active.border-span-0{
    border-radius: 0px;
  }
  .locker-start .process-tab .is-active.border-span-2{
    border-radius: 0px;
  }
}
</style>
