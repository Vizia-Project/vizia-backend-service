#!/bin/bash

# List of directories where you want to run `npm install`
directories=(
  "article-service"
  "database-migrator"
  "default-service"
  "history-service"
  "user-auth-service"
)

# Iterate through directories
for dir in "${directories[@]}"; do
  echo "Running npm install in $dir..."
  cd "$dir" || exit 1 # Navigate to the directory, exit on failure
  npm install         # Run npm install
  cd - > /dev/null    # Return to the previous directory, suppress output
done

echo "All npm install commands completed!"