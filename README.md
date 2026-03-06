# extension-config-manager

Remote and local configuration management for Chrome extensions. Handles remote config fetching, local caching with TTL, type-safe defaults, and change listeners using chrome.storage.

Built by Zovo (https://zovo.one) | npm i extension-config-manager


INSTALLATION

```bash
npm install extension-config-manager
```


FEATURES

- Remote config fetching from any URL with automatic merge into local state
- Local caching through chrome.storage.local with configurable TTL
- Type-safe defaults that always apply as a fallback layer
- Change listeners that fire when config values update
- Written in TypeScript with full generic type inference
- Works in Manifest V3 service workers and content scripts


QUICK START

```typescript
import { ConfigManager } from 'extension-config-manager';

const config = new ConfigManager(
  { theme: 'dark', maxResults: 10, debug: false },
  {
    storageKey: 'my_ext_config',
    remoteUrl: 'https://api.example.com/config.json',
    cacheTTLMinutes: 120
  }
);

// Read a single value
const theme = await config.get('theme');

// Write a single value
await config.set('theme', 'light');

// Get everything merged (defaults + stored)
const all = await config.getAll();
```


CONSTRUCTOR OPTIONS

ConfigManager accepts two arguments. The first is a defaults object containing every config key and its fallback value. The second is an optional options object.

```typescript
new ConfigManager(defaults, options?)
```

Options fields

- storageKey (string, default "__ext_config__") - The key used in chrome.storage.local to persist config
- remoteUrl (string, optional) - URL to fetch remote config JSON from
- cacheTTLMinutes (number, default 60) - Minutes before remote config is considered stale


API

config.get(key)

Returns the value for a single config key. Merges defaults with any stored overrides.

```typescript
const theme = await config.get('theme');
```

config.set(key, value)

Writes a single config value to chrome.storage.local.

```typescript
await config.set('debug', true);
```

config.getAll()

Returns the full config object with defaults merged under any stored values.

```typescript
const all = await config.getAll();
```

config.fetchRemote()

Fetches JSON from the configured remoteUrl, merges it over local config, stores the result, and records the fetch timestamp. Returns the merged config or null if no remoteUrl is set or the fetch fails.

```typescript
const updated = await config.fetchRemote();
```

config.shouldFetchRemote()

Returns true if enough time has passed since the last remote fetch (based on cacheTTLMinutes). Useful for gating fetch calls in service worker alarm handlers.

```typescript
if (await config.shouldFetchRemote()) {
  await config.fetchRemote();
}
```

config.reset()

Resets stored config back to the original defaults.

```typescript
await config.reset();
```

config.onChange(callback)

Registers a listener on chrome.storage.onChanged that fires whenever the config storage key updates. The callback receives the new config state as a partial object.

```typescript
config.onChange((changes) => {
  console.log('Config updated', changes);
});
```


SERVICE WORKER EXAMPLE

```typescript
// background.ts
import { ConfigManager } from 'extension-config-manager';

const config = new ConfigManager(
  { apiVersion: 'v2', debug: false },
  {
    remoteUrl: 'https://api.example.com/extension-config.json',
    cacheTTLMinutes: 30
  }
);

chrome.alarms.create('configRefresh', { periodInMinutes: 30 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'configRefresh' && await config.shouldFetchRemote()) {
    await config.fetchRemote();
  }
});

config.onChange((changes) => {
  console.log('Config changed in background', changes);
});
```


REMOTE CONFIG JSON FORMAT

The remote endpoint should return a flat JSON object matching your defaults shape.

```json
{
  "theme": "dark",
  "maxResults": 25,
  "debug": false
}
```


DEVELOPMENT

```bash
git clone https://github.com/theluckystrike/extension-config-manager.git
cd extension-config-manager
npm install
npm run build
```


LICENSE

MIT License. See LICENSE file for details.

---

zovo.one
