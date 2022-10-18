<template>
  <div class="flex flex-grow flex-col">
    <nuxt />

    <el-dialog
      :title="$t('common.warning')"
      :visible="showLocked"
      width="400px"
      custom-class="locker-dialog"
      @close="$store.commit('UPDATE_SHOW_LOCKED', false)"
    >
      {{ $t('errors.locked_until_pay') }}

      <span slot="footer">
        <el-button
          type="primary"
          @click="goToLock"
        >
          {{ $t('common.ok') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
if (process.env.CS_ENV !== 'web') {
  // eslint-disable-next-line no-var
  var { remote } = require('electron')
}

export default {
  components: {
  },
  middleware: ['LoggedIn', 'UserInfo'],
  data () {
    return {
      externalContent: ''
    }
  },
  computed: {
    showLocked () {
      return this.$store.state.showLocked
    }
  },
  mounted () {
    // this.$store.dispatch('LoadCurrentUser')
    // this.$store.dispatch('LoadCurrentUserPw')
  },
  methods: {
    openURL (url) {
      if (remote) {
        remote.shell.openExternal(url)
      }
    },
    goToLock () {
      this.$store.commit('UPDATE_SHOW_LOCKED', false)
      this.$router.push(this.localeRoute({ name: 'lock' }))
    }
  }
}
</script>
