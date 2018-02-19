export interface ConfigEntry extends MappedEntry {
    key: string;
}

export interface MappedEntry {
    email: string;
    name?: string;
    pattern?: string;
}

export type Config = { [key: string]: MappedEntry };
