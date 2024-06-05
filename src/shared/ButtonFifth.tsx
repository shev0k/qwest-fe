"use client";

import Button, { ButtonProps } from "./Button";
import React from "react";

export interface ButtonForthProps extends ButtonProps {
  style?: React.CSSProperties;
}

const ButtonForth: React.FC<ButtonForthProps> = ({
  className = "",
  style,
  ...args
}) => {
  return (
    <Button
      className={`ttnc-ButtonForth font-medium border bg-white border-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 ${className}`}
      {...args}
    />
  );
};

export default ButtonForth;
