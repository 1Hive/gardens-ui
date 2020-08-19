#!/usr/bin/env node

const execute = require('child_process').execSync

const clientPort = 3000

execute(`copy-aragon-ui-assets -n aragon-ui ./build`, {
  stdio: 'inherit',
})

execute(
  `parcel serve src/index.html --port ${clientPort} --out-dir ./build --no-cache`,
  { stdio: 'inherit' }
)
