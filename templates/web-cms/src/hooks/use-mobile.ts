import { useMemo, useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
    const mediaQueryList = useMemo(() => {
        if (typeof window === "undefined") {
            return null;
        }

        return window.matchMedia(query);
    }, [query]);

    return useSyncExternalStore(
        (onStoreChange) => {
            if (!mediaQueryList) {
                return () => {
                    //
                };
            }

            mediaQueryList.addEventListener("change", onStoreChange);

            return () => {
                mediaQueryList.removeEventListener("change", onStoreChange);
            };
        },
        () => mediaQueryList?.matches ?? false,
        () => false
    );
}

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
    return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
}
