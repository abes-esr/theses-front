<template>
  <!-- Mobile -->
  <ClientOnly>
    <CommonHeaderMobile v-if="mobile" type="home" @displayError="displayError" @activate-menu="activateMenu"
                        :loading="loading" :show-menu="showMenu"></CommonHeaderMobile>
  </ClientOnly>
  <NuxtLink v-if="!mobile" class="logo logo_home" :to="{ name: 'index', query: { domaine: 'theses' } }">
    <img :alt="$t('homepage')" id="logoIMG" src="/icone-theses-beta.svg" />
  </NuxtLink>
  <div class="signaler-erreur-container">
    <h1 class="sr-only">Formulaire de signalement d'erreur</h1>
    <p class="info-msg">{{ $t("reportErrorView.info") }}<a target="_blank" :href="href">{{ href }}</a></p>
    <p class="info-msg">{{ $t("reportErrorView.mandatory") }}</p>
      <v-form id="form" ref="form">
        <div class="form-row shortened">
          <v-text-field :label="$t('reportErrorView.nom')" v-model="nom" aria-autocomplete="given-name"
                        :rules=requiredRule variant="outlined" density="compact" class="item first-item"></v-text-field>
          <v-text-field :label="$t('reportErrorView.prenom')" v-model="prenom" aria-autocomplete="family-name" :rules=requiredRule variant="outlined"
                        density="compact" class="item"></v-text-field>
        </div>
        <div class="form-row shortened">
          <v-text-field :label="$t('reportErrorView.mail')" placeholder="exemple@abes.fr" v-model="mail" aria-autocomplete="email" :rules="mailRule" variant="outlined"
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
          <p class="error-message-text" v-html="errMsg"></p>
        </v-alert>
        <v-alert v-if="validationMsg !== ''" variant="outlined" type="success" density="compact">
          {{ validationMsg }}
        </v-alert>
        <div class="captcha-info">
          <span>
            {{ $t("reportErrorView.informationLegale1") + '\xa0' }}
            <a href="https://stp.abes.fr/node/3?origine=thesesFr" target="_blank">{{ $t("reportErrorView.informationLegale2") }}</a>
            {{ '\xa0' + $t("reportErrorView.informationLegale3") }}
            <IconsIconTarteaucitron></IconsIconTarteaucitron>
            {{ $t("reportErrorView.informationLegale4") }}
          </span>
        </div>
        <span class="form-row submit privacy">
          <br />
          <p>{{ $t("reportErrorView.informationLegale5") + '\xa0' }}</p>
          <a href="https://policies.google.com/privacy" target="_blank">{{ $t("reportErrorView.informationLegale6") }}</a><p>&nbsp;{{ $t("et") }}&nbsp;</p>
          <a href="https://policies.google.com/terms" target="_blank">{{ $t("reportErrorView.informationLegale7") }}</a>
          <p>&nbsp;{{ $t("reportErrorView.informationLegale8") }}</p>
        </span>
      </v-form>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";

const { t } = useI18n();
const route = useRoute();
const { mobile } = useDisplay();

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
        children: `tarteaucitron.init({"privacyUrl": "https://abes.fr/pages-donnees-personnelles/thesesfr.html", "bodyPosition": "top", "hashtag": "#tarteaucitron", "cookieName": "tarteaucitron", "orientation": "middle", "groupServices": false, "showDetailsOnClick": true, "serviceDefaultState": "wait", "showAlertSmall": false, "cookieslist": true, "closePopup": false, "showIcon": true, "iconPosition": "BottomRight", "adblocker": false, "DenyAllCta" : true, "AcceptAllCta" : true, "highPrivacy": true, "handleBrowserDNTRequest": false, "removeCredit": false, "moreInfoLink": true, "useExternalCss": false, "useExternalJs": false, "readmoreLink": "", "mandatory": true, "mandatoryCta": true});`
      },
      {
        children: `tarteaucitron.user.recaptchaapi = '6LchRDMnAAAAAFSPyM8p7mvowBkOiQC6WYahnsV-'; (tarteaucitron.job = tarteaucitron.job || []).push('recaptcha');`
      }
    ]
  });

