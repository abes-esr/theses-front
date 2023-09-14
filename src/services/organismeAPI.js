import axios from "axios";

const apiOrg = axios.create({
  baseURL: import.meta.env.VITE_APP_API,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

function getName(ppn) {
    return apiOrg.get("/theses/getorganismename/" + ppn);
}

function getOrganisme(ppn) {
    return apiOrg.get("/theses/organisme/" + ppn);
}

export function organismeAPIService() {
  return {
    getName,
    getOrganisme
  };
}