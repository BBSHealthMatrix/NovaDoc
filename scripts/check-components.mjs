import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseSync } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src');
const issues = [];
let componentFiles = 0;
const files = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const target = path.join(directory, entry.name);
  return entry.isDirectory() ? files(target) : [target];
});
const children = (node) => Object.values(node).flatMap((value) => {
  if (Array.isArray(value)) return value.filter((child) => child && typeof child.type === 'string');
  return value && typeof value.type === 'string' ? [value] : [];
});
const hasJsx = (node) => Boolean(node && (
  node.type === 'JSXElement' || node.type === 'JSXFragment' || children(node).some(hasJsx)
));
const visit = (node, callback) => {
  callback(node);
  children(node).forEach((child) => visit(child, callback));
};
const existsImport = (directory, specifier) => ['', '.js', '.jsx', '.css', '/index.js', '/index.jsx']
  .some((extension) => fs.existsSync(path.resolve(directory, specifier + extension)));

for (const filename of files(root).filter((name) => /\.jsx?$/.test(name))) {
  const label = path.relative(root, filename).replaceAll('\\', '/');
  const source = fs.readFileSync(filename, 'utf8');
  const parsed = parseSync(filename, source);
  for (const error of parsed.errors) issues.push(`${label}: ${error.message}`);
  const components = [];
  const imports = [];
  visit(parsed.program, (node) => {
    if (node.type === 'ImportDeclaration') imports.push(node.source.value);
    if (node.type === 'ExportNamedDeclaration' && node.source) imports.push(node.source.value);
    if (node.type === 'FunctionDeclaration' && /^[A-Z]/.test(node.id?.name) && hasJsx(node.body)) {
      components.push(node.id.name);
    }
    if (node.type === 'VariableDeclarator' && /^[A-Z]/.test(node.id?.name)
      && ['ArrowFunctionExpression', 'FunctionExpression'].includes(node.init?.type) && hasJsx(node.init.body)) {
      components.push(node.id.name);
    }
  });
  for (const specifier of imports.filter((value) => value.startsWith('.'))) {
    if (!existsImport(path.dirname(filename), specifier)) issues.push(`${label}: missing import ${specifier}`);
  }
  if (components.length > 1) issues.push(`${label}: multiple components (${components.join(', ')})`);
  if (components.length > 0) {
    componentFiles++;
    const moduleName = path.basename(filename, path.extname(filename)) + '.module.css';
    if (!fs.existsSync(path.join(path.dirname(filename), moduleName))) issues.push(`${label}: missing ${moduleName}`);
    if (!imports.includes('./' + moduleName)) issues.push(`${label}: component does not import its CSS module`);
  }
}

if (issues.length) {
  console.error(issues.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Checked ${componentFiles} component files: one component per file, owned CSS modules, and resolved local imports.`);
}
