interface AuthHeroCopyProps {
    description: string;
    title: string;
}

export function AuthHeroCopy({ description, title }: AuthHeroCopyProps) {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                {title}
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
                {description}
            </p>
        </div>
    );
}
