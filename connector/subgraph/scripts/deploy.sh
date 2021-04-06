#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

# Run graph build
yarn build

GRAPH_NODE="https://api.thegraph.com/deploy/"
IPFS_NODE="https://api.thegraph.com/ipfs/"

# Use custom subgraph name based on target network
if [[ "$NETWORK" != "xdai" ]]; then
  SUBGRAPH_EXT="-${NETWORK}"
else
  SUBGRAPH_EXT=""
fi

echo Deploying subgraph 1hive/disputable-honey-pot${SUBGRAPH_EXT}

# Deploy subgraph
graph deploy 1hive/disputable-honey-pot${SUBGRAPH_EXT} --ipfs ${IPFS_NODE} --node ${GRAPH_NODE} --access-token ${GRAPHKEY}