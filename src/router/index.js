import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ResultView from "../views/ResultView.vue";
import TheseView from "../views/TheseView.vue";
const APropos = () => import("../components/footer-pages/APropos.vue")
const AccessibilitePage = () => import("../components/footer-pages/AccessibilitePage.vue")
const CGU = () => import("../components/footer-pages/CGU.vue")
const DonneesPage = () => import("../components/footer-pages/DonneesPage.vue")
const MentionsPage = () => import("../components/footer-pages/MentionsPage.vue")


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/resultats",
      name: "resultats",
      component: ResultView,
      props: true
    },
    {
      path: "/these/:nnt",
      name: "these",
      component: TheseView,
      props: true
    },
    {
      path: "/apropos",
      name: "apropos",
      component: APropos
    },
    {
      path: "/accessibilite",
      name: "accessibilite",
      component: AccessibilitePage
    },
    {
      path: "/CGU",
      name: "CGU",
      component: CGU
    }, 
    {
      path: "/donnees",
      name: "donnees",
      component: DonneesPage
    },
    {
      path: "/mentions",
      name: "mentions",
      component: MentionsPage
    }
  ],
});

export default router;
