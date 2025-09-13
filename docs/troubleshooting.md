# 🐛 Troubleshooting Guide

This guide helps you solve common issues with the QA Test Builder.

## 🚨 **Common Issues**

### **Backend Issues**

#### **"Cannot navigate to invalid URL"**

**Problem**: Backend receives relative URL like `/` instead of full URL

```
❌ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log: - navigating to "/", waiting until "load"
```

**Solution**:

1. Check your Navigate block in the builder
2. Make sure it has a full URL like `http://localhost:5174`
3. Don't use relative paths like `/` or `./page.html`

**Debug Steps**:

```bash
# Check backend logs for the URL being received
# Should show: 🔍 Debug - Goto URL: "http://localhost:5174"
# Not: 🔍 Debug - Goto URL: "/"
```

#### **"Element not found with any selector strategy"**

**Problem**: QA ID doesn't exist or element isn't visible

```
❌ Error: Element not found with any selector strategy for: qa:button:signin:xyz123
```

**Solution**:

1. **Enable QA mode** on sample site (click "🔍 Show QA IDs")
2. **Hover over the element** to get the correct QA ID
3. **Copy the QA ID** and paste it into your test block
4. **Use stable IDs** like `email`, `password`, `signInBtn` instead

**Debug Steps**:

```bash
# Check if element exists on the page
# Go to sample site and enable QA mode
# Hover over elements to see their QA IDs
```

#### **"Backend not responding"**

**Problem**: Backend server isn't running or crashed

```
❌ Error: fetch failed or 500 error
```

**Solution**:

1. **Check if backend is running**:

   ```bash
   curl -s http://localhost:8080/api/health
   # Should return: {"status":"healthy",...}
   ```

2. **Restart backend**:

   ```bash
   cd backend
   npm start
   ```

3. **Check for port conflicts**:
   ```bash
   lsof -i :8080
   # Kill any conflicting processes
   ```

#### **"Playwright browser won't open"**

**Problem**: Browser automation fails to start

```
❌ Error: Browser launch failed or timeout
```

**Solution**:

1. **Install Playwright browsers**:

   ```bash
   cd backend
   npx playwright install
   ```

2. **Check system permissions** (macOS):

   ```bash
   # Allow terminal to control other applications
   # System Preferences → Security & Privacy → Privacy → Accessibility
   ```

3. **Try headless mode** (for debugging):
   ```javascript
   // In backend/server.js, temporarily change:
   headless: true; // instead of false
   ```

### **Frontend Issues**

#### **"Builder shows white screen"**

**Problem**: Frontend build failed or server not running

```
❌ Error: 500 error or blank page
```

**Solution**:

1. **Check if builder is running**:

   ```bash
   curl -s http://localhost:5173 | head -1
   # Should return: <!doctype html>
   ```

2. **Restart builder**:

   ```bash
   pnpm dev:builder
   ```

3. **Clear cache and rebuild**:
   ```bash
   pnpm clean
   pnpm build
   pnpm dev:builder
   ```

#### **"Blocks not appearing in toolbox"**

**Problem**: Custom blocks not loaded

```
❌ Error: Empty toolbox or missing blocks
```

**Solution**:

1. **Check browser console** for JavaScript errors
2. **Verify block definitions** in `apps/builder/src/blocks/defineBlocks.ts`
3. **Restart builder** to reload block definitions

#### **"Test spec shows only first block"**

**Problem**: Block collection not working properly

```
❌ Error: Generated spec only has one step
```

**Solution**:

1. **Check browser console** for debug logs:

   ```
   🔍 Debug - All blocks: X
   🔍 Debug - Custom blocks: X
   ```

2. **Make sure blocks are connected** in the workspace
3. **Try disconnecting and reconnecting** blocks

### **SDK Issues**

#### **"QA IDs not generating"**

**Problem**: SDK not loading or working

```
❌ Error: No elements with QA IDs found
```

**Solution**:

