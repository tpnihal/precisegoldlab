import React from 'react';

type MagneticProps = {
  children: React.ReactNode;
  strength?: number;
  className?: string;
};

/**
 * Smooth, non-shakable luxury button hover wrapper.
 * Uses a steady cubic-bezier(0.22, 1, 0.36, 1) elevation instead of cursor-jitter tracking
 * so buttons never shake when moving the pointer across them.
 */
export const Magnetic: React.FC<MagneticProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`inline-block transition-transform duration-300 ease-luxe hover:-translate-y-0.5 active:translate-y-0 ${className}`}
    >
      {children}
    </div>
  );
};
