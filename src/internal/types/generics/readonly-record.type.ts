/**
 * Read-only extension of TypeScript's `Record` utility type.
 * 
 * TODO Move this to the @fgo-planner/types package.
 */
export type ReadonlyRecord<K extends keyof any, V> = Readonly<Record<K, V>>;
