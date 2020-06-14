import React from "react";
import { Switch } from "react-router-dom";
import auth from "./auth";
import ProtectedRoute from "./ProtectedRoute";
import LazyWrapper from "./LazyWrapper";

const Navigator = (props) => {
  return (
    <>
      <Switch>
        {routes.map((route) => (
          <ProtectedRoute
            key={route.path}
            {...route}
            {...props}
            component={LazyWrapper(route.component)}
          />
        ))}
      </Switch>
    </>
  );
};

const routes = [
  ...auth,
  // {
  //   path: '/',
  //   exact: true,
  //   component: Home
  // },
  // {
  //   path: "/",
  //   exact: false,
  //   component: Page404,
  // },
];

export default Navigator;
