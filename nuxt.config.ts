const myCustomLightTheme = {
  dark: false,
  colors: {
    background: '#F9F9FB',
    surface: '#FFFFFF',
    primary: '#252C61',
    'primary-darken-1': '#3700B3',
    secondary: '#00A0DC',
    'secondary-darken-1': '#018786',
    'secondary-darken-2': '#005A8F',
    'orange-abes': '#CF491B',
    'gris-clair' : '#e6e6e6',
    'gris-fonce': '#b3b2b4',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    'fond-noir': "#000000",
    'text-dark-blue': "#0B2134",
    'fond-chip-blue': "#ABB9D5"
  }
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@invictus.codes/nuxt-vuetify',
    '@nuxtjs/i18n',
  ],
  devtools: { enabled: false },
  vuetify: {
    /* vuetify options */
    vuetifyOptions: {
        theme: {
      defaultTheme: 'myCustomLightTheme',
      themes: {
        myCustomLightTheme,
        }
      }, display: {
        mobileBreakpoint: 'md'
      },
      ssr: true
    },

    moduleOptions: {
      /* nuxt-vuetify module options */
      treeshaking: true,
      useIconCDN: true,

      /* vite-plugin-vuetify options */
      autoImport: true,
      useVuetifyLabs: true, 
    }
  },
  i18n: {
    vueI18n: './i18n.config.ts' // if you are using custom path, default 
  },
  runtimeConfig: {
    public: {
      API: process.env.NUXT_APP_API,
      API_REF: process.env.NUXT_APP_APIREF,
      CAPTCHA: process.env.NUXT_APP_RECAPTCHA,
    }
  },
  routeRules: {
     '/resultats/**': { ssr: false },
     '/resultats': { ssr: false },
  },
  nitro: {
    compressPublicAssets: true,
  },
})
