import Vue from 'vue'
import { nanoid } from 'nanoid'

Vue.mixin({
  methods: {
    randomString () {
      return nanoid()
    },

    clipboardSuccessHandler () {
      this.notify(this.$t('common.copied'), 'success')
    },

    phoneNotRequiredValidator (_, value, callback) {
      const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/
      if (!value.match(phoneRegex)) {
        return callback(new Error('Invalid phone number'))
      }

      return callback()
    },

    validateEmail (email) {
      // eslint-disable-next-line no-useless-escape
      if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
        return true
      }
      return false
    },

    objectKeysSnakeToCamel (obj) {
      function snakeToCamel (str) {
        return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      }
      const camelCaseObj = {}
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const camelCaseKey = snakeToCamel(key)
          camelCaseObj[camelCaseKey] = obj[key]
        }
      }
      return camelCaseObj
    }
  }
})
