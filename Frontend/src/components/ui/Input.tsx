import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth, className = '', style, ...props }, ref) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', width: fullWidth ? '100%' : 'auto' }}>
        {label && (
          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={className}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${error ? 'var(--error)' : 'var(--border)'}`,
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            ...style,
          }}
          onFocus={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(2, 132, 199, 0.2)';
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? 'var(--error)' : 'var(--border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          {...props}
        />
        {error && (
          <span style={{ fontSize: '0.875rem', color: 'var(--error)', marginTop: '0.25rem' }}>
            {error}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
