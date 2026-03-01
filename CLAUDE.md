# CLAUDE.md — AI Assistant Guide for updated_hrms

This file documents the codebase structure, conventions, and workflows for AI assistants working on this project.

---

## Project Overview

**Smarthr Admin Template** is a full-featured Angular 21 HRMS (Human Resource Management System) frontend application with integrated CRM, Finance, Recruitment, and Super-Admin modules. It uses Angular standalone components, lazy-loaded routes, and ships with 105 JSON mock data files in place of a real backend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 21.1.2 (standalone components, Signals-ready) |
| Language | TypeScript 5.9.3 |
| Reactive | RxJS 7.8.2 |
| UI Libraries | Angular Material 21, PrimeNG 21, Bootstrap 5.3, ngx-bootstrap 20 |
| Charting | ApexCharts 5 / ng-apexcharts 2, Chart.js 4 / ng2-charts 8 |
| Calendar | FullCalendar 6, Angular Calendar 0.32 |
| Styling | SCSS / SASS (Less 4 also present), Bootstrap CSS |
| Icons | FontAwesome, Tabler, Feather, Ionicons, Material, Remix, BoxIcons (12 total) |
| Mapping | Leaflet 1.9 |
| Testing | Jasmine 5 + Karma 6 |
| Linting | ESLint 9 + angular-eslint 21 + typescript-eslint 8 |
| Build | Angular CLI 21 / @angular/build 21 |

---

## Directory Structure

```
updated_hrms/
├── src/
│   ├── main.ts                     # Bootstrap entry point
│   ├── index.html                  # Root HTML (title: "Smarthr Admin Template")
│   ├── styles.scss                 # Global styles
│   ├── custom-theme.scss           # Custom theme overrides
│   └── app/
│       ├── app.component.ts        # Root component – handles route-based breadcrumb logic
│       ├── app.config.ts           # App-wide providers (router, HTTP, animations, masks, charts)
│       ├── app.routes.ts           # Top-level routes (redirects → /dashboard/index)
│       ├── core/
│       │   ├── models/
│       │   │   ├── models.ts       # ALL domain interfaces/classes (HR, CRM, Finance, etc.)
│       │   │   └── sidebar.model.ts
│       │   ├── services/
│       │   │   ├── data/
│       │   │   │   └── data.service.ts   # Central data service (6917 lines, HTTP to mock JSON)
│       │   │   ├── common/
│       │   │   │   └── common.service.ts # Shared BehaviorSubjects (base, page, last)
│       │   │   ├── settings/
│       │   │   │   └── setting.service.ts # Layout/theme persistence (localStorage)
│       │   │   └── sidebar/
│       │   │       └── sidebar.service.ts
│       │   ├── pipe/
│       │   │   └── pipe.ts         # Custom Angular pipes
│       │   └── routes/
│       │       └── routes.ts       # Route constant definitions
│       ├── features/
│       │   ├── auth/
│       │   │   └── auth.routes.ts  # 28 authentication screens (login, register, OTP, etc.)
│       │   └── pages/
│       │       └── pages.routes.ts # All feature module routes (lazy-loaded)
│       ├── layouts/
│       │   ├── default-sidebar/
│       │   ├── horizontal-sidebar/
│       │   ├── stacked-sidebar/
│       │   ├── two-column-sidebar/
│       │   ├── header/
│       │   └── footer/
│       └── shared/
│           └── ...                 # Breadcrumbs, pagination, date-pickers, shared components
├── public/
│   └── assets/
│       ├── json/                   # 105 mock data JSON files
│       ├── img/                    # Image assets organised by category (27 folders)
│       ├── css/                    # Vendor CSS
│       └── fonts/                  # Icon font files
├── angular.json                    # CLI configuration (project: "template", output: dist/template)
├── package.json
├── tsconfig.json                   # Strict mode enabled
├── tsconfig.app.json
├── tsconfig.spec.json
└── .editorconfig
```

---

## Key Commands

```bash
# Development server (http://localhost:4200)
npm start            # ng serve

# Production build → dist/template/
npm run build        # ng build

# Watch mode (development)
npm run watch        # ng build --watch --configuration development

# Unit tests
npm test             # ng test (Jasmine + Karma)

# Lint
npm run lint         # ng lint (ESLint + angular-eslint)
```

---

## Routing Architecture

