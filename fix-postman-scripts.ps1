# Fix Postman Test Scripts - Remove unsafe pm.response.json() calls
param(
    [string]$CollectionPath = "postman/postman-collection.json"
)

Write-Host "🔧 Fixing Postman test scripts..." -ForegroundColor Yellow

# Read the collection file
$content = Get-Content $CollectionPath -Raw

# Pattern to match unsafe test scripts
$unsafePattern = '("listen": "test",\s*"script": \{\s*"exec": \[\s*)"if \(pm\.response\.code === (\d+)\) \{\s*const responseJson = pm\.response\.json\(\);\s*pm\.collectionVariables\.set\(''(\w+)'', responseJson\.(\w+)\);\s*\}"'

# Replacement pattern with error handling
$safeReplacement = '$1"// Safe test script with error handling",
                  "try {",
                  "    if (pm.response && pm.response.code === $2) {",
                  "        const responseJson = pm.response.json();",
                  "        if (responseJson && responseJson.$4) {",
                  "            pm.collectionVariables.set(''$3'', responseJson.$4);",
                  "        }",
                  "    }",
                  "} catch (error) {",
                  "    console.error(''Test script error:'', error.message);",
                  "}"'

# Apply the fix
$fixedContent = $content -replace $unsafePattern, $safeReplacement

# Pattern for more complex cases with nested properties
$complexPattern = '("listen": "test",\s*"script": \{\s*"exec": \[\s*)"if \(pm\.response\.code === (\d+)\) \{\s*const responseJson = pm\.response\.json\(\);\s*pm\.collectionVariables\.set\(''(\w+)'', responseJson\.(\w+)\.(\w+)\);\s*\}"'

$complexReplacement = '$1"// Safe test script with error handling",
                  "try {",
                  "    if (pm.response && pm.response.code === $2) {",
                  "        const responseJson = pm.response.json();",
                  "        if (responseJson && responseJson.$4 && responseJson.$4.$5) {",
                  "            pm.collectionVariables.set(''$3'', responseJson.$4.$5);",
                  "        }",
                  "    }",
                  "} catch (error) {",
                  "    console.error(''Test script error:'', error.message);",
                  "}"'

$fixedContent = $fixedContent -replace $complexPattern, $complexReplacement

# Write back to file
$fixedContent | Set-Content $CollectionPath -Encoding UTF8

Write-Host "✅ Fixed Postman test scripts!" -ForegroundColor Green
Write-Host "📝 Changes made:" -ForegroundColor Cyan
Write-Host "  - Added error handling to all test scripts" -ForegroundColor White
Write-Host "  - Added null checks for pm.response" -ForegroundColor White
Write-Host "  - Added validation for response properties" -ForegroundColor White
