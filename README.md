# extension-config-manager

<p align="center">
  <a href="https://www.npmjs.com/package/extension-config-manager">
    <img src="https://img.shields.io/npm/v/extension-config-manager.svg" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/extension-config-manager">
    <img src="https://img.shields.io/npm/dt/extension-config-manager.svg" alt="npm downloads" />
  </a>
  <a href="https://github.com/theluckystrike/extension-config-manager/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/extension-config-manager.svg" alt="MIT license" />
  </a>
  <a href="https://github.com/theluckystrike/extension-config-manager/actions">
    <img src="https://github.com/theluckystrike/extension-config-manager/workflows/Build/badge.svg" alt="Build status" />
  </a>
  <a href="https://github.com/theluckystrike/extension-config-manager/issues">
    <img src="https://img.shields.io/github/issues/theluckystrike/extension-config-manager.svg" alt="GitHub issues" />
  </a>
  <a href="https://github.com/theluckystrike/extension-config-manager/pulls">
    <img src="https://img.shields.io/github/issues-pr/theluckystrike/extension-config-manager.svg" alt="GitHub PRs" />
  </a>
</p>

> Remote and local configuration management for Chrome extensions. Handles remote config fetching, local caching with TTL, type-safe defaults, schema validation, migration support, and change listeners using chrome.storage.

