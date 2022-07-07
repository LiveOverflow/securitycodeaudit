import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import BaseView from "../views/BaseView.vue";

const routerOptions = {
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "",
      component: BaseView,
      children: [
        {
          path: "/",
          name: "home",
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import("../views/AboutView.vue"),
          props: true,
        },
        {
          path: "/idor/calculator",
          name: "idor-calculator",
          component: () => import("../views/IdorCalculatorView.vue"),
          props: true,
        },
        {
          path: "/idor",
          name: "idor-examples",
          component: () => import("../views/IdorExamplesView.vue"),
          props: true,
        },
        {
          path: "/idor-video",
          name: "idor-video",
          component: () => import("../views/IdorVideoView.vue"),
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

router.afterEach((to, from) => {
  console.log(document.body)
  document?.body.focus();
  document?.body.blur();
})

export default router;
