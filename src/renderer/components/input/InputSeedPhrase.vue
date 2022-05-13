<template>
  <div class="grid grid-cols-3 gap-2">
    <el-input
      v-for="(w, index) in words"
      :key="index"
      :value="w"
    />
  </div>
</template>

<script>
const MAX_WORD_COUNT = 24
const MIN_WORD_COUNT = 12
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      wordCount: MIN_WORD_COUNT
    }
  },
  computed: {
    words () {
      return this.value.split(' ').map(w => w ? w.trim() : '')
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>

</style>
