import React from 'react';
import { Info, AlertTriangle, CheckCircle } from 'lucide-react';

export function Callout({ variant = 'info', children }) {
  const variants = {
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    },
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-600'
    }
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div className={`rounded-md border p-4 ${config.bgColor} ${config.borderColor}`}>
      <div className="flex">
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div className={`ml-3 text-sm ${config.textColor}`}>
          {children}
        </div>
      </div>
    </div>
  );
}