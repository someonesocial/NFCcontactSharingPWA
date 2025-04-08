import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/ScanView.vue"),
  },
  {
    path: "/contacts",
    name: "Contacts",
    component: () => import("../views/ContactsListView.vue"),
  },
  {
    path: "/add-contact",
    name: "AddContact",
    component: () => import("../views/AddContactView.vue"),
  },
  {
    path: "/contact-details/:id?",
    name: "ContactDetails",
    component: () => import("../views/ContactDetailsView.vue"),
    props: true,
  },
  {
    path: "/write-to-chip",
    name: "WriteToChip",
    component: () => import("../views/WriteToChipView.vue"),
  },
  {
    path: "/contact",
    name: "SharedContact",
    component: () => import("../views/SharedContactView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
