import React from 'react';
import { createContext } from 'react';

import type { AwilixContainer } from 'awilix/browser';

const DependencyCtx = createContext<AwilixContainer | null>(null);

type DependencyProviderProps = {
  container: AwilixContainer;
  children: React.ReactNode;
};

export const DependencyProvider: React.FC<DependencyProviderProps> = ({ container, children }) => {
  return <DependencyCtx.Provider value={container}>{children}</DependencyCtx.Provider>;
};

export { DependencyCtx };