The app uses Angular's standalone/lazy-loading pattern:

```
app.routes.ts
├── '' → /dashboard/index (redirect)
├── 'auth/**'  → features/auth/auth.routes  (28 auth screens)
├── 'pages/**' → features/pages/pages.routes (all feature routes)
├── 'coming-soon', 'under-maintenance', 'under-construction'
└── '**' → error-404
```

### Major Feature Sections (pages.routes.ts)

| Section | Description |
|---|---|
| `/dashboard/*` | 12 role-specific dashboards (admin, employee, HR, payroll, finance, CRM, etc.) |
| `/apps/*` | Chat, calendar, email, calls, todo, notes, file-manager, kanban, social-feed |
| `/super-admin/*` | Companies, subscriptions, packages, tenant metrics, SLA, escalation rules |
| `/projects/*` | Project list/grid/details, task board, task details |
| `/clients/*` | Client list/grid/details |
| `/crm/*` | Contacts, companies, deals, leads, activity, analytics, pipeline |
| `/hrm/*` | Employees, attendance, holidays, performance, tickets, trainings |
| `/finance/*` | Accounting, payroll, sales modules |
| `/recruitment/*` | Jobs, candidates, referrals, campus-hiring, resume-parsing |
| `/administration/*` | Assets, reports, support, user-management |
| `/settings/*` | 6 settings categories (general, website, app, system, financial, other) |
| `/ui-interface/*` | Forms, tables, icons, charts, maps, base UI components |

---

## Data Layer

### Mock Data (current implementation)

All data comes from static JSON files served from `public/assets/json/`. The central `DataService` (`src/app/core/services/data/data.service.ts`) makes `HttpClient` GET calls to these files and returns Observables.

**To add new data**: add a JSON file under `public/assets/json/` and add a corresponding method in `DataService`.

### Domain Models

All TypeScript interfaces and classes live in a **single file**: `src/app/core/models/models.ts`.

Key model categories:
- **Auth**: `register`, `passwordResponce`
- **Navigation**: `SideBar`, `SideBarMenu`, `SubMenu`
- **HR**: `employees`, `department`, `designation`, `attendanceadmin`, `timesheet`, `shiftschedule`, `overtime`, `promotion`, `resignation`, `termination`, `leaveAdmin`, `performanceAppraisal`, `trainingList`, `trainers`
- **Payroll**: `employeeSalary`, `payrollAddition`, `payrollDeduction`, `ProvidentFundDetails`, `TaxDetails`
- **Finance**: `InvoiceList`, `Estimate`, `ExpenseDetails`, `budget`
- **CRM**: `Project`, `Client`, `Company`, `DealInfo`, `LeadInfo`, `Pipeline`, `Activity`, `contactList`
- **Recruitment**: `JobsInfo`, `CandidateInfo`, `ReferralInfo`
- **Admin**: `UserMangementUser`, `RoleInfo`
- **Content**: `blogCategories`, `blogComments`, `page`, `testimonial`, `faq`, `cities`, `countries`, `states`
- **Assets**: `assetList`, `assetCategories`
- **Reports**: `userReport`, `projectReport`, `payslipReport`, `leaveReport`, `invoiceReport`, etc.
- **Multi-tenant**: `tenantUsage`, `agent`, `ticketReport`, `shiftSwap`, `workfromhome`, `noticePeriod`, `probation`, `certificationTrack`, `campushire`, `resumeParse`, `learninganalysis`
- **Pagination**: `pageSelection`, `apiResultFormat`

---

## Component Conventions

### Standalone Components

