<template>
  <div class="scroll-to-top-button-component" id="scrollToTopBtn" v-if="nbResult">
    <button class="scroll-to-top-button" @click="scrollToTop" :title='$t("top")'>
      <div>
        <div class="circle"></div>
        <v-icon class="scroll-to-top-icon" size="35">mdi-chevron-up-box</v-icon>
      </div>
    </button>
  </div>
</template>

<script setup>
import { scrollToTop } from "@/services/Common";
import { onMounted } from "vue";

defineProps({
  nbResult: {
    type: Number,
    default: 0
  }
});

onMounted(() => {

  document.addEventListener("scroll", handleScroll);

});

function handleScroll() {
  let rootElement = document.documentElement;
  let scrollToTopButton = document.getElementById("scrollToTopBtn");
  let scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;

  if (scrollToTopButton === null || typeof scrollToTopButton === 'undefined') return -1;

  if ((rootElement.scrollTop / scrollTotal) > 0.01) {
    scrollToTopButton.classList.add("show-scroll-to-top-button");
  } else {
    scrollToTopButton.classList.remove("show-scroll-to-top-button");
  }
}
</script>

<script>
export default {
  name: "ScrollToTopButton"
};
</script>

<style scoped lang="scss">
  .scroll-to-top-button {
    z-index: 2;
  }

  .scroll-to-top-icon {
    color: rgb(var(--v-theme-orange-abes));
  }

  .circle {
    border-radius: 50%;
    width: 25px;
    height: 25px;
    position: absolute;
    top: 5px;
    left: 5px;
    background: rgb(var(--v-theme-gris-clair));
  }


  .scroll-to-top-button-component {
    opacity: 0;
    transform: translateY(100px);
    transition: all .5s ease;
    }
</style>


<style lang="scss">
@use 'vuetify/settings';

  .show-scroll-to-top-button {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
</style>