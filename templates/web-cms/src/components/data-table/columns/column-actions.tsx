import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";

import { Button } from "#/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";

import type { ColumnActionsOptions } from "../types";

export function columnActions<TData>(opts: ColumnActionsOptions<TData>): ColumnDef<TData> {
    return {
        id: "__actions",
        header: "",
        enableSorting: false,
        size: 48,
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            aria-label={opts.label ?? "Open actions"}
                        >
                            <MoreHorizontalIcon />
                        </Button>
                    }
                />
                <DropdownMenuContent align="end">
                    {opts.items.map((item, idx) => {
                        const Icon = item.icon;
                        const handleClick = () => item.onClick(row);
                        const isDisabled = item.disabled ? item.disabled(row) : false;

                        const menuItem = (
                            <DropdownMenuItem
                                key={idx}
                                variant={item.variant}
                                disabled={isDisabled}
                                onSelect={handleClick}
                            >
                                {Icon ? <Icon /> : null}
                                {item.label}
                            </DropdownMenuItem>
                        );

                        return menuItem;
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    } as ColumnDef<TData>;
}
