import React from "react";

const Login = React.lazy(() => import("../component/auth/login/Login"));
const Dashboard = React.lazy(() => import("../component/dashboard/Home"));
const Forgot = React.lazy(() => import("../component/auth/forgot/Forgot"));
const Meeting = React.lazy(() => import("../component/meeting"));
const ChangePassword = React.lazy(() =>
  import("../component/auth/changepassword/new-password")
);

export default [
  {
    path: "/login",
    exact: true,
    component: Login,
  },
  {
    path: "/dashboard",
    exact: true,
    component: Dashboard,
  },
  {
    path: "/forgot",
    exact: true,
    component: Forgot,
  },
  {
    path: "/meeting",
    exact: true,
    component: Meeting,
  },
  {
    path: "/changepassword",
    exact: true,
    component: ChangePassword,
  },
];
