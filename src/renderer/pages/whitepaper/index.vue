<template>
  <div>WhitePaper</div>
</template>
<script>
export default {
  layout: 'whitepaper',
  fetch ({ redirect }) {
    const language = this.$store.state.i18n.locale
    if (language === 'en') {
      redirect(301, '/whitepaper/What-is-Locker-Password-Manager-715b7495e91344cf9cffe420c1912ade')
    } else {
      redirect(301, '/whitepaper/Locker-Password-Manager-e875ff4abf2d4cf5a2b59a4c7667eafb')
    }
  }
}
</script>
