interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className = '', children }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-background p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children }: CardProps) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ className = '', children }: CardProps) {
  return (
    <h3 className={`text-lg font-semibold text-foreground ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ className = '', children }: CardProps) {
  return <div className={className}>{children}</div>;
}
