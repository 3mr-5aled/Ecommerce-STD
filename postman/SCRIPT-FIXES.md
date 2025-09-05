# Postman Script Error Fixes

## Problem Solved ✅

The error `TypeError: Cannot read properties of undefined (reading 'json')` was caused by unsafe access to `pm.response.json()` without proper error handling.

## What Was Fixed

### 1. **Test Scripts (Post-Response)**

- Added try-catch blocks around all `pm.response.json()` calls
- Added null checks for `pm.response` before accessing it
- Added validation for response properties before setting collection variables

### 2. **Pre-Request Scripts**

- Added robust pre-request script for authentication
- Added base URL validation
- Added debug logging

### 3. **Global Scripts**

- Enhanced collection-level test scripts
- Added response validation tests
- Added error handling for all script operations

## Safe Script Patterns

### ❌ **Before (Unsafe)**

```javascript
if (pm.response.code === 200) {
  const responseJson = pm.response.json();
  pm.collectionVariables.set("authToken", responseJson.token);
}
```

### ✅ **After (Safe)**

```javascript
try {
  if (pm.response && pm.response.code === 200) {
    const responseJson = pm.response.json();
    if (responseJson && responseJson.token) {
      pm.collectionVariables.set("authToken", responseJson.token);
    }
  }
} catch (error) {
  console.error("Test script error:", error.message);
}
```

## Best Practices for Postman Scripts

### 1. **Always Check for Existence**

```javascript
if (pm.response && pm.response.json) {
  // Safe to proceed
}
```

### 2. **Use Try-Catch Blocks**

```javascript
try {
  // Your script logic here
} catch (error) {
  console.error("Script error:", error.message);
}
```

### 3. **Validate Response Structure**

```javascript
const responseJson = pm.response.json();
if (responseJson && responseJson.data && responseJson.data.token) {
  // Safe to use responseJson.data.token
}
```

### 4. **Add Debugging**

```javascript
console.log(
  "Response status:",
  pm.response ? pm.response.status : "No response"
);
console.log("Response body:", pm.response ? pm.response.text() : "No body");
```

## Files Modified

- ✅ `postman/postman-collection.json` - Fixed all test scripts
- ✅ Added global error handling
- ✅ Enhanced pre-request authentication
- ✅ Added response validation tests

## Testing the Fix

1. **Run any request in the collection**
2. **Check the console** - You should see debug logs instead of errors
3. **Verify authentication** - Tokens should be properly set
4. **Test error scenarios** - Scripts should handle failures gracefully

## Additional Tools Created

- `fix-postman-scripts.ps1` - PowerShell script to fix similar issues in the future
- `kill-port.ps1` - Helper to kill processes on port 8000

The collection is now robust and won't crash on invalid responses! 🎉
