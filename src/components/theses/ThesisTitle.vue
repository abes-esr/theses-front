<template>
  <div class="title-wrapper line-clamp">
    <div class="thesis-icon">
      <thesis-icon :status="status"></thesis-icon>
    </div>
    <div class="title-flexbox"> <!-- #TODO v-if anglais/francais -->
      <span>
        {{ currentTitle }}
        <!--        selecteur langue-->
      </span>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUpdate, ref } from "vue";
import ThesisIcon from "@/components/theses/results/ThesisIcon.vue";

const props = defineProps({
  titles: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  selectedLanguage: {
    type: String,
    default: 'fr'
  },
  dataReady: {
    type: Boolean
  }
});

const currentTitle = ref("");

onBeforeUpdate(() => {
  currentTitle.value = props.titles.fr;
});

</script>

<style lang="scss" scoped>
@use 'vuetify/settings';

.title-wrapper {
  padding: 20px 20px 10px 10px;
  display: grid !important;
  grid-template-columns: 2fr 20fr;
}

.thesis-icon {
  align-self: start;
  justify-self: center;
}

.title-flexbox {
  span {
    font-family: Roboto-Medium, sans-serif;
    font-size: 25.5px;
    font-weight: 600;
    letter-spacing: -0.5px;
    line-height: 1.2;
  }
}
</style>