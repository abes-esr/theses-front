<script setup lang="ts">
import { useI18n } from "vue-i18n";

const props = defineProps({
    error: Object
})

const { t } = useI18n();

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
    <v-app>
        <CommonHeaderCustom></CommonHeaderCustom>
        <v-main>
            <h1>{{ $t('errorPage.title') }} {{ error.statusCode }} : 
                <div v-if="error.statusCode.toString().startsWith('4')">{{ $t('errorPage.notFoundTitle') }}</div>
                <div v-if="error.statusCode.toString().startsWith('5')">{{ $t('errorPage.serverUnavailableTitle') }}</div>
            </h1>
            <p v-if="error.statusCode.toString().startsWith('5')">
                <strong>{{ $t('errorPage.retryMessage') }} 
                    <a :href="$t('errorPage.supportLink')" target="_blank">{{ $t('errorPage.supportLink') }}</a>.
                </strong>
                <br /><br />
                {{ $t('errorPage.attachInfo') }}
                <br /><br />
                <span>{{ error.message }}</span>
                <br />
                <span v-html="error.stack" />
            </p>
            <p v-if="error.statusCode.toString().startsWith('4')">
                <strong>{{ $t('errorPage.pageNotAvailable') }}</strong>
            </p>
            <br /><br />
            <button @click="handleError">{{ $t('errorPage.backToHome') }}</button>
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