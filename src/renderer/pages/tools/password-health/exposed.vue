<template>
  <div v-loading="loading">
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
        <span v-if="haveData">{{
          $t('data.tools.exposed_passwords_found')
        }}</span>
      </div>
      <div>
        <span v-if="noData">
          {{ $t('data.tools.good_news_exposed_details') }}
        </span>
        <span v-if="haveData">
          {{
            $t('data.tools.exposed_passwords_found_details', { data: haveData })
          }}
        </span>
      </div>
    </div>
    <client-only>
      <!-- <el-table
        ref="multipleTable"
        :data="exposedPasswordCiphers || []"
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
              {{ $t('data.tools.exposed') }} {{ exposedPasswordMap.get(scope.row.id) | formatNumber }} {{ $t('data.tools.times') }}
            </span>
          </template>
        </el-table-column>
      </el-table> -->
      <RecycleScroller
        ref="list"
        page-mode
        :item-size="65"
        :items="exposedPasswordCiphers || []"
      >
        <template #default="{ item }">
          <div class="td">
            <div class="flex items-center">
              <div
                class="text-[34px] mr-3 flex-shrink-0"
                :class="{ 'filter grayscale': item.isDeleted }"
              >
                <Vnodes :vnodes="getIconCipher(item, 34)" />
              </div>
              <div class="flex flex-col">
                <a
                  class="text-black font-semibold truncate flex items-center"
                  :class="{ 'opacity-80': item.isDeleted }"
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
              {{ $t('data.tools.exposed') }}
              {{ exposedPasswordMap.get(item.id) | formatNumber }}
              {{ $t('data.tools.times') }}
            </span>
          </div>
        </template>
      </RecycleScroller>
    </client-only>
  </div>
</template>

<script>
import Vnodes from '../../../components/Vnodes'
import { CipherType } from '../../../jslib/src/enums'
export default {
  components: { Vnodes },
  data () {
    return {
      exposedPasswordMap: new Map(),
      loading: false
    }
  },
  computed: {
    haveData () {
      return this.exposedPasswordCiphers && this.exposedPasswordCiphers.length
    },
    noData () {
      return (
        this.exposedPasswordCiphers && this.exposedPasswordCiphers.length === 0
      )
    }
  },
  asyncComputed: {
    exposedPasswordCiphers: {
      async get () {
        this.loading = true
        const allCiphers = await this.$cipherService.getAllDecrypted()
        const exposedPasswordCiphers = []
        const promises = []
        allCiphers.forEach(c => {
          if (
            c.type !== CipherType.Login ||
            c.login.password == null ||
            c.login.password === '' ||
            c.isDeleted
          ) {
            return
          }
          const promise = this.$auditService
            .passwordLeaked(c.login.password)
            .then(exposedCount => {
              if (exposedCount > 0) {
                exposedPasswordCiphers.push(c)
                this.exposedPasswordMap.set(c.id, exposedCount)
              }
            })
          promises.push(promise)
        })
        await Promise.all(promises)
        this.loading = false
        return exposedPasswordCiphers
      },
      watch: ['$store.state.syncedCiphersToggle']
    }
  },
  methods: {}
}
</script>
