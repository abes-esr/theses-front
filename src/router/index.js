import { createRouter, createWebHistory } from "vue-router";
const HomeView = () => import("../views/HomeView.vue")
const ResultView = () => import("../views/ResultView.vue")
const TheseView = () => import("../views/TheseView.vue")
const PersonneView = () => import("../views/PersonneView.vue")
const DetailView = () => import("../views/DetailView.vue")
const APropos = () => import("../components/footer-pages/APropos.vue")
const AccessibilitePage = () => import("../components/footer-pages/AccessibilitePage.vue")
const CGU = () => import("../components/footer-pages/CGU.vue")
const DonneesPage = () => import("../components/footer-pages/DonneesPage.vue")
const MentionsPage = () => import("../components/footer-pages/MentionsPage.vue")


export const router = createRouter({
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
      path: "/:id",
      name: "detail",
      component: DetailView
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
