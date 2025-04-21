import type { Colors } from "@/types";

type ColorVariant =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 950;
type ColorProperty = "bg" | "text" | "border" | "outline" | "ring" | "shadow";
type ColorState = "hover" | "focus" | "active" | "disabled";

interface ColorClassOptions {
  color: Colors;
  property: ColorProperty;
  variant?: ColorVariant;
  state?: ColorState;
}

export const getColorClass = ({
  color,
  property,
  variant = 500,
  state,
}: ColorClassOptions): string => {
  const baseClass = `${property}-${color}-${variant}`;
  return state ? `${state}:${baseClass}` : baseClass;
};

export const createColorClasses = (
  color: Colors,
  ...classConfigs: Array<Partial<Omit<ColorClassOptions, "color">>>
) => {
  return classConfigs
    .map((config) => getColorClass({ ...(config as ColorClassOptions), color }))
    .join(" ");
};

// Ejemplo de uso:
// createColorClasses('red',
//   { property: 'bg', variant: 500 },
//   { property: 'bg', variant: 600, state: 'hover' },
//   { property: 'outline', state: 'focus' }
// );
