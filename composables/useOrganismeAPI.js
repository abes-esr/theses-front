import axios from "axios";

const apiOrg = axios.create({
  baseURL: "https://v2-test.theses.fr/api/v1/",
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

export default function () {
  return {
    getName,
    getOrganisme
  };
}