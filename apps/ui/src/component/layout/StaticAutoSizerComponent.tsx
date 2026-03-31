import { useRef, useState, useLayoutEffect, type ReactNode } from 'react';
import clsx from 'clsx';

interface Size {
  width: number;
  height: number;
}

interface StaticAutoSizerProps {
  children: (size: Size) => ReactNode;
  classes?: string;
}

const StaticAutoSizer = ({ children, classes = '' }: StaticAutoSizerProps) => {
  const [dimensions, setDimensions] = useState<Size>({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      if (width !== 0 || height !== 0) {
        setDimensions({ width, height });
      }
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`min-h-0 min-w-0 ${clsx(classes)}`}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {children(dimensions)}
    </div>
  );
};

export default StaticAutoSizer;
