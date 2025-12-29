import React from 'react';
import { createContext } from 'react';

import type { AwilixContainer } from 'awilix';

const DependencyContext = createContext<AwilixContainer | null>(null);

type DependencyProviderProps = {
  container: AwilixContainer;
  children: React.ReactNode;
};

export const DependencyProvider: React.FC<DependencyProviderProps> = ({
  container,
  children,
}) => {
  return (
    <DependencyContext.Provider value={container}>
      {children}
    </DependencyContext.Provider>
  );
};

export { DependencyContext };
