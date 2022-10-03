<template>
  <div class="flex flex-col flex-column-fluid relative bg-[#FBFBFC]">
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
      <div class="setting-wrapper">
        <div class="setting-section">
          <div class="setting-section-header">
            <div>
              <div class="setting-description">
                {{ $t('data.tools.breach_scanner_desc') }}
              </div>
            </div>
            <div />
          </div>
          <div class="setting-section-body">
            <div class="form-group">
              <label for="">
                {{ $t('data.tools.check_breach_title') }}
              </label>
              <input
                v-model="email"
                type="text"
                class="form-control max-w-[500px]"
                :disabled="loading"
              >
            </div>
            <div class="form-group">
              <button
                class="btn btn-primary"
                :disabled="loading || !email"
                @click="checkBreaches"
              >
                {{ $t('data.tools.check_breach_button') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-loading="loading" class="min-h-[500px] relative">
        <div
          v-if="!loading && checked"
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
            <span v-if="noData">{{ $t('data.tools.check_breach_button') }}</span>
            <span v-if="haveData">{{ $t('data.tools.breach_found') }}</span>
          </div>
          <div>
            <span v-if="noData">
              {{ $t('data.tools.breach_not_found_details', {email: email}) }}
            </span>
            <span v-if="haveData">
              {{ $t('data.tools.breach_found_details', {email: email, count: breach.length}) }}
            </span>
          </div>
        </div>
        <div v-if="breach.length" class="setting-wrapper">
          <div
            v-for="(item, index) in breach"
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      breach: [],
      loading: false,
      checked: false,
      email: ''
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
  watch: {
    currentPlan (newValue) {
      if (newValue.alias === 'pm_free') {
        this.$router.push('/vault')
      }
    }
  },
  mounted () {
    if (this.currentPlan.alias === 'pm_free') {
      this.$router.push('/vault')
    }
  },
  methods: {
    async checkBreaches () {
      this.loading = true
      this.checked = false
      try {
        this.breach = await this.$axios.$post('cystack_platform/pm/tools/breach', {
          email: this.email
        })
      } catch {

      } finally {
        this.loading = false
        this.checked = true
      }
    }
  }
}
</script>
