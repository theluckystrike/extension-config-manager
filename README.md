# extension-config-manager — Remote Config for Extensions
> **Built by [Zovo](https://zovo.one)** | `npm i extension-config-manager`

Remote + local config with caching, TTL, defaults, and change listener.

```typescript
import { ConfigManager } from 'extension-config-manager';
const config = new ConfigManager({ theme: 'dark' }, { remoteUrl: '/config.json' });
const theme = await config.get('theme');
```
MIT License
