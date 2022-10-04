<template>
    <v-app-bar color="white" flat id="appBar" max-height="150px">
        <v-btn flat depressed>FR</v-btn>|<v-btn flat depressed>EN</v-btn>
        <div class="flex-grow-1"></div>
        <div>
            <v-btn fab><img style="max-height: 40px;" alt="icone partager" title="Partager"
                    src="@/assets/icone-reseaux.svg">
            </v-btn>
        </div>
        <div>
            <v-btn fab><img style="max-height: 40px;" alt="icone rss" title="Flux RSS" src="@/assets/icone-rss.svg">
            </v-btn>
        </div>
        <div>
            <v-btn fab><img style="max-height: 40px;" alt="icone assistance" title="Assistance"
                    src="@/assets/icone-assistance.svg">
            </v-btn>
        </div>
        <div>
            <v-btn fab><img style="max-height: 40px;" alt="icone documentation" title="Documentation"
                    src="@/assets/icone-documentation.svg">
            </v-btn>
        </div>
    </v-app-bar>
    <div id="logo" class="d-none d-md-flex justify-center align-start clickable" style="overflow: visible;"
        @click="$router.push({ path: '/' })"> <img alt="logo" src="@/assets/icone-theses.svg"
            style="overflow: visible; max-height: 160px; margin-top: -50px; z-index:2000" class="pt-16"></div>

</template>

<style>
.v-app-bar {
    border-bottom: solid rgb(var(--v-theme-gris-clair)) 1px !important;
}

.v-toolbar {
    overflow: visible !important;
}

#logo {
    height: 80px;
    width: 100%;
}
</style>