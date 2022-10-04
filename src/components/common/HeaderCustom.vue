<template>
    <v-app-bar color="white" flat id="appBar">
        <v-row class="pt-4">
            <v-col cols="12" md="6" class="text-center text-md-left">
                <v-btn flat depressed>FR</v-btn>|<v-btn flat depressed>EN</v-btn>
            </v-col>
            <v-col cols="12" md="6" class="text-center text-md-right">
                <v-btn><img style="max-height: 40px;" alt="icone partager" title="Partager"
                        src="@/assets/icone-reseaux.svg">
                </v-btn>

                <v-btn><img style="max-height: 40px;" alt="icone rss" title="Flux RSS" src="@/assets/icone-rss.svg">
                </v-btn>

                <v-btn><img style="max-height: 40px;" alt="icone assistance" title="Assistance"
                        src="@/assets/icone-assistance.svg">
                </v-btn>

                <v-btn><img style="max-height: 40px;" alt="icone documentation" title="Documentation"
                        src="@/assets/icone-documentation.svg">
                </v-btn>
            </v-col>
            <v-col cols="12" class="pa-0">
                <div id="logo" class="d-flex justify-center align-start clickable"
                    style="overflow: visible; height: 60px;" @click="$router.push({ path: '/' })"> <img alt="logo"
                        id="logoIMG" src="@/assets/icone-theses.svg"
                        style="overflow: visible; max-height: 120px; z-index:2000">
                </div>
            </v-col>
        </v-row>
    </v-app-bar>
</template>

<style>
.v-app-bar {
    border-bottom: solid rgb(var(--v-theme-gris-clair)) 1px !important;
    margin-bottom: 80px;
}

.v-toolbar__content {
    min-height: 64px;
    max-height: 200px;
    height: 100% !important;
}

.v-toolbar {
    overflow: visible !important;
}

@media (min-width: 960px) {
    #logoIMG {
        margin-top: -50px;
    }

    #logo {
        height: 20px !important;
    }
}

#logo {
    height: 0;
    width: 100%;
}
</style>