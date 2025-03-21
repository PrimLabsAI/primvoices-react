import React from 'react';
import { createRoot } from 'react-dom/client';
import ExamplesIndex from './index';

// Get the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Could not find root element');
}

// Create a root
const root = createRoot(rootElement);

// Render the examples index
root.render(
  <React.StrictMode>
    <ExamplesIndex />
  </React.StrictMode>
); 
