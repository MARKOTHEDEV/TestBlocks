# 🖥️ Backend Guide - Real Browser Automation

The **Backend** is the Node.js server that executes real browser automation using Playwright.

## 🏗️ **Architecture Overview**

```
Backend (Node.js Server)
├── server.js (Main server file)
├── package.json (Dependencies)
└── node_modules/
    ├── playwright (Browser automation)
    ├── express (Web server)
    └── cors (Cross-origin requests)
```

## 🧩 **Core Technologies**

### 1. **Playwright** - Browser Automation

- **What it is**: Microsoft's browser automation library
- **Why we use it**: Real browser automation, cross-browser support
- **How it works**: Controls actual browsers (Chrome, Firefox, Safari)

**Key Concepts:**

- **Browser**: The actual browser instance
- **Page**: A tab/window in the browser
- **Locators**: Ways to find elements on the page
- **Actions**: Click, type, navigate, etc.

**Learning Resources:**

- 📚 [Playwright Official Docs](https://playwright.dev/docs/intro)
- 🎥 [Playwright Getting Started](https://playwright.dev/docs/intro)
- 🎯 [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- 🎥 [Playwright YouTube Tutorials](https://www.youtube.com/results?search_query=playwright+tutorial)

### 2. **Node.js** - JavaScript Runtime

- **What it is**: JavaScript runtime for server-side development
- **Why we use it**: Same language as frontend, great ecosystem
- **How it works**: V8 engine, event-driven, non-blocking I/O

**Key Concepts:**

- **Modules**: Code organization (require/import)
- **Events**: Event-driven programming
- **Streams**: Data flow handling
- **Async/Await**: Asynchronous programming

**Learning Resources:**

- 📚 [Node.js Official Docs](https://nodejs.org/en/docs/)
- 🎥 [Node.js Crash Course](https://www.youtube.com/watch?v=fBNz5xF-Kx4)
- 🎯 [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### 3. **Express** - Web Framework

- **What it is**: Minimal web framework for Node.js
- **Why we use it**: Simple API creation, middleware support
- **How it works**: HTTP server, routing, middleware

**Key Concepts:**

- **Routes**: URL endpoints
- **Middleware**: Functions that run between request and response
- **Request/Response**: HTTP handling
- **JSON**: Data serialization

**Learning Resources:**

- 📚 [Express Official Docs](https://expressjs.com/)
- 🎥 [Express Crash Course](https://www.youtube.com/watch?v=L72fhGm1tfE)
- 🎯 [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

## 🔧 **Implementation Details**

### 1. **Server Setup**

```javascript
// server.js - Main server file
const express = require('express');
const { chromium } = require('playwright');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Test execution endpoint
app.post('/api/run-test', async (req, res) => {
  // Handle test execution
});
```

**What to study:**

- Express server setup
- Middleware configuration
- CORS handling
- JSON parsing

### 2. **Playwright Integration**

```javascript
// Launch browser with visible window
const browser = await chromium.launch({
  headless: false, // ← Makes browser visible
  slowMo: 1000, // ← Slows down actions
  args: ['--start-maximized'],
});

const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
});

const page = await context.newPage();
```

**Key Playwright Concepts:**

- **Browser Launch**: Starting browser instances
- **Context**: Browser context (cookies, storage)
- **Page**: Individual tabs/windows
- **Locators**: Finding elements on pages

**What to study:**

- Browser configuration options
- Context management
- Page lifecycle
- Error handling

### 3. **Test Execution Engine**

```javascript
// Execute each test block
for (let i = 0; i < blocks.length; i++) {
  const block = blocks[i];

  switch (block.op) {
    case 'goto':
      await page.goto(block.url);
      break;

    case 'click':
      await page.click(`[data-qa-id="${block.qaId}"]`);
      break;

    case 'fill':
      await page.fill(`[data-qa-id="${block.qaId}"]`, block.value);
      break;
  }
}
```

**Test Operations We Support:**

- `goto` - Navigate to URL
- `click` - Click elements
- `fill` - Fill input fields
- `expectVisible` - Check element visibility
- `wait` - Wait for specified time

**What to study:**

- Playwright page methods
- Element selection strategies
- Action execution
- Error handling

### 4. **Smart Element Selection**

```javascript
// Try multiple strategies to find elements
let clickSelector = `[data-qa-id="${block.qaId}"]`;
try {
  await page.waitForSelector(clickSelector, { timeout: 2000 });
} catch {
  // Fallback to regular ID
  const escapedId = block.qaId.replace(
    /[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g,
    '\\$&'
  );
  clickSelector = `#${escapedId}`;
  await page.waitForSelector(clickSelector, { timeout: 3000 });
}
```

**Selection Strategies:**

1. **QA ID**: `[data-qa-id="qa:button:signin"]`
2. **Regular ID**: `#signInBtn` (with escaping)
3. **Stable Selectors**: `button[type="submit"]`

**What to study:**

- CSS selector syntax
- Character escaping
- Fallback strategies
- Timeout handling

## 🎯 **Key Learning Path**

### **Week 1: Playwright Fundamentals**

1. **Day 1-2**: Playwright Basics
   - [Playwright Getting Started](https://playwright.dev/docs/intro)
   - Install and setup
   - Basic browser automation

2. **Day 3-4**: Element Interaction
   - [Locators Guide](https://playwright.dev/docs/locators)
   - Click, type, navigate
   - Wait strategies

3. **Day 5-7**: Advanced Playwright
   - [Page Object Model](https://playwright.dev/docs/pom)
   - Screenshots and videos
   - Cross-browser testing

### **Week 2: Node.js Backend**

1. **Day 1-3**: Node.js Basics
   - [Node.js Tutorial](https://nodejs.org/en/docs/guides/getting-started-guide/)
   - Modules and packages
   - File system operations

2. **Day 4-5**: Express Framework
   - [Express Guide](https://expressjs.com/en/guide/routing.html)
   - Routes and middleware
   - API development

3. **Day 6-7**: Integration
   - Playwright + Express
   - Error handling
   - Performance optimization

## 🛠️ **Building Your Own Version**

### **Step 1: Setup**

```bash
# Create project directory
mkdir my-qa-backend
cd my-qa-backend

# Initialize package.json
npm init -y

# Install dependencies
npm install playwright express cors

# Install Playwright browsers
npx playwright install
```

### **Step 2: Basic Server**

```javascript
// server.js
const express = require('express');
const { chromium } = require('playwright');

const app = express();
app.use(express.json());

app.post('/api/run-test', async (req, res) => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://example.com');
  await page.click('button');

  await browser.close();
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### **Step 3: Test Execution**

```javascript
// Execute test blocks
app.post('/api/run-test', async (req, res) => {
  const { blocks } = req.body;
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  for (const block of blocks) {
    switch (block.op) {
      case 'goto':
        await page.goto(block.url);
        break;
      case 'click':
        await page.click(block.selector);
        break;
    }
  }

  await browser.close();
  res.json({ success: true });
});
```

### **Step 4: Error Handling**

```javascript
// Add comprehensive error handling
try {
  await page.goto(block.url);
} catch (error) {
  console.error(`Navigation failed: ${error.message}`);
  throw new Error(`Failed to navigate to ${block.url}`);
}
```

## 🔍 **Code Examples to Study**

### **Our Implementation:**

- `backend/server.js` - Complete server implementation
- `backend/package.json` - Dependencies and scripts

### **Key Functions to Understand:**

- `chromium.launch()` - Browser startup
- `page.goto()` - Navigation
- `page.click()` - Element interaction
- `page.waitForSelector()` - Element waiting
- `page.fill()` - Input filling

## 📚 **Additional Resources**

- 🎥 [Playwright YouTube Channel](https://www.youtube.com/c/Playwright)
- 📖 [Playwright Test Runner](https://playwright.dev/docs/test-intro)
- 🎯 [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- 📚 [Node.js Documentation](https://nodejs.org/en/docs/)
- 🎥 [Node.js YouTube Tutorials](https://www.youtube.com/results?search_query=nodejs+tutorial)
- 📚 [Express Documentation](https://expressjs.com/en/4x/api.html)

## 🎯 **Advanced Topics**

### **Performance Optimization**

- Browser pooling
- Parallel test execution
- Resource management

### **Error Handling**

- Retry mechanisms
- Screenshot capture
- Detailed error reporting

### **Scaling**

- Multiple browser instances
- Queue management
- Load balancing

## 🎯 **Next Steps**

After mastering the backend:

1. **Study the [SDK Guide](./sdk.md)** - Learn QA ID generation
2. **Study the [Frontend Guide](./frontend.md)** - Understand the visual interface
3. **Build your own version** - Start with simple automation and expand

---

**Ready to learn QA ID generation? Check out the [SDK Guide](./sdk.md)!** 🚀
