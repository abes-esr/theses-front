import { createRouter, createWebHistory } from "vue-router";
const HomeView = () => import("../views/HomeView.vue")
const ResultView = () => import("../views/ResultView.vue")
const DetailView = () => import("../views/DetailView.vue")
const APropos = () => import("../components/footer-pages/APropos.vue")


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
    }
  ],
  scrollBehavior() {
    return { top: 0, left: 0 }
  }
});

export default router;
