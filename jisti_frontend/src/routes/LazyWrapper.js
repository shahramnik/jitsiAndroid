import React, { memo, Suspense } from 'react';

import Spinner from './Spinner';

const spinner = <Spinner forseShow />;

export default (Component) => memo(
  () => (
    <Suspense fallback={spinner}>
      <Component />
    </Suspense>
  )
);
