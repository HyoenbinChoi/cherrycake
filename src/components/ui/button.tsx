// components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

const button = cva("btn focus-visible:outline-none active:translate-y-[1px]", {
  variants: {
    variant: {
      cherry: "btn--cherry text-white",
      ghost: "btn--ghost",
      link: "bg-transparent p-0 shadow-none underline decoration-cherry/60 hover:decoration-cherry",
    },
    size: {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-4",
      lg: "h-12 px-5 text-lg",
    },
  },
  defaultVariants: { variant: "cherry", size: "md" },
});

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>;

export const Button = ({ className, variant, size, ...props }: ButtonProps) => {
  return <button className={clsx(button({ variant, size }), className)} {...props} />;
};
