<template>
  <div>
    <section class="bg-welcome full-width h-auto pt-[76px] bg-center bg-cover bg-no-repeat" :style="{backgroundImage: `url(${require(`~/assets/images/landing/crypto/bg-frame.png`)})`}">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-1 text-center gap-x-0">
          <div class="pt-28">
            <div class="landing-font-60 font-bold text-[#161922]">
              {{ $t('crypto.bg_welcome.title') }}
            </div>
            <div class="landing-font-18 font-normal text-[#3A3A3A] pt-4">
              {{ $t('crypto.bg_welcome.subtitle') }}
            </div>
            <div class="pt-12 pb-28">
              <a
                class="landing-btn"
                href="https://buy.stripe.com/cN26s3gbefi1c92fYZ"
                style="align-self: center"
              >
                {{ $t('crypto.bg_welcome.btn.text') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="warning py-10 full-width h-auto bg-[#F5F7F9]">
      <div class="w-full text-center">
        <img
          src="~/assets/images/landing/crypto/CaretDoubleDown.svg"
          class="mx-auto mt-5 mb-6 h-9"
        >
        <h2 class="font-semibold landing-font-42 mx-auto mb-10 text-red">
          {{ $t('crypto.warning.title') }}
        </h2>
        <div class="font-normal landing-font-18 mx-auto mb-10 max-w-[830px]">
          {{ $t('crypto.warning.subtitle') }}
        </div>
        <img
          src="~/assets/images/landing/crypto/Vengang.png"
          class="mx-auto mb-20 max-w-[900px]"
        >
        <h2
          class="font-bold landing-font-42 mx-auto mb-[60px]"
          v-html="$t('crypto.warning.what_if')"
        />
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-3 gap-x-16 justify-items-center">
            <div
              v-for="(item, index) in $t('crypto.warning.consequences')"
              :key="index"
              class="items-center"
            >
              <img :src="require(`~/assets/images/landing/crypto/${item.image}`)" class="h-[51px] mb-5">
            </div>
            <div
              v-for="(item, index) in $t('crypto.warning.consequences')"
              :key="index"
              class="landing-font-18 font-normal mb-20"
              v-html="item.conq"
            />
          </div>
          <a
            class="landing-btn mb-24"
            href="https://buy.stripe.com/cN26s3gbefi1c92fYZ"
            style="align-self: center"
          >
            {{ $t('crypto.warning.btn_text1') }}
          </a>
        </div>
      </div>
    </section>

    <section class="sale-pitch full-width">
      <h1
        class="w-full text-center font-semibold landing-font-60 mx-auto mt-28 mb-20"
        v-html="$t('crypto.sale_pitch.title')"
      />
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-[100px]">
          <div v-if="locale==='en'" class="max-w-[516px]">
            <h2
              class="font-semibold landing-font-42 mb-10"
              v-html="$t('crypto.sale_pitch.overall.title')"
            />
            <div class="font-normal landing-font-18 max-w-[450px]">
              {{ $t('crypto.sale_pitch.overall.desc') }}
            </div>
          </div>
          <div v-else class="max-w-[570px]">
            <h2
              class="font-semibold landing-font-42 mb-10"
              v-html="$t('crypto.sale_pitch.overall.title')"
            />
            <div class="font-normal landing-font-18 max-w-[450px]">
              {{ $t('crypto.sale_pitch.overall.desc') }}
            </div>
          </div>
          <img
            src="~/assets/images/landing/crypto/red-shirt-gray-laptop.png"
            class="max-w-[345px]"
          >
        </div>

        <h3
          class="w-full text-center font-semibold landing-font-34 mx-auto mb-20"
          v-html="$t('crypto.sale_pitch.common_reason.title')"
        />
        <div class="flex justify-between items-center">
          <img
            src="~/assets/images/landing/crypto/green-pants-grey-laptop.png"
            class="max-w-[345px]"
          >
          <div>
            <div
              v-for="(item, index) in $t('crypto.sale_pitch.common_reason.reason')"
              :key="index"
              class="items-center"
            >
              <div class="flex max-w-[560px] mb-[52px]">
                <img :src="require(`~/assets/images/landing/crypto/XCircle.svg`)" class="h-[32px] mr-[10px]">
                <div class="landing-font-18 font-normal">
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sale-pitch-hard-sol full-width bg-[#F5F7F9]">
      <div class="max-w-6xl mx-auto mt-16">
        <div class="flex justify-between">
          <div class="">
            <h2
              v-if="locale==='en'"
              class="font-semibold landing-font-42 mb-10 max-w-[750px]"
              v-html="$t('crypto.sale_pitch.hard_sol.title')"
            />
            <h2
              v-else
              class="font-semibold landing-font-38 mb-10 max-w-[840px]"
              v-html="$t('crypto.sale_pitch.hard_sol.title')"
            />
            <div v-if="locale==='en'" class="font-normal landing-font-18 max-w-[640px] mb-20">
              {{ $t('crypto.sale_pitch.hard_sol.desc') }}
            </div>
            <div v-else class="font-normal landing-font-18 max-w-[720px] mb-20">
              {{ $t('crypto.sale_pitch.hard_sol.desc') }}
            </div>
            <a
              class="landing-btn mb-24"
              href="https://buy.stripe.com/cN26s3gbefi1c92fYZ"
              style="align-self: center"
            >
              {{ $t('crypto.warning.btn_text1') }}
            </a>
          </div>
          <img
            src="~/assets/images/landing/crypto/red-shirt-despair.png"
            class="max-w-[340px]"
          >
        </div>
      </div>
    </section>

    <section class="sale-pitch-pitch py-10 full-width h-auto mt-[130px]">
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-between">
          <img
            src="~/assets/images/landing/crypto/green-shirt-shill.png"
            class="max-w-[350px]"
          >
          <div class="max-w-[710px]">
            <h2
              class="w-full font-bold landing-font-38 mb-[27px]"
              v-html="$t('crypto.sale_pitch.pitch.title')"
            />
            <div class="font-normal landing-font-22 max-w-[630px] mb-20">
              {{ $t('crypto.sale_pitch.pitch.desc') }}
            </div>
            <div
              v-for="(item, index) in $t('crypto.sale_pitch.pitch.detail')"
              :key="index"
              class="items-center"
            >
              <div class="flex max-w-[670px] mb-[50px]">
                <img :src="require(`~/assets/images/landing/crypto/CheckCircle.svg`)" class="h-[32px] mr-[10px]">
                <div class="landing-font-18 font-normal">
                  {{ item }}
                </div>
              </div>
            </div>
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
            <a
              class="landing-btn"
              href="https://buy.stripe.com/cN26s3gbefi1c92fYZ"
              style="align-self: center"
            >
              {{ $t('crypto.introduce_crypto.btn.text') }}
            </a>
          </div>
        </div>
        <div>
          <img v-if="locale==='en'" :src="require(`~/assets/images/landing/crypto/en/${item.img}`)" alt="">
          <img v-else :src="require(`~/assets/images/landing/crypto/vi/${item.img}`)" alt="">
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
            <div v-if="tabPosition === currentPosition" class="w-4/5 m-auto">
              <img v-if="locale==='en'" :src="require(`~/assets/images/landing/crypto/en/${$t('crypto.locker_start.list_tabs')[Number(tabPosition)].list_process[Number(indexImage)].img}`)" class="w-[70%] m-auto">
              <img v-else :src="require(`~/assets/images/landing/crypto/vi/${$t('crypto.locker_start.list_tabs')[Number(tabPosition)].list_process[Number(indexImage)].img}`)" class="w-[70%] m-auto">
            </div>
            <div v-else class="w-4/5 m-auto" @change="indexImage = '0'">
              <img v-if="locale==='en'" :src="require(`~/assets/images/landing/crypto/en/${$t('crypto.locker_start.list_tabs')[Number(tabPosition)].list_process[0].img}`)" class="w-[70%] m-auto">
              <img v-else :src="require(`~/assets/images/landing/crypto/vi/${$t('crypto.locker_start.list_tabs')[Number(tabPosition)].list_process[0].img}`)" class="w-[70%] m-auto">
            </div>
            <div>
              <div v-for="(item, idx) in $t('crypto.locker_start.list_tabs')[Number(tabPosition)].list_process" :key="idx" class="">
                <div>
                  <div v-if="currentPosition === tabPosition" class="flex">
                    <div :class="( idx.toString() === indexImage) ? 'text-[#FFFFFF]' : 'text-[#979797]'" @click="displayImage(idx)">
                      <span class="index-image bg-[#DFDFDF] landing-font-16 py-2 px-[15px] h-[42px]" style="border-radius: 50%" :style="( idx.toString() === indexImage) ? ' background-image: radial-gradient(#268334 55%, #D9EADC 45%);' : 'background:#DFDFDF'">
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
                      <span class="index-image landing-font-16 py-2 px-[15px] h-[42px]" style="border-radius: 50%" :style="( idx === 0) ? ' background-image: radial-gradient(#268334 55%, #D9EADC 45%);' : 'background:#DFDFDF'">
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

    <section class="guarantee py-[100px] full-width h-auto">
      <div
        class="max-w-6xl mx-auto rounded-[10px] py-[40px] px-[122px]"
        style="box-shadow: 5px 6px 32px rgba(0, 0, 0, 0.12);"
      >
        <div class="flex justify-between items-center max-w-[865px]">
          <img
            src="~/assets/images/landing/crypto/guarantee.svg"
            class="h-[250px]"
          >
          <div class="max-w-[540px]">
            <div
              class="landing-font-18 !leading-6 font-normal"
              v-html="$t('crypto.trial.desc')"
            />
          </div>
        </div>
      </div>
      <div class="mt-10">
        <div class="flex justify-center">
          <div class="landing-font-18 font-normal mr-[12px]">
            {{ $t('crypto.compability.desc') }}
          </div>
          <div
            v-for="(item, index) in $t('crypto.compability.icon_list')"
            :key="index"
            class="items-center flex justify-between gap-x-[6px]"
          >
            <img :src="require(`~/assets/images/landing/crypto/${item}`)" class="h-[28px]">
          </div>
        </div>
      </div>
    </section>

    <section class="cta full-width py-[90px] bg-[#268334]">
      <div class="max-w-[960px] mx-auto">
        <div
          class="landing-font-60 font-semibold text-center text-white"
          v-html="$t('crypto.cta.title')"
        />
      </div>
      <div class="flex justify-center items-center mt-[60px]">
        <a
          class="landing-btn"
          href="https://buy.stripe.com/cN26s3gbefi1c92fYZ"
          style="background-color: white; color: #268334;"
        >
          <div class="flex justify-center items-center px-[29px]">
            <img :src="require(`~/assets/images/landing/crypto/ShoppingCart.svg`)" class="h-[32px] mr-3">
            {{ $t('crypto.cta.btn.text2') }}
          </div>
        </a>
      </div>
    </section>

    <section class="final-pitch full-width py-[90px]">
      <div class="max-w-6xl h-[320px] flex justify-center items-center mx-auto bg-center bg-cover bg-no-repeat" :style="{backgroundImage: `url(${require(`~/assets/images/landing/crypto/final-pitch.png`)})`}">
        <div class="px-[130px]">
          <div class="landing-font-32 font-bold text-center text-white">
            {{ $t('crypto.final_pitch.desc1') }}
          </div>
          <div class="landing-font-32 font-bold text-center text-white">
            <a
              href="https://buy.stripe.com/cN26s3gbefi1c92fYZ"
            >
              <span class="text-[#F1D75B]">
                {{ $t('crypto.final_pitch.desc2') }}
              </span>
            </a>
            <span>
              {{ $t('crypto.final_pitch.desc3') }}
            </span>
          </div>
        </div>
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
.locker-start .process-tab .menu-tab-menu .el-radio-button{
  cursor: pointer;
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
.index-image:hover{
  cursor: pointer;
}
@media screen and (max-width: 768px){
  .locker-start .process-tab .menu-tab-menu .el-radio-group{
    background:#F8F9FA ;
  }
  .locker-start .process-tab .menu-tab-menu .el-radio-button{
    margin-bottom: 30px;
    margin-left: 10px;
  }
  .locker-start .process-tab .menu-tab-menu .el-radio-button__inner{
    padding: 10px;
    border-radius: 50px;
  }
  .locker-start .process-tab .menu-tab-menu  .el-radio-button__inner>div{
    font-size: 14px;
  }
  .border-span-0 span{
    border-radius: 50px !important;
  }
  .border-span-2 span{
    border-radius: 50px !important;
  }
  .locker-start .process-tab .is-active.border-span-0{
    border-radius: 50px !important;
  }
  .locker-start .process-tab .is-active.border-span-2{
    border-radius: 50px !important;
  }
  .locker-start .process-tab .menu-tab-menu .is-active{
    background: #FFFFFF;
    border-radius: 50px;
  }
}
</style>
