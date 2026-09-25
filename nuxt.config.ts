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

  devtools: { enabled: false },

  i18n: {
    restructureDir: false, // Désactive la restructuration forcée pour chercher les fichiers de configuration à la racine
    bundle: {
      optimizeTranslationDirective: false // Désactive l'optimisation de la directive pour supprimer le warning (sera supprimé en v10)
    }
  },

  // Configuration accessible côté serveur et client (Runtime Config).
  // Les valeurs par défaut ci-dessous sont surchargées dynamiquement au démarrage
  // du conteneur par les variables d'environnement préfixées par NUXT_PUBLIC_
  // (ex: NUXT_PUBLIC_API, NUXT_PUBLIC_API_REF, etc.).
  runtimeConfig: {
    public: {
      API: '',
      API_REF: '',
      IS_MAINTENANCE: 'false',
      MAINTENANCE_MESSAGE: ''
    }
  },

  routeRules: {
     '/resultats/**': { ssr: false },
     '/resultats': { ssr: false },
     '/apropos' : { prerender: true}
  },

  nitro: {
    compressPublicAssets: true,
  },

  app: {
    head: {
      link: [{ rel: 'stylesheet', media: 'print', onload:"this.onload=null;this.removeAttribute('media')", href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&display=swap' }, {rel:"stylesheet preload prefetch", href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900', as:"style", crossorigin: '', type: 'text/css' }, {rel:'preconnect', href:'https://fonts.gstatic.com'},
              { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
      htmlAttrs: {
        lang: 'fr',
      },
    }
  },

  build: {
    transpile: ['vuetify', '@vuepic/vue-datepicker'],
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  compatibilityDate: '2025-03-05',
});