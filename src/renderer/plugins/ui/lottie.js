import lottie from 'lottie-web'

// makes lottie api available from this.$lottie in a nuxt application
export default ({ app }, inject) => {
  inject('lottie', lottie)
}
