
# MedForAll — MedKit UI (Assignment 1)
This is my attempt in creating simple yet focused React component library built for the MedForAll take-home assignment.  

This is a React component library built for healthcare workflows. It consists of five production-ready components, each purpose-built for the realities of clinical software — real-time vitals entry, medication lookups, appointment management, slot scheduling, and data-heavy patient tables.

I have also added the some of the output screenshots of these components in ./Screenshots folder for reference.

---

## What's inside

| Component | What it does |
|---|---|
| `AppointmentCard` | Displays a scheduled appointment with patient details, appointment type, and real-time status management |
| `VitalSignsInput` | Structured form for recording clinical vitals with unit conversion, range validation, and BMI auto-calculation |
| `MedicationSearch` | Debounced async medication search with controlled substance indicators and prior auth flags |
| `TimeSlotPicker` | Timezone-aware time slot selection grouped by Morning / Afternoon / Evening |
| `DataTable` | Fully-featured data table with sorting, row selection, server-side pagination, and loading skeletons |

---

## Getting started

**Install dependencies**

```bash
npm install
```

**Run Storybook** — this is your best starting point. It's the living docs for every component.

```bash
npm run storybook
```

Opens at `http://localhost:6006`. Every component has multiple stories covering its key states — default, loading, edge cases, mobile viewport, and interactive demos with real state.

**Run tests**

```bash
npm test
```

53 tests across all five components. Coverage includes unit behavior, keyboard navigation, accessibility (via `vitest-axe` / `axe-core`), and edge cases like empty states and out-of-range values.

**Build the library**

```bash
npm run build
```

Outputs ESM (`.mjs`), CJS (`.js`), and TypeScript declarations (`.d.ts`) to `dist/` via `tsup`. Package exports are wired for both bundler and Node environments.

---

## Component details

### AppointmentCard

Renders a clinical appointment with patient info, appointment type, current status, and action controls.

```tsx
import { AppointmentCard } from 'medforall-medkit-ui';

<AppointmentCard
  patient={{
    name: "Ava Johnson",
    mrn: "MRN-00042",
    dateOfBirth: new Date("1985-03-12"),
  }}
  appointment={{
    id: "appt-1",
    scheduledTime: new Date("2026-02-14T09:00:00"),
    duration: 30,
    type: "in-person",
    status: "scheduled",
    reason: "Annual checkup",
  }}
  onStatusChange={(newStatus) => console.log(newStatus)}
  onReschedule={() => {}}
  onCancel={() => {}}
/>
```

**Status values:** `scheduled` · `checked-in` · `in-progress` · `completed` · `no-show` · `cancelled`

**Appointment types:** `in-person` (🏥) · `telehealth` (📹) · `phone` (📞)

The component calculates and displays the patient's age from `dateOfBirth`, renders avatar initials when no image is provided, and exposes contextual action buttons based on the current status.

---

### VitalSignsInput

A structured vitals entry form. Handles the messy realities of clinical data — unit switching, impossible value combinations (diastolic > systolic), and required field enforcement.

```tsx
import { VitalSignsInput } from 'medforall-medkit-ui';

<VitalSignsInput
  onChange={(vitals) => saveVitals(vitals)}
  onValidationError={(errors) => console.warn(errors)}
  requiredFields={["bloodPressureSystolic", "bloodPressureDiastolic", "heartRate"]}
  initialValues={{
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    temperatureUnit: "F",
    weightUnit: "lb",
    heightUnit: "in",
  }}
/>
```

**What it handles:**
- Blood pressure (systolic/diastolic with relationship validation)
- Heart rate, respiratory rate, oxygen saturation
- Temperature with °F ↔ °C toggle (values convert in place)
- Weight with lb ↔ kg toggle
- Height with in ↔ cm toggle
- BMI auto-calculated whenever weight + height are both present
- Pain level on a 0–10 slider
- Out-of-range hints (soft warnings — clinicians sometimes legitimately need to record unusual values)
- `Enter` key moves focus to the next field

---

### MedicationSearch

Async medication lookup with debouncing, request cancellation, and clinical safety indicators.

```tsx
import { MedicationSearch } from 'medforall-medkit-ui';

<MedicationSearch
  searchFn={async (query) => await api.searchMedications(query)}
  onSelect={(medication) => prescribe(medication)}
  recentSelections={recentMeds}
  debounceMs={300}
/>
```

The `searchFn` prop owns the API call — pass in whatever async function fetches your medication data. The component handles debouncing, loading state, and cancellation of in-flight requests when new input arrives before the previous call completes.

**Medication indicators:**
- `⚠ C` — Controlled substance
- `PA` — Requires prior authorization

Recent selections surface on focus so clinicians can quickly re-select without re-typing.

---

### TimeSlotPicker

Appointment slot selection with timezone-aware display and capacity tracking.

