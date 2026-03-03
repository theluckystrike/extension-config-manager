# extension-config-manager — Remote Config for Extensions

> **Built by [Zovo](https://zovo.one)** | `npm i extension-config-manager`

Remote + local config management with caching, TTL, defaults, and change listeners for Chrome extensions.

## Features

- **Remote Config** - Fetch config from remote URL
- **Local Caching** - Cache config with TTL support
- **Default Values** - Fallback to defaults when remote unavailable
- **Change Listeners** - React to config changes
- **TypeScript Support** - Full type safety

## Installation

```bash
npm install extension-config-manager
```

## Usage

### Basic Setup

```typescript
import { ConfigManager } from 'extension-config-manager';

const config = new ConfigManager(
  { theme: 'dark', maxResults: 10 }, // Default values
  { remoteUrl: 'https://api.example.com/config.json' }
);

const theme = await config.get('theme');
console.log(theme); // 'dark' or remote value
```

### Remote Config with TTL

```typescript
import { ConfigManager } from 'extension-config-manager';

const config = new ConfigManager(
  { apiUrl: 'https://api.example.com' },
  {
    remoteUrl: 'https://api.example.com/config.json',
    ttl: 3600000 // 1 hour in milliseconds
  }
);
```

### Listening for Changes

```typescript
import { ConfigManager } from 'extension-config-manager';

const config = new ConfigManager({ theme: 'light' });

// Listen for config changes
config.on('change', (key, newValue, oldValue) => {
  console.log(`Config changed: ${key} from ${oldValue} to ${newValue}`);
});

// Update config
await config.set('theme', 'dark');
```

### Manifest V3 / Service Worker Usage

```typescript
// background.ts (Service Worker)
import { ConfigManager } from 'extension-config-manager';

const config = new ConfigManager(
  { debug: false, apiVersion: 'v1' },
  {
    remoteUrl: 'https://api.example.com/extension-config.json',
    storage: 'chrome-storage' // Use chrome.storage instead of localStorage
  }
);

// Listen from background
config.on('change', (key, value) => {
  chrome.tabs.query({}).then(tabs => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, { type: 'CONFIG_CHANGED', key, value });
    });
  });
});
```

### Content Script Usage

```typescript
// content-script.ts
import { ConfigManager } from 'extension-config-manager';

// Use same defaults, config syncs via chrome.storage
const config = new ConfigManager(
  { theme: 'light', accentColor: '#007bff' },
  { storage: 'chrome-storage' }
);

const theme = await config.get('theme');
document.body.className = theme;
```

## API Reference

### new ConfigManager(defaults, options?)

Create a config manager instance.

- `defaults` - Default configuration values
- `options` - Configuration options

```typescript
interface ConfigOptions {
  remoteUrl?: string;      // URL to fetch remote config
  ttl?: number;            // Cache TTL in ms (default: 300000 = 5 min)
  storage?: 'localStorage' | 'chrome-storage';
  onError?: (error: Error) => void;
}
```

### config.get(key)

Get a config value (from cache or defaults).

```typescript
const theme = await config.get('theme');
```

### config.set(key, value)

Set a config value.

```typescript
await config.set('theme', 'dark');
```

### config.getAll()

Get all config values.

```typescript
const all = await config.getAll();
```

### config.refresh()

Force refresh from remote URL.

```typescript
await config.refresh();
```

### config.on('change', callback)

Listen for configuration changes.

```typescript
config.on('change', (key, newValue, oldValue) => {
  // Handle change
});
```

## Storage Options

### localStorage

Default storage. Works in content scripts and popup/background.

```typescript
const config = new ConfigManager(defaults, { storage: 'localStorage' });
```

### chrome.storage

Recommended for Manifest V3. Syncs across all extension contexts.

```typescript
const config = new ConfigManager(defaults, { storage: 'chrome-storage' });
```

## Example Config JSON

```json
{
  "theme": "dark",
  "accentColor": "#007bff",
  "apiUrl": "https://api.example.com",
  "featureFlags": {
    "newUI": true,
    "betaFeatures": false
  }
}
```

## License

MIT License
