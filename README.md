# Hybrid QA Test Builder

A minimal, production-ready MVP for a **Hybrid QA Test Builder** where QA authors tests via **blocks (Blockly)** and target elements using a **Chrome MV3 extension** + **on-page SDK** that assigns stable `data-qa-id` IDs on demand.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 20.0.0
- pnpm >= 8.0.0
- Chrome browser

### Installation

```bash
# Clone and install dependencies
git clone <your-repo>
cd mymvp
pnpm install

# Build all packages
pnpm build
```

### Running the Demo

1. **Start the sample site:**
   ```bash
   pnpm dev:sample-site
   ```
   This starts the sample site at http://localhost:5174

2. **Start the builder app:**
   ```bash
   pnpm dev:builder
   ```
   This starts the builder at http://localhost:5173

3. **Load the Chrome extension:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select `packages/extension/dist/`

4. **Test the flow:**
   - Open the sample site (http://localhost:5174)
   - Open the builder app (http://localhost:5173)
   - Create a test by dragging blocks
   - Click "Pick" on any target field to select elements from the sample site

## 📁 Project Structure

```
mymvp/
├── packages/
│   ├── shared/          # Shared types and utilities
│   ├── sdk/             # On-page SDK (qa-tagger)
│   ├── extension/       # Chrome MV3 extension
│   └── runner/          # Node + Playwright runner
├── apps/
│   ├── builder/         # Vite + React + Blockly app
│   └── sample-site/     # Static sample app for testing
└── scripts/
    └── build.js         # Build orchestration
```

## 🔧 Core Components

### 1. On-Page SDK (`packages/sdk`)

The `qa-tagger` SDK provides stable element identification and picking functionality.

**Features:**
- Generates stable `data-qa-id` attributes
- Reuses existing test IDs (`data-testid`, `data-test`, `data-qa`)
- Semantic ID generation based on element properties
- Element picking with visual highlighting
- Shadow DOM and iframe support

**Usage:**
```html
<script src="/qa-tagger.v1.js"></script>
<script>
  // SDK is automatically available as window.__QATagger
  window.__QATagger.start(); // Start picking mode
  window.__QATagger.stop();  // Stop picking mode
</script>
```

### 2. Chrome Extension (`packages/extension`)

MV3 extension that bridges the builder app with the page SDK.

**Features:**
- Popup interface for toggling pick mode
- Content script injection
- Message passing between builder and page
- Background service worker for coordination

**Installation:**
1. Build the extension: `pnpm build:extension`
2. Load `packages/extension/dist/` as unpacked extension in Chrome

### 3. Builder App (`apps/builder`)

React + Blockly application for authoring tests visually.

**Features:**
- Drag-and-drop block editor
- Real-time element picking
- JSON spec export
- Block inspector for configuration

**Available Blocks:**
- **Navigation:** Go to URL
- **Actions:** Click Element, Fill Input
- **Assertions:** Expect Visible
- **Containers:** Within Container

### 4. Test Runner (`packages/runner`)

Node.js + Playwright runner for executing test specifications.

**Features:**
- Executes JSON test specs
- Generates artifacts (screenshots, videos, traces)
- Supports all block operations
- Container and frame scoping

**Usage:**
```bash
# Run a test spec
pnpm --filter runner test:spec ./examples/login-test.json

# Or use the CLI directly
node packages/runner/dist/cli.js ./examples/login-test.json
```

### 5. Sample Site (`apps/sample-site`)

Simple HTML application for testing the QA builder flow.

**Features:**
- Login form with email/password
- Dashboard page
- Pre-loaded with QA Tagger SDK
- Test credentials: `test@example.com` / `password`

## 🎯 Usage Workflow

### 1. Author a Test

1. Open the builder app (http://localhost:5173)
2. Drag blocks from the sidebar to create your test flow
3. Configure each block using the inspector panel

### 2. Pick Elements

1. Click the "Pick" button next to any target field
2. The extension will activate pick mode on the current page
3. Click any element on the page to select it
4. The `qaId` will be automatically filled in the block

### 3. Export and Run

1. Click "Export JSON" to generate the test specification
2. Click "Download Spec" to save the JSON file
3. Run the test using the runner:
   ```bash
   pnpm --filter runner test:spec your-test.json
   ```

## 📋 Test Specification Format

```json
{
  "name": "Login Test",
  "baseUrl": "http://localhost:5174",
  "steps": [
    {
      "op": "goto",
      "url": "/"
    },
    {
      "op": "fill",
      "qaId": "qa:textbox:email:abc123",
      "value": "test@example.com"
    },
    {
      "op": "click",
      "qaId": "qa:button:sign-in:ghi789"
    },
    {
      "op": "expectVisible",
      "qaId": "qa:heading:dashboard:jkl012"
    }
  ]
}
```

## 🔍 QA ID Generation Strategy

The SDK generates stable IDs using this strategy:

1. **Existing IDs:** If element has `data-testid`, `data-test`, or `data-qa`, reuse that value
2. **Semantic Signature:** Build a JSON signature from:
   - Tag name
   - Inferred ARIA role
   - Accessible name (aria-label, placeholder, alt, text content)
   - Input type
   - Href path (for links)
   - Parent hint (id or stable classes)
   - Sibling ordinal (when needed)
3. **Hash & Format:** SHA-256 hash → base36 → `qa:<role>:<hint>:<hash>`

Example: `qa:textbox:email:abc123`

## 🛠 Development

### Building Individual Packages

```bash
# Build SDK
pnpm build:sdk

# Build extension
pnpm build:extension

# Build builder app
pnpm build:builder

# Build runner
pnpm build:runner
```

### Development Mode

```bash
# Run all packages in dev mode
pnpm dev

# Run specific package
pnpm dev:builder
pnpm dev:sample-site
```

### Type Checking

```bash
# Check all packages
pnpm type-check

# Check specific package
pnpm --filter builder type-check
```

## 🧪 Testing the Full Flow

1. **Setup:**
   ```bash
   pnpm build
   pnpm dev:sample-site  # Terminal 1
   pnpm dev:builder      # Terminal 2
   ```

2. **Load Extension:**
   - Chrome → Extensions → Load unpacked → `packages/extension/dist/`

3. **Create Test:**
   - Open builder (http://localhost:5173)
   - Open sample site (http://localhost:5174)
   - Drag "Go to URL" block, set URL to "http://localhost:5174"
   - Drag "Fill Input" block, click "Pick", select email field
   - Drag "Fill Input" block, click "Pick", select password field
   - Drag "Click Element" block, click "Pick", select sign-in button
   - Drag "Expect Visible" block, click "Pick", select dashboard heading

4. **Export & Run:**
   - Click "Export JSON" then "Download Spec"
   - Run: `pnpm --filter runner test:spec downloaded-spec.json`

## 🎯 Acceptance Criteria ✅

- [x] SDK script loaded on sample-site enables element picking
- [x] Existing `data-testid|data-test|data-qa` values are reused as `data-qa-id`
- [x] Selected `qaId` auto-fills block's Target field
- [x] Export produces JSON spec referencing only `qaId` values
- [x] Runner executes JSON spec with Playwright and saves artifacts
- [x] Builder shows SDK detection status and disables picking when SDK missing

## 🔧 Troubleshooting

### Extension Not Working
- Ensure extension is loaded in Chrome
- Check browser console for errors
- Verify content script is injected

### SDK Not Detected
- Confirm `qa-tagger.v1.js` is loaded on the target page
- Check network tab for 404 errors
- Verify script is included before other scripts

### Element Picking Issues
- Ensure target page has the SDK loaded
- Check for CSP (Content Security Policy) blocking
- Verify extension permissions include `activeTab` and `scripting`

### Runner Failures
- Ensure Playwright is installed: `pnpm --filter runner install`
- Check that target URLs are accessible
- Verify `qaId` values exist on the target page

## 📝 License

MIT License - see LICENSE file for details.
