# Contributing to extension-config-manager

Thank you for your interest in contributing to extension-config-manager! This document provides guidelines and best practices for contributing.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Code Style](#code-style)
- [Testing](#testing)
- [Reporting Issues](#reporting-issues)
- [Security](#security)
- [License](#license)

## Getting Started

1. Fork the repository at https://github.com/theluckystrike/extension-config-manager
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/extension-config-manager.git
   cd extension-config-manager
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a feature branch from main:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Google Chrome (for testing in a real extension context)

### Building

Build the project with:

```bash
npm run build
```

The TypeScript compiler outputs to `dist/`.

### Project Structure

```
extension-config-manager/
├── src/
│   ├── index.ts       # Public API exports
│   └── config.ts     # ConfigManager class implementation
├── dist/              # Compiled output (generated)
├── .github/           # GitHub workflows and templates
├── README.md          # Documentation
├── CONTRIBUTING.md    # This file
├── LICENSE            # MIT License
└── package.json       # Package configuration
```

## Making Changes

1. Make your changes in the `src/` directory
2. Ensure your changes maintain type safety
3. Add tests if applicable (manual testing in Chrome extension recommended)
4. Update documentation if the public API changes
5. Build and verify the project compiles without errors

### Adding New Features

When adding new features:

1. Define TypeScript types in `src/config.ts`
2. Implement the feature in the `ConfigManager` class
3. Export any new types from `src/index.ts`
4. Update README.md with new API documentation
5. Add a code example demonstrating the new feature

### Bug Fixes

When fixing bugs:

1. Describe the issue clearly in your commit message
2. Provide reproduction steps if applicable
3. Verify the fix works correctly

## Pull Request Guidelines

- **Keep PRs focused** - One feature or fix per PR
- **Write clear commit messages** - Describe what changed and why
- **Test your changes** - Verify in a Chrome extension before submitting
- **Update types** - If changing the public API, update TypeScript definitions
- **Update documentation** - Keep README.md in sync with code changes
- **Be responsive** - Address review feedback promptly

### PR Checklist

Before submitting:

- [ ] Project builds without errors (`npm run build`)
- [ ] TypeScript type checking passes
- [ ] New public APIs are documented in README.md
- [ ] Code follows the style guidelines
- [ ] Commit messages are clear and descriptive

### PR Title Format

Use conventional commit format:

```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore
```

Examples:
- `feat: add schema validation support`
- `fix: resolve cache invalidation issue`
- `docs: update API reference`

## Code Style

- **TypeScript strict mode** - Enable strict type checking
- **Async/await** - Prefer over raw promises
- **Single-purpose methods** - Keep methods small and focused
- **JSDoc comments** - Document all public methods and types
- **Meaningful names** - Use descriptive variable and function names
- **Early returns** - Use guard clauses for error conditions

### TypeScript Guidelines

```typescript
// ✓ Good: Explicit return types for public methods
public async get<K extends keyof T>(key: K): Promise<T[K]> {
  // ...
}

// ✗ Avoid: Implicit any types
public get(key) {
  // ...
}

// ✓ Good: Generic constraints
async set<K extends keyof T>(key: K, value: T[K]): Promise<void> {

// ✗ Avoid: Using 'any'
async set(key: any, value: any): Promise<void> {
```

### Formatting

This project uses standard TypeScript formatting. Most editors will automatically format on save.

## Testing

### Manual Testing

Since this library interacts with `chrome.storage`, manual testing in a Chrome extension is recommended:

1. Build the project: `npm run build`
2. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select your test extension directory
3. Test all config operations:
   - Set and get values
   - Remote fetch (if configured)
   - Change listeners
   - Reset functionality

### Test Scenarios

- ✓ Initial load with defaults
- ✓ Override defaults with stored values
- ✓ Remote config fetch and merge
- ✓ Cache TTL expiration
- ✓ Config reset to defaults
- ✓ Change listener notifications
- ✓ Error handling for failed fetches

## Reporting Issues

Use GitHub Issues to report:

- **Bugs** - With reproduction steps and expected behavior
- **Feature requests** - With clear description and use case
- **Questions** - About usage or configuration

### Bug Report Template

```markdown
## Bug Description
A clear and concise description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened instead.

## Environment
- OS: [e.g., macOS]
- Chrome version: [e.g., 120.0]
- Library version: [e.g., 0.1.0]

## Additional Context
Any other context about the problem.
```

## Security

If you discover a security vulnerability, please DO NOT open an issue. Instead, contact the maintainers directly through GitHub or email.

## Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct. By participating, you are expected to uphold this code.

## License

By contributing to extension-config-manager, you agree that your contributions will be licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Getting Help

- **Documentation**: Check [README.md](README.md) for usage examples
- **Issues**: https://github.com/theluckystrike/extension-config-manager/issues
- **Discussions**: https://github.com/theluckystrike/extension-config-manager/discussions

---

**Thank you for contributing!**

---

<div align="center">

*Built with 🔧 by [Zovo](https://zovo.one)*

</div>
