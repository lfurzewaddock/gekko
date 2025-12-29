import React, { useMemo } from 'react';
import { DependencyContext } from '#core/providers/Injection';

export const useDependency = <T>(key: string): T => {
  const container = React.useContext(DependencyContext);
  if (!container) {
    throw new Error('DependencyProvider not found');
  }

  const instance = useMemo<T>(
    () => container.resolve<T>(key),
    [container, key],
  );

  return instance;
};
