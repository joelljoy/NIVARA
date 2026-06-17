import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:    "bg-primary/10 text-primary-700",
        secondary:  "bg-secondary/30 text-yellow-800",
        success:    "bg-success/10 text-green-700",
        warning:    "bg-warning/10 text-yellow-700",
        destructive:"bg-destructive/10 text-red-700",
        outline:    "border border-border text-foreground bg-transparent",
        muted:      "bg-muted text-muted-foreground",
        blue:       "bg-blue-50 text-blue-700",
        purple:     "bg-purple-50 text-purple-700",
        teal:       "bg-teal-50 text-teal-700",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props}>
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {children}
    </span>
  );
}
