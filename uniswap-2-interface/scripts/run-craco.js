#!/usr/bin/env node
'use strict'

const { spawnSync } = require('child_process')
const path = require('path')

const script = process.argv[2]
const allowed = ['start', 'build', 'test']

if (!script || !allowed.includes(script)) {
  console.error(`Usage: node scripts/run-craco.js <${allowed.join('|')}> [...args]`)
  process.exit(1)
}

const interfaceRoot = path.join(__dirname, '..')
const monorepoRoot = path.join(interfaceRoot, '..')

let cracoScript
try {
  cracoScript = require.resolve(`@craco/craco/scripts/${script}.js`, {
    paths: [interfaceRoot, monorepoRoot]
  })
} catch {
  console.error('Could not resolve @craco/craco. Run npm install from the repo root.')
  process.exit(1)
}

const extraArgs = process.argv.slice(3)

/** OpenSSL 3 (Node 17+) needs this for Webpack 4; Node 16 rejects the flag entirely. */
const nodeMajor = parseInt(process.versions.node.split('.')[0], 10)
const legacyOpenssl = nodeMajor >= 17 ? ['--openssl-legacy-provider'] : []
const nodeArgs = [...legacyOpenssl, cracoScript, ...extraArgs]

const result = spawnSync(process.execPath, nodeArgs, {
  stdio: 'inherit',
  env: process.env,
  cwd: interfaceRoot
})

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

if (result.signal) {
  process.exit(1)
}

process.exit(result.status ?? 1)
