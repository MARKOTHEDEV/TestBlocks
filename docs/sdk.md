# 🔧 SDK Guide - QA ID Generation

The **SDK** is a JavaScript library that automatically generates stable, deterministic IDs for website elements.

## 🏗️ **Architecture Overview**

```
SDK (JavaScript Library)
├── qa-tagger.ts (Main SDK file)
├── rollup.config.js (Build configuration)
├── package.json (Dependencies)
└── dist/
    └── qa-tagger.v1.js (Built library)
```

## 🧩 **Core Technologies**

### 1. **Vanilla JavaScript** - Core Language

- **What it is**: Pure JavaScript without frameworks
- **Why we use it**: Lightweight, no dependencies, works everywhere
- **How it works**: DOM manipulation, event handling, ES6+ features

**Key Concepts:**

- **DOM API**: Document Object Model manipulation
- **Event Listeners**: Mouse, keyboard, and custom events
- **MutationObserver**: Watch for DOM changes
- **ES6+ Features**: Classes, arrow functions, async/await

**Learning Resources:**

- 📚 [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- 🎥 [JavaScript Crash Course](https://www.youtube.com/watch?v=hdI2bqOjy3c)
- 🎯 [DOM Manipulation Guide](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)

### 2. **Rollup** - Module Bundler

- **What it is**: JavaScript module bundler
- **Why we use it**: Tree shaking, ES modules, small bundle size
- **How it works**: Bundles modules into single files

**Key Concepts:**

- **Entry Points**: Starting files for bundling
- **Output Formats**: IIFE, ES modules, CommonJS
- **Plugins**: TypeScript, Terser, etc.
- **Tree Shaking**: Removing unused code

**Learning Resources:**

- 📚 [Rollup Official Docs](https://rollupjs.org/guide/en/)
- 🎥 [Rollup Tutorial](https://www.youtube.com/watch?v=_6V6Od4d8qI)
- 🎯 [Rollup Configuration](https://rollupjs.org/guide/en/#configuration-files)

### 3. **TypeScript** - Type Safety

- **What it is**: JavaScript with static type checking
- **Why we use it**: Better development experience, fewer bugs
- **How it works**: Compiles to JavaScript, adds type annotations

**Key Concepts:**

- **Types**: Interfaces, enums, generics
- **Compilation**: TypeScript to JavaScript
- **Type Checking**: Compile-time error detection
- **Modern JavaScript**: ES6+ features

**Learning Resources:**

- 📚 [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- 🎥 [TypeScript Crash Course](https://www.youtube.com/watch?v=BwuLxPH8IDs)
- 🎯 [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

## 🔧 **Implementation Details**

### 1. **SDK Architecture**

```typescript
// qa-tagger.ts - Main SDK class
class QATagger implements QATaggerAPI {
  private isPicking = false;
  private overlay: HTMLElement | null = null;
  private currentElement: Element | null = null;

  constructor() {
    this.setupMessageListener();
    this.autoGenerateIds();
  }

  // Public API methods
  start(): void {
    /* Start element picking */
  }
  stop(): void {
    /* Stop element picking */
  }
  ensureQaId(element: Element): string {
    /* Generate QA ID */
  }
}
```

**Key Responsibilities:**

- **Element Detection**: Find interactive elements
- **ID Generation**: Create stable, deterministic IDs
- **Visual Feedback**: Show hover effects and tooltips
- **Message Handling**: Communicate with parent window

**What to study:**

- Class-based architecture
- Public/private methods
- Constructor patterns
- Interface implementation

### 2. **Automatic ID Generation**

```typescript
// Auto-generate IDs for interactive elements
private autoGenerateIds(): void {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () =>
      this.generateIdsForInteractiveElements()
    );
  } else {
    this.generateIdsForInteractiveElements();
  }

  // Watch for new elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          this.ensureQaIdForElement(node as Element);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
```

**Key Concepts:**

- **DOM Ready States**: Loading, interactive, complete
- **MutationObserver**: Watch for DOM changes
- **Element Detection**: Finding interactive elements
- **Throttling**: Performance optimization

**What to study:**

- DOM lifecycle events
- MutationObserver API
- Performance optimization
- Event delegation

### 3. **Deterministic ID Generation**

```typescript
// Generate stable, predictable IDs
private generateStableId(element: Element): string {
  const role = this.inferRole(element) || 'node';
  const hint = this.getHint(element);

  // Create base ID without random hash
  const baseId = `qa:${role}:${hint}`;

  // Check for duplicates and add counter if needed
  return this.ensureUniqueId(baseId);
}

private ensureUniqueId(baseId: string): string {
  let counter = 0;
  let finalId = baseId;

  // Check if this ID already exists
  while (document.querySelector(`[data-qa-id="${finalId}"]`)) {
    counter++;
    finalId = `${baseId}:${counter}`;
  }

  return finalId;
}
```

**ID Format:**

- **Base**: `qa:button:signin`
- **With Counter**: `qa:button:signin:1` (if duplicate)
- **Deterministic**: Same element always gets same ID

**What to study:**

- String manipulation
- DOM querying
- Uniqueness algorithms
- Naming conventions

### 4. **Element Role Inference**

```typescript
// Determine element role for ID generation
private inferRole(element: Element): string | undefined {
  // Check explicit ARIA role
  const ariaRole = element.getAttribute('role');
  if (ariaRole) return ariaRole;

  // Check semantic HTML elements
  const tagName = element.tagName.toLowerCase();
  const semanticRoles: Record<string, string> = {
    button: "button",
    a: "link",
    input: "textbox",
    textarea: "textbox",
    select: "combobox",
    img: "img",
    h1: "heading",
    h2: "heading",
    // ... more mappings
  };

  return semanticRoles[tagName];
}
```

**Role Detection:**

- **ARIA Roles**: `role="button"`, `role="link"`
- **Semantic HTML**: `<button>`, `<a>`, `<input>`
- **Input Types**: `type="submit"`, `type="email"`
- **Fallback**: Generic role based on tag

**What to study:**

- ARIA accessibility
- Semantic HTML
- Element classification
- Accessibility best practices

### 5. **Visual Feedback System**

```typescript
// Show hover effects and tooltips
private createOverlay(): void {
  this.overlay = document.createElement('div');
  this.overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 123, 255, 0.1);
    border: 2px solid #007bff;
    pointer-events: none;
    z-index: 2147483647;
    display: none;
  `;
  document.body.appendChild(this.overlay);
}

private highlightElement(element: Element): void {
  if (!this.overlay) return;
  const rect = element.getBoundingClientRect();
  this.overlay.style.display = 'block';
  this.overlay.style.top = `${rect.top}px`;
  this.overlay.style.left = `${rect.left}px`;
  this.overlay.style.width = `${rect.width}px`;
  this.overlay.style.height = `${rect.height}px`;
}
```

**Visual Features:**

- **Hover Overlay**: Blue highlight on hover
- **Tooltips**: Show QA ID on hover
- **Click Feedback**: Copy ID to clipboard
- **Non-intrusive**: Doesn't interfere with page

**What to study:**

- CSS positioning
- Element dimensions
- Event handling
- User experience design

## 🎯 **Key Learning Path**

### **Week 1: JavaScript Fundamentals**

1. **Day 1-2**: JavaScript Basics
   - [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
   - Variables, functions, objects
   - ES6+ features

2. **Day 3-4**: DOM Manipulation
   - [DOM API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
   - Element selection and manipulation
   - Event handling

3. **Day 5-7**: Advanced JavaScript
   - Classes and modules
   - Async/await
   - Error handling

### **Week 2: SDK Development**

1. **Day 1-3**: TypeScript Basics
   - [TypeScript Handbook](https://www.typescriptlang.org/docs/)
   - Types and interfaces
   - Compilation

2. **Day 4-5**: Build Tools
   - [Rollup Guide](https://rollupjs.org/guide/en/)
   - Module bundling
   - Configuration

3. **Day 6-7**: SDK Integration
   - Website integration
   - Performance optimization
   - Testing

## 🛠️ **Building Your Own Version**

### **Step 1: Setup**

```bash
# Create project directory
mkdir my-qa-sdk
cd my-qa-sdk

# Initialize package.json
npm init -y

# Install dependencies
npm install --save-dev typescript rollup @rollup/plugin-typescript @rollup/plugin-terser tslib
```

### **Step 2: Basic SDK**

```typescript
// src/qa-tagger.ts
class QATagger {
  private isPicking = false;

  constructor() {
    this.autoGenerateIds();
  }

  start(): void {
    this.isPicking = true;
    this.addEventListeners();
  }

  stop(): void {
    this.isPicking = false;
    this.removeEventListeners();
  }

  private autoGenerateIds(): void {
    const elements = document.querySelectorAll('button, input, a');
    elements.forEach((element) => {
      this.ensureQaId(element);
    });
  }

  private ensureQaId(element: Element): string {
    const existingId = element.getAttribute('data-qa-id');
    if (existingId) return existingId;

    const qaId = this.generateId(element);
    element.setAttribute('data-qa-id', qaId);
    return qaId;
  }

  private generateId(element: Element): string {
    const tag = element.tagName.toLowerCase();
    const text = element.textContent?.trim().substring(0, 10) || '';
    return `qa:${tag}:${text}`.replace(/[^a-zA-Z0-9:]/g, '');
  }
}

// Global API
window.__QATagger = new QATagger();
```

### **Step 3: Build Configuration**

```javascript
// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/qa-tagger.ts',
  output: {
    file: 'dist/qa-tagger.js',
    format: 'iife',
    name: 'QATagger',
  },
  plugins: [typescript(), terser()],
};
```

### **Step 4: Website Integration**

```html
<!-- Include in your website -->
<script src="/qa-tagger.js"></script>
<script>
  // Start QA mode
  window.__QATagger.start();
</script>
```

## 🔍 **Code Examples to Study**

### **Our Implementation:**

- `packages/sdk/src/qa-tagger.ts` - Complete SDK implementation
- `packages/sdk/rollup.config.js` - Build configuration
- `packages/sdk/package.json` - Dependencies and scripts

### **Key Functions to Understand:**

- `ensureQaId()` - Generate QA IDs
- `generateStableId()` - Create deterministic IDs
- `inferRole()` - Determine element roles
- `autoGenerateIds()` - Automatic ID generation
- `ensureUniqueId()` - Handle duplicates

## 📚 **Additional Resources**

- 🎥 [JavaScript YouTube Tutorials](https://www.youtube.com/results?search_query=javascript+tutorial)
- 📖 [DOM API Reference](https://developer.mozilla.org/en-US/docs/Web/API)
- 🎯 [MutationObserver Guide](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
- 📚 [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- 🎥 [TypeScript YouTube Tutorials](https://www.youtube.com/results?search_query=typescript+tutorial)
- 📖 [Rollup Documentation](https://rollupjs.org/guide/en/)

## 🎯 **Advanced Topics**

### **Performance Optimization**

- Throttling and debouncing
- Lazy loading
- Memory management

### **Accessibility**

- ARIA compliance
- Screen reader support
- Keyboard navigation

### **Browser Compatibility**

- Polyfills
- Feature detection
- Cross-browser testing

## 🎯 **Next Steps**

After mastering the SDK:

1. **Study the [Frontend Guide](./frontend.md)** - Learn the visual interface
2. **Study the [Backend Guide](./backend.md)** - Understand browser automation
3. **Build your own version** - Start with simple ID generation and expand

---

**Ready to learn the complete system? Check out the [Getting Started Guide](./getting-started.md)!** 🚀
