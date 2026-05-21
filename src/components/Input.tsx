import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className={`form-group ${className}`}>
        {label && <label className="form-label">{label}</label>}
        <input 
          ref={ref}
          className={`form-input ${error ? 'border-red-500' : ''}`}
          {...props} 
        />
        {error && <span className="text-danger text-sm mt-1 block" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
