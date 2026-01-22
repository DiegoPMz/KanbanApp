export function safeJsonParse<T>(
	json: string,
	defaultValue: T | null = null,
): T | null {
	try {
		return JSON.parse(json) as T;
	} catch {
		return defaultValue;
	}
}
