#!/bin/bash

echo "Running database migrations..."
node drizzle.mjs

if [ $? -eq 0 ]; then
  echo "Migrations completed successfully!"
else
  echo "Migrations failed!"
  exit 1
fi

echo "Done!"