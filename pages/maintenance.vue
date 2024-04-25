<template>
    <div class="container">
        <h1><v-icon>mdi-account-hard-hat-outline</v-icon>Theses.fr est en maintenance.</h1>
        <span>
            <p>Nous nous excusons pour tout inconvénient que cela pourrait causer. </p><br />
            <p>Vous pouvez suivre le compte Twitter de l'ABES pour le suivi des travaux : <a
                    href="https://twitter.com/com_abes" target="_blank">https://twitter.com/com_abes</a></p><br />
            <p>Nous vous remercions pour votre patience et nous revenons bientôt !</p>
        </span>
    </div>
</template>

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

p {
    @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
        font-size: 1.3rem;
    }
}
</style>