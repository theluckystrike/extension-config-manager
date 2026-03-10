# Contributing to extension-config-manager

Thank you for your interest in contributing to extension-config-manager! This document outlines the process for contributing to this project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. We expect all contributors to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- A Chrome/Chromium browser for testing

### Development Setup

```bash
# Clone the repository
git clone https://github.com/theluckystrike/extension-config-manager.git
cd extension-config-manager

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

## How to Contribute

### Reporting Bugs

Before reporting a bug, please check the [existing issues](https://github.com/theluckystrike/extension-config-manager/issues) to avoid duplicates.

When reporting a bug, include:
- A clear, descriptive title
- Detailed steps to reproduce the issue
- Your environment details (Node version, browser, OS)
- Any relevant error messages or logs

### Suggesting Features

We welcome feature suggestions! Please open an issue with:
- A clear description of the proposed feature
- Use cases for the feature
- Any alternative solutions you've considered

### Pull Requests

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-new-feature`
3. **Make** your changes
4. **Run** tests to ensure nothing is broken: `npm test`
5. **Commit** your changes: `git commit -m 'Add some feature'`
6. **Push** to the branch: `git push origin feature/my-new-feature`
7. **Submit** a Pull Request

### Pull Request Guidelines

- Follow the existing code style and conventions
- Add tests for new features or bug fixes
- Update documentation as needed
- Ensure all tests pass before submitting
- Keep PRs focused and reasonably sized

## Project Structure

```
extension-config-manager/
├── src/
│   ├── index.ts          # Main entry point
│   ├── ConfigManager.ts  # Core configuration manager
│   ├── storage.ts        # Storage utilities
│   ├── validation.ts     # Schema validation
│   └── types.ts          # TypeScript types
├── tests/
│   └── *.test.ts         # Unit tests
├── dist/                 # Build output
├── README.md             # Documentation
└── package.json          # Project configuration
```

## Coding Standards

### TypeScript

- Use strict TypeScript settings
- Prefer interfaces over types for public APIs
- Use generics where appropriate for type safety
- Document complex types with JSDoc comments

### Testing

- Write meaningful test descriptions
- Test both success and failure cases
- Mock Chrome storage API in tests

### Commit Messages

Follow conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `refactor:` for code refactoring
- `test:` for adding/updating tests
- `chore:` for maintenance tasks

Example:
```
feat: add schema validation support

Add validateConfig function to allow users to validate
configuration values against a defined schema before storing.
```

## License

By contributing to extension-config-manager, you agree that your contributions will be licensed under the [MIT License](LICENSE).

## Questions?

If you have questions about contributing, please:
- Check our [GitHub Discussions](https://github.com/theluckystrike/extension-config-manager/discussions)
- Open an issue with the `question` label

---

**Built by [Zovo](https://zovo.one)** — Powering the next generation of Chrome extensions
