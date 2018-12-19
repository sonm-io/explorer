export const prefix = (prefix: string) => (value: string) => prefix + value;

export function isValidDate(d: any) {
    return d instanceof Date && !isNaN(d as any);
}
