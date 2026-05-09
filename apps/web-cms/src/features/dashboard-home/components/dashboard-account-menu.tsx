import { ChevronUpIcon, LogOutIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { useSidebar } from "#/components/ui/sidebar";
import { authClient } from "#/integrations/auth/client";
import { cn } from "#/lib/utils";

import type { DashboardSession } from "../server/get-dashboard-session";

const DEFAULT_SIGN_OUT_ERROR_MESSAGE = "Unable to sign out right now.";

function getDisplayName(user: DashboardSession["user"]) {
    const name = user.name?.trim();

    if (name) {
        return name;
    }

    const localPart = user.email.split("@")[0]?.trim();

    if (!localPart) {
        return "Dashboard User";
    }

    return localPart
        .split(/[._-]+/)
        .filter(Boolean)
        .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
        .join(" ");
}

function getAvatarFallbackLabel(displayName: string) {
    const initials = displayName
        .split(/\s+/)
        .filter(Boolean)
        .map((segment) => segment[0]?.toUpperCase())
        .slice(0, 2)
        .join("");

    return initials || "DU";
}

interface DashboardAccountMenuProps {
    user: DashboardSession["user"];
}

export function DashboardAccountMenu({ user }: DashboardAccountMenuProps) {
    const { isMobile, state } = useSidebar();
    const [isSigningOut, setIsSigningOut] = useState(false);
    const displayName = getDisplayName(user);
    const avatarFallbackLabel = getAvatarFallbackLabel(displayName);
    const isCompact = !isMobile && state === "collapsed";

    async function handleSignOut() {
        if (isSigningOut) {
            return;
        }

        setIsSigningOut(true);

        try {
            const result = await authClient.signOut();

            if (result?.error) {
                toast.error(
                    result.error.message || DEFAULT_SIGN_OUT_ERROR_MESSAGE
                );

                return;
            }

            window.location.assign("/login");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : DEFAULT_SIGN_OUT_ERROR_MESSAGE
            );
        } finally {
            setIsSigningOut(false);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                aria-label={`${displayName} account menu`}
                className={cn(
                    "items-center rounded-xl border border-sidebar-border/70 bg-sidebar-accent/40 text-sidebar-foreground shadow-none outline-none transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring aria-expanded:bg-sidebar-accent",
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
                            <span className="truncate font-medium">
                                {displayName}
                            </span>
                            <span className="truncate text-xs text-sidebar-foreground/70">
                                {user.email}
                            </span>
                        </span>

                        <ChevronUpIcon className="text-sidebar-foreground/70" />
                    </>
                )}
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-56 rounded-xl"
                side="top"
                sideOffset={10}
            >
                <DropdownMenuGroup>
                    <DropdownMenuItem disabled>
                        <UserIcon />
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        disabled={isSigningOut}
                        onClick={() => {
                            void handleSignOut();
                        }}
                        variant="destructive"
                    >
                        <LogOutIcon />
                        {isSigningOut ? "Signing out..." : "Sign out"}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
