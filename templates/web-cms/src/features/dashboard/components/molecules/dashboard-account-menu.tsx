import { ChevronUpIcon, LogOutIcon, UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { useSidebar } from "#/components/ui/sidebar";
import { cn } from "#/lib/utils";

import { useDashboardSignOut } from "../../hooks/use-dashboard-sign-out";
import { DASHBOARD_ACCOUNT } from "../../lib/constants";
import type { DashboardSession } from "../../server/get-dashboard-session";

function getDisplayName(user: DashboardSession["user"]) {
    const name = user.name?.trim();

    if (name) {
        return name;
    }

    const localPart = user.email.split("@")[0]?.trim();

    if (!localPart) {
        return DASHBOARD_ACCOUNT.defaultDisplayName;
    }

    return localPart
        .split(/[._-]+/u)
        .filter(Boolean)
        .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
        .join(" ");
}

function getAvatarFallbackLabel(displayName: string) {
    const initials = displayName
        .split(/\s+/u)
        .filter(Boolean)
        .map((segment) => segment[0]?.toUpperCase())
        .slice(0, 2)
        .join("");

    return initials || DASHBOARD_ACCOUNT.defaultAvatarFallback;
}

interface DashboardAccountMenuProps {
    user: DashboardSession["user"];
}

export function DashboardAccountMenu({ user }: DashboardAccountMenuProps) {
    const { isMobile, state } = useSidebar();
    const { isSigningOut, signOut } = useDashboardSignOut();
    const displayName = getDisplayName(user);
    const avatarFallbackLabel = getAvatarFallbackLabel(displayName);
    const isCompact = !isMobile && state === "collapsed";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                aria-label={DASHBOARD_ACCOUNT.getAriaLabel(displayName)}
                className={cn(
                    "items-center rounded-xl border border-sidebar-border/70 bg-sidebar-accent/40 text-sidebar-foreground shadow-none transition-colors outline-none hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring aria-expanded:bg-sidebar-accent",
                    isCompact
                        ? "flex size-8 justify-center p-0"
                        : "flex w-full gap-3 px-2.5 py-2 text-left text-sm"
                )}
                title={isCompact ? displayName : undefined}
                type="button"
            >
                <Avatar>
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback>{avatarFallbackLabel}</AvatarFallback>
                </Avatar>

                {isCompact ? null : (
                    <>
                        <span className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate font-medium">{displayName}</span>
                            <span className="truncate text-xs text-sidebar-foreground/70">
                                {user.email}
                            </span>
                        </span>

                        <ChevronUpIcon className="text-sidebar-foreground/70" />
                    </>
                )}
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 rounded-xl" side="top" sideOffset={10}>
                <DropdownMenuGroup>
                    <DropdownMenuItem disabled>
                        <UserIcon />
                        {DASHBOARD_ACCOUNT.labels.profile}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        disabled={isSigningOut}
                        onClick={() => {
                            void signOut();
                        }}
                        variant="destructive"
                    >
                        <LogOutIcon />
                        {isSigningOut
                            ? DASHBOARD_ACCOUNT.labels.signingOut
                            : DASHBOARD_ACCOUNT.labels.signOut}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
