export function generateUniqueId(): string {
	/** We cannot use `crypto.randomUUID()` because it is only available in https contexts. */
	return `id-${crypto.getRandomValues(new Uint32Array(1)).toString()}`;
}