**Built by [Zovo](https://zovo.one)** | [npm i extension-config-manager](https://www.npmjs.com/package/extension-config-manager)

---

## Why extension-config-manager?

Managing configuration in Chrome extensions is complex. You need to handle:
- Remote configuration updates without requiring extension releases
- Local caching with TTL to reduce network calls
- Type-safe defaults that always apply as a fallback layer
- Schema validation to ensure data integrity
- Migration support when config shapes change across versions
- Real-time change detection to react to config updates

This library handles all of this with a simple, type-safe API designed for Manifest V3.

---

## Features

### 🔐 Type-Safe Configuration
Full TypeScript generic type inference. Your config shape is enforced at compile time.

```typescript
interface AppConfig {
  theme: 'light' | 'dark';
  maxResults: number;
  debug: boolean;
  userPreferences: {
    notifications: boolean;
    autoSave: boolean;
  };
}

const config = new ConfigManager<AppConfig>({
  theme: 'dark',
  maxResults: 10,
  debug: false,
  userPreferences: {
    notifications: true,
    autoSave: true
  }
});
```

### 🌐 Remote Config Fetching
Fetch configuration from any remote URL with automatic merge into local state.

```typescript
const config = new ConfigManager(defaults, {
  remoteUrl: 'https://api.example.com/config.json',
  cacheTTLMinutes: 120
});

// Only fetches if cache is stale
if (await config.shouldFetchRemote()) {
  await config.fetchRemote();
}
```

### 💾 Local Caching with TTL
Built-in caching through `chrome.storage.local` with configurable time-to-live.

- Configurable TTL (default: 60 minutes)
- Automatic stale cache detection
- Works offline with cached values

### ✅ Schema Validation
Validate configuration values against a defined schema. Prevents invalid data from being stored.

```typescript
import { ConfigManager, validateConfig } from 'extension-config-manager';

const schema = {
  theme: { type: 'string' as const, enum: ['light', 'dark'], default: 'dark' },
  maxResults: { type: 'number' as const, min: 1, max: 100, default: 10 },
  debug: { type: 'boolean' as const, default: false }
};

// Validate before setting
const isValid = await validateConfig({ theme: 'dark', maxResults: 50 }, schema);
```

### 🔄 Configuration Migration
Migrate configuration when your config shape changes across versions.

```typescript
const config = new ConfigManager(defaults, options);

config.onMigration((oldConfig, newDefaults) => {
  // Migrate old config keys to new structure
  return {
    ...oldConfig,
    // Handle renamed keys
    apiUrl: oldConfig.endpoint,  // renamed
    // Add new keys with defaults
    newFeature: newDefaults.newFeature,
    // Remove deprecated keys
  };
});
```

### 👂 Change Listeners
React to configuration changes in real-time across your extension.

```typescript
config.onChange((changes) => {
  console.log('Config updated:', changes);
  
  if (changes.theme) {
    applyTheme(changes.theme);
  }
});
```

### 📦 Manifest V3 Compatible
Works seamlessly in:
- Service workers
- Content scripts
- Popup scripts
- Background scripts

---

## Installation

```bash
npm install extension-config-manager
```

Or using yarn:

```bash
yarn add extension-config-manager
```

Or using pnpm:

```bash
pnpm add extension-config-manager
```

---

## Quick Start

### Basic Usage

```typescript
import { ConfigManager } from 'extension-config-manager';

// Define your config shape with defaults
interface MyConfig {
  theme: 'light' | 'dark';
  maxResults: number;
  debug: boolean;
  apiEndpoint: string;
}

const config = new ConfigManager<MyConfig>(
  {
    theme: 'dark',
    maxResults: 10,
    debug: false,
    apiEndpoint: 'https://api.example.com'
  },
  {
    storageKey: 'my_ext_config',
    remoteUrl: 'https://api.example.com/config.json',
    cacheTTLMinutes: 120
  }
);

// Read a single value (type-safe!)
const theme = await config.get('theme');  // Returns 'light' | 'dark'

// Write a single value
await config.set('theme', 'light');

// Get everything merged (defaults + stored)
const all = await config.getAll();

// Fetch remote config if cache is stale
if (await config.shouldFetchRemote()) {
  await config.fetchRemote();
}

// Listen for changes
config.onChange((changes) => {
  console.log('Config changed:', changes);
});
```

### Service Worker Example

```typescript
// background.ts (Manifest V3 service worker)
import { ConfigManager } from 'extension-config-manager';

interface ExtensionConfig {
  apiVersion: string;
  debug: boolean;
  featureFlags: {
    newUI: boolean;
    betaFeatures: boolean;
  };
}

const config = new ConfigManager<ExtensionConfig>(
  {
    apiVersion: 'v2',
    debug: false,
    featureFlags: {
      newUI: false,
      betaFeatures: false
    }
  },
  {
    storageKey: 'extension_config',
    remoteUrl: 'https://api.example.com/extension-config.json',
    cacheTTLMinutes: 30
  }
);

// Set up periodic refresh using Chrome alarms
chrome.alarms.create('configRefresh', { periodInMinutes: 30 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'configRefresh') {
    if (await config.shouldFetchRemote()) {
      const updated = await config.fetchRemote();
      if (updated) {
        console.log('Config refreshed:', updated);
      }
    }
  }
});

// Listen for config changes from other extension contexts
config.onChange((changes) => {
  console.log('Config updated in background:', changes);
  
  // Notify all tabs about config changes
  if (changes.featureFlags) {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, { 
            type: 'CONFIG_UPDATE', 
            config: changes 
          });
        }
      });
    });
  }
});

// Initial fetch
if (await config.shouldFetchRemote()) {
  await config.fetchRemote();
}
```

### Content Script Example

```typescript
// content.ts
import { ConfigManager } from 'extension-config-manager';

interface ContentConfig {
  theme: 'light' | 'dark';
  fontSize: number;
  enableAnimations: boolean;
}

const config = new ConfigManager<ContentConfig>(
  {
    theme: 'dark',
    fontSize: 14,
    enableAnimations: true
  },
  { storageKey: 'my_ext_config' }
);

// Apply config on page load
async function applyConfig() {
  const { theme, fontSize, enableAnimations } = await config.getAll();
  
  document.body.setAttribute('data-theme', theme);
  document.body.style.fontSize = `${fontSize}px`;
  document.body.classList.toggle('animations', enableAnimations);
}

// Listen for runtime config updates
config.onChange((changes) => {
  console.log('Config changed:', changes);
  applyConfig();
});

applyConfig();

// Also listen for messages from background
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'CONFIG_UPDATE') {
    applyConfig();
  }
});
```

---

## API Reference

### Constructor

```typescript
new ConfigManager<T>(defaults: T, options?: ConfigOptions): ConfigManager<T>
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storageKey` | `string` | `"__ext_config__"` | The key used in `chrome.storage.local` to persist config |
| `remoteUrl` | `string` | `undefined` | URL to fetch remote config JSON from |
| `cacheTTLMinutes` | `number` | `60` | Minutes before remote config is considered stale |

---

### Methods

#### `config.get(key)`

Returns the value for a single config key. Merges defaults with any stored overrides.

```typescript
const theme = await config.get('theme');
// Type: 'light' | 'dark'
```

**Parameters:**
- `key` (K extends keyof T): The configuration key to retrieve

**Returns:** `Promise<T[K]>` - The configuration value

---

#### `config.set(key, value)`

Writes a single config value to `chrome.storage.local`.

```typescript
await config.set('theme', 'light');
await config.set('maxResults', 25);
```

**Parameters:**
- `key` (K extends keyof T): The configuration key to set
- `value` (T[K]): The value to store

**Returns:** `Promise<void>`

---

#### `config.getAll()`

Returns the full config object with defaults merged under any stored values.

```typescript
const all = await config.getAll();
// Returns: { theme: 'dark', maxResults: 10, debug: false, ... }
```

**Returns:** `Promise<T>` - The complete merged configuration

---

#### `config.fetchRemote()`

Fetches JSON from the configured `remoteUrl`, merges it over local config, stores the result, and records the fetch timestamp.

```typescript
const updated = await config.fetchRemote();
if (updated) {
  console.log('Config updated from remote:', updated);
}
```

**Returns:** `Promise<T | null>` - The merged config, or `null` if no `remoteUrl` is set or fetch fails

---

#### `config.shouldFetchRemote()`

Returns `true` if enough time has passed since the last remote fetch (based on `cacheTTLMinutes`). Useful for gating fetch calls in service worker alarm handlers.

```typescript
if (await config.shouldFetchRemote()) {
  await config.fetchRemote();
}
```

**Returns:** `Promise<boolean>` - Whether a remote fetch should be performed

---

#### `config.reset()`

Resets stored config back to the original defaults.

```typescript
await config.reset();
```

**Returns:** `Promise<void>`

---

#### `config.onChange(callback)`

Registers a listener on `chrome.storage.onChanged` that fires whenever the config storage key updates.

```typescript
config.onChange((changes) => {
  console.log('Config updated:', changes);
});

// Typed callback
config.onChange((changes: Partial<MyConfig>) => {
  if (changes.theme) {
    console.log('Theme changed to:', changes.theme);
  }
});
```

**Parameters:**
- `callback` ((changes: Partial<T>) => void): Function called with the new config state

**Returns:** `void`

---

## Advanced Usage

### Nested Configuration

```typescript
interface NestedConfig {
  ui: {
    theme: 'light' | 'dark';
    fontSize: number;
  };
  features: {
    analytics: boolean;
    beta: boolean;
  };
}

const config = new ConfigManager<NestedConfig>({
  ui: { theme: 'dark', fontSize: 14 },
  features: { analytics: true, beta: false }
});

// Get nested value
const theme = await config.get('ui.theme');  // Error: dot notation not supported directly

// Instead, use getAll for nested access
const all = await config.getAll();
console.log(all.ui.theme);

// Or set nested values
await config.set('ui', { ...all.ui, theme: 'light' });
```

### Schema Validation

```typescript
import { validateConfig, ConfigSchema } from 'extension-config-manager';

const schema: ConfigSchema = {
  theme: { 
    type: 'string', 
    enum: ['light', 'dark'], 
    default: 'dark',
    description: 'UI theme preference'
  },
  maxResults: { 
    type: 'number', 
    min: 1, 
    max: 100, 
    default: 10,
    description: 'Maximum number of results to display'
  },
  debug: {
    type: 'boolean',
    default: false,
    description: 'Enable debug logging'
  }
};

// Validate values
const result = validateConfig(
  { theme: 'dark', maxResults: 50, debug: true },
  schema
);

if (result.valid) {
  console.log('Config is valid');
} else {
  console.error('Validation errors:', result.errors);
}
```

### Environment-Based Configuration

```typescript
// Different configs for different contexts
const getConfig = () => {
  const isDev = process.env.NODE_ENV === 'development';
  
  return new ConfigManager(
    {
      apiUrl: isDev ? 'http://localhost:3000' : 'https://api.production.com',
      debug: isDev,
      logLevel: isDev ? 'verbose' : 'error'
    },
    {
      storageKey: isDev ? 'dev_config' : 'prod_config',
      remoteUrl: isDev 
        ? 'http://localhost:3000/config.json'
        : 'https://api.production.com/config.json'
    }
  );
};
```

### Configuration Migration

```typescript
interface OldConfig {
  apiEndpoint: string;
  debug: boolean;
}

interface NewConfig {
  apiUrl: string;
  apiVersion: string;
  debug: boolean;
  featureFlags: {
    newUI: boolean;
  };
}

const config = new ConfigManager<NewConfig>(
  {
    apiUrl: '',
    apiVersion: 'v1',
    debug: false,
    featureFlags: { newUI: false }
  },
  { storageKey: 'my_config' }
);

// Register migration handler
config.onMigration((oldConfig: OldConfig): NewConfig => {
  return {
    // Map old key to new key
    apiUrl: oldConfig.apiEndpoint,
    apiVersion: 'v2',  // Default new version
    debug: oldConfig.debug,
    featureFlags: { newUI: false }
  };
});
```

---

## Remote Config JSON Format

The remote endpoint should return a flat JSON object matching your defaults shape.

```json
{
  "theme": "dark",
  "maxResults": 25,
  "debug": false,
  "apiEndpoint": "https://api.example.com"
}
```

For nested configs, include the nested structure:

```json
{
  "ui": {
    "theme": "dark",
    "fontSize": 16
  },
  "features": {
    "analytics": true,
    "beta": false
  }
}
```

---

## TypeScript Support

This library is written in TypeScript with full type definitions included. The generic type parameter ensures type safety across your entire configuration.

```typescript
// Full type inference
const config = new ConfigManager<MyConfig>(defaults, options);

// Type-safe get
const value: MyConfig['theme'] = await config.get('theme');

// Type-safe set
await config.set('theme', 'dark');  // ✓ Valid
await config.set('theme', 'blue');  // ✗ Type error!
```

---

## Browser Permissions

This library requires the following permissions in your `manifest.json`:

```json
{
  "permissions": [
    "storage"
  ],
  "host_permissions": [
    "https://api.example.com/*"
  ]
}
```

Add the remote URL host to `host_permissions` if you're fetching remote configuration.

---

## Error Handling

```typescript
try {
  const result = await config.fetchRemote();
  if (result) {
    console.log('Config updated:', result);
  }
} catch (error) {
  console.error('Failed to fetch remote config:', error);
  // Fall back to cached/local config
  const local = await config.getAll();
}
```

---

## Best Practices

1. **Define config shape upfront** - Use a TypeScript interface to define your full config structure
2. **Set reasonable defaults** - Always provide fallback values for all config keys
3. **Use appropriate TTL** - Balance freshness with network calls (30-120 minutes is typical)
4. **Handle migration** - Plan for config schema changes across versions
5. **Listen for changes** - Use `onChange` to react to config updates across extension contexts
6. **Validate remote config** - Sanitize and validate any remote config before applying

---

## Related Packages

- [chrome-storage](https://www.npmjs.com/package/chrome-storage) - Simple chrome.storage wrapper
- [webext-config](https://www.npmjs.com/package/webext-config) - Web extension configuration utilities

---

## License

MIT License. See [LICENSE](LICENSE) file for details.

---

## Development

```bash
# Clone the repository
git clone https://github.com/theluckystrike/extension-config-manager.git
cd extension-config-manager

# Install dependencies
npm install

# Build the project
npm run build

# Type check
npm run build
```

---

## Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

---

## Support

- **Issues**: https://github.com/theluckystrike/extension-config-manager/issues
- **Discussions**: https://github.com/theluckystrike/extension-config-manager/discussions

---

<div align="center">

**Built with 🔧 by [Zovo](https://zovo.one)**

*Powering the next generation of Chrome extensions*

</div>
