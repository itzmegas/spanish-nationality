import type { FunctionComponent } from "preact";
import type { ButtonHTMLAttributes } from "preact/compat";
import { twMerge, type ClassNameValue } from "tailwind-merge";
import type { Colors } from "@/types";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  className?: ClassNameValue;
  color?: Colors;
}

export const Button: FunctionComponent<ButtonProps> = ({
  children,
  className,
  color = "purple",
  ...restProps
}) => {
  return (
    <button
      className={twMerge(
        `border-2 border-black rounded-xl p-2 w-full cursor-pointer`,
        `bg-${color}-500 hover:bg-${color}-600 active:bg-${color}-700`,
        className,
      )}
      {...restProps}
    >
      {children}
    </button>
  );
};
