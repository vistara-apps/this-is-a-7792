import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loading Indicator component
 * Displays a loading spinner with optional text
 */
export function LoadingIndicator({ text = 'Loading...', size = 'md', fullScreen = false }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="text-center">
          <Loader2 className={`${spinnerSize} text-primary animate-spin mx-auto mb-2`} />
          {text && <p className="text-text-secondary">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-6">
      <div className="text-center">
        <Loader2 className={`${spinnerSize} text-primary animate-spin mx-auto mb-2`} />
        {text && <p className="text-text-secondary">{text}</p>}
      </div>
    </div>
  );
}

/**
 * Skeleton Loader component
 * Displays a placeholder loading state for content
 */
export function SkeletonLoader({ type = 'text', count = 1, className = '' }) {
  const types = {
    text: 'h-4 bg-gray-200 rounded',
    card: 'h-32 bg-gray-200 rounded-lg',
    avatar: 'w-12 h-12 bg-gray-200 rounded-full',
    button: 'h-10 bg-gray-200 rounded-md',
    input: 'h-10 bg-gray-200 rounded-md'
  };

  const baseClass = types[type] || types.text;
  const fullClass = `animate-pulse ${baseClass} ${className}`;

  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div key={index} className={fullClass} />
        ))}
    </>
  );
}

export default LoadingIndicator;

