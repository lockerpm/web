import Vue from 'vue'

Vue.mixin({
  data () {
    return {
      notEnable2FA: false
    }
  },

  computed: {
    enterprisePolicies () {
      return this.$store.state.enterprisePolicies
    }
  },

  methods: {
    checkPasswordPolicy (
      password,
      policy_type = 'password_requirement',
      policies = null
    ) {
      const violations = []
      if (!this.enterprisePolicies && !policies) {
        return violations
      }
      const policy = policies
        ? policies[policy_type]
        : this.enterprisePolicies[policy_type]
      if (policy && policy.enabled) {
        if (
          policy.config.minLength &&
          password.length < policy.config.minLength
        ) {
          violations.push(
            this.$t('data.password_policies.min_password_length', {
              length: policy.config.minLength
            })
          )
        }
        if (policy.config.requireSpecialCharacter) {
          const reg = /(?=.*[!@#$%^&*])/
          const check = reg.test(password)
          if (!check) {
            violations.push(this.$t('data.password_policies.requires_special'))
          }
        }
        if (policy.config.requireLowerCase) {
          const reg = /[a-z]/
          const check = reg.test(password)
          if (!check) {
            violations.push(
              this.$t('data.password_policies.requires_lowercase')
            )
          }
        }
        if (policy.config.requireUpperCase) {
          const reg = /[A-Z]/
          const check = reg.test(password)
          if (!check) {
            violations.push(
              this.$t('data.password_policies.requires_uppercase')
            )
          }
        }
        if (policy.config.requireDigit) {
          const reg = /[1-9]/
          const check = reg.test(password)
          if (!check) {
            violations.push(this.$t('data.password_policies.requires_number'))
          }
        }
      }
      return violations
    },

    listPasswordPolicy (policy_type = 'password_requirement') {
      const res = []
      if (!this.enterprisePolicies) {
        return []
      }
      const policy = this.enterprisePolicies[policy_type]
      if (policy && policy.enabled) {
        if (policy.config.minLength) {
          res.push(
            this.$t('data.password_policies.min_password_length', {
              length: policy.config.minLength
            })
          )
        }
        if (policy.config.requireSpecialCharacter) {
          res.push(this.$t('data.password_policies.requires_special'))
        }
        if (policy.config.requireLowerCase) {
          res.push(this.$t('data.password_policies.requires_lowercase'))
        }
        if (policy.config.requireUpperCase) {
          res.push(this.$t('data.password_policies.requires_uppercase'))
        }
        if (policy.config.requireDigit) {
          res.push(this.$t('data.password_policies.requires_number'))
        }
      }
      return res
    },

    async checkBlockedBy2FA () {
      try {
        const res = await this.$axios.$get(
          '/cystack_platform/pm/users/me/block_by_2fa'
        )
        this.notEnable2FA = res.block
      } catch (e) {}
    },

    async loadEnterprisePolicies () {
      if (!this.currentOrg?.id) {
        return
      }
      try {
        const res = await this.$axios.$get(
          `/cystack_platform/pm/enterprises/${this.currentOrg.id}/policy`
        )
        const enterprisePolicies = {}
        res.forEach(element => {
          enterprisePolicies[element.policy_type] = element
        })
        this.$store.commit('UPDATE_ENTERPRISE_POLICIES', enterprisePolicies)
      } catch (e) {}
    }
  }
})
