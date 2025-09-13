# 🚀 Getting Started Guide

Welcome to the **QA Test Builder**! This guide will help you get up and running quickly.

## 📋 **Prerequisites**

Before you start, make sure you have:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **pnpm** (package manager) - [Install here](https://pnpm.io/installation)
- **Git** (version control) - [Download here](https://git-scm.com/)

## 🛠️ **Installation**

### **Step 1: Clone the Repository**

```bash
git clone <your-repo-url>
cd mymvp
```

### **Step 2: Install Dependencies**

```bash
# Install all dependencies for all packages
pnpm install

# Build all packages
pnpm build
```

### **Step 3: Start All Services**

```bash
# Terminal 1 - Backend (Browser Automation)
cd backend
npm start

# Terminal 2 - Builder (Visual Interface)
cd /Users/admin/mymvp
pnpm dev:builder

# Terminal 3 - Sample Site (Test Target)
cd /Users/admin/mymvp
pnpm dev:sample-site
```

## 🌐 **Access the Application**

Once all services are running, you can access:

- **Builder**: http://localhost:5173 - Create your tests
- **Sample Site**: http://localhost:5174 - Test your automation
- **Backend API**: http://localhost:8080 - Powers the automation

## 🎯 **Creating Your First Test**

### **Step 1: Open the Builder**

1. Go to http://localhost:5173
2. You should see the Blockly workspace with a toolbox on the left

### **Step 2: Add Test Blocks**

1. **Drag "Navigate to URL"** from the toolbox to the workspace
2. **Set the URL** to `http://localhost:5174` in the inspector panel
3. **Drag "Fill input"** block and connect it to the first block
4. **Set the Target** to `email` and Value to `test@example.com`
5. **Drag "Click button"** block and connect it
6. **Set the Target** to `signInBtn`

### **Step 3: Run Your Test**

1. **Click "Run Test"** button
2. **Watch the magic!** A browser window will open
3. **See your test execute** in real-time

## 🔧 **Understanding the Interface**

### **Builder Interface**

```
┌─────────────────────────────────────────────────────────┐
│ Header: [Run Test] [Export JSON]                        │
├─────────────┬─────────────────────────┬─────────────────┤
│ Toolbox     │ Workspace               │ Inspector       │
│             │                         │                 │
│ • Navigate  │ [Navigate] → [Fill] →   │ Block Settings  │
│ • Click     │ [Click]                 │                 │
│ • Fill      │                         │ • URL           │
│ • Expect    │                         │ • Target        │
│ • Wait      │                         │ • Value         │
└─────────────┴─────────────────────────┴─────────────────┘
```

### **Block Types**

- **Navigate to URL**: Go to a specific webpage
- **Click**: Click on buttons, links, etc.
- **Fill input**: Enter text in input fields
- **Expect visible**: Check if element is visible
- **Wait**: Pause for specified time

## 🎮 **Sample Site Features**

### **QA Mode Toggle**

1. **Click "🔍 Show QA IDs"** button (top-left)
2. **Hover over elements** to see QA IDs in tooltips
3. **Click elements** to copy their QA IDs
4. **Use these IDs** in your test blocks

### **Manual ID Generation**

1. **Click "⚡ Generate IDs"** button
2. **All interactive elements** get QA IDs automatically
3. **Hover to see** the generated IDs

## 🐛 **Troubleshooting**

### **Common Issues**

#### **"Cannot navigate to invalid URL"**

- **Problem**: Backend receives relative URL like `/`
- **Solution**: Make sure your Navigate block has full URL like `http://localhost:5174`

#### **"Element not found"**

- **Problem**: QA ID doesn't exist or is incorrect
- **Solution**:
  1. Enable QA mode on sample site
  2. Hover over element to get correct QA ID
  3. Copy and paste into your test block

#### **"Backend not responding"**

- **Problem**: Backend server isn't running
- **Solution**:
  1. Check if backend is running on port 8080
  2. Restart backend: `cd backend && npm start`

#### **"Builder shows white screen"**

- **Problem**: Frontend build failed
- **Solution**:
  1. Check if builder is running on port 5173
  2. Restart builder: `pnpm dev:builder`

### **Debugging Tips**

#### **Check Backend Logs**

```bash
# Backend terminal should show:
🚀 QA Test Runner Backend running on http://localhost:8080
📊 Health check: http://localhost:8080/api/health
🧪 Test endpoint: http://localhost:8080/api/run-test
```

#### **Check Frontend Console**

1. **Open browser dev tools** (F12)
2. **Go to Console tab**
3. **Look for error messages** or debug logs

#### **Verify All Services**

```bash
# Check if all services are running
curl -s http://localhost:8080/api/health && echo " ✅ Backend"
curl -s http://localhost:5173 | head -1 && echo " ✅ Builder"
curl -s http://localhost:5174 | head -1 && echo " ✅ Sample Site"
```

## 📚 **Next Steps**

### **Learn the Components**

1. **Read [Frontend Guide](./frontend.md)** - Understand the visual interface
2. **Read [Backend Guide](./backend.md)** - Learn browser automation
3. **Read [SDK Guide](./sdk.md)** - Understand QA ID generation

### **Study the Technologies**

1. **Blockly** - Visual programming editor
2. **Playwright** - Browser automation
3. **React** - Frontend framework
4. **Node.js** - Backend runtime

### **Build Your Own**

1. **Start simple** - Create basic blocks
2. **Add features** - More block types, better UI
3. **Scale up** - Multiple browsers, parallel tests

## 🎯 **Example Test Scenarios**

### **Login Test**

```
1. Navigate to http://localhost:5174
2. Fill email field with "user@test.com"
3. Fill password field with "password123"
4. Click Sign In button
5. Expect success message to be visible
```

### **Form Validation Test**

```
1. Navigate to http://localhost:5174
2. Click Sign In button (without filling fields)
3. Expect error message to be visible
4. Fill email field with "invalid-email"
5. Click Sign In button
6. Expect validation error to be visible
```

## 🆘 **Getting Help**

### **Documentation**

- [Frontend Guide](./frontend.md) - Visual interface details
- [Backend Guide](./backend.md) - Browser automation details
- [SDK Guide](./sdk.md) - QA ID generation details
- [Learning Resources](./learning-resources.md) - Study materials

### **Common Commands**

```bash
# Start all services
pnpm dev:builder    # Frontend builder
pnpm dev:sample-site # Sample website
cd backend && npm start # Backend server

# Build packages
pnpm build:sdk      # Build SDK
pnpm build:runner   # Build test runner

# Clean and rebuild
pnpm clean          # Clean all builds
pnpm build          # Rebuild everything
```

---

**Ready to dive deeper? Check out the [Frontend Guide](./frontend.md) to understand how the visual interface works!** 🎯
