/**
 * Config Manager — Remote and local config with caching
 */
export interface ConfigSchema { [key: string]: { type: 'string' | 'number' | 'boolean' | 'object'; default: unknown; description?: string }; }

export class ConfigManager<T extends Record<string, unknown>> {
    private defaults: T; private storageKey: string; private remoteUrl?: string; private cacheTTL: number;

    constructor(defaults: T, options?: { storageKey?: string; remoteUrl?: string; cacheTTLMinutes?: number }) {
        this.defaults = defaults; this.storageKey = options?.storageKey || '__ext_config__'; this.remoteUrl = options?.remoteUrl; this.cacheTTL = (options?.cacheTTLMinutes || 60) * 60000;
    }

    /** Get config value */
    async get<K extends keyof T>(key: K): Promise<T[K]> { const config = await this.getAll(); return config[key]; }

    /** Set config value */
    async set<K extends keyof T>(key: K, value: T[K]): Promise<void> {
        const config = await this.getAll();
        config[key] = value;
        await chrome.storage.local.set({ [this.storageKey]: config });
    }

    /** Get all config */
    async getAll(): Promise<T> {
        const result = await chrome.storage.local.get(this.storageKey);
        return { ...this.defaults, ...(result[this.storageKey] as Partial<T> || {}) };
    }

    /** Fetch and merge remote config */
    async fetchRemote(): Promise<T | null> {
        if (!this.remoteUrl) return null;
        try {
            const resp = await fetch(this.remoteUrl);
            const remote = await resp.json() as Partial<T>;
            const local = await this.getAll();
            const merged = { ...local, ...remote };
            await chrome.storage.local.set({ [this.storageKey]: merged, [`${this.storageKey}_fetched`]: Date.now() });
            return merged;
        } catch { return null; }
    }

    /** Check if remote fetch needed */
    async shouldFetchRemote(): Promise<boolean> {
        const result = await chrome.storage.local.get(`${this.storageKey}_fetched`);
        const lastFetched = result[`${this.storageKey}_fetched`] as number || 0;
        return Date.now() - lastFetched > this.cacheTTL;
    }

    /** Reset to defaults */
    async reset(): Promise<void> { await chrome.storage.local.set({ [this.storageKey]: this.defaults }); }

    /** Listen for config changes */
    onChange(callback: (changes: Partial<T>) => void): void {
        chrome.storage.onChanged.addListener((changes) => {
            if (changes[this.storageKey]) callback(changes[this.storageKey].newValue as Partial<T>);
        });
    }
}