1. **Check if SDK is loaded**:

   ```bash
   # In browser console:
   console.log(window.__QATagger);
   # Should return: QATagger object
   ```

2. **Manually trigger ID generation**:

   ```bash
   # Click "⚡ Generate IDs" button on sample site
   ```

3. **Check for JavaScript errors** in browser console

#### **"QA IDs are different each time"**

**Problem**: IDs are non-deterministic

```
❌ Error: qa:button:signin:abc123 vs qa:button:signin:xyz789
```

**Solution**:

1. **Update SDK** to latest version:

   ```bash
   pnpm build:sdk
   cp packages/sdk/dist/qa-tagger.v1.js apps/sample-site/public/qa-tagger.v1.js
   ```

2. **Use stable IDs** like `email`, `password`, `signInBtn`

#### **"Sample site is slow"**

**Problem**: Performance issues with SDK

```
❌ Error: Page becomes unresponsive
```

**Solution**:

1. **Check for excessive event listeners**
2. **Verify throttling** is working in SDK
3. **Disable QA mode** when not needed

## 🔍 **Debugging Tools**

### **Browser DevTools**

1. **Open DevTools** (F12)
2. **Console tab** - Check for JavaScript errors
3. **Network tab** - Check API requests
4. **Elements tab** - Inspect DOM and QA IDs

### **Backend Logs**

```bash
# Backend terminal shows:
🚀 Starting test execution...
📋 Executing X test blocks
🔄 Executing step 1: goto
✅ Navigated to: http://localhost:5174
```

### **Network Requests**

```bash
# Check API communication:
# Frontend → Backend: POST /api/run-test
# Backend response: {"success": true, "results": [...]}
```

## 🛠️ **Diagnostic Commands**

### **Check All Services**

```bash
# Verify all services are running
curl -s http://localhost:8080/api/health && echo " ✅ Backend"
curl -s http://localhost:5173 | head -1 && echo " ✅ Builder"
curl -s http://localhost:5174 | head -1 && echo " ✅ Sample Site"
```

### **Check Dependencies**

```bash
# Verify all packages are installed
pnpm install
cd backend && npm install
```

### **Check Build Status**

```bash
# Verify all packages build successfully
pnpm build
```

### **Check Ports**

```bash
# Check if ports are in use
lsof -i :5173  # Builder
lsof -i :5174  # Sample site
lsof -i :8080  # Backend
```

## 🚀 **Quick Fixes**

### **Complete Reset**

```bash
# Stop all services (Ctrl+C in each terminal)
# Clean everything
pnpm clean
rm -rf node_modules
rm -rf backend/node_modules

# Reinstall and rebuild
pnpm install
cd backend && npm install
pnpm build

# Restart all services
cd backend && npm start &
pnpm dev:builder &
pnpm dev:sample-site &
```

### **Update SDK**

```bash
# Rebuild and update SDK
pnpm build:sdk
cp packages/sdk/dist/qa-tagger.v1.js apps/sample-site/public/qa-tagger.v1.js
```

### **Clear Browser Cache**

1. **Hard refresh** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Clear cache** in browser settings
3. **Disable cache** in DevTools (Network tab)

## 📞 **Getting Help**

### **Check Documentation**

- [Getting Started Guide](./getting-started.md)
- [Frontend Guide](./frontend.md)
- [Backend Guide](./backend.md)
- [SDK Guide](./sdk.md)

### **Common Solutions**

1. **Restart services** - Fixes most issues
2. **Clear cache** - Resolves build problems
3. **Check logs** - Identifies specific errors
4. **Verify URLs** - Ensures correct endpoints

### **Still Stuck?**

1. **Check browser console** for errors
2. **Check backend terminal** for logs
3. **Verify all services** are running
4. **Try the complete reset** procedure

---

**Most issues can be resolved by restarting services and clearing cache. If problems persist, check the specific component guides for detailed troubleshooting!** 🛠️
