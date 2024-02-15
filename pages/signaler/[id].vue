<template>
  <div class="signaler-erreur-container">
    <p>{{ $t("reportErrorView.info") }}<a target="_blank" :href="href">{{ href
      }}</a>
    </p>
    <div class="form-wrapper">
      <v-form id="form" ref="form">
        <div class="form-row shortened">
          <v-text-field :label="$t('reportErrorView.nom')" v-model="nom"
                        :rules=requiredRule variant="outlined" density="compact" class="item first-item"></v-text-field>
          <v-text-field :label="$t('reportErrorView.prenom')" v-model="prenom" :rules=requiredRule variant="outlined"
                        density="compact" class="item"></v-text-field>
        </div>
        <div class="form-row shortened">
          <v-text-field :label="$t('reportErrorView.mail')" v-model="mail" :rules="mailRule" variant="outlined"
                        density="compact" required></v-text-field>
        </div>
        <div class="form-row shortened">
          <v-select :label="$t('reportErrorView.domaine')" v-model="domaine" :rules=requiredRule :items="domainItems"
                    variant="outlined" density="compact" required></v-select>
        </div>
        <div class="form-row shortened">
          <v-text-field :label="$t('reportErrorView.objet')" v-model="objet" :rules=requiredRule variant="outlined"
                        density="compact" required></v-text-field>
        </div>
        <div class="form-row">
          <v-textarea :label="$t('reportErrorView.question')" v-model="question" :rules=requiredRule
                      variant="outlined" density="compact" required></v-textarea>
        </div>
        <div class="form-row submit">
          <v-btn flat variant="outlined" size="large" :loading="loading" @click="validate">{{
              $t("reportErrorView.envoyer") }}
          </v-btn>

        </div>
        <v-alert v-if="errMsg !== ''" variant="outlined" type="error" density="compact">
          {{ errMsg }}
        </v-alert>
        <v-alert v-if="validationMsg !== ''" variant="outlined" type="success" density="compact">
          {{ validationMsg }}
        </v-alert>
        <div class="captcha-info">
          L'envoi du formulaire nécessite l'acceptation du cookie reCAPTCHA.
        </div>
        <div class="form-row submit privacy">
          <br />
          Ce formulaire est protégé par reCAPTCHA et les&nbsp;
          <a href="https://policies.google.com/privacy" target="_blank">Politiques de
            confidentialité</a>&nbsp;et&nbsp;<a href="https://policies.google.com/terms" target="_blank">Conditions
          d'utilisations</a>&nbsp;de Google
          s'appliquent.
        </div>
      </v-form>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from "vue-i18n";

const { t } = useI18n();


  useHead({
    title: "Theses.fr",
      viewport: "width=device-width, initial-scale=1, maximum-scale=1",
      charset: "utf-8",
      meta: [{ name: "description", content: "Moteur de recherche des thèses françaises, theses.fr propose l’accès aux thèses de doctorat soutenues ou en préparation." }],
    script: [
      {
        src: "/tarteaucitronjs/tarteaucitron.js"
      },
      {
        children: `tarteaucitron.init({"privacyUrl": "https://abes.fr/pages-donnees-personnelles/thesesfr.html", "bodyPosition": "bottom", "hashtag": "#tarteaucitron", "cookieName": "tarteaucitron", "orientation": "middle", "groupServices": false, "showDetailsOnClick": true, "serviceDefaultState": "wait", "showAlertSmall": false, "cookieslist": false, "closePopup": false, "showIcon": true, "iconPosition": "BottomRight", "adblocker": false, "DenyAllCta" : true, "AcceptAllCta" : true, "highPrivacy": true, "handleBrowserDNTRequest": false, "removeCredit": false, "moreInfoLink": true, "useExternalCss": false, "useExternalJs": false, "readmoreLink": "", "mandatory": false, "mandatoryCta": false});`
      },
      {
        children: `tarteaucitron.user.recaptchaapi = '6LchRDMnAAAAAFSPyM8p7mvowBkOiQC6WYahnsV-'; (tarteaucitron.job = tarteaucitron.job || []).push('recaptcha');`
      }
    ]
  });

