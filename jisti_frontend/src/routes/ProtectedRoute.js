import React, { PureComponent } from 'react';

import { Route } from 'react-router-dom';

export default class ProtectedRoute extends PureComponent {
  render() {
    const {
      path,
      exact,
      component,
      children
    } = this.props;

    return (
      <Route
        path={path}
        exact={exact}
        component={component}
      >
        {children}
      </Route>
    );
  }
}
