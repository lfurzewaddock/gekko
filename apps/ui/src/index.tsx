import React from 'react';
import ReactDOM from 'react-dom/client';
import { configure } from 'mobx';

import { DependencyProvider } from '#core/providers/Injection';
import { ValidationProvider } from '#core/providers/Validation';
import container from '#ioc';
import AppComponent from '#AppComponent';

import './index.css';

configure({
  enforceActions: 'never',
  computedRequiresReaction: false,
  reactionRequiresObservable: false,
  observableRequiresReaction: false,
  disableErrorBoundaries: false,
});

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <DependencyProvider container={container}>
        <ValidationProvider>
          <AppComponent />
        </ValidationProvider>
      </DependencyProvider>
    </React.StrictMode>,
  );
}
