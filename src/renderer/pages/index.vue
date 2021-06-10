<template>
  <div>
    Landing page
    <nuxt-link :to="localeRoute({name: 'vault'})" class="btn btn-primary">
      vault
    </nuxt-link>
  </div>
</template>

<script>
export default {
  // layout: 'authenticate',
  layout: 'blank',
  asyncData ({ redirect }) {
    // redirect(302, '/vault')
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
