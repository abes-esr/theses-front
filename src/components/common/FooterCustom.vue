<template>
  <v-footer class="pa-0">
    <div class="footerTop">
      <div class="links-container">
        <h3>
          <v-icon>mdi-arrow-top-right</v-icon>
          {{ $t("accesDirect") }}
        </h3>
        <ul class="list-1">
          <li><span class="orange-link"> > </span><a
              href="https://www.data.gouv.fr/fr/datasets/theses-soutenues-en-france-depuis-1985/" target="_blank">{{
                $t("footer.opendata") }}</a>
          </li>
          <li><span class="orange-link"> > </span><a href="http://www.sudoc.abes.fr/cbs/" target="_blank">{{
            $t("footer.catalogue") }}</a>
          </li>
          <li><span class="orange-link"> > </span><a
              href="https://documentation.abes.fr/aidetheses/thesesfr/index.html#TEF" target="_blank">{{ $t("footer.tef")
              }}</a>
          </li>
          <li><span class="orange-link"> > </span><a href="https://www.idref.fr/" target="_blank">{{ $t("footer.idRref")
          }}</a>
          </li>
          <li><span class="orange-link"> > </span><a href="https://documentation.abes.fr/aidetheses/thesesfr/index.html"
              target="_blank">{{ $t("footer.doc") }}</a>
          </li>
          <li><span class="orange-link"> > </span><a href="https://stp.abes.fr/node/3?origine=thesesFr" target="_blank">{{
            $t("footer.assistance") }}</a>
          </li>
        </ul>
      </div>
      <div class="theses-description">
        <h4>Theses.fr</h4>
        <span>{{ $t("footer.texte") }}</span>&nbsp;<a href="/apropos">{{ $t("footer.plus")
        }}</a>
      </div>
      <div class="logos-container">
        <a href="https://abes.fr/" target="_blank" :title='$t("footer.logoAbesAlt")'>
          <img src="../../assets/abes-logo-cercle.svg" :alt='$t("footer.logoAbesAlt")'></a>
        <a href="https://www.enseignementsup-recherche.gouv.fr/fr" target="_blank" :title='$t("footer.logoMesriAlt")'>
          <img src="../../assets/logo-mesr.svg" :alt='$t("footer.logoMesriAlt")' class="pr-4 "></a>
      </div>
    </div>
    <v-divider></v-divider>
    <v-card-text class="footerBottom">
      <v-row>
        <v-col cols="12" md="3" class="text-center text-md-left pa-0">
          {{ new Date().getFullYear() }} —
          <strong>Theses.fr</strong>
          <div id="accessconfig" data-accessconfig-buttonname="Paramètres d’accessibilité"
            data-accessconfig-params='{ "Prefix" : "a42-ac", "ContainerClass" : "","ModalCloseButton" : "","ModalTitle" : "","FormFieldset" : "","FormFieldsetLegend" : "","FormRadio" : "", "ImageReplacement" : false}'>
          </div>
        </v-col>
        <v-col cols="12" md="9" class="text-center text-md-right pa-0">
          <v-divider vertical class="my-1"></v-divider>
          <v-btn plain color="transparent" size="small" target="_blank"
            href="https://abes.fr/pages-donnees-personnelles/thesesfr.html">
            {{ $t("donnees") }}
          </v-btn>
          <v-divider vertical class="my-1"></v-divider>
          <v-btn color="transparent" size="small" target="_blank"
            href="https://abes.fr/pages-cgu/conditions-generales-utilisation-sites-abes.html">{{ $t("CGU") }}
          </v-btn>
          <v-divider vertical class="my-1"></v-divider>
          <v-btn color="transparent" size="small" href="https://abes.fr/pages-mentions-legales/theses.html"
            target="_blank">
            {{ $t("mentions") }}
          </v-btn>
          <v-divider vertical class="my-1"></v-divider>
          <v-btn color="transparent" size="small" target="_blank" href="https://abes.fr/pages-accessibilite/theses.html">
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
  background-color: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-fond-noir));
  flex-basis: 1%;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
    max-height: 300px;
  }

  .footerTop {
    display: grid;
    grid-template-columns: 30fr 0.5fr 30fr 0.5fr 30fr;

    width: 90%;
    padding-top: 1em;
    padding-bottom: 1em;

    @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
      flex: 0 0 70%;
      flex-direction: row;
      width: 97%;
    }

    @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
      div:nth-of-type(1) {

      }
    }

    div {

      @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {

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

            @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
              line-height: 1.8rem;
            }
          }
        }
      }
    }
  }

  .links-container {
    width: 100%;
    grid-column-start: 3;
    grid-row-start: 1;

    display: grid;
    grid-template-rows: 1fr 8fr;

    .list-1 {

    }
  }

  .theses-description {
    grid-column-start: 1;

    span {
      opacity: 0.6;
    }
  }

  .logos-container {
    grid-column-start: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: end;

    a {

      img {
        height: 6em;
      }
    }
  }

  .footerBottom {
    width: 100%;
    background-color: rgb(var(--v-theme-fond-noir));
    color: rgb(var(--v-theme-background));

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
      .v-btn {
        width: 100%;
        line-height: 2rem;
        font-size: 0.9rem;
        height: 3rem;
      }
    }

  }

  .v-divider {
    background-color: rgb(var(--v-theme-gris-clair));
  }

}

h3 {
  color: rgb(var(--v-theme-primary));
  margin-left: 1rem;
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
  background-color: rgb(var(--v-theme-surface));
  border-top: 1px solid rgb(var(--v-theme-gris-clair));
}
</style>