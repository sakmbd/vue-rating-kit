# Contributing

## Project Setup

```bash
git clone https://github.com/sakmbd/vue-rating-kit.git
cd vue-rating-kit
npm install
npm run dev
```

## Testing

All of the following must pass before submitting a PR:

```bash
npm run test:run    # unit tests
npm run build       # library build
npm run docs:build  # documentation build
```

## Pull Requests

- Keep changes focused to a single concern
- Add tests for new features or bug fixes
- Maintain backward compatibility where possible
- Update documentation when public APIs change

## Quality Standards

Contributions should preserve:

- **Accessibility** — ARIA semantics, keyboard navigation, screen reader support
- **TypeScript** — strict typing, no `any`, exported public types
- **SSR compatibility** — no browser-only APIs at module scope
- **Nuxt compatibility** — tested with `@vue/server-renderer`
- **Test coverage** — keep coverage at or above the current baseline

## Code Style

Follow the existing patterns and conventions in the codebase. See [CLAUDE.md](CLAUDE.md) for the full project philosophy.
