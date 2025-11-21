import React from 'react';

// FIX: Update CardProps to accept standard HTML attributes like 'role'.
// We extend Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> to allow passing
// down props like `role`, while avoiding a type conflict with the custom `onClick` handler.
interface CardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, ...props }) => {
  const baseClasses = 'p-6 rounded-3xl shadow-cartoon transition-all duration-300';
  const combinedClasses = `${baseClasses} ${className}`;

  if (onClick) {
    return (
      <button onClick={onClick} className={`text-left w-full ${combinedClasses} shadow-cartoon-hover active:scale-95`} {...props}>
        {children}
      </button>
    );
  }

  return <div className={combinedClasses} {...props}>{children}</div>;
};

export default Card;
