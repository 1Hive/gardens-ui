#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

# Create manifest
npm run manifest

# Run codegen
rm -rf ./generated && graph codegen