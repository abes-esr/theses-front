<template>
  <div>
    <div class="resume-title-wrapper">
        <v-icon color="primary">mdi-file-document-arrow-right</v-icon>
        <h1>{{ $t('theseView.resume') }}</h1>
        <!--    language selector-->
    </div>
      <div id="resume-text">
        <p :class='{ "truncated-text": !readMore }'>
          {{ resume }}
        </p>
      </div>
    <div id="resume-button-wrapper" v-if="typeof resume !== 'undefined'">
      <v-btn id="read-more-button" @click="readMore = !readMore" flat>
        <span></span>
        <span>{{ readMore ? 'Moins' : 'Lire la suite' }}</span>
        <v-icon class="toggle-up-down" :class='{ "rotate": readMore }'>mdi-arrow-down-circle-outline</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUpdate, ref, watch } from "vue";

const props = defineProps({
  these: {
    type: Object
  },
  selectedLanguage: {
    type: String,
    default: 'fr'
  }
});

const resume = ref("");
const readMore = ref(false);

onBeforeUpdate(() => {
  if (typeof props.these.resumes !== 'undefined') {
    resume.value = props.these.resumes[props.selectedLanguage];
  }
});

/**
 * Watchers
 */
watch(() => props.selectedLanguage, async (newSelected) => {
  for (const [key, value] of Object.entries(props.these.value.resumes)) {
    if (key === newSelected)
      resume.value = value;
  }
});

</script>

<style scoped lang="scss">
@use 'vuetify/settings';

  .resume-title-wrapper {
    display: inline-flex;
    align-items: center;
  }

  h1 {
    font-size: 24px;
    margin-left: 5px;

    font-family: Roboto-Bold, sans-serif;
    font-weight: 700;
    letter-spacing: 0px;
    color: rgb(var(--v-theme-text-dark-blue))
  }

  p {
    text-align: justify;

    font-size: 16px;
    font-family: Roboto-Regular, sans-serif;
    font-weight: 400;
    letter-spacing: 0px;
    color: rgb(var(--v-theme-text-dark-blue));
  }

  .truncated-text {
    height: 50px;
    overflow: hidden;
  }

  #resume-text {
    margin: 0 10px;
  }

  .mdi-file-document-arrow-right.v-icon--size-default {
    font-size: 25px;
    width: 35px;
  }

  #resume-button-wrapper {
    display: flex;
    justify-content: end;
  }

  #read-more-button {
    margin-top: 7px;
    background-color: rgb(var(--v-theme-primary));
    text-transform: none;
    color: white;
    width: 130px;
    display: inline-flex;
    padding: 0 7px;
    letter-spacing: 0px;

    :deep(.v-btn__content) {
      width: 100%;
      justify-content: space-between;
    }
  }

  .toggle-up-down {
    transition: transform .3s ease-in-out !important;
  }

  .toggle-up-down.rotate {
    transform: rotate(180deg);
}
</style>