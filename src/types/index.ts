export type MenuOption = { label: string, value: string }

export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {}