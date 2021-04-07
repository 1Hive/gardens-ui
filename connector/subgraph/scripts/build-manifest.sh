#!/bin/bash

if [ "$STAGING" ]
then
  FILE=$NETWORK'-staging.json'
else
  FILE=$NETWORK'.json'
fi

DATA=manifest/data/$FILE

echo 'Generating manifest from data file: '$DATA
cat $DATA

mustache \
  -p manifest/templates/Agreement.template.yaml \
  -p manifest/templates/ConvictionVoting.template.yaml \
  -p manifest/templates/DisputableVoting.template.yaml \
  -p manifest/templates/Organization.template.yaml \
  $DATA \
  subgraph.template.yaml > subgraph.yaml