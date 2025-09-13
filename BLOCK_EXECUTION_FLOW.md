# 🔄 Block Execution Flow - What Happens When Blocks Run

## 🎯 **Overview**

When you click "▶️ Run Test", here's exactly what happens for each block type:

## 📋 **Step 1: Block → Test Step Conversion**

Each Blockly block gets converted to a `TestStep` object:

### **Go to URL Block**

```javascript
// Block fields: url
// Converts to:
{
  op: 'goto',
  url: 'http://localhost:5174'
}
```

### **Click Element Block**

```javascript
// Block fields: qaId
// Converts to:
{
  op: 'click',
  qaId: 'qa-abc123'
}
```

### **Fill Input Block**

```javascript
// Block fields: qaId, value
// Converts to:
{
  op: 'fill',
  qaId: 'qa-abc123',
  value: 'hello world'
}
```

### **Expect Visible Block**

```javascript
// Block fields: qaId
// Converts to:
{
  op: 'expectVisible',
  qaId: 'qa-abc123'
}
```

## 🚀 **Step 2: Test Execution**

The TestRunner executes each step in sequence:

### **1. Go to URL Block**

```javascript
case 'goto':
  // Changes the iframe URL
  setIframeUrl(new URL(step.url!, testSpec.baseUrl).toString());
  // Waits 2 seconds for page to load
  await new Promise((resolve) => setTimeout(resolve, 2000));
  break;
```

**What happens:**

- ✅ **Iframe URL changes** to the specified URL
- ✅ **Page loads** in the iframe
- ✅ **Waits 2 seconds** for page to fully load
- ✅ **Visual feedback** - you see the page change

### **2. Click Element Block**

```javascript
case 'click':
  // Sends message to iframe
  iframe.postMessage({
    type: 'QA_CLICK',
    qaId: step.qaId,
  }, '*');
  // Waits 500ms
  await new Promise((resolve) => setTimeout(resolve, 500));
  break;
```

**What happens:**

- ✅ **Message sent** to iframe: `{type: 'QA_CLICK', qaId: 'qa-abc123'}`
- ✅ **Sample site receives** the message
- ✅ **Element found** using `document.querySelector('[data-qa-id="qa-abc123"]')`
- ✅ **Element clicked** with `element.click()`
- ✅ **Waits 500ms** before next step
- ✅ **Visual feedback** - you see the element get clicked

### **3. Fill Input Block**

```javascript
case 'fill':
  // Sends message to iframe
  iframe.postMessage({
    type: 'QA_FILL',
    qaId: step.qaId,
    value: step.value,
  }, '*');
  // Waits 500ms
  await new Promise((resolve) => setTimeout(resolve, 500));
  break;
```

**What happens:**

- ✅ **Message sent** to iframe: `{type: 'QA_FILL', qaId: 'qa-abc123', value: 'hello'}`
- ✅ **Sample site receives** the message
- ✅ **Element found** using `document.querySelector('[data-qa-id="qa-abc123"]')`
- ✅ **Value set** with `element.value = 'hello'`
- ✅ **Input event fired** with `element.dispatchEvent(new Event('input', { bubbles: true }))`
- ✅ **Waits 500ms** before next step
- ✅ **Visual feedback** - you see the input field get filled

### **4. Expect Visible Block**

```javascript
case 'expectVisible':
  // For now, just wait - in a real implementation, you'd check visibility
  await new Promise((resolve) => setTimeout(resolve, 1000));
  break;
```

**What happens:**

- ✅ **Waits 1 second** (placeholder for visibility check)
- ✅ **Future enhancement** - will check if element is actually visible
- ✅ **Visual feedback** - step shows as completed

## 🔄 **Step 3: Message Flow**

### **Builder → Sample Site Communication**

```
Builder (TestRunner)          Sample Site
     |                            |
     | postMessage()              |
     | {type: 'QA_FILL',          |
     |  qaId: 'qa-abc123',        |
     |  value: 'hello'}           |
     |--------------------------->|
     |                            | addEventListener('message')
     |                            | document.querySelector()
     |                            | element.value = 'hello'
     |                            | element.dispatchEvent()
     |                            |
     |<-- 500ms wait -------------|
     |                            |
```

## 🎯 **Step 4: Visual Feedback**

### **Progress Bar**

- ✅ **Updates in real-time** as each step completes
- ✅ **Shows current step** being executed
- ✅ **Displays step descriptions** like "Fill qa-abc123 with 'hello'"

### **Step List**

- ✅ **Current step** highlighted with 🔄
- ✅ **Completed steps** show ✅
- ✅ **Step descriptions** show what's happening

### **Iframe Preview**

- ✅ **Live webpage** shows the actual interactions
- ✅ **You see clicks** happening
- ✅ **You see inputs** getting filled
- ✅ **You see page navigation**

## 🐛 **Debugging Information**

### **Console Logs**

```javascript
// Builder console shows:
Sending QA_FILL message: {qaId: "qa-abc123", value: "hello"}

// Sample site console shows:
Received message: {type: "QA_FILL", qaId: "qa-abc123", value: "hello"}
Filled element: qa-abc123 with: hello
```

### **Error Handling**

- ✅ **Iframe not ready** - throws error if iframe isn't loaded
- ✅ **Element not found** - logs when element can't be found
- ✅ **Message not received** - logs when communication fails

## 🎉 **Complete Flow Example**

### **Test: Login Form**

1. **Go to URL** → iframe loads http://localhost:5174
2. **Fill Input** → email field gets filled with "test@example.com"
3. **Fill Input** → password field gets filled with "password"
4. **Click Element** → Sign In button gets clicked
5. **Expect Visible** → waits for dashboard to appear

### **What You See:**

- ✅ **Iframe changes** to login page
- ✅ **Email field** gets filled with "test@example.com"
- ✅ **Password field** gets filled with "password"
- ✅ **Sign In button** gets clicked
- ✅ **Page transitions** to dashboard
- ✅ **Progress bar** shows 100% complete

This is exactly what happens when each block runs! 🚀
