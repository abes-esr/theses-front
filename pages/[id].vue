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

/**
 * Middleware de redirection pour les sujets de thèse (ex: s123456) :
 * Si le sujet a été soutenu et dispose désormais d'un NNT, on effectue
 * une redirection HTTP 301 côté serveur directement vers l'URL de la thèse.
 */
definePageMeta({
    middleware: [
        async (to) => {
            const id = to.params.id;
            if (id) {
                const config = useRuntimeConfig();
                try {
                    const nnt = await $fetch(`theses/checkNNT/${id}`, { baseURL: config.public.API });
                    if (nnt && nnt !== id) {
                        return navigateTo(`/${nnt}`, { redirectCode: 301, replace: true });
                    }
                } catch (e) {
                    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' })
                }
            }
        }
    ]
});

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
                if (res.data.value !== "") type.value = "organisme";
                else type.value = "personne"
            }).catch(() => { return "personne" })
    }
    else if (regexSujet.test(id)) type.value = "sujet";
    else {
        throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
    }
}

</script>

<style>
.skeleton-wrapper {
    display: grid;
    grid-template-columns: 10fr 145fr 10fr;
    padding: 30px;
}
</style>