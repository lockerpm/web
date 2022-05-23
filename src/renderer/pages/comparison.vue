<template>
  <div class="pt-[176px] ">
    <div class="mb-[72px] font-bold landing-font-48 text-black text-center">
      {{ $t('comparison.title') }}
    </div>
    <div class="table-fixed">
      <table class="border-collapse border table-auto" style="border-color:#DFDFDF">
        <thead>
          <tr>
            <th style="width: 200px" />
            <th
              v-for="(item, index) in $t('comparison.list_company')"
              :key="index"
              class="font-bold landing-font-18 px-[21px] py-[24px] border "
              :style="index != 0 ? 'color: #161922;': 'color: #268334; background: #E7F5E8;'"
              style="border-color:#DFDFDF"
            >
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody>
          <client-only v-for="(item, index) in $t('comparison.compare_services')" :key="item.status + index">
            <tr style="background: #FBFAF3;" class="w-full uppercase">
              <td class="py-[17px] px-5 font-landing-16 font-bold" style="color: #268334; line-height: 22px !important;" colspan="8">{{ item.status }}</td>
            </tr>
            <tr v-for="(service, idx) in item.list_services" :key="service + idx">
              <td class="py-[28px] px-[19px] border" style="line-height: 22px !important; border-left-width: 0.5px;border-right-width: 0.5px; border-color:#DFDFDF !important">{{ service }}</td>
              <td
                v-for="(detail, id) in item.details_services"
                :key="id"
                class="font-normal text-center py-7 px-5 font-landing-16 border"
                style="line-height: 22px !important; border-left-width: 0.5px;border-right-width: 0.5px; border-color:#DFDFDF"
                :style="id == 0 ? 'background: #E7F5E8;' : ''"
              >
                <span v-if="detail[idx] === 'Yes' || detail[idx] === 'Khả dụng'">
                  <img src="~/assets/images/landing/comparison/icon-yes.svg" class="m-auto">
                </span>
                <span v-else-if="detail[idx] === 'No' || detail[idx] === 'Không khả dụng'">
                  <img src="~/assets/images/landing/comparison/icon-no.svg" class="m-auto">
                </span>
                <span v-else-if="detail[idx] === '>=5'">
                  <img src="~/assets/images/landing/comparison/icon-bigger.svg" class="m-auto inline-block">
                  <span>5</span>
                </span>
                <span v-else>
                  {{ detail[idx] }}
                </span>
              </td>
            </tr>
          </client-only>
        </tbody>
      </table>
    </div>
    <div
      class="full-width w-full h-auto pb-[105px] md:mt-[150px] mt-24"
      style="background-color: #f5f6f7"
    >
      <section class="max-w-6xl mx-auto px-6">
        <div class="w-full flex flex-wrap">
          <div class="w-full md:mb-0 md:pt-[115px] pt-20 text-center order-1">
            <h2 class="w-full font-bold landing-font-38 text-black mb-[45px] max-w-[790px] mx-auto">
              {{ $t('landing.start.title') }}
            </h2>
          </div>
          <div class="w-full md:w-10/12 mx-auto flex flex-wrap order-2 gap-x-[30px] gap-y-[45px] justify-center">
            <div
              v-for="(item, index) in $t('landing.start.options')"
              :key="index"
              class=" landing-transition p-12 w-full md:w-[380px] bg-white relative z-10 rounded-xl hover:shadow-xl"
            >
              <img
                :src="require(`~/assets/images/landing/index/${item.img}`)"
                :alt="item.title"
                class="mb-[20px] h-[100px] w-auto mx-auto"
              >

              <h3 class="text-center landing-font-20 font-bold mb-[11px]">
                {{ item.title }}
              </h3>

              <p class="text-center text-black-600 landing-font-16 mb-[40px]">
                {{ item.desc }}
              </p>

              <div class="w-full flex">
                <a
                  :class="index === 0 ? 'landing-btn' : 'landing-btn2'"
                  class="mx-auto"
                  :href="item.btn.link"
                  style="align-self: center"
                >
                  {{ item.btn.text }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'landing'
}
</script>
