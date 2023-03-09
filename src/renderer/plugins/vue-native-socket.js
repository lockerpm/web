import Vue from 'vue'
import VueNativeSock from 'vue-native-websocket'

Vue.use(VueNativeSock, 'ws://192.168.0.185:8000', {
  connectManually: true
})
