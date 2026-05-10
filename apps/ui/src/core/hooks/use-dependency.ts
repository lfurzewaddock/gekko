import React, { useMemo } from 'react';
import { DependencyCtx } from '#core/providers/Injection';

export const useDependency = <T>(key: string): T => {
  const container = React.useContext(DependencyCtx);
  if (!container) {
    throw new Error('DependencyProvider not found');
  }

  const instance = useMemo<T>(() => container.resolve<T>(key), [container, key]);

  return instance;
};
