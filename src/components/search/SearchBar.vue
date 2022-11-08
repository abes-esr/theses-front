<template>
  <v-col>
    <v-text-field clearable :label='$t("rechercher")' v-model="request" type="text" variant="outlined"
      @keydown.enter="search">
      <template v-slot:append>
        <v-btn color="primary"
          style="height: 100%; border-bottom-left-radius: 0; border-top-left-radius: 0; margin-left: -10px !important;"
          text @click="search" :loading="loading" class="pa-0 ma-0">
          <v-icon large>mdi-magnify</v-icon>
        </v-btn>
      </template>
    </v-text-field>
  </v-col>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { useRoute } from 'vue-router'
import { computed } from 'vue'

import router from '../../router';

const route = useRoute();
const routeName = computed(() => route.name)

defineProps({
  loading: {
    type: Boolean,
    default: false
  },
})
const request = ref('');
const emit = defineEmits(['search'])

onMounted(
  () => {
    request.value = useRoute().query.q;
  }
)


async function search() {
  if (routeName.value === "resultats") {
    router.replace({
      name: 'resultats',
      query: { q: request.value }
    })
  } else {
    router.push({
      name: 'resultats',
      query: { q: request.value }
    })
  }
  emit('search', request.value);
}

defineExpose({
  search,
});

</script>

<style scoped>
:deep(.v-field__field) {
  background: rgb(var(--v-theme-surface));
}

:deep(.v-input--horizontal .v-input__append) {
  padding: 0 !important;
  margin: 0 !important;
  height: 100% !important;
}
</style>