const props = defineProps({
    nnt: {
        type: String,
        default: ""
    },
    source: {
        type: String,
        default: "Star"
    },
    etabPpn: {
        type: String,
        default: ""
    }
});

const href = computed(() => { return "https://theses.fr/" + props.nnt; });

const domainItems = [
    "Signaler des erreurs dans la description de la thèse",
    "Signaler un problème d'accès au document",
    "Signaler l'aboutissement ou l'abandon du projet de thèse",
    "Signaler des erreurs sur les données personnelles (droit de rectification)",
    "Autre"
]

const form = ref();
const nom = ref("");
const prenom = ref("");
const mail = ref("");
const objet = ref("");
const domaine = ref("");
const question = ref("");


/**
 * Règles de validation du formulaire
 */
const requiredRule = [value => {
    if (value) return true;
    return t("reportErrorView.requis");
}];

const mailRule = [value => {
    if (value) return true;

    return t("reportErrorView.requis");
},
value => {
    if (/.+@.+\..+/.test(value)) return true;
    return t("reportErrorView.mailInvalide");
},];


/**
 * Callback formulaire
 */
const { postSignalerErreur } = useThesesAPI();
const loading = ref(false);
const errMsg = ref("");
const validationMsg = ref("");

function validate() {
  errMsg.value = "";
  validationMsg.value = "";

  form.value.validate().then((v) => {
    if (v.valid) {
      if (typeof grecaptcha !== "undefined") {
        grecaptcha.ready(function() {
          loading.value = true;
          grecaptcha.execute("6LchRDMnAAAAAFSPyM8p7mvowBkOiQC6WYahnsV-", { action: "submit" }).then(function(token) {
            postSignalerErreur(buildJSONToPost(token)).then((res) => {
              const error = res.error.value;
              if (error) {
                errMsg.value = "Erreur : " + error.data.message;
              } else {
                validationMsg.value = t('reportErrorView.msg');
                form.value.reset();
              }
            }).catch((err) => {
              errMsg.value = "Erreur : " + err.response.data.message;
            }).finally(() => {
              loading.value = false;
            });
          });
        });
      } else {
        errMsg.value = "Erreur : le formulaire nécessite l'acceptation du cookie reCAPTCHA. ";
      }
    }
  });
}

function buildJSONToPost(token) {
    return {
        "token": token,
        "url": "https://theses.fr/" + props.nnt,
        "nom": nom.value,
        "prenom": prenom.value,
        "mail": mail.value,
        "domaine": domaine.value,
        "objet": objet.value,
        "question": question.value,
        "appSource": props.source,
        "etabPpn": props.etabPpn
    }
}

</script>

<style lang="scss" scoped>
@use '../node_modules/vuetify/settings';

p {
    padding-bottom: 30px;
}

.form-row {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 10px;
}

.captcha-info {
  padding-top: 1em;
}

.first-item {
    @media #{ map-get(settings.$display-breakpoints, 'md-and-up')} {
        padding-right: 2rem !important;
    }
}

.item {
    flex: 1 1 50%;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
        flex-basis: 100%;
    }
}

.shortened {
    width: 66%;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
        width: 100%;
    }
}

.half {
    width: 50%;

    @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
        width: 100%;
    }
}

.submit {
    justify-content: flex-end;
    margin-right: 10px;
}

.privacy {
    font-size: 0.8rem;
    color: rgb(var(--v-theme-gris-fonce));
    padding-top: 0.8rem;
}

.v-text-field {
    padding-left: 5px;
    padding-right: 5px;
}


.signaler-erreur-container {
  padding: 3em;
  background-color: rgb(var(--v-theme-surface));
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.form-wrapper {
  display: flex;
  justify-content: center;
}

.v-form {
    display: flex;
    flex-direction: column;
}

.v-btn {
    margin-right: 10px;
}
</style>