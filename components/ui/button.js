import React from 'react';
import classNames from 'classnames';

export function Button({ children, className, variant = 'default', ...props }) {
  const base = 'px-4 py-2 rounded-xl font-medium transition text-sm';

  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
    ghost: 'text-gray-600 hover:bg-gray-100',
  };

  return (
    <button
      className={classNames(base, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
