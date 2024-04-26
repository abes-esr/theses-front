<template>
    <div class="container">
        <h1><v-icon>mdi-account-hard-hat-outline</v-icon>Theses.fr est en maintenance.</h1>
        <span v-html="maintenanceMsg" class="maintenance-text">
        </span>
    </div>
</template>

<script setup>
const config = useRuntimeConfig();
const maintenanceMsg = config.public.MAINTENANCE_MESSAGE;
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

header {
    padding: 0 !important;
}

h1 {
    padding-top: 20px;
    padding-bottom: 20px;
    width: 80%;

    @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
        font-size: 3rem;
    }
}

.container {
    width: 90%;
    align-items: flex-start;
}

.maintenance-text {
    @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
        font-size: 1.3rem;
    }
}
</style>