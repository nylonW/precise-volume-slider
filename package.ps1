# Define the output zip filename
$outputZip = "volume-control-extension.zip"

# Define the files to include
$filesToInclude = @(
  "manifest.json",
  "content.js",
  "styles.css",
  "icons/icon16.svg",
  "icons/icon48.svg",
  "icons/icon128.svg",
  "readme.md"
)

# Check if all required files exist
foreach ($file in $filesToInclude) {
  if (-not (Test-Path $file)) {
    Write-Error "Required file '$file' not found!"
    exit 1
  }
}

# Remove existing zip if it exists
if (Test-Path $outputZip) {
  Write-Host "Removing existing $outputZip..."
  Remove-Item $outputZip
}

# Create the zip file
Write-Host "Creating $outputZip with the following files:"
foreach ($file in $filesToInclude) {
  Write-Host "  - $file"
}

# Create a temporary directory
$tempDir = New-Item -ItemType Directory -Path (Join-Path $env:TEMP ([System.Guid]::NewGuid().ToString()))

# Copy all files to the temporary directory
foreach ($file in $filesToInclude) {
  # Create directory structure if needed
  $targetPath = Join-Path $tempDir $file
  $targetDir = Split-Path -Parent $targetPath
  if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir | Out-Null
  }
  
  Copy-Item $file -Destination $targetPath
}

# Create the zip file
Compress-Archive -Path "$tempDir\*" -DestinationPath $outputZip -Force

# Clean up the temporary directory
Remove-Item -Recurse -Force $tempDir

# Check if zip was successful
if (Test-Path $outputZip) {
  Write-Host "Successfully created $outputZip"
  Write-Host "This file is ready to be uploaded to the Chrome Web Store."
} else {
  Write-Error "Error creating zip file!"
  exit 1
} 