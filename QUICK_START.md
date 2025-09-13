# 🚀 Quick Start Guide - Hybrid QA Test Builder

**TL;DR:** This is a visual test builder where you drag blocks to create tests, pick elements by clicking them, and run tests with Playwright.

## 📋 What You Need

- **Node.js 20+** (check with `node --version`)
- **pnpm** (install with `npm install -g pnpm`)
- **Chrome browser**

## 🎯 Step-by-Step Setup

### 1. Install Everything
```bash
# In your terminal, navigate to the project folder
cd /Users/admin/mymvp

# Run the setup script (this does everything for you!)
pnpm setup
```

This will:
- ✅ Check your Node.js version
- ✅ Install all dependencies
- ✅ Build all packages
- ✅ Copy files to the right places

### 2. Start the Sample Website
```bash
# In Terminal 1
pnpm dev:sample-site
```
**What this does:** Starts a test website at http://localhost:5174 with a login form

### 3. Start the Builder App
```bash
# In Terminal 2 (new terminal window)
pnpm dev:builder
```
**What this does:** Starts the visual test builder at http://localhost:5173

### 4. Install the Chrome Extension

1. **Open Chrome** and go to `chrome://extensions/`
2. **Turn on "Developer mode"** (toggle in top-right)
3. **Click "Load unpacked"**
4. **Navigate to:** `/Users/admin/mymvp/packages/extension/dist/`
5. **Select the folder** and click "Select"
6. **You should see** "QA Test Builder" extension appear

## 🎮 How to Use It

### Step 1: Open Both Apps
- **Sample Site:** http://localhost:5174 (login form)
- **Builder App:** http://localhost:5173 (test editor)

### Step 2: Create Your First Test

1. **In the Builder App:**
   - Drag "Go to URL" block from left sidebar
   - Set URL to: `http://localhost:5174`

2. **Add a Fill Block:**
   - Drag "Fill Input" block
   - Click the **"Pick"** button next to "Target Element"
   - **Switch to the sample site tab** and click the email field
   - The `qaId` will auto-fill! Set value to: `test@example.com`

3. **Add Another Fill Block:**
   - Drag another "Fill Input" block
   - Click "Pick" and select the password field
   - Set value to: `password`

4. **Add a Click Block:**
   - Drag "Click Element" block
   - Click "Pick" and select the "Sign In" button

5. **Add an Assertion:**
   - Drag "Expect Visible" block
   - Click "Pick" and select the "Dashboard" heading

### Step 3: Export and Run Your Test

1. **Export:** Click "Export JSON" then "Download Spec"
2. **Run the test:**
   ```bash
   # In Terminal 3
   pnpm --filter runner test:spec ~/Downloads/your-test.json
   ```

## 🎯 What Each Part Does

### 🏗️ Builder App (http://localhost:5173)
- **Left Sidebar:** Drag blocks to create tests
- **Middle:** Visual workspace where you arrange blocks
- **Right Sidebar:** Configure selected blocks

### 🌐 Sample Site (http://localhost:5174)
- **Login form** for testing
- **Credentials:** `test@example.com` / `password`
- **Has the SDK loaded** for element picking

### 🔌 Chrome Extension
- **Popup:** Click "Pick Element" to start picking
- **Content Script:** Injects into pages to enable picking
- **Background:** Coordinates between builder and pages

### 🏃 Test Runner
- **Executes** your JSON test specs
- **Uses Playwright** to control the browser
- **Saves** screenshots, videos, and traces

## 🧪 Test the Full Flow

1. **Create a test** in the builder (drag blocks, pick elements)
2. **Export JSON** and download it
3. **Run the test** with the runner
4. **Watch it execute** in a new browser window
5. **Check artifacts** in the `artifacts/` folder

## 🆘 Troubleshooting

### "SDK not detected"
- Make sure the sample site is running
- Check that http://localhost:5174 loads properly
- The SDK should be loaded automatically

### Extension not working
- Make sure you loaded the extension from `packages/extension/dist/`
- Check that Developer mode is enabled in Chrome
- Try refreshing the extension

### Can't pick elements
- Make sure both the sample site and builder are open
- Click "Pick" in the builder, then click elements on the sample site
- The extension popup should show "Click an element on the page..."

### Runner fails
- Make sure the sample site is running on port 5174
- Check that your JSON file has the right `baseUrl`
- Try running a simple test first

## 🎉 You're Ready!

You now have a complete visual test automation system! 

**Next steps:**
- Try creating more complex tests
- Add the SDK to your own websites
- Customize the blocks for your needs
- Run tests in CI/CD pipelines

**Need help?** Check the main README.md for more detailed documentation.

---

## 📁 Project Structure (for reference)

```
mymvp/
├── packages/
│   ├── sdk/           # The on-page script that tags elements
│   ├── extension/     # Chrome extension (load this in Chrome)
│   ├── runner/        # Test execution engine
│   └── shared/        # Common types
├── apps/
│   ├── builder/       # Visual test editor (http://localhost:5173)
│   └── sample-site/   # Test website (http://localhost:5174)
└── examples/          # Sample test files
```

**Happy testing! 🧪**