```tsx
import { TimeSlotPicker } from 'medforall-medkit-ui';

<TimeSlotPicker
  date={new Date("2026-02-14T12:00:00Z")}
  availableSlots={slots}
  selectedSlot={selected}
  onSelect={setSelected}
  timezone="America/New_York"
  slotDuration={30}
/>
```

Slots are grouped automatically into **Morning** (before noon), **Afternoon** (noon–5pm), and **Evening** (after 5pm) based on the provided `timezone` — not the browser's local time. The timezone abbreviation (EST, PST, etc.) is shown alongside the date header.

`remainingCapacity` on a slot shows "N left" when provided. Unavailable slots render as disabled but stay visible so users can see what's already booked.

---

### DataTable

A general-purpose data table for patient lists, records, and results grids.

```tsx
import { DataTable } from 'medforall-medkit-ui';

<DataTable
  data={patients}
  columns={columns}
  getRowId={(row) => row.id}
  sorting={{ column: sortCol, direction: sortDir, onSort: handleSort }}
  selection={{ selected, onSelectionChange: setSelected, mode: "multiple" }}
  pagination={{ page, pageSize, total, onPageChange, onPageSizeChange }}
  onRowClick={(row) => navigate(`/patients/${row.id}`)}
  loading={isLoading}
  stickyHeader
/>
```

**Features:**
- Column-level `sortable` flag with `aria-sort` attributes for screen readers
- Row selection: `"single"` or `"multiple"` mode with a select-all checkbox
- Server-side pagination with configurable page size (10 / 25 / 50 / 100)
- Shimmer skeleton rows while loading
- Sticky header via `stickyHeader` prop
- Per-column `cell` renderer for custom content (badges, actions, links)
- Keyboard navigation on rows — `Enter` triggers `onRowClick`
- `emptyState` prop for a custom empty state

The table is fully controlled — sort state, pagination, and selection all live in the parent. The component fires callbacks and reflects whatever state you pass back in.

---

## Architecture decisions

**CSS Modules, not a design system**

No runtime overhead, no specificity fights with consumer apps, and dead-simple scoping. Healthcare apps often bring their own design system — CSS Modules means our styles don't bleed out and theirs don't bleed in.

**Controlled components throughout**

Clinical UIs need predictable state. Every component with selection, sort, or pagination is fully controlled — the parent owns the truth, the component renders and fires callbacks. This makes it easy to drop into any state management layer without friction.

**`tsup` for bundling**

Zero-config for what we need: ESM for bundlers, CJS for Node/Jest, `.d.ts` declarations. It gets out of the way.

**Accessibility tested, not just considered**

Every interactive element uses proper ARIA roles. The time slot picker uses `role="radio"` / `role="radiogroup"`. The data table reflects sort state with `aria-sort`. VitalSignsInput fields are properly labeled. All five components are tested with `axe-core` via `vitest-axe` — an a11y violation is a test failure.

---

## Project structure

```
src/
  components/
    AppointmentCard/
      AppointmentCard.tsx          # component implementation
      AppointmentCard.types.ts     # TypeScript interfaces
      AppointmentCard.module.css   # scoped styles
      AppointmentCard.stories.tsx  # Storybook stories
      AppointmentCard.test.tsx     # Vitest + Testing Library tests
      index.ts
    VitalSignsInput/  ...
    MedicationSearch/ ...
    TimeSlotPicker/   ...
    DataTable/        ...
  index.ts                         # public exports (all 5 components + types)

.storybook/
  main.ts
  preview.ts

Screenshots/
vitest.config.ts
vitest.setup.ts
tsup.config.ts
```

---

## Useful scripts

| Script | What it does |
|---|---|
| `npm run storybook` | Run Storybook dev server on port 6006 |
| `npm run build-storybook` | Generate static Storybook build |
| `npm test` | Run Vitest in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run build` | Build library via tsup → `dist/` |
| `npm run lint` | Run ESLint |

---

## What I'd improve with more time

- **Design tokens** — styles use hardcoded values right now. A CSS custom properties layer (or a tokens file piped into the CSS Modules) would make theming much more tractable for teams with an existing design system.
- **E2E coverage** — the component tests cover behavior well, but a Playwright suite exercising the full Storybook stories would add confidence in responsive layout and cross-browser rendering.
- **Storybook `play()` functions** — the Interactive stories already demonstrate stateful behavior. Wiring `play()` functions into them would make them self-verifying in CI.
- **UX/styling iteration** — this is a first pass focused on correctness and accessibility. With more time, I’d refine spacing/typography, hover/focus states, empty/loading feedback, and micro-interactions to make the components feel more “product-ready” and friendlier to use.

---

## Tech stack

- **React 18** + TypeScript (strict mode, no `any`)
- **CSS Modules** for component-scoped styles
- **Storybook 8** with `@storybook/addon-a11y` and `@storybook/addon-essentials`
- **Vitest** + `@testing-library/react` + `vitest-axe` for testing
- **tsup** for library bundling (ESM + CJS + `.d.ts`)
- **jsdom** as the test environment

---