const href = computed(() => { return "https://theses.fr/" + route.query.nnt; });

var domainItems = [];

const form = ref();
const nom = ref("");
const prenom = ref("");
const mail = ref("");
const objet = ref("");
const domaine = ref("");
const question = ref("");
const showMenu = ref(false);

onMounted(() => {
  domainItems = computed(() => {
    return [
      t('reportErrorView.description'),
      t('reportErrorView.access'),
      t('reportErrorView.cancelling'),
      t('reportErrorView.personnalData'),
      t('reportErrorView.others')
    ]
  });
});

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
        errMsg.value = t('reportErrorView.erreurCookie') + ` <img style='height: 2em; margin: 0 5px; vertical-align: middle;'
                    src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAGA0lEQVRoge1a207bWBRdBtJwLYZhKDMVmlSK1LxNkPo+ZH6g8B6p5AuALwC+APoFoVLeoT8whPeRSt+CZKmZVu3AiIsRlEtCktGyjy8xzuXYhvahS0JJHJ/4rLP3XnuffcAPfGdQ7mM6jRLSAF4BxqsbewB2lRS2o35mpEQaJcwCyANIdLi1DGBNSWEzqmdHRqRRwjqAJclhtExOSUEP+/xIiDRKhhUWfL7ShTtBuJnqcw+/z4Ql0xNmMEwSSz4kuNIzSgpjSsqYJP/GeE185wYJroedRyiLNEpGLLzzrHSuk+83SgbxvOcyyRaDziWsRVZkSRDinpzPbwVGWIucuohsKynMS47fAQyls/BMSRmKJo3AFhG5wm2N1wF+Zs3zebbFfR0RxrXcJHQlgH+LMW616pR/WiIMEXfW3mtzXyeEGWsjKot8c4TOI98L+iKaR5PS6IUk88RLAO9F8UjrbYoYMOosNavpfmODIiwRXRR/G3ohaWVo1RU/c30jV8ab2mV8qVGzHWBOLyTLZiWs5Rolg/C3ySOi0tXP/k4aEwOwSBKPJs7Rp16ABJTe+p1xVX0It/owqqdDEMRoqd3RFxqDPh20Ig6VEPVC0i5RSCD+6wl6HlW7GksSlUMV11/GrUs5NasFLusDE9ELSVphXemtJwaT/8JyIRvxNNCfBmIiNdR04LII3DSrbe0yjqvyJF/ppptqVlt+MCLCEh/oOkPPP6N38Mb5cnQBGFsEqmXg5j3QMwoMzwGnr4HYbybBq13gZAOom/FO63zdf2qQArCsZrUN2TlJy69eSDKYV+6Q4MpP75ivHzPA53ngaBW4eGuSOt0A/lsGPmXMz0+3TFJcTfFbPfFbfnwlhON+iQhlWmA82CQ4ocQ7c6KcfL3DHuls0yT6Sx4YnLXJDCQOIRRv5yGIJBgP8Sdisj2qubpc5UGJmo+W49ifVmzL8HcpGhQPvZCUKiCliIhEN0tr2OCqHuSA8gwQ/92MkU7gxEmeVqGrTTgpxPXbUrtGWYus0I9thRIraagRQUIDf7Qn4yZhKRiFQIyhfMfUr3yblokVWSJ6k8xSnc7eNN/RjowfCYiFoDUFer1S3gW6JiJ8Nt30EMbEhU+vzSIztuRYjRLsR8IHLjlf7HZ+MrWWEXxNmbvapt4jGSqZRYSkGUetSNTPzHsui5YMQ2ajJUNks6mw4wT54Ok2ShnzzIPCUGshzawCRKy5FqvrTZe0RWzQGvw79m67XZjKmxJrLsICjtZa55gxXy+6F4sYsEtxTqhXdRTLC8ulSDaWoCLsolfN+8YUhOsJV709H7Cudr0LlVEtzqBcN+shEyThdR941OnAbF8pirKJqXyupTRTtQSReiVmXW1j7oBErB0d9xM2WEd5J9ZKYtuR4WKwwBSoORbpGrJ5ZI9lt71irJmGX1px0JYE26uNErawr2zfIcP4OHEKXm66PA3wjpCNEfpJunI4muifPjKvsFCkGjExTq63yxMJsZNMYF/J4HmDC5A3Yq36jy0ClePHVhwuu/b1HSFlEfHD5ZtD1bEK44Qu1mWys6tbWmZyPWckzlPTGiRw/XHCuk+q4Rek+mVrVL/UppwrdDEGNV2kpyuhccgc5Oxm9vWnn+19vJrVpLor0kTUrGacMplb1CfOFyTD4o9uNrHqr2Z+ZMSp1c2XcVSORnh9Q81q3k599ETgkNnjg0nGzi10K7rX+bZpHbrblPcY5A4Zxk2xcjzCvTpd9027Aa0QtouyyrKFRR6D/04DwkFGvHPXM3Qda/Jb4nPgI7hQLVM1q5HIBt2MzQNa57Z1DiiLAGa5Mi+O4Sz3Mpp6laPHO6InII3ITnX1QtI+EOX+m9ZxleOZ/j9PiuKoLi3aqXPuEoSye/Vhkm+LalbLtHhMS0R6zu7aZ3vP2jOjL7QVv4McxhcDnZIelAQibGIbULOapf3PuE1Vs9qeaOTdkVKr00gCQiw4NlBzDvf1Lxx+uP5r3Dgv5KQZRzWn+GRwz8jmDS8itUg7iB6vLuJCF5Uty4A9mVKkFR6MiJDachST/oHvHgD+B4SoUIitpF05AAAAAElFTkSuQmCC'
                    alt='` + t('reportErrorView.modale') + `' title='` + t('reportErrorView.modale') + `'> ` + t('reportErrorView.erreurCookie2');


      }
    }
  });
}

