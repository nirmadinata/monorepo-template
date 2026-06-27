import { useSyncExternalStore } from "react";

const subscribe = () => () => {
    // No-op unsubscribe: the mounted snapshot is static for the component lifetime.
};

export function useMounted() {
    return useSyncExternalStore(
        subscribe,
        () => true,
        () => false
    );
}
