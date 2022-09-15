<template>
    <v-footer class="pa-0">
        <v-card id="footerCard" elevation="0" rounded="0" width="100%" class="bg-grey text-center">
            <v-card-text id="footerTop">
                <v-row class="px-8">
                    <v-col cols="12" md="4" class="text-left">
                        <strong>Theses.fr</strong><br />
                        <span>Lorem ipsum dolor sit amet. Ut molestiae quae ex quae omnis id possimus
                            voluptas sit amet ipsam eos mollitia odit et
                            saepe ducimus! Aut officiis quidem non suscipit ipsam eos repellat autem id dolorem amet et
                            facilis sequi sed laboriosam
                            recusandae quo corporis sapiente. Aut incidunt omnis aut laborum minima eum eveniet quia.
                        </span>
                    </v-col>
                    <v-col cols="12" md="4" class="text-center">
                        <v-icon>mdi-arrow-top-right</v-icon>
                        <strong>
                            Acces direct
                        </strong><br />
                        <span class="orange-link"> > </span><a
                            href="https://documentation.abes.fr/aidetheses/thesesfr/index.html"
                            target="_blank">Documentation</a><br />
                        <span class="orange-link"> > </span><a
                            href="https://www.data.gouv.fr/fr/datasets/theses-soutenues-en-france-depuis-1985/"
                            target="_blank">data.gouv.fr</a><br />
                        <span class="orange-link"> > </span><a href="https://stp.abes.fr"
                            target="_blank">Assistance</a><br />
                    </v-col>
                    <v-col cols="12" md="4" class="text-right align-center"><img src="../../assets/logo-mesri.svg"
                            style="height: 60px;" class="pr-4 ">
                        <img src="../../assets/logo-abes.jpg" style="height: 60px;">
                    </v-col>
                </v-row>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-text id="footerBottom">
                <v-row class="px-4">
                    {{ new Date().getFullYear() }} — <strong>Theses.fr</strong>
                    <div class="flex-grow-1"></div>
                    <v-btn plain color="transparent" size="small" @click="$router.push({ name: 'apropos' })">A Propos
                    </v-btn>
                    <v-divider vertical class="my-1"></v-divider>
                    <v-btn plain color="transparent" size="small" href="/donnees"
                        @click="$router.push({ name: 'donnees' })">Donnees personnelles</v-btn>
                    <v-divider vertical class="my-1"></v-divider>
                    <v-btn color="transparent" size="small" @click="$router.push({ name: 'cgu' })">CGU
                    </v-btn>
                    <v-divider vertical class="my-1"></v-divider>
                    <v-btn color="transparent" size="small" @click="$router.push({ name: 'mentions' })">Mentions
                        Légales</v-btn>
                    <v-divider vertical class="my-1"></v-divider>
                    <v-btn color="transparent" size="small" @click="$router.push({ name: 'accessibilite' })">
                        Accessibilité</v-btn>
                </v-row>

            </v-card-text>
        </v-card>
    </v-footer>
</template>

<style scoped>
#footerTop {
    background-color: rgb(var(--v-theme-gris-clair));
}

#footerBottom {
    background-color: rgb(var(--v-theme-fond-noir));
    color: rgb(var(--v-theme-background));
}

.v-divider {
    background-color: rgb(var(--v-theme-background));
}

.orange-link {
    color: rgb(var(--v-theme-orange-abes));
    font-weight: bold;
}

#footerCard {
    margin-top: auto;
}
</style>