<template>
    <v-container>
        <p>{{ $t('reportErrorView.info') }}<a target="_blank" :href="href">{{ href
        }}</a>
        </p>
        <v-form id="form" ref="form" v-model="isValid">
            <div class="form-row shortened"><v-text-field :label="$t('reportErrorView.nom')" v-model="nom"
                    :rules=requiredRule variant="outlined" density="compact" class="item pr-4"></v-text-field>
                <v-text-field :label="$t('reportErrorView.prenom')" v-model="prenom" :rules=requiredRule variant="outlined"
                    density="compact" class="item pl-4"></v-text-field>
            </div>
            <div class="form-row shortened">
                <v-text-field :label="$t('reportErrorView.mail')" v-model="mail" :rules="mailRule" variant="outlined"
                    density="compact" required></v-text-field>
            </div>
            <div class="form-row half">
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
                <v-btn flat size="large" @click="emit('close')">{{ $t('reportErrorView.annuler') }}</v-btn>
                <v-btn flat size="large" :loading="loading" @click="validate">{{ $t('reportErrorView.envoyer') }}</v-btn>

            </div>
            <v-alert v-if="errMsg !== ''" variant="outlined" type="error" density="compact">
                {{ errMsg }}
            </v-alert>
            <div class="form-row submit privacy">
                Ce formulaire est protégé par reCAPTCHA et les&nbsp;
                <a href="https://policies.google.com/privacy" target="_blank">Politiques de
                    confidentialité</a>&nbsp;et&nbsp;<a href="https://policies.google.com/terms" target="_blank">Conditions
                    d'utilisations</a>&nbsp;de Google
                s'appliquent.
            </div>
        </v-form>
    </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from "vue-i18n";
import { thesesAPIService } from '@/services/ThesesAPI';

const emit = defineEmits('close', 'done');

const { t } = useI18n();



//Chargement de recaptcha sur ce composant, puis suppression lorsque le composant n'est plus utilisé
var script = document.createElement('script');
onMounted(() => {
    script.type = 'text/javascript';
    script.src = 'https://www.google.com/recaptcha/api.js?render=6LchRDMnAAAAAFSPyM8p7mvowBkOiQC6WYahnsV-';
    document.head.appendChild(script);
})
onBeforeUnmount(() => {
    script.remove();
})


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
const { postSignalerErreur } = thesesAPIService();
const loading = ref(false);
const errMsg = ref("");

function validate() {
    errMsg.value = "";
    form.value.validate().then((v) => {
        if (v.valid) {
            grecaptcha.ready(function () {
                loading.value = true;
                grecaptcha.execute('6LchRDMnAAAAAFSPyM8p7mvowBkOiQC6WYahnsV-', { action: 'submit' }).then(function (token) {
                    postSignalerErreur(buildJSONToPost(token)).then(() => {
                        emit('done');
                    }).catch((err) => {
                        errMsg.value = "Erreur : " + err.response.data.message;
                    }).finally(() => { loading.value = false; });
                });
            });
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
@use 'vuetify/settings';

p {
    padding-bottom: 30px;
}

.form-row {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 10px;
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
    justify-content: end;
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

.v-form {
    display: flex;
    flex-direction: column;
}

.v-container {
    background-color: rgb(var(--v-theme-surface));
}

.v-btn {
    margin-right: 10px;
}
</style>