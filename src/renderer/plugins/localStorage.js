import createPersistedState from 'vuex-persistedstate'

export default ({ store, app, isDev }) => {
  const environment = isDev ? 'dev' : process.env.environment
  window.onNuxtReady(() => {
    // let options = {
    //   key: 'cs_locker_store',
    //   paths: []
    // }
    // if (process.env.CS_ENV === 'web') {
    //   options = {
    //     key: 'cs_locker_store',
    //     paths: [],
    //     storage: {
    //       getItem: key => app.$cookies.get(key),
    //       setItem: (key, value) => {
    //         // remove notifications because of too large to store in cookie
    //         const obj = JSON.parse(value)
    //         delete obj.notifications
    //         delete obj.userIntercom
    //         if (obj.user) {
    //           // eslint-disable-next-line camelcase
    //           const { language, is_factor2 } = obj.user
    //           obj.user = {
    //             language,
    //             avatar: '',
    //             is_factor2
    //           }
    //         }
    //
    //         const result = JSON.stringify(obj)
    //
    //         return app.$cookies.set(key, result, { path: '/', ...environment === '' ? { secure: true } : { secure: false } })
    //       },
    //       removeItem: key => app.$cookies.remove(key)
    //     }
    //   }
    // }
    createPersistedState({
      key: 'cs_locker_store',
      paths: [],
      storage: {
        getItem: key => app.$cookies.get(key),
        setItem: (key, value) => {
          // remove notifications because of too large to store in cookie
          const obj = JSON.parse(value)
          delete obj.notifications
          delete obj.userIntercom
          delete obj.currentPlan
          if (obj.user) {
            // eslint-disable-next-line camelcase
            const { language, is_factor2, email, avatar } = obj.user
            obj.user = {
              language,
              avatar,
              is_factor2,
              email
            }
          }

          const result = JSON.stringify(obj)

          return app.$cookies.set(key, result, {
            path: '/',
            ...(environment === '' ? { secure: true } : { secure: false })
          })
        },
        removeItem: key => app.$cookies.remove(key)
      }
    })(store)
  })
}
