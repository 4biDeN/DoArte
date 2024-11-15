const routes = [
  {
    path: "/dashboard",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/DashboardPage.vue") },
    ],
  },
  {
    path: "/clientes",
    component: () => import("layouts/MainLayout.vue"), // Herda o layout
    children: [
      { path: "", component: () => import("pages/ClientesPage.vue") }, // Página de clientes
    ],
  },
  {
    path: "/financeiro",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "receber",
        component: () => import("src/pages/FinanceiroReceberPage.vue"),
        name: "FinanceiroReceber",
      },
      {
        path: "pagar",
        component: () => import("src/pages/FinanceiroPagarPage.vue"),
        name: "FinanceiroPagar",
      },
    ],
  },
  {
    path: "/agenda",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/AgendaPage.vue") },
    ],
  },
  {
    path: "/login",
    component: () => import("pages/loginPage.vue"),
  },
];

export default routes;
