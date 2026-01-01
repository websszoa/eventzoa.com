import { cn } from "@/lib/utils";

interface DividerProps {
  text?: string;
  className?: string;
}

export function Divider({ text, className }: DividerProps) {
  return (
    <div className={cn("relative my-4", className)}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t" />
      </div>
      {text && (
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-2 text-muted-foreground">
            {text}
          </span>
        </div>
      )}
    </div>
  );
}
