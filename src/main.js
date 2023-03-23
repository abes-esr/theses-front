import { createApp } from 'vue'
import { createI18n } from "vue-i18n";
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import messages from "@intlify/unplugin-vue-i18n/messages";
import { createMetaManager } from 'vue-meta'


const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: "fr",
  fallbackLocale: "en",
  availableLocales: ["fr", "en"],
  messages: messages,
});

loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .use(i18n)
  .use(createMetaManager()) 
  .mount('#app')
