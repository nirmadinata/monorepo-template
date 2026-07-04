import type { ClassValue } from "cnfast";
import { twMerge, clsx } from "cnfast";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
