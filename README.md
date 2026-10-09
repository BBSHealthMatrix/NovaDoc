# NovaDoc

React application for patient registration, appointments, queues, reports, and administrative configuration. Built with React 19, React Router, Vite, Lucide icons, and CSS Modules.

## Development

```sh
npm install
npm run dev
npm run build
npm run lint
npm run check:components
```

Vite uses its native configuration loader for this JavaScript configuration. This also avoids the extra config-bundling subprocess in restricted Windows environments.

## Source organization

```text
src/
  App.jsx                         # Application routes and layout
  App.module.css
  main.jsx                        # React entry point
  index.css                       # Global reset, typography, and shared utilities
  Components/
    Shared/
      Select.jsx / Select.module.css
      FieldEditorModal.jsx / FieldEditorModal.module.css
    Toggle/                       # Shared accessible switch
    Field/                        # Shared field label and content wrapper
    Drawer/                       # Shared booking/registration dialog shell
    DrawerHeader/
    DrawerBody/
    DrawerFooter/
    FormGrid/
    Formbuilder/                  # Form controller plus layout, fields, doctor and palette components
    QuickRegistration/            # Page plus reusable queue assignment row
    ...                           # Feature folders with components, modules, and feature data
  data/
    appointments.js               # Shared appointment data and scheduling helpers
    branches.js                   # Shared branch data
  hooks/
    useClock.js
  utils/
    classNames.js
scripts/
  check-components.mjs
```

Each React component is defined in one `.jsx` file and imports its matching `.module.css`. Feature-specific child components stay with their feature; controls used across features are shared. Feature seed data stays in `*Data.js`, while data used by several features lives in `src/data`.

`src/data/branches.js` is the project's branch-data source. The supplied `E:/branchData.js` matched this data before the refactor and is not a separate runtime dependency.

## Reusing components

- **Toggle** accepts `on`, `onChange`, `label`, `size`, and `color`. It also retains the existing `variant="modal"` option used by branch editing.
- **Select** accepts string options or objects containing `value` (or `v`), `label`, and `disabled`. Supply `value` and `onChange`; use `placeholder`, `label`, and the existing visual variants when needed. It supports keyboard navigation, Escape, and outside-click dismissal.
- **FieldEditorModal** edits `{ label, type, placeholder, req }`. Pass `field`, `types`, `onSave`, and `onClose`. Patient types and custom sections use the same editor.
- **Drawer**, **DrawerHeader**, **DrawerBody**, and **DrawerFooter** provide the shared booking and registration layout. Pass feature content through `children`, actions through callbacks, and use **FormGrid** for paired fields.
- **FormBuilderLayout**, **FormBuilderFields**, **FormBuilderDoctors**, and **FormBuilderPalette** receive data and callbacks from the form controller.
- **QuickRegistrationQueue** receives its queue, subtitle, checked state, and toggle callback.

Use `classNames(...values)` for conditional module classes. Use `createClassNames(styles)` only for existing feature markup that resolves class tokens and preserves the explicit global utilities in `index.css`.

Put component-specific declarations in that component's module. Compose styles from a shared primitive only when they are intentionally shared, such as drawer footer buttons or field wrappers. Avoid importing a feature page's stylesheet into another feature.

The structure check parses the source to catch multiple component definitions, missing component modules, and unresolved local imports. Run it with lint and the production build when adding or moving components.
