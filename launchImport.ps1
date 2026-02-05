Write-Host "Path to files to import:"
$importFileName = Read-Host
Invoke-WebRequest -UseBasicParsing -Method Post -Body $importFileName http://localhost:5173/import