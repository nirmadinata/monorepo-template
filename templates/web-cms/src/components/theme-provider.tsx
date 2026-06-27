import { ThemeProvider } from "next-themes";

interface AppThemeProviderProps {
    children: React.ReactNode;
}

export function AppThemeProvider({ children }: AppThemeProviderProps) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
            enableSystem
        >
            {children}
        </ThemeProvider>
    );
}
