export const state = () => ({
  isLoggedIn: false,
  user: {
    email: null,
    language: 'vi'
  },
  notifications: {
    results: [],
    unread_count: 0,
    count: 0
  },
  userIntercom: {},
  currentPath: '/',
  previousPath: '',
  isDev: 'dev',
  environment: 'dev',
  loading: false,
  userPw: {},
  isLoggedInPw: false,
  syncedCiphersToggle: false,
  searchText: ''
})
export const mutations = {
  SET_LANG (state, payload) {
    state.user.language = payload
  },
  SET_AUTH (state, auth) {
    state.isLoggedIn = auth
  },
  UPDATE_IS_LOGGEDIN (state, value) {
    state.isLoggedIn = value
  },
  CLEAR_ALL_DATA (state) {
    // Auth
    state.isLoggedIn = false
    // // User
    state.user.full_name = ''
    state.user.email = ''
    state.user.avatar = ''
    state.user.organization = ''
    state.user.phone = ''
    state.notifications = {
      results: [],
      unread_count: 0,
      count: 0
    }
  },
  UPDATE_USER (state, user) {
    state.user = user
  },
  UPDATE_USER_PW (state, user) {
    state.userPw = user
  },
  UPDATE_USER_INTERCOM (state, userIntercom) {
    state.userIntercom = userIntercom
  },
  UPDATE_PATH (state, target) {
    state.currentPath = target
  },
  UPDATE_PREVIOUS_PATH (state, target) {
    state.previousPath = target || '/dashboard'
  },
  UPDATE_NOTIFICATION (state, payload) {
    state.notifications = payload
  },
  UPDATE_DEV (state, value) {
    state.environment = value
  },
  UPDATE_LOADING (state, loading) {
    state.loading = loading
  },
  UPDATE_IS_LOGGEDIN_PW (state, value) {
    state.isLoggedInPw = value
  },
  UPDATE_SYNCED_CIPHERS (state) {
    state.syncedCiphersToggle = !state.syncedCiphersToggle
  },
  UPDATE_SEARCH (state, value) {
    state.searchText = value
  }
}
export const actions = {
  nuxtServerInit ({ commit }, { app, isDev }) {
    const state = app.$cookies.get('cs_locker_store') || {
      isLoggedIn: false,
      user: {
        language: 'en'
      },
      currentPath: '/',
      previousPath: '/dashboard',
      userPw: {}
    }

    commit('UPDATE_IS_LOGGEDIN', state.isLoggedIn)
    commit('UPDATE_USER', state.user)
    commit('UPDATE_USER_PW', state.userPw)
    const environment = isDev ? 'dev' : (process.env.environment || '')
    commit('UPDATE_DEV', environment)
    commit('UPDATE_PATH', state.currentPath)
    commit('UPDATE_PREVIOUS_PATH', state.previousPath)
  },
  nuxtClientInit ({ commit }, { app, isDev }) {
    if (process.env.CS_ENV === 'electron') {
      const state = app.$cookies.get('cs_locker_store') || {
        isLoggedIn: false,
        user: {
          language: 'en'
        },
        currentPath: '/',
        previousPath: '/dashboard',
        userPw: {}
      }

      commit('UPDATE_IS_LOGGEDIN', state.isLoggedIn)
      commit('UPDATE_USER', state.user)
      commit('UPDATE_USER_PW', state.userPw)
      const environment = isDev ? 'dev' : (process.env.environment || '')
      commit('UPDATE_DEV', environment)
      commit('UPDATE_PATH', state.currentPath)
      commit('UPDATE_PREVIOUS_PATH', state.previousPath)
    }
  },
  SetLang ({ commit, state }, payload) {
    commit('SET_LANG', payload)
    return new Promise(resolve => {
      if (state.isLoggedIn) {
        const data = Object.assign({}, state.user)
        data.language = payload
        // eslint-disable-next-line no-undef
        Intercom('update', { language_override: payload })
        this.$axios.$put('me', data)
      }
      resolve(payload)
    })
  },
  LoadCurrentUser ({ commit }) {
    return this.$axios.$get('me').then(res => {
      commit('UPDATE_USER', res)
      commit('SET_LANG', res.language)
      return res
    })
  },
  LoadCurrentUserPw ({ commit }) {
    return this.$axios.$get('/cystack_platform/pm/users/me').then(res => {
      commit('UPDATE_USER_PW', res)
      return res
    })
  },
  LoadCurrentIntercom ({ commit }) {
    return this.$axios.$get('me/intercom').then(res => {
      window.intercomSettings = res
      commit('UPDATE_USER_INTERCOM', res)
      // eslint-disable-next-line no-undef
      Intercom('update')
    })
  },
  LoadNotification ({ commit }) {
    // const user = context.state.user
    return this.$axios.$get('notifications?scope=cloud').then(res => {
      commit('UPDATE_NOTIFICATION', res)
    })
  }
}
