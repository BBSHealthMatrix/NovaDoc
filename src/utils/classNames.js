/** Join conditional class names without introducing a styling dependency. */
export const classNames = (...values) => values.filter(Boolean).join(' ')

// Global utilities are defined in index.css. Keep their names unscoped when
// resolving the legacy page class names through a component's CSS module.
const globalClasses = new Set([
  'amber', 'blue', 'btn-blue', 'dot', 'empty-state', 'label', 'm-icon',
  'mono', 'page', 'page-title', 'row', 'row-between', 'search', 't-amber',
  't-blue', 't-cyan', 't-gray', 't-green', 't-orange', 't-pink', 't-purple',
  't-red', 't-teal', 'toggle', 'top', 'track', 'white',
])

/** Resolve module classes while preserving the application's global utilities. */
export const createClassNames = (styles) => (value) =>
  String(value ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .map((name) => globalClasses.has(name) ? name : styles[name] || name)
    .join(' ')
