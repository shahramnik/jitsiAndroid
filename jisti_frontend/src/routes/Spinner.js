import React, { memo } from 'react';

const Spinner = ({ show, forseShow }) => {
  if (!show && !forseShow) { return null; }

  return (
    <img
      src={`${process.env.PUBLIC_URL}/spinner.svg`}
      alt="spinnerImage"
      id="spinner"
    />
  );
};

export default memo(Spinner);
