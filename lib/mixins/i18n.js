import langs from '../config/lang' // Language configuration
import { warn } from '../util/warn'

// Internationalization
export default {
  computed: {
    // Language content
    langs() {
      let { lang } = this

      // Automatically identify the browser language
      if (lang === 'auto') {
        lang = (navigator.language || navigator.userLanguage).substr(0, 2)
      }

      if (typeof lang === 'string') {
        lang = langs[lang]
      }

      // If no language configuration is found, English will be used
      if (!lang) lang = langs['en']

      return lang
    }
  },

  methods: {
    // Get international content
    i18nText(text) {
      let { key, params } = this.i18nParse(text)

      if (key) {
        const hasI18nProp = typeof this.i18n === 'function'

        // Warn if i18n method is not configured
        if (!this._hasI18nPropWarn) {
          warn(hasI18nProp, this.langs.msg.i18nProp)
          this._hasI18nPropWarn = true
        }

        if (hasI18nProp) {
          return this.i18n(key, params)
        }
      }

      return text
    },

    // Analysis of internationalization
    i18nParse(text) {
      let key
      let params

      // Get internationalization configuration
      if (typeof text === 'string') {
        // String configuration: 'i18n:custom.lang.key'
        const res = /^i18n:([^\s]+)$/.exec(text)

        if (res) {
          key = res[1]
          params = []
        }
      } else if (Array.isArray(text)) {
        // Array configuration: ['tab.i18n.key', 'param1', 'param2', ...]
        ;[key, ...params] = text
      }

      return { key, params }
    }
  }
}
