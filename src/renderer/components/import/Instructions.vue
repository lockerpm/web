<template>
  <div v-if="format && instructions.valid" class="locker-callout locker-callout-info">
    <div class="mb-2 font-semibold">{{ title }}</div>

    <div v-if="instructions.link">
      {{ $t('data.instructions.see_details') }}
      <a
        target="_blank"
        rel="noopener"
        :href="instructions.link"
      >
        {{ instructions.link }}
      </a>
    </div>

    <div
      v-else
      v-html="instructions.text"
    />
  </div>
</template>

<script>
export default {
  props: {
    format: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    instructions () {
      let key = this.format
      if (['bitwardencsv', 'bitwardenjson'].includes(key)) {
        key = 'bitwarden'
      } else if (['dashlanecsv', 'dashlanejson'].includes(key)) {
        key = 'dashlane'
      } else if (['enpasscsv', 'enpassjson'].includes(key)) {
        key = 'enpass'
      } else if (['1password1pif', '1passwordwincsv', '1passwordmaccsv'].includes(key)) {
        key = '1password'
      }
      let link = this.$t(`data.instructions.${key}_link`)
      if (link === `data.instructions.${key}_link`) {
        link = ''
      }
      let text = this.$t(`data.instructions.${key}`)
      if (text === `data.instructions.${key}`) {
        text = ''
      }
      return {
        valid: !!link || !!text,
        link,
        text
      }
    }
  }
}
</script>
