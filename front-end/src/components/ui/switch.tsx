"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";

function ThemeSwitch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return (
      <div className="inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-zinc-200 bg-zinc-200 shadow-xs">
        <div className="bg-background pointer-events-none size-4 rounded-full ring-0 translate-x-0 flex items-center justify-center">
          <Sun className="h-3 w-3 text-primary" />
        </div>
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <SwitchPrimitive.Root
      checked={isDark}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      className={cn(
        "peer data-[state=checked]:bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border  shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 flex items-center justify-center"
        )}
      >
        {isDark ? (
          <Moon className="h-3 w-3 text-primary" />
        ) : (
          <Sun className="h-3 w-3 text-primary" />
        )}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { ThemeSwitch };
