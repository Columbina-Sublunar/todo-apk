// Patch 7zip-bin and builder-util for Windows symlink compatibility.
// Windows requires admin/DeveloperMode to create symlinks, but electron-builder's
// Go app-builder binary hardcodes "-snld" (store symlinks) when invoking 7za.
// This script wraps 7za to replace "-snld" with "-snl-" (skip symlinks).
//
// Also patches builder-util's exec() because Node.js v24 execFile() can't
// directly spawn .cmd files — they must be routed through cmd.exe.

const fs = require('fs');
const path = require('path');

if (process.platform !== 'win32') {
  console.log('[patch] Skipped — not on Windows');
  process.exit(0);
}

const nodeModules = path.join(__dirname, 'node_modules');

// ── Step 1: Patch 7zip-bin ──────────────────────────────────

const z7dir = path.join(nodeModules, '7zip-bin', 'win', 'x64');
const z7exe = path.join(z7dir, '7za.exe');
const z7orig = path.join(z7dir, '7za_orig.exe');
const z7cmd = path.join(z7dir, '7za.cmd');
const z7wrapper = path.join(z7dir, '7za_wrapper.js');

if (fs.existsSync(z7exe)) {
  fs.renameSync(z7exe, z7orig);
  console.log('[patch] Renamed 7za.exe → 7za_orig.exe');
}

if (!fs.existsSync(z7cmd)) {
  fs.writeFileSync(z7cmd, '@echo off\r\nnode "%~dp07za_wrapper.js" %*\r\n');
  console.log('[patch] Created 7za.cmd');
}

if (!fs.existsSync(z7wrapper)) {
  fs.writeFileSync(z7wrapper, [
    "const { spawnSync } = require('child_process');",
    "const path = require('path');",
    "",
    "const args = process.argv.slice(2).map(arg => {",
    "  if (arg === '-snld') return '-snl-';",
    "  return arg;",
    "});",
    "",
    "const result = spawnSync(",
    "  path.join(__dirname, '7za_orig.exe'),",
    "  args,",
    "  { stdio: 'inherit' }",
    ");",
    "process.exit(result.status != null ? result.status : 1);",
    ""
  ].join('\n'));
  console.log('[patch] Created 7za_wrapper.js');
}

const idxPath = path.join(nodeModules, '7zip-bin', 'index.js');
let idxContent = fs.readFileSync(idxPath, 'utf8');
if (idxContent.includes('7za.exe"')) {
  idxContent = idxContent.replace('7za.exe"', '7za.cmd"');
  fs.writeFileSync(idxPath, idxContent);
  console.log('[patch] Patched 7zip-bin/index.js → return .cmd');
}

// ── Step 2: Patch builder-util exec() ───────────────────────

const utilPath = path.join(nodeModules, 'builder-util', 'out', 'util.js');
let utilContent = fs.readFileSync(utilPath, 'utf8');

const marker = 'let actualFile = file;';
if (!utilContent.includes(marker)) {
  const oldBlock = `    return new Promise((resolve, reject) => {
        (0, child_process_1.execFile)(file, args, {`;
  const newBlock = `    return new Promise((resolve, reject) => {
        let actualFile = file;
        let actualArgs = args;
        if (process.platform === "win32" && (file.endsWith(".cmd") || file.endsWith(".bat"))) {
            actualFile = process.env.COMSPEC || "cmd.exe";
            actualArgs = ["/c", file, ...(args || [])];
        }
        (0, child_process_1.execFile)(actualFile, actualArgs, {`;

  if (utilContent.includes(oldBlock)) {
    utilContent = utilContent.replace(oldBlock, newBlock);
    fs.writeFileSync(utilPath, utilContent);
    console.log('[patch] Patched builder-util/out/util.js → cmd.exe routing');
  } else {
    console.log('[patch] builder-util exec() already patched or pattern not found');
  }
} else {
  console.log('[patch] builder-util exec() already patched');
}

console.log('[patch] Done.');
