# Port Forwarding Script
# This script starts port-forwarding for frontend and Eureka

Write-Host "`n🌐 Starting Port Forwarding..." -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "Starting port-forwarding in background..." -ForegroundColor Yellow
Write-Host "`n⚠️  Note: These will run in the background." -ForegroundColor Yellow
Write-Host "   To stop them, use: Get-Job | Stop-Job" -ForegroundColor Cyan
Write-Host "   To see them: Get-Job" -ForegroundColor Cyan
Write-Host "   To remove: Get-Job | Remove-Job`n" -ForegroundColor Cyan

# Start frontend port-forward in background
Start-Job -ScriptBlock {
    kubectl port-forward -n drug-interaction-system service/frontend 8081:80
} | Out-Null

# Start Eureka port-forward in background
Start-Job -ScriptBlock {
    kubectl port-forward -n drug-interaction-system service/eureka-server 8761:8761
} | Out-Null

Start-Sleep -Seconds 2

Write-Host "✅ Port forwarding started!" -ForegroundColor Green
Write-Host "`n📱 Access the application:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:8081" -ForegroundColor White
Write-Host "   Eureka:   http://localhost:8761" -ForegroundColor White
Write-Host "`n💡 To stop port-forwarding:" -ForegroundColor Cyan
Write-Host "   Get-Job | Stop-Job" -ForegroundColor White



