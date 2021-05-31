<template>
  <div v-loading="loading" class="flex flex-col flex-column-fluid relative">
    <div class="flex-column-fluid lg:px-28 py-10 px-10 mb-20">
      <div class="mb-5">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
            :to="localeRoute({name: 'tools'})"
          >
            Tools
          </el-breadcrumb-item>
          <el-breadcrumb-item
            :to="localeRoute({name: 'tools-breach'})"
          >
            Data Breach Scanner
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div v-if="!loading" class="locker-callout mb-8"
           :class="{
             'locker-callout-success': noData,
             'locker-callout-danger': haveData
           }"
      >
        <div class="mb-2 font-semibold"
             :class="{
               'text-success': noData,
               'text-danger': haveData
             }"
        >
          <span v-if="noData">GOOD NEWS</span>
          <span v-if="haveData">BREACHED ACCOUNTS FOUND</span>
        </div>
        <div>
          <span v-if="noData">
            {{ currentUser.email }} was not found in any known data breaches.
          </span>
          <span v-if="haveData">
            {{ currentUser.email }} was found in {{ breach.length }} different data breaches online.
          </span>
        </div>
      </div>
      <div v-if="breach.length" class="setting-wrapper">
        <div v-for="(item, index) in breach"
             :key="index"
             class="setting-section"
        >
          <div class="setting-section-header">
            <div class="grid grid-cols-12 gap-x-4">
              <div class="col-span-2">
                <img :src="item.logo_path" alt="" class="mr-3">
              </div>
              <div class="col-span-7">
                <div class="setting-title mb-2">
                  {{ item.name }}
                </div>
                <div class="setting-description mb-2" v-html="item.description" />
                <div class="setting-description">
                  Compromised data:
                  <ul class="list-disc list-inside">
                    <li v-for="(data, iData) in item.data_classes" :key="iData">{{ data }}</li>
                  </ul>
                </div>
              </div>
              <div class="col-span-3">
                <div class="font-semibold">
                  Website
                </div>
                <div class="text-black-600">
                  {{ item.domain }}
                </div>
                <div class="font-semibold">
                  Affected Users
                </div>
                <div class="text-black-600">
                  {{ item.pwn_count | formatNumber }}
                </div>
                <div class="font-semibold">
                  Breach Occurred
                </div>
                <div class="text-black-600">
                  {{ $moment(item.breach_date).format('LL') }}
                </div>
                <div class="font-semibold">
                  Breach Reported
                </div>
                <div class="text-black-600">
                  {{ $moment(item.added_date).format('LL') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      breach: [],
      loading: true
    }
  },
  computed: {
    haveData () {
      return !this.loading && this.breach.length
    },
    noData () {
      return !this.loading && this.breach.length === 0
    }
  },
  mounted () {
    this.checkBreach()
  },
  methods: {
    async checkBreach () {
      this.loading = true
      try {
        this.breach = await this.$axios.$post('cystack_platform/pm/tools/breach', {
          email: this.currentUser.email
        })
      } catch {

      } finally {
        this.loading = false
      }
    }
  }
}
</script>
