<template>
    <div class="languageSelector">
        <div v-for="(item, index) in langList" :key="item">
            <span tabindex="0" @click="update(item)" v-on:keyup.enter="update(item)"
                :class="current === item ? 'selected' : ''">{{ item.toUpperCase()
                }}</span><span v-if="index < props.languages.length - 1">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
    languages: {
        type: Array,
        required: true
    }
});

const current = ref(
  props.languages.includes("fr")
    ? "fr" // Si "fr" est présent dans props.languages
    : props.languages[0] // Sinon, prendre le premier langage disponible
);

//Tri des langues dans l'ordre alpha + FR au début
const langList = computed(() => {
  const list = [...props.languages];
  list.sort();

  if (list.includes("fr")) {
    list.splice(list.indexOf("fr"), 1);
    list.unshift("fr");
  }
  return list;
});

const emit = defineEmits(['updateLangue']);

function update(langue) {
    current.value = langue;
    emit("updateLangue", langue);
}
</script>
<style lang="scss" scoped>
.languageSelector {
    display: flex;
    margin-left: 12px;
    margin-top: 5px;
}

span {
    cursor: pointer;
}

.selected {
    color: rgb(var(--v-theme-orange-abes));
    font-weight: 700;
}
</style>