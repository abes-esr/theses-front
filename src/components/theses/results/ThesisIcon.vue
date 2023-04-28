<template>
  <span v-if="status === 'enCours'" class="these-icon-wrapper">
    <div>
      <img :alt="$t('resultCard.ongoing')" id="logoIMG" src="@/assets/these-en-cours-icone-min.svg" />
    </div>
    <p>
      {{ titre }}
    </p>
  </span>
  <span v-else-if="status === 'soutenue'" class="these-icon-wrapper">
    <div>
      <img :alt="$t('resultCard.defended')" id="logoIMG" src="@/assets/these-soutenue-icone-min.svg" />
    </div>
    <p>
      {{ titre }}
    </p>
  </span>
</template>

<script setup>
defineProps({
  status: {
    type: String,
    default: 'soutenue'
  },
  titre: {
    type: String
  }
});
</script>

<style scoped>
#logoIMG {
  float: left;
  margin-right: 5px;
}

p {
  padding: 5px 0 0;
  margin-right: 5px;
}
</style>