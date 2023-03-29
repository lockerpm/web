import * as rules from 'vee-validate/dist/rules'
import { extend, configure } from 'vee-validate'

// loop over all rules
for (const rule in rules) {
  // add the rule
  // eslint-disable-next-line import/namespace
  extend(rule, rules[rule])
}
export default ({ app }) => {
  configure({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    defaultMessage: (field, values) => {
      // override the field name.
      return app.i18n.t(`messages.${values._rule_}`, values)
    }
  })
}
