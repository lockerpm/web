import Vue from 'vue'
import { SocketMessageType } from './types'

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

    clearOnPremiseCookies () {
      const baseCookiesDomain = 'locker.io'
      const cookies = [
        'on_premise_email',
        'on_premise_avatar',
        'on_premise_base_url',
        'on_premise_require_pwl',
        'on_premise_has_pwl'
      ]
      cookies.forEach(k => {
        this.$cookies.remove(k, {
          domain: baseCookiesDomain,
          path: '/'
        })
      })
    },

    setOnPremiseCookies () {
      const baseDomain = 'locker.io'
      const cookies = {
        on_premise_base_url: this.$store.state.onPremiseBaseApi?.replace(
          '/v3',
          ''
        ),
        on_premise_email: this.currentUser.email,
        on_premise_avatar: this.currentUser.avatar,
        on_premise_require_pwl: this.$store.state.requirePwl,
        on_premise_has_pwl: this.$store.state.hasPwl
      }
      Object.keys(cookies).forEach(k => {
        this.$cookies.set(k, cookies[k], {
          domain: baseDomain,
          path: '/'
        })
      })
    },

    reconnectDesktopSocket (handlers) {
      const {
        onEncryptedDataReceived,
        onOTPReceived,
        onDesktopRejected,
        onSocketError,
        onSocketClosed,
        onSocketOpen
      } = handlers
      const socketUrl = process.env.desktopWsUrl
      this.$connect(socketUrl, {
        format: 'json'
      })
      this.$options.sockets.onmessage = message => {
        const data = JSON.parse(message.data)
        switch (data.msgType) {
        case SocketMessageType.OTP_RESPONSE: {
          onOTPReceived(data.otp)
          break
        }
        case SocketMessageType.ENC_DATA_RESPONSE: {
          onEncryptedDataReceived(data.data)
          break
        }
        case SocketMessageType.DESKTOP_REJECTED: {
          onDesktopRejected()
          break
        }
        case SocketMessageType.DESKTOP_LOCKED: {
          // Do nothing
          break
        }
        case SocketMessageType.DESKTOP_LOGGED_OUT: {
          // Do nothing
          break
        }
        default:
          break
        }
      }
      this.$options.sockets.onerror = e => {
        console.log('socket error')
        onSocketError && onSocketError(e)
      }
      this.$options.sockets.onclose = e => {
        console.log('socket closed')
        onSocketClosed && onSocketClosed(e)
      }
      this.$options.sockets.onopen = () => {
        console.log('socket open')
        onSocketOpen && onSocketOpen()
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
        msgType: SocketMessageType.VERIFY_CLIENT_REQUEST,
        clientId: deviceIdentifier,
        email
      })
    },

    clearDesktopSocketHandlers () {
      delete this.$options.sockets.onmessage
      delete this.$options.sockets.onerror
      delete this.$options.sockets.onclose
    },

    disconnectDesktopSocket () {
      this.clearDesktopSocketHandlers()
      this.$disconnect()
    }
  }
})
