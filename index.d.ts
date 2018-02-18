declare interface Entry {
    key: string;
    email: string;
    pattern: string;
}

declare interface ConfigEntry {
    email: string;
    pattern: string;
}

declare type Config = { [key: string]: ConfigEntry };
