export const state = () => ({
  // User
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
  userChatwoot: {},
  userPw: {},
  currentPlan: {},
  extensionLoggedIn: false,

  // Dev
  currentPath: '/',
  previousPath: '',
  isDev: 'dev',
  environment: 'dev',

  // Cipher
  loading: false,
  syncing: false,
  syncedCiphersToggle: false,
  searchText: '',
  cipherCount: null,
  itemsCount: {},
  notDeletedCipherCount: {
    total: 0,
    ciphers: {}
  },
  syncingQuickShares: false,

  // Sharing
  teams: [],
  myShares: [],
  shareInvitations: [],

  // Enterprise
  enterpriseInvitations: [],
  enterprisePolicies: [],

  // UI
  notice: {
    showLocked: false,
    showTutorial: false,
    showTutorialStep6: false,
    showWelcome: false,
    allowShowWelcomeBusiness: false,
    allowShowTutorial: false,
    showPleaseUpgrade: false
  },
  ui: {
    closeAllModal: false
  },
  tutorial: {
    isActive: false,
    currentStepId: '',
    doneSteps: []
  },

  // On premise
  isOnPremise: false,
  onPremiseBaseApi: '',
  isLoggedInOnPremise: false,
  requirePwl: false,
  hasPwl: false
})
export const mutations = {
  SET_LANG (state, payload) {
    state.user.language = payload
  },
  UPDATE_IS_LOGGEDIN (state, value) {
    state.isLoggedIn = value
  },
  UPDATE_IS_LOGGEDIN_ON_PREMISE (state, value) {
    state.isLoggedInOnPremise = value
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
    state.syncingQuickShares = false
    state.cipherCount = null
    state.itemsCount = {}
    state.notDeletedCipherCount = {
      total: 0,
      ciphers: {}
    }
    state.myShares = []
    state.shareInvitations = []
    state.enterpriseInvitations = []
    state.enterprisePolicies = []
    state.onPremiseBaseApi = ''
    state.isOnPremise = false
    state.isLoggedInOnPremise = false
    state.hasPwl = false
    state.requirePwl = false
    state.userPw = {}
  },
  UPDATE_USER (state, user) {
    state.user = user
  },
  UPDATE_ON_PREMISE_INFO (state, { baseApi, hasPwl, requirePwl }) {
    state.isOnPremise = !!baseApi
    state.onPremiseBaseApi = baseApi
    state.hasPwl = hasPwl
    state.requirePwl = requirePwl
  },
  UPDATE_USER_PW (state, user) {
    state.userPw = user
  },
  UPDATE_USER_CHATWOOT (state, userChatwoot) {
    state.userChatwoot = userChatwoot
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
  UPDATE_SYNCING_QUICK_SHARES (state, syncing) {
    state.syncingQuickShares = syncing
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
  UPDATE_ITEMS_COUNT (state, value) {
    state.itemsCount = value
  },
  UPDATE_NOT_DELETED_CIPHER_COUNT (state, value) {
    state.notDeletedCipherCount = value
  },
  UPDATE_LOGIN_EXTENSION (state, value) {
    state.extensionLoggedIn = value
  },
  UPDATE_MY_SHARES (state, value) {
    state.myShares = value
  },
  UPDATE_SHARE_INVITATIONS (state, value) {
    state.shareInvitations = value
  },
  UPDATE_ENTERPRISE_INVITATIONS (state, value) {
    state.enterpriseInvitations = value
  },
  UPDATE_ENTERPRISE_POLICIES (state, value) {
    state.enterprisePolicies = value
  },
  UPDATE_NOTICE (state, value) {
    state.notice = {
      ...state.notice,
      ...value
    }
  },
  UPDATE_UI (state, value) {
    state.ui = {
      ...state.ui,
      ...value
    }
  },
  UPDATE_TUTORIAL (state, value) {
    state.tutorial = {
      ...state.tutorial,
      ...value
    }
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
    commit('UPDATE_ON_PREMISE_INFO', {
      baseApi: state.onPremiseBaseApi,
      hasPwl: state.hasPwl,
      requirePwl: state.requirePwl
    })
    commit('UPDATE_USER_PW', state.userPw)
    const environment = isDev ? 'dev' : process.env.environment || ''
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
      commit('UPDATE_ON_PREMISE_INFO', {
        baseApi: state.onPremiseBaseApi,
        hasPwl: state.hasPwl,
        requirePwl: state.requirePwl
      })
      commit('UPDATE_USER_PW', state.userPw)
      const environment = isDev ? 'dev' : process.env.environment || ''
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
        this.$axios.$put('me', data)
      }
      resolve(payload)
    })
  },
  LoadCurrentUser ({ commit, state }) {
    if (state.isOnPremise && !state.isLoggedInOnPremise) {
      console.log('Ignore current user')
      return {
        language: 'en'
      }
    }
    return this.$axios.$get('me').then(res => {
      commit('UPDATE_USER', res)
      commit('SET_LANG', res.language)
      return res
    })
  },
  LoadCurrentUserPw ({ commit, state }) {
    if (state.isOnPremise && !state.isLoggedInOnPremise) {
      console.log('Ignore user pw')
      return
    }
    return this.$axios.$get('/cystack_platform/pm/users/me').then(res => {
      commit('UPDATE_USER_PW', res)
      if (this.$vaultTimeoutService) {
        this.$vaultTimeoutService.setVaultTimeoutOptions(
          res.timeout,
          res.timeout_action
        )
      }
      return res
    })
  },
  LoadCurrentChatwoot ({ commit, state }) {
    if (state.isOnPremise) {
      console.log('Ignore Chatwoot')
      return
    }
    return {}
    // TODO
    // return this.$axios
    //   .$get('cystack_platform/pm/users/me/chatwoot')
    //   .then(res => {
    //     commit('UPDATE_USER_CHATWOOT', res)
    //   }).catch(() => {})
  },
  LoadNotification ({ commit }) {
    // const user = context.state.user
    return this.$axios.$get('notifications?scope=pwdmanager').then(res => {
      commit('UPDATE_NOTIFICATION', res)
    })
  },
  LoadTeams ({ commit, state }) {
    commit('UPDATE_TEAMS', [])
    if (state.isOnPremise && !state.isLoggedInOnPremise) {
      console.log('Ignore teams')
      return []
    }
    return this.$axios.$get('cystack_platform/pm/enterprises').then(res => {
      commit('UPDATE_TEAMS', res)
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
    return this.$axios
      .$get('cystack_platform/pm/sharing/my_share')
      .then(res => {
        commit('UPDATE_MY_SHARES', res)
        return res
      })
  },
  LoadMyShareInvitations ({ commit }) {
    return this.$axios
      .$get('cystack_platform/pm/sharing/invitations')
      .then(res => {
        commit('UPDATE_SHARE_INVITATIONS', res)
        return res
      })
  },
  LoadEnterpriseInvitations ({ commit, state }) {
    if (state.isOnPremise && !state.isLoggedInOnPremise) {
      console.log('Ignore invitations')
      return
    }
    return this.$axios
      .$get('cystack_platform/pm/enterprises/members/invitations')
      .then(res => {
        commit('UPDATE_ENTERPRISE_INVITATIONS', res)
        return res
      })
  },
  LoadItemsCount ({ commit }) {
    return this.$axios
      .$get('cystack_platform/pm/payments/plan/limit')
      .then(res => {
        commit('UPDATE_ITEMS_COUNT', res)
        return res
      })
  }
}
