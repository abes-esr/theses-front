// @ts-nocheck
export const localeCodes = []

export const localeMessages = {

}

export const resolveNuxtI18nOptions = async (context) => {
  const nuxtI18nOptions = Object({})
  nuxtI18nOptions.experimental = Object({"jsTsFormatResource":false})
  nuxtI18nOptions.bundle = Object({"compositionOnly":true,"runtimeOnly":false,"fullInstall":true,"dropMessageCompiler":false})
  nuxtI18nOptions.compilation = Object({"jit":true,"strictMessage":true,"escapeHtml":false})
  nuxtI18nOptions.customBlocks = Object({"defaultSFCLang":"json","globalSFCScope":false})
 const vueI18nConfigLoader = async loader => {
            const config = await loader().then(r => r.default || r)
            if (typeof config === 'object') return config
            if (typeof config === 'function') return await config()
            return {}
          }
          const deepCopy = (src, des, predicate) => {
            for (const key in src) {
              if (typeof src[key] === 'object') {
                if (!(typeof des[key] === 'object')) des[key] = {}
                deepCopy(src[key], des[key], predicate)
              } else {
                if (predicate) {
                  if (predicate(src[key], des[key])) {
                    des[key] = src[key]
                  }
                } else {
                  des[key] = src[key]
                }
              }
            }
          }

          const mergeVueI18nConfigs = async (configuredMessages, loader) => {
            const layerConfig = await vueI18nConfigLoader(loader)
            const cfg = layerConfig || {}
            cfg.messages ??= {}
            const skipped = ['messages']

            for (const [k, v] of Object.entries(cfg).filter(([k]) => !skipped.includes(k))) {
              if(nuxtI18nOptions.vueI18n?.[k] === undefined || typeof nuxtI18nOptions.vueI18n?.[k] !== 'object') {
                nuxtI18nOptions.vueI18n[k] = v
              } else {
                deepCopy(v, nuxtI18nOptions.vueI18n[k])
              }
            }

            for (const [locale, message] of Object.entries(cfg.messages)) {
              configuredMessages[locale] ??= {}
              deepCopy(message, configuredMessages[locale])
            }
          }
  nuxtI18nOptions.vueI18n = Object({"messages":Object({})})
  await mergeVueI18nConfigs(nuxtI18nOptions.vueI18n.messages, (() => import("../i18n.config.ts?hash=e8c4ba4d&config=1" /* webpackChunkName: __i18n_config_ts_e8c4ba4d */)))
  nuxtI18nOptions.locales = []
  nuxtI18nOptions.defaultLocale = ""
  nuxtI18nOptions.defaultDirection = "ltr"
  nuxtI18nOptions.routesNameSeparator = "___"
  nuxtI18nOptions.trailingSlash = false
  nuxtI18nOptions.defaultLocaleRouteNameSuffix = "default"
  nuxtI18nOptions.strategy = "prefix_except_default"
  nuxtI18nOptions.lazy = false
  nuxtI18nOptions.langDir = null
  nuxtI18nOptions.rootRedirect = null
  nuxtI18nOptions.detectBrowserLanguage = Object({"alwaysRedirect":false,"cookieCrossOrigin":false,"cookieDomain":null,"cookieKey":"i18n_redirected","cookieSecure":false,"fallbackLocale":"","redirectOn":"root","useCookie":true})
  nuxtI18nOptions.differentDomains = false
  nuxtI18nOptions.baseUrl = ""
  nuxtI18nOptions.dynamicRouteParams = false
  nuxtI18nOptions.customRoutes = "page"
  nuxtI18nOptions.pages = Object({})
  nuxtI18nOptions.skipSettingLocaleOnNavigate = false
  nuxtI18nOptions.types = "composition"
  nuxtI18nOptions.debug = false
  nuxtI18nOptions.parallelPlugin = false
  nuxtI18nOptions.i18nModules = []
  return nuxtI18nOptions
}

export const nuxtI18nOptionsDefault = Object({experimental: Object({"jsTsFormatResource":false}),bundle: Object({"compositionOnly":true,"runtimeOnly":false,"fullInstall":true,"dropMessageCompiler":false}),compilation: Object({"jit":true,"strictMessage":true,"escapeHtml":false}),customBlocks: Object({"defaultSFCLang":"json","globalSFCScope":false}),vueI18n: "",locales: [],defaultLocale: "",defaultDirection: "ltr",routesNameSeparator: "___",trailingSlash: false,defaultLocaleRouteNameSuffix: "default",strategy: "prefix_except_default",lazy: false,langDir: null,rootRedirect: null,detectBrowserLanguage: Object({"alwaysRedirect":false,"cookieCrossOrigin":false,"cookieDomain":null,"cookieKey":"i18n_redirected","cookieSecure":false,"fallbackLocale":"","redirectOn":"root","useCookie":true}),differentDomains: false,baseUrl: "",dynamicRouteParams: false,customRoutes: "page",pages: Object({}),skipSettingLocaleOnNavigate: false,types: "composition",debug: false,parallelPlugin: false})

export const nuxtI18nInternalOptions = Object({__normalizedLocales: []})
export const NUXT_I18N_MODULE_ID = "@nuxtjs/i18n"
export const isSSG = false
export const parallelPlugin = false
