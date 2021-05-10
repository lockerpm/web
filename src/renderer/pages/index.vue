<template>
  <div />
</template>

<script>
export default {
  layout: 'authenticate',
  asyncData ({ redirect }) {
    redirect(302, '/dashboard')
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
