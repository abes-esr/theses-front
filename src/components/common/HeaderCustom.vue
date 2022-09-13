<template>
    <v-app-bar color="white" flat id="appBar" max-height="150px">
        <v-btn flat depressed>FR</v-btn>|<v-btn flat depressed>EN</v-btn>
        <div class="flex-grow-1"></div>
        <div>
            <v-btn fab><img style="max-height: 40px;" alt="icone assistance" src="@/assets/documentation.png">
            </v-btn>
        </div>
        <div>
            <v-btn fab><img style="max-height: 40px;" alt="icone documentation" src="@/assets/documentation.png">
            </v-btn>
        </div>
        <div>
            <v-btn fab><img style="max-height: 40px;" alt="icone assistance" src="@/assets/documentation.png">
            </v-btn>
        </div>
        <div>
            <v-btn fab><img style="max-height: 40px;" alt="icone documentation" src="@/assets/documentation.png">
            </v-btn>
        </div>
    </v-app-bar>
    <div id="logo" class="d-flex justify-center align-start" style="overflow: visible;"> <img alt="logo"
            src="@/assets/logo.png" style="overflow: visible; max-height: 160px; margin-top: -50px; z-index:2000"
            class="d-none d-md-block pt-16"></div>

</template>

<style>
.v-app-bar {
    border-bottom: solid #b3b2b4 1px !important;
}

.v-toolbar {
    overflow: visible !important;
}

#logo {
    height: 80px;
    width: 100%;
}
</style>