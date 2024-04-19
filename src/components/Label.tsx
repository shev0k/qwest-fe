import React, { FC } from "react";

export interface LabelProps {
  className?: string;
  children?: React.ReactNode;
  htmlFor?: string;
}

const Label: FC<LabelProps> = ({ className = "", children, htmlFor }) => {
  return (
    <label
      className={`nc-Label text-sm font-medium text-neutral-700 dark:text-neutral-300 ${className}`}
      htmlFor={htmlFor} 
    >
      {children}
    </label>
  );
};

export default Label;
