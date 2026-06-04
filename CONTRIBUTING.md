# Contributing

## Prerequisites

- Node.js 22+
- npm 10+

## Setup

```bash
git clone git@github.com:twilio/twilio-compliance-embed-react.git
cd twilio-compliance-embed-react
npm install
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Compile to `dist/` (ESM + CJS + type declarations) |
| `npm run lint` | Run ESLint |
| `npm test` | Run the full test suite |
| `npm run coverage` | Run tests with coverage report |
| `npm run typecheck` | Type-check without emitting output |

## Branching model

| Branch | Purpose |
|--------|---------|
| `main` | Stable, production-ready |
| `feature/*` | Day-to-day development |

Always branch off `main`:

```bash
git checkout main
git checkout -b feature/my-feature
```

Open PRs targeting `main`.

## Commit messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/).

| Prefix | Version bump |
|--------|-------------|
| `fix:` | Patch (`1.0.0` → `1.0.1`) |
| `feat:` | Minor (`1.0.0` → `1.1.0`) |
| `BREAKING CHANGE:` in footer | Major (`1.0.0` → `2.0.0`) |
| `chore:`, `docs:`, `refactor:`, etc. | No release |

## Pull requests

- PRs must target `main`.
- CI checks must pass before merging.
- Run `npm test` and `npm run typecheck` locally before opening a PR.

## Releases

Releases follow the GitHub Release flow with OIDC trusted publishing to npm:

1. Update the version in `package.json`
2. Merge to `main`
3. Create a GitHub Release with a semver tag (e.g. `v1.0.0`)
4. CI tests pass → environment approval → npm publish
