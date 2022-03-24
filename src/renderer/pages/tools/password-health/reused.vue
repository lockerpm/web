<template>
  <div>
    <div
      class="locker-callout mb-8"
      :class="{
        'locker-callout-success': noData,
        'locker-callout-danger': haveData
      }"
    >
      <div
        class="mb-2 font-semibold"
        :class="{
          'text-success': noData,
          'text-danger': haveData
        }"
      >
        <span v-if="noData">{{ $t('data.tools.good_news') }}</span>
        <span v-if="haveData">{{ $t('data.tools.reused_passwords_found') }}</span>
      </div>
      <div>
        <span v-if="noData">{{ $t('data.tools.good_news_reused_details') }}</span>
        <span v-if="haveData">{{ $t('data.tools.reused_passwords_found_details', {data: haveData}) }}</span>
      </div>
    </div>
    <client-only>
      <!-- <el-table
        ref="multipleTable"
        :data="reusedPasswordCiphers || []"
        style="width: 100%"
        row-class-name="hover-table-row"
        :show-header="false"
      >
        <el-table-column
          prop="name"
          label=""
        >
          <template slot-scope="scope">
            <div class="flex items-center">
              <div
                class="text-[34px] mr-3 flex-shrink-0"
                :class="{'filter grayscale': scope.row.isDeleted}"
              >
                <Vnodes :vnodes="getIconCipher(scope.row, 34)" />
              </div>
              <div class="flex flex-col">
                <a
                  class="text-black font-semibold truncate flex items-center"
                  :class="{'opacity-80': scope.row.isDeleted}"
                  @click="routerCipher(scope.row)"
                >
                  {{ scope.row.name }}
                  <img v-if="scope.row.organizationId" src="~/assets/images/icons/shares.svg" alt="Shared" :title="$t('common.shared_with_you')" class="inline-block ml-2">
                </a>
                <div>
                  {{ scope.row.subTitle }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label=""
        >
          <template slot-scope="scope">
            <span class="label label-warning-light">
              {{ $t('data.tools.used') }} {{ passwordUseMap.get(scope.row.login.password) }} {{ $t('data.tools.times') }}
            </span>
          </template>
        </el-table-column>
      </el-table> -->
      <RecycleScroller
        ref="list"
        page-mode
        :item-size="65"
        :items="reusedPasswordCiphers || []"
      >
        <template #default="{item}">
          <div class="td">
            <div class="flex items-center">
              <div
                class="text-[34px] mr-3 flex-shrink-0"
                :class="{'filter grayscale': item.isDeleted}"
              >
                <Vnodes :vnodes="getIconCipher(item, 34)" />
              </div>
              <div class="flex flex-col">
                <a
                  class="text-black font-semibold truncate flex items-center"
                  :class="{'opacity-80': item.isDeleted}"
                  @click="routerCipher(item, addEdit)"
                >
                  {{ item.name }}
                  <img
                    v-if="item.organizationId"
                    src="~/assets/images/icons/shares.svg"
                    alt="Shared"
                    :title="$t('common.shared_with_you')"
                    class="inline-block ml-2"
                  >
                </a>
                <div>
                  {{ item.subTitle }}
                </div>
              </div>
            </div>
          </div>
          <div class="td">
            <span class="label label-warning-light">
              {{ $t('data.tools.used') }} {{ passwordUseMap.get(item.login.password) }} {{ $t('data.tools.times') }}
            </span>
          </div>
        </template>
      </RecycleScroller>
    </client-only>
  </div>
</template>

<script>
import Vnodes from '../../../components/Vnodes'
export default {
  components: {
    Vnodes
  },
  props: {
    passwordUseMap: {
      type: Map,
      default () {
        return new Map()
      }
    },
    reusedPasswordCiphers: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    haveData () {
      return this.reusedPasswordCiphers && this.reusedPasswordCiphers.length
    },
    noData () {
      return this.reusedPasswordCiphers && this.reusedPasswordCiphers.length === 0
    }
  }
}
</script>
