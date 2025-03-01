#!/bin/bash

# Define the output zip filename
OUTPUT_ZIP="volume-control-extension.zip"

# Define the files to include
FILES_TO_INCLUDE=(
  "manifest.json"
  "content.js"
  "styles.css"
  "icons"
  "readme.md"
)

# Check if all required files exist
for file in "${FILES_TO_INCLUDE[@]}"; do
  if [ ! -e "$file" ]; then
    echo "Error: Required file or directory '$file' not found!"
    exit 1
  fi
done

# Remove existing zip if it exists
if [ -f "$OUTPUT_ZIP" ]; then
  echo "Removing existing $OUTPUT_ZIP..."
  rm "$OUTPUT_ZIP"
fi

# Create the zip file
echo "Creating $OUTPUT_ZIP with the following files:"
for file in "${FILES_TO_INCLUDE[@]}"; do
  echo "  - $file"
done

zip -r "$OUTPUT_ZIP" "${FILES_TO_INCLUDE[@]}"

# Check if zip was successful
if [ $? -eq 0 ]; then
  echo "Successfully created $OUTPUT_ZIP"
  echo "This file is ready to be uploaded to the Chrome Web Store."
else
  echo "Error creating zip file!"
  exit 1
fi 