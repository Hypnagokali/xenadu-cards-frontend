const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "manage-card-sets",
        children: [
          {
            path: "",
            component: () => import("pages/manage-cards/ManageCardSets"),
          },
          {
            path: ":cardSetId",
            component: () => import("pages/manage-cards/ManageCards"),
          },
          {
            path: ":cardSetId/:cardId",
            component: () => import("pages/manage-cards/EditCard"),
          },
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
