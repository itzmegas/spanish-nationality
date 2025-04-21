import type { FunctionComponent } from "preact";
import type { ButtonHTMLAttributes } from "preact/compat";
import { twMerge, type ClassNameValue } from "tailwind-merge";
import type { Colors } from "@/types/colors";
import { createColorClasses } from "@/lib/tailwind-colors";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  className?: ClassNameValue;
  color?: Colors;
}

export const Button: FunctionComponent<ButtonProps> = ({
  children,
  className,
  color = "blue",
  ...restProps
}) => {
  // Use createColorClasses with default configurations
  const colorClasses = createColorClasses(color);
  return (
    <button
      className={twMerge(
        "border-2 border-black rounded-xl p-2 w-full cursor-pointer text-white font-bold",
        colorClasses,
        className,
      )}
      {...restProps}
    >
      {children}
    </button>
  );
};
