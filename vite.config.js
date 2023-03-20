import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import { splitVendorChunkPlugin } from 'vite'
import vue from "@vitejs/plugin-vue";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import viteCompression from 'vite-plugin-compression';
import { resolve, dirname } from "node:path";



// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
		vue(),
		vuetify({ autoImport: true, treeShake: true }),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**'),
    }),
    viteCompression(),
    splitVendorChunkPlugin()
],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
