import React from 'react';
import { Lock, Vote, TrendingUp, Crown } from 'lucide-react';

export function FeatureCard({ 
  variant, 
  title, 
  description, 
  icon: Icon, 
  isPaid = false, 
  onUpgrade 
}) {
  const variants = {
    accessControl: {
      gradient: 'from-blue-500 to-purple-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    governance: {
      gradient: 'from-green-500 to-teal-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    staking: {
      gradient: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  };

  const config = variants[variant] || variants.accessControl;

  return (
    <div className="card group hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className={`w-12 h-12 rounded-lg ${config.bgColor} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${config.iconColor}`} />
          </div>
          {isPaid && (
            <div className="flex items-center space-x-1 text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
              <Crown className="w-3 h-3" />
              <span>Pro</span>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {title}
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {!isPaid ? (
          <button
            onClick={onUpgrade}
            className={`w-full py-3 px-4 rounded-md font-medium text-white bg-gradient-to-r ${config.gradient} hover:opacity-90 transition-opacity`}
          >
            Unlock Feature - $0.001
          </button>
        ) : (
          <div className="w-full py-3 px-4 rounded-md font-medium text-center bg-green-100 text-green-700 border border-green-200">
            ✓ Feature Unlocked
          </div>
        )}
      </div>
    </div>
  );
}