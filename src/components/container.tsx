import { cn } from "@/utils/styling";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <div className={cn("space-y-4 rounded border bg-white p-4", className)}>
      {children}
    </div>
  );
}
