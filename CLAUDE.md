# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Bookshelf: a small React 19 + TypeScript (strict) app built with Vite, tested with Vitest, jsdom and Testing Library. Node.js 22.22+ is required.

## Commands

- `npm run dev`: start the app (Vite, port 3000)
- `npm run test:run`: run the tests once. **Always use this.** `npm test` starts watch mode and never finishes, so do not run it.
- `npx vitest run src/books.test.ts`: run one test file (add `-t "<name>"` for a single test)
- `npm run check`: type check (`tsc --noEmit`). There is no linter.
- `npm run build`: production build

## Architecture

- `src/App.tsx` owns all state (`books`, genre filter, search query) and passes data and callbacks down. Filtering is derived on every render.
- `src/books.ts` holds all non-UI logic as pure functions. State is never changed in place; functions return new arrays. Tests are in `src/books.test.ts`.
- `src/components/<Name>/index.tsx` are presentational components. Props type is `<Name>Props`; the test is `<Name>.test.tsx` next to it.
- `src/types.ts` defines `Book`, `Genre` and `GenreFilter`. Rating `0` means "not rated".
- `src/data.ts` holds the sample books (`initialBooks`).

## Conventions

- Default exports for components; UI text is in English.
- Tests query by role/label (Testing Library), as in `src/App.test.tsx`.

## Off limits

- Do not edit `src/data.ts`.
- Do not add dependencies without asking.
- Never change a test to make it pass, unless the requirement changed.
