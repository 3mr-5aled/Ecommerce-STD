# API Testing Script
# This script tests various endpoints of the E-Commerce API

$baseUrl = "http://localhost:8000/api/v1"
$headers = @{ "Content-Type" = "application/json" }

Write-Host "🚀 Testing E-Commerce API Endpoints" -ForegroundColor Green
Write-Host "=" * 50

# Test 1: Get Categories
Write-Host "`n📂 Testing Categories Endpoint..." -ForegroundColor Yellow
try {
    $categoriesResponse = Invoke-RestMethod -Uri "$baseUrl/categories" -Method GET
    Write-Host "✅ Categories endpoint working! Found $($categoriesResponse.results) categories" -ForegroundColor Green
} catch {
    Write-Host "❌ Categories endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Get Products
Write-Host "`n📦 Testing Products Endpoint..." -ForegroundColor Yellow
try {
    $productsResponse = Invoke-RestMethod -Uri "$baseUrl/products?limit=5" -Method GET
    Write-Host "✅ Products endpoint working! Found $($productsResponse.results) products" -ForegroundColor Green
} catch {
    Write-Host "❌ Products endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get Brands
Write-Host "`n🏷️ Testing Brands Endpoint..." -ForegroundColor Yellow
try {
    $brandsResponse = Invoke-RestMethod -Uri "$baseUrl/brands" -Method GET
    Write-Host "✅ Brands endpoint working! Found $($brandsResponse.results) brands" -ForegroundColor Green
} catch {
    Write-Host "❌ Brands endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Test User Signup
Write-Host "`n👤 Testing User Signup..." -ForegroundColor Yellow
$userData = @{
    name = "Test User $(Get-Random)"
    email = "test$(Get-Random)@example.com"
    password = "password123"
    passwordConfirm = "password123"
} | ConvertTo-Json

try {
    $signupResponse = Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method POST -Headers $headers -Body $userData
    Write-Host "✅ User signup working! User created successfully" -ForegroundColor Green
    $token = $signupResponse.token
    
    # Test 5: Test Protected Endpoint
    Write-Host "`n🔐 Testing Protected Endpoint..." -ForegroundColor Yellow
    $authHeaders = @{ 
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $token"
    }
    
    try {
        $profileResponse = Invoke-RestMethod -Uri "$baseUrl/users/getMe" -Method GET -Headers $authHeaders
        Write-Host "✅ Protected endpoint working! User profile retrieved" -ForegroundColor Green
    } catch {
        Write-Host "❌ Protected endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ User signup failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n" + "=" * 50
Write-Host "🎉 API Testing Complete!" -ForegroundColor Green
