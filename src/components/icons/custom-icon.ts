import {h} from "vue";
import type {IconAliases, IconSet} from "vuetify";
import IconReseau from "@/components/icons/IconReseau.vue";
import IconRss from "@/components/icons/IconRss.vue";
import IconDocumentation from "@/components/icons/IconDocumentation.vue";
import IconAssistance from "@/components/icons/IconAssistance.vue";

const aliases: IconAliases = {
  collapse: "...",
  complete: "...",
  cancel: "...",
  close: "...",
  delete: "...",
  clear: "...",
  success: "...",
  info: "...",
  warning: "...",
  error: "...",
  prev: "...",
  next: "...",
  checkboxOn: "...",
  checkboxOff: "...",
  checkboxIndeterminate: "...",
  delimiter: "...",
  sort:"...",
  sortAsc: "...",
  sortDesc: "...",
  expand: "...",
  menu: "...",
  subgroup: "...",
  dropdown: "...",
  radioOn: "...",
  radioOff: "...",
  edit: "...",
  ratingEmpty: "...",
  ratingFull: "...",
  ratingHalf: "...",
  loading: "...",
  first: "...",
  last: "...",
  unfold: "...",
  file: "...",
  plus: "...",
  minus: "...",
  reseau: IconReseau,
  rss:IconRss,
  documentation:IconDocumentation,
  assistance:IconAssistance
};

const custom: IconSet = {
  component: (props) => h(props.tag, { class: [props.icon] }),
};

export { aliases, custom };
