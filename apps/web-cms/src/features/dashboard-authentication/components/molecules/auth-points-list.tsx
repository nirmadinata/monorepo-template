interface AuthPointsListProps {
    items: {
        icon: React.ReactNode;
        text: string;
    }[];
}

export function AuthPointsList({ items }: AuthPointsListProps) {
    return (
        <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            {items.map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                    {item.icon}
                    <p>{item.text}</p>
                </div>
            ))}
        </div>
    );
}
