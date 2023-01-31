<template>
  <v-footer class="pa-0">
    <div class="footerTop">
      <div>
        <h4>Theses.fr</h4>
        <span>Lorem ipsum dolor sit amet. Ut molestiae quae ex quae omnis id possimus
                            voluptas sit amet ipsam eos mollitia odit et
                            saepe ducimus! Aut officiis quidem non suscipit ipsam eos repellat autem id dolorem amet et
                            facilis sequi sed laboriosam
                            recusandae quo corporis sapiente. Aut incidunt omnis aut laborum minima eum eveniet quia.
                        </span>
      </div>
      <div>
        <h3>
          <v-icon>mdi-arrow-top-right</v-icon>
          {{ $t("accesDirect") }}
        </h3>
        <ul>
          <li><span class="orange-link"> ></span><a
              href="https://documentation.abes.fr/aidetheses/thesesfr/index.html"
              target="_blank">Documentation</a>
          </li>
          <li><span class="orange-link"> > </span><a
              href="https://www.data.gouv.fr/fr/datasets/theses-soutenues-en-france-depuis-1985/"
              target="_blank">data.gouv.fr</a>
          </li>
          <li><span class="orange-link"> > </span><a href="https://stp.abes.fr"
                                                     target="_blank">Assistance</a>
          </li>
        </ul>
      </div>
      <div><img
          src="../../assets/logo-mesr.svg" alt="logo ministère enseignement supérieur"
          style="height: 80px;" class="pr-4 ">
        <img src="../../assets/abes-logo-cercle.svg" alt="logo Abes" style="height: 80px;">

      </div>
    </div>
    <v-divider></v-divider>
    <v-card-text class="footerBottom">
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
            {{ $t("apropos") }}
          </v-btn>
          <v-divider vertical class="my-1"></v-divider>
          <v-btn plain color="transparent" size="small" href="/donnees"
                 @click="$router.push({ name: 'donnees' })">
            {{ $t("donnees") }}
          </v-btn>
          <v-divider vertical class="my-1"></v-divider>
          <v-btn color="transparent" size="small" @click="$router.push({ name: 'cgu' })">{{ $t("CGU") }}
          </v-btn>
          <v-divider vertical class="my-1"></v-divider>
          <v-btn color="transparent" size="small" @click="$router.push({ name: 'mentions' })">
            {{ $t("mentions") }}
          </v-btn>
          <v-divider vertical class="my-1"></v-divider>
          <v-btn color="transparent" size="small" @click="$router.push({ name: 'accessibilite' })">
            {{ $t("accessibilite") }}
          </v-btn>
        </v-col>
      </v-row>

    </v-card-text>
  </v-footer>
</template>

<style scoped lang="scss">
@use 'vuetify/settings';

.v-footer {
  flex-direction: column;
  width: 100vw;
  background-color: rgb(var(--v-theme-gris-clair));
  color: rgb(var(--v-theme-fond-noir));

  .footerTop {
    flex: 1 0 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 90%;
    padding-top: 1rem;
    padding-bottom: 2rem;

    @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
      flex: 0 0 70%;
      flex-direction: row;
      width: 98%;
    }

    @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
      div:nth-of-type(1) {
        flex: 1 0 25%;
        max-width: 30%;
      }
    }

    div:nth-of-type(2) {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
        flex: 1 0 30%;
        max-width: 30%;
      }

      ul {
        margin-left: 1rem;
        list-style: none;
        text-align: left;

        li {
          span {
            margin-right: 0.2rem;
          }

          a {
            color: rgb(var(--v-theme-primary));
          }
        }
      }
    }

    div:nth-of-type(3) {
      display: flex;
      justify-content: space-around;
      align-items: center;

    }

  }

  .footerBottom {
    width: 100%;
    background-color: rgb(var(--v-theme-fond-noir));
    color: rgb(var(--v-theme-background));
  }

  .v-divider {
    background-color: rgb(var(--v-theme-background));
  }

}


.orange-link {
  color: rgb(var(--v-theme-orange-abes));
  font-weight: bold;
}

#footerCard {
  margin-top: auto;
}

footer {
  padding-top: 0;
  background-color: rgb(var(--v-theme-gris-clair));
  border-top: 2px solid rgb(var(--v-theme-gris-fonce));
}
</style>