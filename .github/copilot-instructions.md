# Equilibra Manager - AI Coding Instructions

## Architecture Overview
This is an Electron desktop application for managing psychology clinic consultations and patients. It uses a modular feature-based structure with React in the renderer process and SQLite database accessed via IPC from the main process.

- **Main Process** (`src/main/`): Handles Electron window creation, IPC handlers for database operations, and app lifecycle.
- **Renderer Process** (`src/renderer/`): React app with routing, using Material-UI (MUI) for components and custom color palette.
- **Database** (`src/db/`): SQLite with better-sqlite3, tables for `pacientes`, `consultas`, `relatorios_evolucao`. Schema migrations handled via ALTER statements in `database.ts`.
- **Features** (`src/features/`): Modular by domain (Paciente, Consulta, etc.), each with pages, components, services, types, hooks, utils.
- **Shared** (`src/shared/`): Reusable components, styles, and utilities across features.

## Key Patterns
- **IPC Communication**: Renderer calls `window.api.*` (exposed via `preload.ts`) for CRUD operations. Main process handles `ipcMain.handle` with database functions.
- **Data Fetching**: Services in each feature call IPC, hooks (e.g., `usePacientesAtivos`) manage state and loading.
- **Forms**: Use MUI components with custom fields like `XPDateField`, `XPCPFField`. Validation is basic client-side; handle errors with Snackbar.
- **Lists**: MUI DataGrid for tabular data, filtered via URL params (e.g., `?status=ativo`) and tabs.
- **Styling**: MUI theme with custom `Colors.ts` palette. CSS modules per feature (e.g., `PacienteModule.css`).
- **Navigation**: React Router with HashRouter; routes defined in `router.tsx`.
- **Date Handling**: Use `date-fns` or `dayjs` for formatting; convert to ISO strings for DB.

## Workflows
- **Development**: `npm start` builds with Webpack (configs in root) and launches Electron app. DevTools open in dev mode.
- **Build**: `npm run make` creates platform-specific executables via Electron Forge.
- **Lint**: `npm run lint` uses ESLint with TypeScript rules.
- **Database**: Auto-initializes on app start; path set in main process. No migrations tool; ALTERs in code for schema changes.

## Conventions
- **Naming**: Portuguese for types/interfaces (e.g., `Paciente`), English for code/functions. File names in Portuguese (e.g., `newPaciente.tsx`).
- **Error Handling**: Try-catch in async functions; show user feedback via MUI Snackbar.
- **State Management**: Local state with hooks; no global state library.
- **Components**: Functional components with hooks; props for data, outlets for layout context (e.g., `drawerOpen`).
- **Utils**: Shared utilities like `formatarData.ts` for date conversions.

## Examples
- Creating a new patient: Use `FormularioGlobal` wrapper, MUI `TextField`s, custom `XPDateField`, call `salvarPaciente` service, navigate on success.
- Listing patients: `PacienteDataGrid` with MUI DataGrid, columns defined in `PacienteColunas.tsx`, actions in `PacienteActions.tsx`.
- Database query: In `db/paciente.ts`, use prepared statements with better-sqlite3 (e.g., `db.prepare('SELECT * FROM pacientes WHERE status = ?').all(status)`).

Reference: [src/db/database.ts](src/db/database.ts), [src/renderer/router.tsx](src/renderer/router.tsx), [src/shared/styles/Colors.ts](src/shared/styles/Colors.ts)</content>
<parameter name="filePath">c:\Users\paulh\Documents\FerramentaControl\.github\copilot-instructions.md