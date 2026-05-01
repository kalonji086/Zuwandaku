# Script pour redeployer le backend sur Fly.io

Write-Host "Start deployment on Fly.io..." -ForegroundColor Green

# Check if Fly CLI is installed
$flyInstalled = Get-Command fly -ErrorAction SilentlyContinue
if (-not $flyInstalled) {
    Write-Host "Fly CLI is not installed. Please install it from https://fly.io/docs/hands-on/install-flyctl/" -ForegroundColor Red
    exit 1
}

# Build the application
Write-Host "Building the application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error building the application" -ForegroundColor Red
    exit 1
}

# Deploy to Fly.io
Write-Host "Deploying to Fly.io..." -ForegroundColor Yellow
fly deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deployment completed successfully!" -ForegroundColor Green
    Write-Host "Your backend is accessible at: https://zuwandaku-backend.fly.dev" -ForegroundColor Cyan
} else {
    Write-Host "Error during deployment" -ForegroundColor Red
    exit 1
}