function buildJSONToPost(token) {
    return {
        "token": token,
        "url": "https://theses.fr/" + route.query.nnt,
        "nom": nom.value,
        "prenom": prenom.value,
        "mail": mail.value,
        "domaine": domaine.value,
        "objet": objet.value,
        "question": question.value,
        "appSource": route.query.source,
        "etabPpn": route.query.etabPpn
    }
}

/**
 * Fonctionnement du header mobile
 */
function activateMenu() {
  sleep(250).then(() => {
    showMenu.value = !showMenu.value;
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
</script>

<style lang="scss" scoped>
@use '../node_modules/vuetify/settings';

.info-msg {
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

  a, p {
    align-content: end !important;
    text-align: end;
  }
}

.privacy {
    font-size: 0.8rem;
    color: rgb(var(--v-theme-text-dark-blue));
    padding-top: 0.8rem;
}

.v-text-field {
    padding-left: 5px;
    padding-right: 5px;
}

.signaler-erreur-container {
  margin: 2em 0;
  padding: 2em 3em 3em 3em;
  background-color: rgb(var(--v-theme-surface));

  border: 1px solid rgb(var(--v-theme-gris-clair));
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 80%;

  @media #{ map-get(settings.$display-breakpoints, 'sm-and-down')} {
    margin-top: 1em;
    margin-bottom: 1em;
    padding-bottom: 0;
    width: 100%;
  }
}

.form-wrapper {
  display: flex;
  justify-content: center;
}

.v-form {
    display: flex;
    flex-direction: column;
}

:deep(.v-label) {
  color: rgb(var(--v-theme-text-dark-blue));
  opacity: 1 !important;
}

.v-btn {
    margin-right: 10px;
}

.error-message-text {
  margin: 0 5px;
}

a {
  text-decoration: underline;
}
</style>

