<template>
    <v-footer class="pa-0">
        <v-card id="footerCard" elevation="0" rounded="0" width="100%" class="bg-grey text-center">
            <v-card-text id="footerTop">
                <v-row class="px-8">
                    <v-col cols="12" md="4" class="text-md-left text-center">
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
                            {{$t("accesDirect")}}
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
                    <v-col cols="12" md="4" class="text-md-right text-center align-center"><img
                            src="../../assets/logo-mesr.svg" alt="logo ministère enseignement supérieur"
                            style="height: 80px;" class="pr-4 ">
                        <img src="../../assets/abes-logo-cercle.svg" alt="logo Abes" style="height: 80px;">
                    </v-col>
                </v-row>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-text id="footerBottom">
                <v-row class="px-4">
                    <v-col cols="12" md="3" class="text-center text-md-left pa-0">
                        {{ new Date().getFullYear() }} —
                        <strong>Theses.fr</strong>
                        <div id="accessconfig" data-accessconfig-buttonname="Paramètres d’accessibilité"
                            data-accessconfig-params='{ "Prefix" : "a42-ac", "ContainerClass" : "","ModalCloseButton" : "","ModalTitle" : "","FormFieldset" : "","FormFieldsetLegend" : "","FormRadio" : "", "ImageReplacement" : false}'>
                        </div>
                    </v-col>
                    <v-col cols="12" md="9" class="text-center text-md-right pa-0">
                        <v-btn plain color="transparent" size="small" @click="$router.push({ name: 'apropos' })">
                            {{$t("apropos")}}
                        </v-btn>
                        <v-divider vertical class="my-1"></v-divider>
                        <v-btn plain color="transparent" size="small" href="/donnees"
                            @click="$router.push({ name: 'donnees' })">
                            {{$t("donnees")}}</v-btn>
                        <v-divider vertical class="my-1"></v-divider>
                        <v-btn color="transparent" size="small" @click="$router.push({ name: 'cgu' })">{{$t("CGU")}}
                        </v-btn>
                        <v-divider vertical class="my-1"></v-divider>
                        <v-btn color="transparent" size="small" @click="$router.push({ name: 'mentions' })">
                            {{$t("mentions")}}</v-btn>
                        <v-divider vertical class="my-1"></v-divider>
                        <v-btn color="transparent" size="small" @click="$router.push({ name: 'accessibilite' })">
                            {{$t("accessibilite")}}</v-btn>
                    </v-col>
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

footer {
    background: rgb(var(--v-theme-background));
}
</style>