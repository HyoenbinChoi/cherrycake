// components/ui/card.tsx
import clsx from "clsx";

export function Card({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}) {
  return <Tag className={clsx("card", className)}>{children}</Tag>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={clsx("font-display text-2xl mb-2 tracking-tight", className)}>{children}</h3>;
}

export function CardText({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={clsx("font-sans text-[15px] leading-7 opacity-90", className)}>{children}</p>;
}
