import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";

const routerOptions = {
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      children: [
        {
          path: "about",
          name: "about/",
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import("../views/AboutView.vue"),
          props: true,
        },
      ],
    },
    {
      path: "/path/:path/:page",
      name: "path",
      component: () => import("../views/ChallengeView.vue"),
      props: true,
    },
  ],
};

const router = createRouter(routerOptions);

export default router;
