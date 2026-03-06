# Contributing to extension-config-manager

Thanks for your interest in contributing. This document covers the basics for getting started.


GETTING STARTED

1. Fork the repository at https://github.com/theluckystrike/extension-config-manager
2. Clone your fork locally
3. Install dependencies with npm install
4. Create a feature branch from main


DEVELOPMENT

Build the project with npm run build. The TypeScript compiler outputs to dist/.

The source lives in src/ with two files. index.ts re-exports the public API and config.ts contains the ConfigManager class.


PULL REQUESTS

- Keep PRs focused on a single change
- Write clear commit messages describing what changed and why
- Make sure the project builds cleanly before submitting
- Add or update types if you change the public API
- Test your changes manually in a Chrome extension before submitting


CODE STYLE

- Use TypeScript strict mode
- Prefer async/await over raw promises
- Keep methods small and single-purpose
- Document public methods with JSDoc comments


ISSUES

Use GitHub Issues to report bugs or suggest features. Include reproduction steps for bugs and a clear description of the expected behavior.


LICENSE

By contributing you agree that your contributions will be licensed under the MIT License.

---

zovo.one
