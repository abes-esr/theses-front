<script setup lang="ts">
const props = defineProps({
    error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
    <v-app>
        <CommonHeaderCustom></CommonHeaderCustom>
        <v-main>
            <h1>Erreur {{ error.statusCode }} : <div v-if="error.statusCode.toString().startsWith('4')">Page
                    Introuvable</div>
                <div v-if="error.statusCode.toString().startsWith('5')">Serveur
                    Indisponible</div>
            </h1>
            <p v-if="error.statusCode.toString().startsWith('5')"><strong>Merci d'essayer à nouveau dans quelques
                    instants.
                    Si le problème persiste, vous
                    pouvez contacter le guichet
                    d'assistance de l'Abes : <a href="https://stp.abes.fr/node/3?origine=thesesFr"
                        target="_blank">https://stp.abes.fr/node/3?origine=thesesFr</a>.</strong>
                <br /><br />
                Vous pouvez joindre les informations suivantes à votre demande d'assistance :
                <br /><br />
            <pre>{{ error.message }}</pre>
            <br />
            <span v-html="error.stack" />
            </p>
            <p v-if="error.statusCode.toString().startsWith('4')"><strong>La page à laquelle vous tentez d'accéder
                    n'existe
                    pas, ou
                    n'est plus disponible.</strong></p>
            <br /><br />
            <button @click="handleError">Retour à l'accueil</button>
        </v-main>
        <CommonFooterCustom></CommonFooterCustom>
    </v-app>
</template>

<style scoped lang="scss">
@use 'vuetify/settings';

.v-application {
    height: 100%;
    display: flex !important;
}

.v-main {
    flex: 1;
}

h1 {
    padding-top: 20px;
    padding-bottom: 20px;
    font-size: 3rem;
    width: 80%;
}

button {
    font-size: 2em;
    color: rgb(var(--v-theme-text-dark-blue));
    border: solid 2px rgb(var(--v-theme-text-dark-blue));
    border-radius: 5px;
    background-color: transparent;
    padding: 10px;
    margin-bottom: 50px;

}

p {
    width: 90%;
    padding: 20px;
}

pre {
    width: 80%;
    white-space: pre-wrap;
    display: grid !important;

}

:deep(.stack) {
    display: contents;
    width: 80%;
    white-space: pre-wrap;
    word-break: break-all;
}

div {
    display: inline;
}
</style>