<template>
  <v-footer class="pa-0">
    <div class="footer-top">
      <div class="theses-description footer-content">
        <h1 aria-hidden="true">theses.fr</h1>
        <span>{{ $t("footer.texte") }}</span>&nbsp;
        <a href="/apropos" :alt="$t('apropos.aboutLink')"><strong>{{
          $t("footer.plus")
            }}</strong></a>
      </div>
      <div class="links-container footer-content">
        <h1 aria-hidden="true" id="footer-link-title">
          <v-icon :title="$t('externalLink')">mdi-open-in-new</v-icon>
          {{ $t("accesDirect") }}
        </h1>
        <div class="list-1" role="list" aria-labelledby="footer-link-title">
          <div role="presentation" class="colonne1">
            <div class="list-item" role="listitem">
              <span class="first-column-bullet"><span class="orange-link">{{ ">\xa0" }}</span></span>
              <span><a href="https://bibliomap.theses.fr/" target="_blank" :title="$t('footer.bibliomapInfo')">
                  {{ $t("footer.bibliomap") }}</a></span>
            </div>
            <div class="list-item" role="listitem">
              <span class="first-column-bullet"><span class="orange-link">{{ ">\xa0" }}</span></span>
              <span><a href="https://www.data.gouv.fr/fr/datasets/theses-soutenues-en-france-depuis-1985/"
                  target="_blank" :title="$t('apropos.dataGouv')">
                  {{ $t("footer.opendata") }}</a></span>
            </div>
            <div class="list-item" role="listitem">
              <span class="first-column-bullet"><span class="orange-link">{{ ">\xa0" }}</span></span>
              <span><a
                  href="https://www.data.gouv.fr/fr/organizations/agence-bibliographique-de-lenseignement-superieur/#/dataservices"
                  target="_blank" :title="$t('footer.apiGouv')">
                  {{ $t("footer.apiThesesfr") }}</a></span>
            </div>
            <div class="list-item" role="listitem">
              <span class="first-column-bullet"><span class="orange-link">{{ ">\xa0" }}</span></span>
              <span><a href="https://www.idref.fr/" target="_blank" :title="$t('footer.idRef')">{{
                $t("footer.idRref")
                  }}</a></span>
            </div>
            <div class="list-item" role="listitem">
              <span class="first-column-bullet"><span class="orange-link">{{ ">\xa0" }}</span></span>
              <span><a :href="$t('docUrl.index')" target="_blank" :title="$t('footer.accesDoc')">{{
                $t("footer.doc") }}</a></span>
            </div>
          </div>
          <div role="presentation" class="colonne2">
            <div class="list-item" role="listitem">
              <span class="first-column-bullet"><span class="orange-link">{{ ">\xa0" }}</span></span>
              <span><a href="http://www.sudoc.abes.fr/cbs/" target="_blank" :title="$t('footer.accesSudoc')">{{
                $t("footer.catalogue") }}</a></span>
            </div>
            <div class="list-item" role="listitem">
              <span class="first-column-bullet"><span class="orange-link">{{ ">\xa0" }}</span></span>
              <span><a :href="$t('docUrl.formatTEF')" target="_blank" :title="$t('footer.accesTEF')">{{
                $t("footer.tef")
              }}</a></span>
            </div>
            <div class="list-item" role="listitem">
              <span class="first-column-bullet"><span class="orange-link">{{ ">\xa0" }}</span></span>
              <span><a href="https://stp.abes.fr/node/3?origine=thesesFr" target="_blank"
                  :title="$t('footer.accesAssistance')">{{
                    $t("footer.assistance") }}</a></span>
            </div>
            <div class="list-item" role="listitem">
              <span class="first-column-bullet"><span class="orange-link">{{ ">\xa0" }}</span></span>
              <span><a href="http://search.ndltd.org/" target="_blank" :title="$t('footer.accesGlobalETD')">{{
                $t("footer.globalETD") }}</a></span>
            </div>
          </div>
        </div>
      </div>
      <div class="logos-container footer-content" role="list">
        <a role="listitem" href="https://www.enseignementsup-recherche.gouv.fr/fr" target="_blank"
          :title='$t("footer.logoMesriAlt")'>
          <img src="../../assets/logo-mesr.svg" :alt='$t("footer.logoMesriAlt")' class="pr-4 "></a>
        <a href="https://abes.fr/" target="_blank" :title='$t("footer.logoAbesAlt")'>
          <img src="../../assets/abes-logo-cercle.svg" :alt='$t("footer.logoAbesAlt")'></a>
      </div>
    </div>
    <v-divider></v-divider>
    <v-card-text class="footerBottom">
      <div class="text-center text-md-left pa-0 slogan">
        {{ new Date().getFullYear() }} —
        theses.fr, {{ $t('slogan') }}
      </div>
      <div class="text-center text-md-right pa-0">
        <v-divider vertical class="my-1"></v-divider>
        <v-btn flat plain color="transparent" size="small" target="_blank"
          href="https://abes.fr/pages-donnees-personnelles/thesesfr.html" :title="$t('footer.accesDonnees')">
          {{ $t("donnees") }}
        </v-btn>
        <v-divider vertical class="my-1"></v-divider><span class="mobileHide">|</span>
        <v-btn flat color="transparent" size="small" target="_blank"
          href="https://abes.fr/pages-cgu/conditions-generales-utilisation-sites-abes.html"
          :title="$t('footer.accesCGU')">{{ $t("CGU") }}
        </v-btn>
        <v-divider vertical class="my-1"></v-divider><span class="mobileHide">|</span>
        <v-btn flat color="transparent" size="small" href="https://abes.fr/pages-mentions-legales/theses.html"
          target="_blank" :title="$t('footer.accesMention')">
          {{ $t("mentions") }}
        </v-btn>
        <v-divider vertical class="my-1"></v-divider><span class="mobileHide">|</span>
        <v-btn flat color="transparent" size="small" target="_blank"
          href="https://abes.fr/pages-accessibilite/theses.html" :title="$t('footer.accesAccessibilite')">
          {{ $t("accessibilite") }}
        </v-btn>
      </div>
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

  .footer-top {
    display: grid;
    grid-template-columns: 45fr 0.5fr 45fr 0.5fr 15fr;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
      display: flex;
      flex-direction: column;
    }

    width: 90%;

    @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
      flex: 0 0 70%;
      flex-direction: row;
      width: 97%;
    }

    div {
      ul {
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

    a {
      text-decoration: none;
      color: rgb(var(--v-theme-secondary-darken-2)) !important;

    }
  }

  .links-container {
    order: 2;
    width: 100%;
    grid-column-start: 3;
    grid-row-start: 1;

    display: grid;
    grid-template-rows: 1.8rem auto;

    justify-content: center;


    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
      justify-content: flex-start;
    }

    .list-1 {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      justify-content: flex-start;
      margin-left: 1.5rem;
    }

    .list-1 div {
      flex: 1 0 50%;
      box-sizing: border-box;
      line-height: 1.35rem;
    }

    .colonne1 {
      min-width: 90%;
      max-width: 90%;
    }

    .colonne2 {
      min-width: 90%;
      max-width: 90%;
    }

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-up')} {
      .colonne1 {
        min-width: 250px;
        max-width: 250px;
      }

      .colonne2 {
        min-width: 350px;
        max-width: 350px;
      }

    }

    .v-icon {
      font-size: 1.3rem;
    }
  }


  .theses-description {
    grid-column-start: 1;
    order: 1;

    span {
      line-height: 1.3;
      opacity: 0.9;
      color: rgb(var(--v-theme-text-dark-blue));

    }
  }

  .logos-container {
    order: 3;
    grid-column-start: 5;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: flex-end;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
      justify-content: space-around;
    }


    a {
      img {
        height: 6em;
      }

      padding-left: 40px;

      @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
        padding-left: unset;
      }
    }
  }

  .footerBottom {
    width: 100%;
    background-color: rgb(var(--v-theme-fond-noir));
    color: rgb(var(--v-theme-white-text-footer));

    display: grid;
    grid-template-columns: 1fr 1fr;

    border-top: rgb(var(--v-theme-gris-clair)) solid 1px;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
      display: flex;
      flex-direction: column;
    }

    .v-btn {
      text-transform: none !important;
      font-weight: 400;
      font-size: 0.875rem;
      letter-spacing: unset;
    }

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
      max-height: unset;

      .v-btn {
        width: 100%;
        line-height: 2rem;
        font-size: 0.9rem;
        height: 3rem;
      }
    }

    .v-row {
      margin-left: 0px !important;
      margin-right: 0px !important;
    }

  }

  .v-divider {
    background-color: rgb(var(--v-theme-gris-clair));
  }

}

h1 {
  color: rgb(var(--v-theme-primary));
  font-size: 1.2rem;
}

h2 {
  color: rgb(var(--v-theme-primary));
  font-size: 15px;
  font-family: "Roboto-Bold", sans-serif;
  font-weight: 700;
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
  border-top: 2px solid rgb(var(--v-theme-gris-fonce));
}

.list-item {
  display: flex;
}

.footer-content {
  margin: 0.8em 0 0.8em;
}

.slogan {
  display: flex;
  align-items: center;

  @media #{ map-get(settings.$display-breakpoints, 'md-and-down')} {
    justify-content: center;
  }
}

.mobileHide {
  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    display: none !important;
  }
}
</style>