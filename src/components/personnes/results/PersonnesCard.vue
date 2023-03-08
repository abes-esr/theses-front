<template>
    <v-card flat>
        <div class="firstHalf">
              <div class="info">
                <div class="nom-card">
                <v-icon size="40px">$personne</v-icon>
                  <RouterLink class="nomprenom"  :to="{ name: 'personne', params: { id: item.id } }"
                              v-if="item.has_idref">
                    <span class="prenom">{{ item.prenom }}</span>
                    <span class="nom">{{ item.nom }}</span>
                  </RouterLink>
                  <RouterLink v-else class="nomprenom" :to="{ name: 'these', params: { id: item.theses[0].nnt } }">
                    <span class="prenom">{{ item.prenom }}</span>
                    <span class="nom">{{ item.nom }}</span>
                  </RouterLink>
                </div>
                <v-divider vertical></v-divider>
                <a v-if="item.has_idref" :href="`https://www.idref.fr/${item.id}`" target="_blank">
                  <img alt="logo"
                       id="logoIMG" src="@/assets/idref-icone.png"/>
                </a>
              </div>
        </div>
        <div class="secondHalf">
        </div>
    </v-card>
</template>
<script>
export default {
  name: "personnes-card",
};
</script>
<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>

<style scoped lang="scss">
@use 'vuetify/settings';

.line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.v-card {
    border: solid 1px rgb(var(--v-theme-gris-fonce));
    height: 100px;
}

:deep(.v-card-title) {
    white-space: break-spaces !important;
    font-size: 1rem;
}

.firstHalf {

  .info {

    display: flex;
    justify-content: space-between;
    align-items: center;
    margin:1rem;
    width: calc(100% - 2rem);

    @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
      width:calc(70% - 2rem);
    }

    .nom-card {
      display: flex;
      align-items: center;

      .v-icon {
        margin-right: 1rem;
      }

      .nomprenom {
        text-decoration: none;
        color:rgb(var(--v-theme-primary));
        font-size: 23.5px;

        @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
          font-size: 29.5px;
        }

        .prenom {
          font-weight: 400;
        }

        .nom {
          margin-left: 0.5rem;
          font-weight: 700;
        }
      }
    }

    hr {
      border-color: rgb(var(--v-theme-primary));
      opacity: 1;
      border-width: 0 1.5px 0 0;
    }
    a {
      img {
        max-height: 30px;
      }
    }
  }
}

.secondHalf {
    background-color: rgb(var(--v-theme-gris-clair)) !important;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 30%;
}

.subtitle {
    font-size: 0.9rem;
    font-weight: 400;
}
</style>