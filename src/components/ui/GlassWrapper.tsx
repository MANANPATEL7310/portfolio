import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassWrapper({ children, className, ...props }: GlassWrapperProps) {
  return (
    <div 
      className={twMerge(
        clsx(
          "mac-glass shadow-xl", // Uses globals.css utility
          className
        )
      )} 
      {...props}
    >
      {children}
    </div>
  );
}
