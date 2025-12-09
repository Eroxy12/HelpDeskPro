import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    ...props
}: ButtonProps) {
    const baseStyles = 'font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98]';

    const variantStyles = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-md hover:shadow-lg focus:ring-primary/50',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-md hover:shadow-lg focus:ring-secondary/50',
        danger: 'bg-danger text-white hover:bg-red-600 shadow-md hover:shadow-lg focus:ring-danger/50',
        success: 'bg-success text-white hover:bg-success-hover shadow-md hover:shadow-lg focus:ring-success/50',
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
