import type { FunctionComponent } from "preact";
import type { ButtonHTMLAttributes } from "preact/compat";
import { twMerge, type ClassNameValue } from "tailwind-merge";
import type { Colors } from "@/types/colors";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  className?: ClassNameValue;
  color?: Colors;
  disabled?: boolean;
}

export const Button: FunctionComponent<ButtonProps> = ({
  children,
  className,
  color = "blue",
  disabled,
  ...restProps
}) => {
  // Use createColorClasses with default configurations
  // const colorClasses = createColorClasses(color);
  return (
    <button
      className={twMerge(
        "rounded-xl p-3 w-full cursor-pointer font-bold shadow-md outline-1 outline-gray-200",
        disabled
          ? "cursor-not-allowed opacity-40 bg-white hover:bg-white"
          : "bg-white hover:shadow-md hover:bg-gray-50 active:shadow-lg",
        className,
      )}
      disabled={disabled}
      {...restProps}
    >
      {children}
    </button>
  );
};
