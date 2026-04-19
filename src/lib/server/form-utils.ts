export const readText = (value: FormDataEntryValue | null) =>
	typeof value === 'string' ? value : '';
