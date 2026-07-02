import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button = ({ variant = 'primary', fullWidth, className = '', children, style, ...props }: ButtonProps) => {
  const baseStyle: React.CSSProperties = {
    padding: '0.75rem 1.5rem',
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    width: fullWidth ? '100%' : 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    ...style,
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--accent)',
      color: '#ffffff',
    },
    secondary: {
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--accent)',
      border: '1px solid var(--accent)',
    }
  };

  return (
    <button 
      className={`button-${variant} ${className}`}
      style={{ ...baseStyle, ...variants[variant] }}
      {...props}
      onMouseOver={(e) => {
        if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
        if (variant === 'secondary') e.currentTarget.style.backgroundColor = 'var(--border)';
        if (variant === 'outline') {
          e.currentTarget.style.backgroundColor = 'var(--accent)';
          e.currentTarget.style.color = '#ffffff';
        }
      }}
      onMouseOut={(e) => {
        if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--accent)';
        if (variant === 'secondary') e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
        if (variant === 'outline') {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--accent)';
        }
      }}
    >
      {children}
    </button>
  );
};
