# 🎨 Frontend Guide - Visual Test Builder

The **Frontend** is the visual programming interface where users create tests by dragging and dropping blocks.

## 🏗️ **Architecture Overview**

```
Frontend (React App)
├── App.tsx (Main component)
├── components/
│   ├── BlocklyWorkspace.tsx (Visual editor)
│   ├── Inspector.tsx (Block configuration)
│   └── TestRunner.tsx (Test execution)
├── blocks/
│   └── defineBlocks.ts (Custom block definitions)
└── styles/
    └── index.css (UI styling)
```

## 🧩 **Core Technologies**

### 1. **Blockly** - Visual Programming Editor

- **What it is**: Google's visual programming library
- **Why we use it**: Drag-and-drop interface for non-programmers
- **How it works**: Converts visual blocks to code/JSON

**Key Concepts:**

- **Blocks**: Visual programming elements (goto, click, fill)
- **Workspace**: Canvas where blocks are placed
- **Toolbox**: Sidebar with available blocks
- **Code Generation**: Converting blocks to executable code

**Learning Resources:**

- 📚 [Blockly Official Docs](https://developers.google.com/blockly)
- 🎥 [Blockly Getting Started](https://developers.google.com/blockly/guides/get-started/web)
- 🎯 [Blockly Block Creation](https://developers.google.com/blockly/guides/create-custom-blocks/overview)

### 2. **React** - User Interface Framework

- **What it is**: JavaScript library for building user interfaces
- **Why we use it**: Component-based architecture, great for complex UIs
- **How it works**: Virtual DOM, state management, component lifecycle

**Key Concepts:**

- **Components**: Reusable UI pieces
- **State**: Data that changes over time
- **Props**: Data passed between components
- **Hooks**: Functions that let you use state and lifecycle features

**Learning Resources:**

- 📚 [React Official Tutorial](https://react.dev/learn)
- 🎥 [React Crash Course](https://www.youtube.com/watch?v=w7ejDZ8SWv8)
- 🎯 [React Hooks Guide](https://react.dev/reference/react)

### 3. **Vite** - Build Tool

- **What it is**: Fast build tool and development server
- **Why we use it**: Hot reload, fast builds, modern tooling
- **How it works**: ES modules, Rollup bundling

**Learning Resources:**

- 📚 [Vite Official Guide](https://vitejs.dev/guide/)
- 🎥 [Vite Tutorial](https://www.youtube.com/watch?v=89NJdbYTgJ8)

## 🔧 **Implementation Details**

### 1. **BlocklyWorkspace Component**

```typescript
// Key responsibilities:
// - Initialize Blockly workspace
// - Define custom blocks
// - Handle block selection
// - Manage workspace changes

const BlocklyWorkspace: React.FC<BlocklyWorkspaceProps> = ({
  onWorkspaceChange,
  onBlockSelect,
}) => {
  useEffect(() => {
    // Create workspace
    const workspace = Blockly.inject(workspaceRef.current, {
      toolbox: {
        /* block definitions */
      },
      grid: {
        /* visual grid */
      },
    });

    // Listen for changes
    workspace.addChangeListener(() => {
      onWorkspaceChange(workspace);
    });
  }, []);
};
```

**What to study:**

- Blockly workspace configuration
- Event listeners and change detection
- Custom block definitions

### 2. **Custom Block Definitions**

```typescript
// defineBlocks.ts - Defines our custom blocks
Blockly.Blocks['goto'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('Navigate to URL')
      .appendField(new Blockly.FieldTextInput('http://example.com'), 'url');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },
};
```

**Block Types We Created:**

- `goto` - Navigate to a URL
- `click` - Click an element
- `fill` - Fill an input field
- `expectVisible` - Check if element is visible
- `withinContainer` - Scope to a container

**What to study:**

- Blockly block definition syntax
- Input types (text, dropdown, etc.)
- Statement connections (previous/next)
- Field types and validation

### 3. **Test Spec Generation**

```typescript
// Converts Blockly blocks to JSON test specification
const generateTestSpec = (workspace: any): TestSpec => {
  const allBlocks = workspace.getAllBlocks();
  const customBlocks = allBlocks.filter((block) =>
    ['goto', 'click', 'fill', 'expectVisible'].includes(block.type)
  );

  const steps: TestStep[] = [];
  for (const block of customBlocks) {
    const step = blockToTestStep(block);
    if (step) steps.push(step);
  }

  return { name: 'My Test', baseUrl: 'http://localhost:5174', steps };
};
```

**What to study:**

- Blockly workspace API
- Block data extraction
- JSON serialization
- Data transformation patterns

### 4. **TestRunner Component**

```typescript
// Handles test execution and displays results
const TestRunner: React.FC<TestRunnerProps> = ({ testSpec, isRunning }) => {
  const runTestWithBackend = async () => {
    const response = await fetch('http://localhost:8080/api/run-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks: testSpec.steps }),
    });

    const data = await response.json();
    // Handle results...
  };
};
```

**What to study:**

- HTTP API communication
- Async/await patterns
- State management
- Error handling
- Real-time updates

## 🎯 **Key Learning Path**

### **Week 1: Blockly Fundamentals**

1. **Day 1-2**: Study Blockly basics
   - [Blockly Getting Started](https://developers.google.com/blockly/guides/get-started/web)
   - Create simple blocks
   - Understand workspace concepts

2. **Day 3-4**: Custom Block Creation
   - [Block Creation Guide](https://developers.google.com/blockly/guides/create-custom-blocks/overview)
   - Build your own blocks
   - Learn block connections

3. **Day 5-7**: Advanced Blockly
   - Code generation
   - Custom toolboxes
   - Block serialization

### **Week 2: React Integration**

1. **Day 1-3**: React Basics
   - [React Tutorial](https://react.dev/learn)
   - Components and props
   - State and hooks

2. **Day 4-5**: React + Blockly
   - Embedding Blockly in React
   - Component lifecycle
   - Event handling

3. **Day 6-7**: Advanced React
   - Context API
   - Custom hooks
   - Performance optimization

## 🛠️ **Building Your Own Version**

### **Step 1: Setup**

```bash
# Create React app
npx create-react-app my-qa-builder --template typescript

# Install Blockly
npm install blockly

# Install additional dependencies
npm install @types/blockly
```

### **Step 2: Basic Blockly Integration**

```typescript
// App.tsx
import * as Blockly from 'blockly';

function App() {
  useEffect(() => {
    const workspace = Blockly.inject('blocklyDiv', {
      toolbox: document.getElementById('toolbox'),
    });
  }, []);

  return (
    <div>
      <div id="blocklyDiv" style={{height: '480px', width: '600px'}}></div>
      <xml id="toolbox" style={{display: 'none'}}>
        <block type="controls_if"></block>
        <block type="controls_repeat_ext"></block>
      </xml>
    </div>
  );
}
```

### **Step 3: Custom Blocks**

```typescript
// Define your custom blocks
Blockly.Blocks['my_custom_block'] = {
  init: function () {
    // Block definition
  },
};
```

### **Step 4: Code Generation**

```typescript
// Generate code from blocks
const code = Blockly.JavaScript.workspaceToCode(workspace);
```

## 🔍 **Code Examples to Study**

### **Our Implementation:**

- `apps/builder/src/App.tsx` - Main application logic
- `apps/builder/src/components/BlocklyWorkspace.tsx` - Blockly integration
- `apps/builder/src/blocks/defineBlocks.ts` - Custom block definitions
- `apps/builder/src/components/TestRunner.tsx` - Test execution

### **Key Functions to Understand:**

- `generateTestSpec()` - Converts blocks to JSON
- `blockToTestStep()` - Transforms individual blocks
- `runTestWithBackend()` - Executes tests via API

## 📚 **Additional Resources**

- 🎥 [Blockly YouTube Channel](https://www.youtube.com/c/Blockly)
- 📖 [Blockly Games](https://blockly.games/) - Interactive examples
- 🎯 [Blockly Demos](https://blockly-demo.appspot.com/) - Live examples
- 📚 [React Documentation](https://react.dev/)
- 🎥 [React YouTube Tutorials](https://www.youtube.com/results?search_query=react+tutorial)

## 🎯 **Next Steps**

After mastering the frontend:

1. **Study the [Backend Guide](./backend.md)** - Learn browser automation
2. **Study the [SDK Guide](./sdk.md)** - Understand QA ID generation
3. **Build your own version** - Start with simple blocks and expand

---

**Ready to learn browser automation? Check out the [Backend Guide](./backend.md)!** 🚀
