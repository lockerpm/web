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
        <span v-if="haveData">{{ $t('data.tools.weak_passwords_found') }}</span>
      </div>
      <div>
        <span v-if="noData">{{ $t('data.tools.good_news_details') }}</span>
        <span v-if="haveData">{{ $t('data.tools.weak_passwords_found_details', {data: haveData}) }}</span>
      </div>
    </div>
    <client-only>
      <el-table
        ref="multipleTable"
        :data="weakPasswordCiphers || []"
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
            <PasswordStrength :score="passwordStrengthMap.get(scope.row.id)" />
          </template>
        </el-table-column>
      </el-table>
    </client-only>
  </div>
</template>

<script>
import Vnodes from '../../../components/Vnodes'
import PasswordStrength from '../../../components/password/PasswordStrength'
export default {
  components: {
    PasswordStrength, Vnodes
  },
  props: {
    passwordStrengthMap: {
      type: Map,
      default () {
        return new Map()
      }
    },
    weakPasswordCiphers: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    haveData () {
      return this.weakPasswordCiphers && this.weakPasswordCiphers.length
    },
    noData () {
      return this.weakPasswordCiphers && this.weakPasswordCiphers.length === 0
    }
  },
  mounted () {
  }
}
</script>
