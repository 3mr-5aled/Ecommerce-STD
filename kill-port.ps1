#!/usr/bin/env pwsh

# Kill process running on port 8000
param(
    [int]$Port = 8000
)

Write-Host "🔍 Checking for processes on port $Port..." -ForegroundColor Yellow

$processes = netstat -ano | Select-String ":$Port"

if ($processes) {
    Write-Host "📋 Found processes using port ${Port}:" -ForegroundColor Cyan
    $processes | ForEach-Object {
        $line = $_.Line.Trim()
        $parts = $line -split '\s+'
        if ($parts.Length -ge 5) {
            $processId = $parts[4]
            Write-Host "  PID: $processId" -ForegroundColor White
            
            try {
                taskkill /PID $processId /F | Out-Null
                Write-Host "✅ Successfully killed process $processId" -ForegroundColor Green
            }
            catch {
                Write-Host "❌ Failed to kill process $processId" -ForegroundColor Red
            }
        }
    }
} else {
    Write-Host "✅ No processes found on port $Port" -ForegroundColor Green
}

Write-Host "🚀 Port $Port is now available!" -ForegroundColor Green
