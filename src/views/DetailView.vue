<template>
    <TheseView v-if="type === 'these' || type === 'sujet'" :id="id"></TheseView>
    <PersonneView v-if="type === 'personne'" :id="id"></PersonneView>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from 'vue-router';
import TheseView from './TheseView.vue';
import PersonneView from './PersonneView.vue';

const route = useRoute();
let id = "";
const type = ref("");

onMounted(() => {
    id = route.params.id;
    type.value = checkId(id);
});

function checkId(id) {
    var regexNNT = /^[a-zA-Z0-9]{12}$/;
    var regexPPN = /^[a-zA-Z0-9]{9}$/;
    var regexSujet = /^s\d+$/;

    if (regexNNT.test(id)) return "these";
    else if (regexPPN.test(id)) return "personne";
    else if (regexSujet.test(id)) return "sujet";
}

</script>