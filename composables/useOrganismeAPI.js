import axios from "axios";
import { useAPIFetch } from "./useAPIFetch";



function getName(ppn) {
    return useAPIFetch("/theses/getorganismename/" + ppn);
}

function getOrganisme(ppn) {
    return useAPIFetch("/theses/organisme/" + ppn);
}

export default function () {
  return {
    getName,
    getOrganisme
  };
}