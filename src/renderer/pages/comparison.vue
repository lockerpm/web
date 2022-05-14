<template>
  <div class="pt-[176px] ">
    <div class="mb-[72px] font-bold landing-font-48 text-black text-center">
      {{ $t('comparison.title') }}
    </div>
    <div class="table-fixed">
      <table class="border-collapse border border-slate-200 table-auto">
        <thead>
          <tr>
            <th style="width: 200px"/>
            <th
              v-for="(item, index) in $t('comparison.list_company')"
              :key="index"
              class="font-bold landing-font-18 px-[21px] py-[24px] border border-slate-200"
              :style="index != 0 ? 'color: #161922;': 'color: #268334; background: #E7F5E8;'"
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
              <td class="py-[28px] px-[19px] border border-slate-200" style="line-height: 22px !important; border-left-width: 0.5px;border-right-width: 0.5px;">{{ service }}</td>
              <td
                v-for="(detail, id) in item.details_services"
                :key="id"
                class="font-normal text-center py-7 px-5 font-landing-16 border border-slate-200"
                style="line-height: 22px !important; border-left-width: 0.5px;border-right-width: 0.5px;"
                :style="id == 0 ? 'background: #E7F5E8;' : ''"
              >
                {{ detail[idx] }}
              </td>
            </tr>
          </client-only>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'landing'
}
</script>
