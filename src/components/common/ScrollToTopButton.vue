<template>
  <div class="scrollTopWrapper">
    <button class="scrollTopButton" @click="scrollToTop">
      <v-icon class="scrollTopIcon" size="x-large">mdi-chevron-up-box
      </v-icon>
    </button>
  </div>
</template>

<script>
export default {
  name: "ScrollToTopButton",
  setup() {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
    }

    return { scrollToTop }
  }
};

</script>

<style scoped lang="scss">

.scrollTopIcon {
  color: rgb(var(--v-theme-orange-abes));
}

.scrollTopWrapper {
  top: 90%;
  position: sticky;
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>