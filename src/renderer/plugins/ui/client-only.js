import Vue from 'vue'
import CircularCountDownTimer from 'vue-circular-count-down-timer'
import Clipboard from 'vue-clipboard2'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import VueYouTubeEmbed from 'vue-youtube-embed'
import VueCarousel from 'vue-carousel'

Vue.use(CircularCountDownTimer)
Vue.use(Clipboard)
Vue.component('RecycleScroller', RecycleScroller)
Vue.use(VueYouTubeEmbed, { global: true })
Vue.use(VueCarousel)
