import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "#/components/ui/button";

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const isDark = isMounted && resolvedTheme === "dark";

    return (
        <Button
            aria-label={
                isDark ? "Switch to light theme" : "Switch to dark theme"
            }
            className="border-border/80 bg-card/75 text-foreground shadow-none hover:bg-muted/80"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            size="icon-sm"
            type="button"
            variant="outline"
        >
            {isDark ? <SunIcon /> : <MoonIcon />}
        </Button>
    );
}
