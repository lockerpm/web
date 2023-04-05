<template>
  <div class="setting-wrapper">
    <div class="setting-section">
      <div class="setting-section-header" @click="collapsed = !collapsed">
        <div class="text-head-5 font-semibold">
          {{ $t('data.settings.account_password') }}
        </div>
        <div>
          <a href="https://id.locker.io/security/password" target="_blank" class="mr-4">
            <button
              class="btn btn-default md:mb-0"
              @onclick="() => collapsed = !collapsed"
            >
              <span><i class="fas fa-key mr-2" />{{ $t('data.settings.change_password') }}</span>
            </button>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      collapsed: false
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
  }
}
</script>
