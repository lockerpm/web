import Vue from 'vue'

Vue.mixin({
  computed: {
    isOnPremise () {
      return this.$store.state.isOnPremise
    }
  },
  methods: {
    async validateOnPremiseBaseApi (baseApi) {
      try {
        await this.$axios.$post('/cystack_platform/pm/users/onpremise/host', {
          host: baseApi
        })
        return true
      } catch (e) {
        this.$store.commit('CLEAR_ALL_DATA')
        this.$router.push('/')
        this.$axios.setToken(false)
        return false
      }
    },

    reconnectDesktopSocket (handlers) {
      const { onEncryptedDataReceived } = handlers
      const socketUrl = process.env.desktopWsUrl
      this.$connect(socketUrl, {
        format: 'json'
      })
      this.$options.sockets.onmessage = message => {
        const data = JSON.parse(message.data)
        console.log(data)
        switch (data.msgType) {
        case 3: {
          // TODO
          break
        }
        case 4: {
          onEncryptedDataReceived(data.data)
          break
        }
        case 6: {
          // TODO
          break
        }
        case 7: {
          // TODO
          break
        }
        case 9: {
          // TODO
          break
        }
        default:
          break
        }
      }
    },

    sendDesktopSocketConnectionMessage (email) {
      const lockerDeviceId = this.$cookies.get('device_id')
      const deviceIdentifier = lockerDeviceId || this.randomString()
      if (!lockerDeviceId) {
        const expireTime = 50 * 365 * 24 * 3600
        this.$cookies.set('device_id', deviceIdentifier, {
          maxAge: expireTime,
          domain: 'locker.io'
        })
      }
      this.$socket.sendObj({
        msgType: 1,
        clientId: deviceIdentifier,
        email
      })
    },

    disconnectDesktopSocket () {
      delete this.$options.sockets.onmessage
      this.$disconnect()
    }
  }
})
