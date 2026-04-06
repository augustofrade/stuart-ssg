export type Unknown<T> = { [P in keyof T]: T[P] | undefined };
