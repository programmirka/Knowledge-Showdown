import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import QuizView from "../views/QuizView.vue";
import BetaBlast from "../views/BetaBlast.vue";
import ProfileView from "../views/ProfileView.vue";
import LocalStorage from "../services/LocalStorage";

// TODO: Requires admin ili permision logika
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/quiz/:cat_id",
      props: true,
      name: "quiz",
      meta: {
        requiresLogin: true,
      },
      component: QuizView,
    },
    {
      path: "/beta-blast",
      name: "beta-blast",
      meta: {
        requiresLogin: false,
      },
      component: BetaBlast,
    },
    {
      path: "/profile/:id",
      name: "profile-details",
      meta: {
        requiresLogin: true,
      },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: ProfileView,
    },
    {
      path: "/leaderboards",
      name: "leaderboards",
      component: () => import("../views/LeaderboardsView.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/admin",
      name: "admin",
      meta: {
        requiresLogin: true,
      },
      component: () => import("../views/AdminView.vue"),
    },
    {
      path: "/questions",
      name: "questions",
      component: () => import("../views/QuestionsView.vue"),
    },
    {
      path: "/categories",
      name: "categories",
      component: () => import("../views/CategoriesView.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresLogin) {
    const loggedUser = LocalStorage.getUser();
    if (!loggedUser) {
      next({ name: "home" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
