import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
} from 'react';
import clsx from 'clsx';

const widthClasses: Record<string, string> = {
  '1/1': 'w-full',
  '1/2': 'w-1/2',
  '1/3': 'w-1/3',
  '2/3': 'w-2/3',
  '1/4': 'w-1/4',
  '3/4': 'w-3/4',
  '1/5': 'w-1/5',
  '2/5': 'w-2/5',
  '3/5': 'w-3/5',
  '4/5': 'w-4/5',
  '1/6': 'w-1/6',
  '5/6': 'w-5/6',
};

function getWidthCssClass(childCount: number): string {
  const numerator = 1;
  const denominator = childCount;
  const fraction = `${numerator}/${denominator}`;
  return widthClasses[fraction] ?? 'md:w-full';
}

function SplitScreenComponent({
  children,
  className,
}: {
  children: ReactElement<{ className?: string }>[];
  className?: string | string[];
}) {
  const totalChild = Children.count(children);
  const widthClass = getWidthCssClass(totalChild);

  return (
    <div className={clsx([className, 'flex flex-wrap md:flex-nowrap'])}>
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            className: clsx([
              `md:w-full md:${widthClass}`,
              child.props.className,
            ]),
          });
        }
        return child;
      })}
    </div>
  );
}

export default SplitScreenComponent;
