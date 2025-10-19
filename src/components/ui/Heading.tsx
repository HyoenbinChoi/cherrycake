// components/ui/Heading.tsx
import clsx from "clsx";

export function H1({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h1 className={clsx("h1", className)}>{children}</h1>;
}

export function H2({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={clsx("h2", className)}>{children}</h2>;
}

export function H3({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={clsx("h3", className)}>{children}</h3>;
}

export function P1({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={clsx("p1", className)}>{children}</p>;
}

export function P2({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={clsx("p2", className)}>{children}</p>;
}

export function Cap({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={clsx("cap", className)}>{children}</p>;
}
