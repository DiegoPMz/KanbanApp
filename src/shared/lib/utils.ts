import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function parseData<D>(data: string) {
	try {
		return JSON.parse(data) as D;
	} catch {
		return null;
	}
}
