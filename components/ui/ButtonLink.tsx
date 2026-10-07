import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center rounded-pill font-medium no-underline transition-colors duration-200 whitespace-nowrap";

const variants: Record<Variant, string> = {
  // The only filled button on any screen is «رزرو نوبت».
  primary: "bg-primary text-white hover:bg-primary-hover hover:text-white active:bg-primary-hover",
  outline:
    "border border-primary text-primary hover:border-primary-hover hover:text-primary-hover bg-transparent",
};

const sizes: Record<Size, string> = {
  sm: "h-11 px-[26px] text-sm",
  md: "h-[52px] px-8 text-base",
  lg: "h-[58px] px-11 text-[17px]",
};

type Props = ComponentProps<typeof Link> & { variant?: Variant; size?: Size };

export function ButtonLink({ variant = "primary", size = "lg", className = "", ...props }: Props) {
  return <Link className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}
