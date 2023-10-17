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

import { defineNuxtConfig } from 'nuxt/config'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    }
  ],
  devtools: { enabled: true },
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
  app: {
    head: {
      link: [{ rel: 'stylesheet', media: 'print', onload:"this.onload=null;this.removeAttribute('media')", href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900' }, {rel:"preload", href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900', as:"font" }, {rel:'preconnect', href:'https://fonts.gstatic.com'}]
    }
  },
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