All components use Angular's standalone API:

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, RouterModule, /* ... */],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss'
})
export class ExampleComponent { }
```

### Statistics

- ~338 TypeScript component files
- ~384 `.spec.ts` test files
- 49 HRM-specific components
- 20 CRM-specific components

### Naming Conventions

- Files: `kebab-case.component.ts` / `.html` / `.scss` / `.spec.ts`
- Classes: `PascalCase`
- Selectors: `app-kebab-case`
- Services: `kebab-case.service.ts`, class `PascalCaseService`
- Interfaces/Models: `PascalCase` in `models.ts`

---

## State Management

No NgRx or third-party state library. State is managed with:

- **`CommonService`** — BehaviorSubjects for `base`, `page`, and `last` values (used for breadcrumbs/page titles)
- **`SettingService`** — Theme and layout preferences persisted to `localStorage`
- **`SideBarService`** — Navigation/sidebar state
- **RxJS Observables** — Data streams from `DataService`

---

## Layouts

Four layout variants (each a standalone component in `src/app/layouts/`):

| Layout | Component path |
|---|---|
| Default sidebar | `layouts/default-sidebar/` |
| Horizontal sidebar | `layouts/horizontal-sidebar/` |
| Stacked sidebar | `layouts/stacked-sidebar/` |
| Two-column sidebar | `layouts/two-column-sidebar/` |

Layout selection is managed by `SettingService` and persisted in `localStorage`.

---

## Styling Conventions

- **Preprocessor**: SCSS (primary), Less also present
- **Grid**: Bootstrap 5 (`container`, `row`, `col-*`)
- **Components**: Mix of Angular Material and PrimeNG
- **Theme**: Custom theme via `custom-theme.scss`; `SettingService` manages dark/light/RTL modes
- **Icons**: Prefer the icon library already used in the section being modified (check imports)
- **Fonts**: Inter (Google Fonts, loaded in `index.html`)

---

## Testing

- **Framework**: Jasmine 5 + Karma 6
- **Command**: `npm test`
- **Coverage**: Karma coverage plugin is configured
- Every component has a `.spec.ts` file generated alongside it
- When adding a new component, include a corresponding `.spec.ts`

---

## Linting

- **Config**: ESLint 9 + `angular-eslint` + `typescript-eslint`
- **Command**: `npm run lint`
- **TypeScript**: Strict mode is enabled (`tsconfig.json` — `"strict": true`)
- Always run `npm run lint` before committing

---

## Authentication

The application includes 28 authentication screens (UI only). No backend authentication is currently integrated.

**Auth routes** (`features/auth/auth.routes.ts`): login variants, registration, forgot-password, reset-password, email verification, two-step verification, OTP, lock-screen.

**To integrate real auth**, the recommended pattern for this stack:
1. Create an `AuthService` with login/logout/refresh token methods
2. Add an `HttpInterceptor` to inject JWT tokens
3. Add `CanActivate` route guards for protected routes
4. Add `CanDeactivate` guards for forms with unsaved changes

---

## Adding New Features — Checklist

When adding a new page or module:

1. **Model**: Add interface(s) to `src/app/core/models/models.ts`
2. **Mock data**: Add JSON file to `public/assets/json/`
3. **Service method**: Add method to `DataService` to fetch the JSON
4. **Component**: Create standalone component under `src/app/features/pages/<module>/`
5. **Route**: Register lazy route in `src/app/features/pages/pages.routes.ts`
6. **Sidebar**: Add menu entry in the sidebar model/data if navigation is needed
7. **Test**: Create/update `.spec.ts` alongside the component
8. **Lint + Test**: Run `npm run lint && npm test` before committing

---

## Build & Deployment

- **Build command**: `npm run build` → output in `dist/template/`
- **Production optimizations**: Script/style optimization enabled in `angular.json`
- **Lazy loading**: Feature modules are lazy-loaded by default — do not break this
- **Assets**: All files in `public/` are copied to the build output; do not add large binaries to `src/`
- **No environment files** are committed — add Angular environment configuration as needed for API base URLs

---

## Git Workflow

- **Main branch**: `master`
- **Feature branches**: `claude/<description>` prefix used for AI-assisted work
- **Remote**: `http://local_proxy@127.0.0.1:45795/git/suthishan/updated_hrms`
- Commit messages should be descriptive and imperative (e.g., `Add candidate pipeline component`)
- Run lint and tests before pushing

---

## Common Gotchas

- `DataService` is 6917 lines — when adding a method, follow the existing pattern of returning `this.http.get<T[]>('assets/json/filename.json')`
- `models.ts` is a single large file — keep models grouped by domain and in alphabetical order within each group
- The root `app.component.ts` contains URL-parsing logic to derive `base`/`page` names for breadcrumbs — update it when adding routes with new URL segments
- `SettingService` reads/writes to `localStorage` — be careful with SSR if that is ever introduced
- Multiple UI libraries (Material + PrimeNG + Bootstrap) coexist — avoid mixing component systems within a single page for consistency
- Icon fonts are loaded via `angular.json` styles array — new icon libraries must be added there, not just installed via npm
