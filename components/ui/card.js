import React from 'react';
import classNames from 'classnames';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={classNames(
        'bg-white border border-gray-200 rounded-2xl p-4 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={classNames('text-sm', className)} {...props}>
      {children}
    </div>
  );
}
