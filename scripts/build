#!/usr/bin/env node

const execute = require('child_process').execSync

execute(`rimraf ./build`, { stdio: 'inherit' })
execute(`copy-aragon-ui-assets -n aragon-ui ./build`, {
  stdio: 'inherit',
})

execute(
  `parcel build src/index.html --out-dir ./build --public-url ./ --no-cache`,
  { stdio: 'inherit' }
)
