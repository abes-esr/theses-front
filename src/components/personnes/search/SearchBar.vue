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
<script>
export default {
name: "search-bar-personnes"
};
</script>
<script setup>
import { ref, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import { computed } from 'vue'

const router = useRouter();
const currentRoute = useRoute();
const routeName = computed(() => currentRoute.name);

defineProps({
  loading: {
    type: Boolean,
    default: false
  },
})
const request = ref('');
const emit = defineEmits(['search','onError']);

onMounted(
  () => {
    if (currentRoute.query && currentRoute.query.q) {
      request.value = currentRoute.query.q;
    }
  }
)

async function search() {
  let currentURLParams = Object.assign({},currentRoute.query);

  if (currentURLParams) {
    currentURLParams.q = request.value
  } else {
    currentURLParams = {"q": request.value}
  }

  if (routeName.value === "resultats") {
    router.replace({
      query: currentURLParams
    })
  } else {
    router.push({
      name: 'resultats',
      query: currentURLParams
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