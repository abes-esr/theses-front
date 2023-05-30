<template>
    <v-container>
        <p>{{ $t('reportErrorView.info') }} <br /> {{ $t('reportErrorView.info2') }}<a target="_blank" :href="href">{{ href
        }}</a>
        </p>
        <v-form id="form" ref="form" v-model="isValid">
            <div class="form-row"><v-text-field :label="$t('reportErrorView.nom')" v-model="nom" :rules=requiredRule
                    required></v-text-field>
            </div>
            <div class="form-row">
                <v-text-field :label="$t('reportErrorView.prenom')" v-model="prenom" :rules=requiredRule
                    required></v-text-field>
            </div>
            <div class="form-row">
                <v-text-field :label="$t('reportErrorView.mail')" v-model="mail" :rules="mailRule" required></v-text-field>
            </div>
            <div class="form-row">
                <v-text-field :label="$t('reportErrorView.objet')" v-model="objet" :rules=requiredRule
                    required></v-text-field>
            </div>
            <div class="form-row">
                <v-textarea :label="$t('reportErrorView.question')" v-model="question" :rules=requiredRule
                    required></v-textarea>
            </div>
            <div class="form-row">
                <v-btn @click="validate()">{{ $t('reportErrorView.envoyer') }}</v-btn>
            </div>
        </v-form>
    </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
    nnt: {
        type: String,
        default: ""
    }
});

const href = computed(() => { return "https://theses.fr/" + props.nnt; });

const form = ref();
const nom = ref("");
const prenom = ref("");
const mail = ref("");
const objet = ref("");
const question = ref("");

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



function validate() {
    form.value.validate().then((v) => {
        if (v.valid) {
            // TODO
        }
    });
}

</script>

<style lang="scss" scoped>
p {
    padding-bottom: 30px;
}
</style>