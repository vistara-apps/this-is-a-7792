import React from 'react';

export function TokenInput({ variant = 'tokenAddress', value, onChange, placeholder, ...props }) {
  const variants = {
    tokenAddress: {
      placeholder: 'Enter token contract address (0x...)',
      pattern: '^0x[a-fA-F0-9]{40}$'
    },
    amount: {
      placeholder: 'Enter amount',
      type: 'number',
      min: '0',
      step: 'any'
    }
  };

  const config = variants[variant] || variants.tokenAddress;

  return (
    <input
      type={config.type || 'text'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || config.placeholder}
      pattern={config.pattern}
      min={config.min}
      step={config.step}
      className="input-field"
      {...props}
    />
  );
}