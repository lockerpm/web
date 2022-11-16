export const state = () => ({
  isLoggedIn: false,
  user: {
    email: null,
    language: 'en'
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
  syncing: false,
  userPw: {},
  syncedCiphersToggle: false,
  searchText: '',
  teams: [],
  currentPlan: {},
  cipherCount: null,
  notDeletedCipherCount: {
    total: 0,
    ciphers: {}
  },
  pendingShares: 0,
  extensionLoggedIn: false,
  myShares: [],
  enterpriseInvitations: [],
  enterprisePolicies: [],
  showLocked: false
})
export const mutations = {
  SET_LANG (state, payload) {
    state.user.language = payload
  },
  UPDATE_IS_LOGGEDIN (state, value) {
    state.isLoggedIn = value
  },
  CLEAR_ALL_DATA (state) {
    state.isLoggedIn = false
    state.notifications = {
      results: [],
      unread_count: 0,
      count: 0
    }
    state.teams = []
    state.syncing = false
    state.cipherCount = null
    state.notDeletedCipherCount = {
      total: 0,
      ciphers: {}
    }
    state.pendingShares = 0
    state.enterpriseInvitations = []
    state.enterprisePolicies = []
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
    state.previousPath = target || '/vault'
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
  UPDATE_SYNCING (state, syncing) {
    state.syncing = syncing
  },
  UPDATE_SYNCED_CIPHERS (state) {
    state.syncedCiphersToggle = !state.syncedCiphersToggle
  },
  UPDATE_SEARCH (state, value) {
    state.searchText = value
  },
  UPDATE_TEAMS (state, value) {
    state.teams = value
  },
  UPDATE_CURRENT_PLAN (state, plan) {
    state.currentPlan = plan
  },
  UPDATE_CIPHER_COUNT (state, value) {
    state.cipherCount = value
  },
  UPDATE_NOT_DELETED_CIPHER_COUNT (state, value) {
    state.notDeletedCipherCount = value
  },
  UPDATE_PENDING_SHARES (state, value) {
    state.pendingShares = value
  },
  UPDATE_LOGIN_EXTENSION (state, value) {
    state.extensionLoggedIn = value
  },
  UPDATE_MY_SHARES (state, value) {
    state.myShares = value
  },
  UPDATE_ENTERPRISE_INVITATIONS (state, value) {
    state.enterpriseInvitations = value
  },
  UPDATE_ENTERPRISE_POLICIES (state, value) {
    state.enterprisePolicies = value
  },
  UPDATE_SHOW_LOCKED (state, value) {
    state.showLocked = value
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
      previousPath: '/vault',
      userPw: {},
      teams: []
    }

    commit('UPDATE_IS_LOGGEDIN', state.isLoggedIn)
    commit('UPDATE_USER', state.user)
    commit('UPDATE_USER_PW', state.userPw)
    const environment = isDev ? 'dev' : (process.env.environment || '')
    commit('UPDATE_DEV', environment)
    commit('UPDATE_PATH', state.currentPath)
    commit('UPDATE_PREVIOUS_PATH', state.previousPath)
    commit('UPDATE_TEAMS', state.teams)
  },
  nuxtClientInit ({ commit }, { app, isDev }) {
    if (process.env.CS_ENV === 'electron') {
      const state = app.$cookies.get('cs_locker_store') || {
        isLoggedIn: false,
        user: {
          language: 'en'
        },
        currentPath: '/',
        previousPath: '/vault',
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
        // if (Intercom) {
        //   // eslint-disable-next-line no-undef
        //   Intercom('update', { language_override: payload })
        // }
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
      if (this.$vaultTimeoutService) {
        this.$vaultTimeoutService.setVaultTimeoutOptions(res.timeout, res.timeout_action)
      }
      return res
    })
  },
  LoadCurrentIntercom ({ commit }) {
    return this.$axios.$get('cystack_platform/pm/users/me/intercom').then(res => {
      window.intercomSettings = res
      commit('UPDATE_USER_INTERCOM', res)
      // eslint-disable-next-line no-undef
      Intercom('update')
    })
  },
  LoadNotification ({ commit }) {
    // const user = context.state.user
    return this.$axios.$get('notifications?scope=pwdmanager').then(res => {
      commit('UPDATE_NOTIFICATION', res)
    })
  },
  LoadTeams ({ commit }) {
    commit('UPDATE_TEAMS', [])
    return this.$axios.$get('cystack_platform/pm/enterprises').then(res => {
      commit('UPDATE_TEAMS', res)
      // if (res.length) {
      //   this.$axios.$get(`cystack_platform/pm/enterprises/${res[0].id}/policy`).then(policy => {
      //     const enterprisePolicies = {}
      //     policy.forEach(element => {
      //       enterprisePolicies[element.policy_type] = element
      //     })
      //     commit('UPDATE_ENTERPRISE_POLICIES', enterprisePolicies)
      //   })
      // }
      return res
    })
  },
  LoadCurrentPlan ({ commit }) {
    return this.$axios.$get('cystack_platform/pm/payments/plan').then(res => {
      commit('UPDATE_CURRENT_PLAN', res)
      return res
    })
  },
  LoadMyShares ({ commit }) {
    return this.$axios.$get('cystack_platform/pm/sharing/my_share').then(res => {
      commit('UPDATE_MY_SHARES', res)
      return res
    })
  },
  LoadEnterpriseInvitations ({ commit }) {
    return this.$axios.$get('cystack_platform/pm/enterprises/members/invitations').then(res => {
      commit('UPDATE_ENTERPRISE_INVITATIONS', res)
      return res
    })
  }
}
