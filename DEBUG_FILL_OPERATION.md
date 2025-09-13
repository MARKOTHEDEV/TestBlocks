# 🔍 Debug Fill Operation Issue

## 🎯 **The Problem**

You're using a fill block with:

- **QA ID**: `qa:textbox:enteryoure:cjjzj7`
- **Value**: `hell`
- **Expected**: Input field should be filled with "hell"
- **Actual**: Preview doesn't show the fill operation

## 🔧 **Debugging Steps**

### **Step 1: Check Console Logs**

1. **Open Builder**: http://localhost:5173
2. **Open Browser DevTools** (F12)
3. **Go to Console tab**
4. **Run your test** with the fill block
5. **Look for these logs**:
   ```
   Sending QA_FILL message: {qaId: "qa:textbox:enteryoure:cjjzj7", value: "hell"}
   ```

### **Step 2: Check Sample Site Console**

1. **Open Sample Site**: http://localhost:5174
2. **Open Browser DevTools** (F12)
3. **Go to Console tab**
4. **Look for these logs**:
   ```
   Received message: {type: "QA_FILL", qaId: "qa:textbox:enteryoure:cjjzj7", value: "hell"}
   Filled element: qa:textbox:enteryoure:cjjzj7 with: hell
   ```

### **Step 3: Verify QA ID Exists**

1. **Go to Sample Site**: http://localhost:5174
2. **Click**: "⚡ Generate IDs" button
3. **Click**: "🔍 Show QA IDs" button
4. **Hover over the input field** you want to fill
5. **Check if the QA ID matches**: `qa:textbox:enteryoure:cjjzj7`

## 🐛 **Common Issues & Solutions**

### **Issue 1: QA ID Mismatch**

**Problem**: The QA ID in your block doesn't match the actual QA ID on the element
**Solution**:

1. Use the tooltip to get the correct QA ID
2. Copy the exact QA ID from the tooltip
3. Paste it into your fill block

### **Issue 2: Element Not Found**

**Console shows**: `Element not found for QA_FILL: qa:textbox:enteryoure:cjjzj7`
**Solution**:

1. Make sure the element has a `data-qa-id` attribute
2. Check if the QA ID is exactly correct (no typos)
3. Regenerate IDs if needed

### **Issue 3: Message Not Received**

**Console shows**: No "Received message" logs
**Solution**:

1. Check if the iframe is loading the sample site
2. Make sure both sites are running
3. Check for CORS errors in console

### **Issue 4: Fill Not Visible**

**Console shows**: "Filled element" but input doesn't show the value
**Solution**:

1. The element might be an input field that needs focus
2. Try adding a click before the fill
3. Check if the element is actually an input field

## 🚀 **Step-by-Step Test**

### **Create a Simple Test**:

1. **Go to Builder**: http://localhost:5173
2. **Drag**: "Go to URL" block
3. **Set URL**: `http://localhost:5174`
4. **Drag**: "Fill Input" block
5. **Get QA ID**: Click "Get QA ID" button
6. **Copy QA ID** from sample site tooltip
7. **Paste QA ID** into Target field
8. **Set Value**: "hello world"
9. **Run Test**: Click "▶️ Run Test"

### **Expected Console Output**:

```
Sending QA_FILL message: {qaId: "qa-abc123", value: "hello world"}
Received message: {type: "QA_FILL", qaId: "qa-abc123", value: "hello world"}
Filled element: qa-abc123 with: hello world
```

## 🔧 **Quick Fixes**

### **If QA ID is Wrong**:

1. Go to sample site
2. Click "⚡ Generate IDs"
3. Click "🔍 Show QA IDs"
4. Hover over the input field
5. Copy the exact QA ID from tooltip
6. Paste into your fill block

### **If Element Not Found**:

1. Make sure you're targeting the right element
2. Check if the element has `data-qa-id` attribute
3. Try regenerating IDs

### **If Fill Not Working**:

1. Try adding a click before the fill
2. Check if the element is actually an input field
3. Verify the value is being set correctly

## 🎯 **Test Your Setup**

Try this exact sequence:

1. **Builder**: Create fill block with QA ID from tooltip
2. **Run Test**: Watch console logs
3. **Sample Site**: Check if input field gets filled
4. **Debug**: Use console logs to identify the issue

The debugging logs should help you identify exactly where the issue is! 🚀
