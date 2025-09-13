# 🎮 Play Button Demo - Live Test Execution

## 🚀 **New Feature: Live Test Runner**

Your QA Test Builder now has a **▶️ Run Test** button that lets you execute tests directly in the browser with a live preview!

## 🎯 **How It Works**

### **1. Build Your Test**

- Drag blocks to create your test flow
- Configure each block with the inspector
- Pick elements using the "Pick" buttons

### **2. Click ▶️ Run Test**

- The builder switches to **Test Runner Mode**
- Shows a **live preview** of your target website
- Displays **step-by-step progress** on the left
- Executes each step with visual feedback

### **3. Watch It Execute**

- **Progress Bar:** Shows overall test completion
- **Step List:** Each step highlights as it runs
- **Live Preview:** See the website respond to each action
- **Real-time Feedback:** ✅ Success or ❌ Error messages

## 🎨 **Visual Features**

### **Left Panel - Test Progress**

- **Progress Bar:** Visual completion indicator
- **Step List:** Each step with status indicators
  - 🔄 **Current Step:** Blue highlight with spinner
  - ✅ **Completed Steps:** Green with checkmark
  - ⚪ **Pending Steps:** Gray with step number
- **Error/Success Messages:** Clear feedback

### **Right Panel - Live Preview**

- **Embedded Website:** Full iframe of your target site
- **Real-time Updates:** See form fills, clicks, navigation
- **Responsive Design:** Adapts to your screen size

## 🧪 **Demo Test Flow**

1. **Create this test:**

   ```
   Go to URL → http://localhost:5174
   Fill Input → email field → test@example.com
   Fill Input → password field → password
   Click Element → Sign In button
   Expect Visible → Dashboard heading
   ```

2. **Click ▶️ Run Test**

3. **Watch it execute:**
   - Navigate to the login page
   - Fill in the email field
   - Fill in the password field
   - Click the sign-in button
   - Verify the dashboard appears

## 🔧 **Technical Details**

### **Message Passing**

- Builder sends commands to the iframe via `postMessage`
- Sample site listens for `QA_CLICK` and `QA_FILL` messages
- Real-time execution with visual feedback

### **Step Execution**

- **goto:** Navigates to the specified URL
- **click:** Clicks elements by `data-qa-id`
- **fill:** Fills input fields with values
- **expectVisible:** Validates element visibility

### **Error Handling**

- Shows clear error messages if steps fail
- Highlights the failed step
- Allows you to go back and fix issues

## 🎉 **Benefits**

- **Immediate Feedback:** See if your test works before exporting
- **Visual Learning:** Understand how each step affects the page
- **Debugging:** Quickly identify issues in your test flow
- **No Setup Required:** Works instantly without external tools
- **Professional UI:** Clean, intuitive interface

## 🚀 **Try It Now!**

1. **Open the builder:** http://localhost:5173
2. **Create a simple test** with a few blocks
3. **Click ▶️ Run Test** and watch the magic happen!
4. **Go back to editor** to make changes and run again

This makes test creation and debugging incredibly fast and visual! 🎯
