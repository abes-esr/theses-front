<template>
    <ThesesTheseView v-if="type === 'these' || type === 'sujet'" :id="id"></ThesesTheseView>
    <PersonnesPersonneView v-else-if="type === 'personne'" :id="id"></PersonnesPersonneView>
    <OrganismesOrganismeView v-else-if="type === 'organisme'" :id="id"></OrganismesOrganismeView>
    <div v-else class="skeleton-wrapper">
        <v-skeleton-loader type="list-item" class="skeleton"></v-skeleton-loader>
        <v-skeleton-loader type="divider" class="skeleton"></v-skeleton-loader>
        <v-skeleton-loader v-for="i in 4" :key="i" type="paragraph" class="skeleton-cards"></v-skeleton-loader>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'

const route = useRoute();
const { getName } = useOrganismeAPI();
const id = ref("");
const type = ref("");
const hash = ref("");

id.value = route.params.id;
checkId(id.value);
hash.value = route.hash;

watch(
    () => route.params.id,
    async newId => {
        id.value = newId;
        checkId(id.value);
    }
);

function checkId(id) {
    var regexNNT = /^[a-zA-Z0-9]{12}$/;
    var regexPPN = /^[a-zA-Z0-9]{9}$/;
    var regexSujet = /^s\d+$/;

    if (regexNNT.test(id)) type.value = "these";
    else if (regexPPN.test(id)) {
        getName(id)
            .then((res) => {
                if (res.data !== "") type.value = "organisme";
                else type.value = "personne"
            }).catch(() => { return "personne" })
    }
    else if (regexSujet.test(id)) type.value = "sujet";
}

</script>

<style>
.skeleton-wrapper {
    display: grid;
    grid-template-columns: 10fr 145fr 10fr;
    padding: 30px;
}
</style>