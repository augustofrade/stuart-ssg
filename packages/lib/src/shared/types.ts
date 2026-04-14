export type Unknown<T> = { [P in keyof T]: T[P] | undefined };

export type AsyncFunction = (...args: any[]) => Promise<any>;
