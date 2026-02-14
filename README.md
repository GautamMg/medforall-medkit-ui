
# MedForAll — MedKit UI (Assignment 1)

A small, focused React component library built for the MedForAll take-home (Assignment 1).  
Goal: implement the required UI components with sensible defaults, Storybook stories, and basic tests—without over-engineering.

## What’s included (Assignment requirements)

This project implements **exactly the 5 required components**:

- **AppointmentCard** — display an appointment summary with status and actions
- **VitalSignsInput** — input fields for common vitals with validation/hints
- **MedicationSearch** — searchable medication input with results dropdown
- **TimeSlotPicker** — choose a time slot (available/unavailable)
- **DataTable** — lightweight table with empty state + clickable rows

All components are showcased in **Storybook** with minimal, practical stories (Default + a couple of variations).

## Tech choices (kept intentionally simple)

- **React + TypeScript**
- **CSS Modules** for styling (no design system dependency)
- **Storybook (react-vite)** for component previews
- **Vitest + Testing Library** for tests
- **tsup** for building the library output (`dist/`)

No extra UI frameworks or complex theming layers—keeps the code easy to explain in an interview.

---

## Getting started

### Install
```bash
npm install
````

### Run Storybook

```bash
npm run storybook
```

Storybook runs at:

* [http://localhost:6006](http://localhost:6006)

### Run tests

```bash
npm test
```

### Build library

```bash
npm run build
```

Build output is generated in `dist/`.

---

## Project structure

```txt
src/
  components/
    AppointmentCard/
    DataTable/
    MedicationSearch/
    TimeSlotPicker/
    VitalSignsInput/
  index.ts
.storybook/
  main.ts
  preview.ts
vitest.config.ts
vitest.setup.ts
tsup.config.ts
```

* Each component folder typically contains:

  * `Component.tsx`
  * `Component.types.ts` (props/types)
  * `Component.module.css`
  * `Component.stories.tsx`
  * `Component.test.tsx`

---

## Component notes (implementation details)

### Accessibility

Basic a11y is considered throughout:

* Inputs are labeled properly
* Interactive elements use appropriate roles/states
* Keyboard support where it matters (ex: `MedicationSearch`, `TimeSlotPicker`)
* A small a11y sanity check is used in tests (using `axe` and checking violations length)

> Note: If you see a console warning like `HTMLCanvasElement.getContext` during tests, it’s a known jsdom limitation and does not affect the component behavior or the assignment requirements.

### Styling

* CSS Modules are used to keep styles scoped and predictable.
* The styles aim to be clean and readable rather than “perfect UI”.

---

## Useful scripts

* `npm run storybook` — run Storybook dev server
* `npm run build-storybook` — generate static Storybook build
* `npm test` — run vitest in watch mode
* `npm run test:coverage` — run tests with coverage
* `npm run build` — build library via tsup
* `npm run lint` — eslint

---

## What I did *not* add (on purpose)

To keep this defensible and aligned with the assignment scope, I avoided:

* heavy design systems / UI frameworks
* global theming infrastructure
* complex state management
* advanced packaging/publishing workflows

This is a straightforward component library meant to satisfy the assignment cleanly.

---