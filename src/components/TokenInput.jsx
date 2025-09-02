import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useTokenMetadata } from '../hooks/useTokenMetadata';

/**
 * Token Input component
 * Input field for token addresses with validation and metadata display
 */
export function TokenInput({ 
  value, 
  onChange, 
  onValidation,
  chain = 'base',
  label = 'Token Address',
  placeholder = '0x...',
  required = true,
  disabled = false
}) {
  const { validateToken, isLoading, error } = useTokenMetadata();
  const [address, setAddress] = useState(value || '');
  const [validationState, setValidationState] = useState({
    isValid: false,
    isValidated: false,
    metadata: null
  });
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  // Update address when value prop changes
  useEffect(() => {
    if (value !== address) {
      setAddress(value || '');
      setValidationState({
        isValid: false,
        isValidated: false,
        metadata: null
      });
    }
  }, [value]);

  // Validate token address
  const validateAddress = async (addr) => {
    if (!addr || addr.length < 42) {
      setValidationState({
        isValid: false,
        isValidated: true,
        metadata: null
      });
      
      if (onValidation) {
        onValidation(false, null);
      }
      
      return;
    }
    
    try {
      const result = await validateToken(addr, chain);
      
      setValidationState({
        isValid: result.isValid,
        isValidated: true,
        metadata: result.isValid ? {
          name: result.name,
          symbol: result.symbol,
          decimals: result.decimals,
          logo: result.logo
        } : null
      });
      
      if (onValidation) {
        onValidation(result.isValid, result.isValid ? {
          name: result.name,
          symbol: result.symbol,
          decimals: result.decimals,
          logo: result.logo
        } : null);
      }
    } catch (err) {
      setValidationState({
        isValid: false,
        isValidated: true,
        metadata: null
      });
      
      if (onValidation) {
        onValidation(false, null);
      }
    }
  };

  // Handle input change with debounce
  const handleChange = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    
    if (onChange) {
      onChange(newAddress);
    }
    
    // Reset validation state
    setValidationState({
      isValid: false,
      isValidated: false,
      metadata: null
    });
    
    // Clear previous timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    // Set new timeout for validation
    if (newAddress && newAddress.length >= 42) {
      const timeout = setTimeout(() => {
        validateAddress(newAddress);
      }, 500);
      
      setDebounceTimeout(timeout);
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type="text"
          value={address}
          onChange={handleChange}
          className={`
            input-field w-full pl-10
            ${validationState.isValidated && !validationState.isValid && 'border-red-300 focus:border-red-500 focus:ring-red-500'}
            ${validationState.isValid && 'border-green-300 focus:border-green-500 focus:ring-green-500'}
          `}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
        />
        
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-text-secondary" />
        </div>
        
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Loader2 className="w-4 h-4 text-text-secondary animate-spin" />
          </div>
        )}
        
        {validationState.isValidated && !isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {validationState.isValid ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
        )}
      </div>
      
      {validationState.isValidated && !validationState.isValid && !isLoading && (
        <p className="mt-1 text-sm text-red-600">
          {error || 'Invalid token address'}
        </p>
      )}
      
      {validationState.isValid && validationState.metadata && (
        <div className="mt-2 flex items-center">
          {validationState.metadata.logo && (
            <img 
              src={validationState.metadata.logo} 
              alt={validationState.metadata.symbol}
              className="w-5 h-5 mr-2 rounded-full"
            />
          )}
          <span className="text-sm font-medium text-text-primary">
            {validationState.metadata.name} ({validationState.metadata.symbol})
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Token Amount Input component
 * Input field for token amounts with formatting
 */
export function TokenAmountInput({
  value,
  onChange,
  tokenSymbol,
  label = 'Amount',
  placeholder = '0.0',
  min = 0,
  max,
  step = 'any',
  required = true,
  disabled = false
}) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={onChange}
          className="input-field w-full pr-16"
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          required={required}
        />
        
        {tokenSymbol && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary">
            {tokenSymbol}
          </div>
        )}
      </div>
      
      {max !== undefined && (
        <p className="mt-1 text-xs text-text-secondary">
          Max: {max} {tokenSymbol}
        </p>
      )}
    </div>
  );
}

export default TokenInput;

