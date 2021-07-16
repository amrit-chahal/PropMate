import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Box, Grid, InputBase, IconButton, Paper } from '@material-ui/core';
import './contentScript.css';
console.log('hello from content script start');

const App: React.FC<{}> = () => {
  return <div>Hello from content script div</div>;
};

window.addEventListener('load', () => {
  const root = document.createElement('div');
  const element: HTMLElement | null = document.querySelector(
    '.tm-property-listing-body__location'
  );
  element!.appendChild(root);
  ReactDOM.render(<App />, root);
});
