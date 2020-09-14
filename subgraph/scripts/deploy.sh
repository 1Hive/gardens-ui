#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

# Run graph build
npm run build:graph

GRAPH_NODE="https://api.thegraph.com/deploy/"
IPFS_NODE="https://api.thegraph.com/ipfs/"
SUBGRAPH_EXT="-${NETWORK}"

# Create subgraph if missing
{
  graph create 1hive/honey-pot${SUBGRAPH_EXT} --node ${GRAPH_NODE}
} || {
  echo 'Subgraph was already created'
}

# Deploy subgraph
graph deploy 1hive/honey-pot${SUBGRAPH_EXT} --ipfs ${IPFS_NODE} --node ${GRAPH_NODE}