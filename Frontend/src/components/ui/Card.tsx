import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = ({ children, style, className = '', ...props }: CardProps) => {
  return (
    <div
      className={className}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
