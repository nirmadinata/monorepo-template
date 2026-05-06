interface AuthLinkProps {
    children: React.ReactNode;
    href: string;
}

export function AuthLink({ children, href }: AuthLinkProps) {
    return (
        <a
            className="font-medium text-foreground underline-offset-4 hover:underline"
            href={href}
        >
            {children}
        </a>
    );
}
