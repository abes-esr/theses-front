import {aliases as defaultAliases} from 'vuetify/iconsets/mdi'
import IconReseau from "@/components/icons/IconReseau.vue";
import IconRss from "@/components/icons/IconRss.vue";
import IconDocumentation from "@/components/icons/IconDocumentation.vue";
import IconAssistance from "@/components/icons/IconAssistance.vue";
import IconPersonne from "@/components/icons/IconPersonne.vue";

const aliases = {
  ...defaultAliases, // Needed by Vuetify components, can be customized.
  reseau: IconReseau,
  rss:IconRss,
  documentation:IconDocumentation,
  assistance:IconAssistance,
  personne:IconPersonne
};

export { aliases};
