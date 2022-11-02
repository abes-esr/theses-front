<template>
  <v-snackbar
      outlined
      :color="colors()"
      v-model="display"
      :multi-line="options.multiline"
      location="top"
  >
      <span
          class="errorLine"
          v-for="m in message.split('\n')"
          v-bind:key="m"
          v-html="m"
      ></span>
    <template v-slot:actions>
      <v-btn
          text
          @click="close"
      >
        <v-icon color="primary">mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>

import {reactive, ref} from "vue";

const message = ref("");
const display = ref(false);
let resolve; // Fonction pour résoudre la promesse
let reject; // Fonctio pour rejetter la promesse
const options = reactive({
  type: "info",
  isSticky: false,
  timeout: 2000,
  multiline: false
});

/**
 * Fonction pour afficher la boîte de message
 * @param mes Message à afficher
 * @param opt Option de la boîte de message
 * @returns {Promise<unknown>}
 */
function open(mes, opt) {
  display.value = true;
  message.value = mes;

  if (opt) {
    Object.assign(options, opt);
  }

  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  if (!options.isSticky) {
    setTimeout(() => {
      close()
    }, options.timeout);
  }

  return promise;
}

/**
 * Fonction pour fermer la boîte de message
 */
function close() {
  display.value = false;
  resolve(true);
}

/**
 * Fonction pour retourner le code couleur en fonction du type de message
 * @returns {string}
 */
function colors() {
  switch (options.type) {
    case "success":
      return "success"
    case "info":
      return "info"
    case "error":
      return "error"
    case "warning":
      return "warning"
    default:
      return "info"
  }
}

defineExpose({open})

</script>
<style scoped>
</style>
