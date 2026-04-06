#!/bin/bash
# Show decisions where review is due
decision_file="$(dirname "$0")/decisions.csv"
if [ ! -f "$decision_file" ]; then
  echo "No decisions.csv found."
  exit 1
fi
awk -F, 'NR==1 || $6=="review due"' "$decision_file"
