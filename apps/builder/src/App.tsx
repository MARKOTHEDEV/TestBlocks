import React, { useState, useEffect, useRef } from 'react';
import { BlocklyWorkspace } from './components/BlocklyWorkspace';
import { Inspector } from './components/Inspector';
import { TestRunner } from './components/TestRunner';
import { TestSpec, TestStep } from '@qa-builder/shared';

function App() {
  const [selectedBlock, setSelectedBlock] = useState<any>(null);
  const [isPicking, setIsPicking] = useState(false);
  const [sdkDetected, setSdkDetected] = useState(false);
  const [workspace, setWorkspace] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showRunner, setShowRunner] = useState(false);
  const [testSpec, setTestSpec] = useState<TestSpec>({
    name: 'My Test',
    baseUrl: 'http://localhost:5174',
    steps: [],
  });

  useEffect(() => {
    // Check if SDK is available on the current page
    const checkSDK = () => {
      setSdkDetected(!!window.__QATagger);
    };

    checkSDK();
    const interval = setInterval(checkSDK, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePickElement = async () => {
    // Open the sample site in a new tab for element picking
    const sampleSiteUrl = 'http://localhost:5174';
    window.open(sampleSiteUrl, '_blank');

    // Show instructions
    alert(`Instructions:
1. The sample site will open in a new tab
2. Click the "🔍 Show QA IDs" button (top-left)
3. Interact with elements to generate QA IDs
4. Copy the QA ID you want to use
5. Paste it in the Target field below`);
  };

  const handleExportJSON = () => {
    if (!workspace) return;

    const spec = generateTestSpec(workspace);
    setTestSpec(spec);
  };

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(testSpec, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${testSpec.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRunTest = async () => {
    if (!workspace) return;

    setIsRunning(true);
    setShowRunner(true);

    // Generate the test spec
    const spec = generateTestSpec(workspace);
    setTestSpec(spec);

    // The TestRunner component will handle the actual execution
  };

  const generateTestSpec = (workspace: any): TestSpec => {
    // Get all blocks, not just top blocks
    const allBlocks = workspace.getAllBlocks();
    console.log('🔍 Debug - All blocks:', allBlocks.length);
    console.log(
      '🔍 Debug - All block types:',
      allBlocks.map((b) => b.type)
    );

    // Filter out toolbox blocks and get only our custom blocks
    const customBlocks = allBlocks.filter((block) =>
      ['goto', 'click', 'fill', 'expectVisible', 'withinContainer'].includes(
        block.type
      )
    );
    console.log('🔍 Debug - Custom blocks:', customBlocks.length);
    console.log(
      '🔍 Debug - Custom block types:',
      customBlocks.map((b) => b.type)
    );

    const steps: TestStep[] = [];

    for (const block of customBlocks) {
      const step = blockToTestStep(block);
      if (step) {
        steps.push(step);
        console.log('🔍 Debug - Added step:', step);
      }
    }

    return {
      name: testSpec.name,
      baseUrl: testSpec.baseUrl,
      steps,
    };
  };

  const blockToTestStep = (block: any): TestStep | null => {
    const op = block.type;

    switch (op) {
      case 'goto':
        return {
          op: 'goto',
          url: block.getFieldValue('url'),
        };

      case 'click':
        return {
          op: 'click',
          qaId: block.getFieldValue('qaId'),
        };

      case 'fill':
        return {
          op: 'fill',
          qaId: block.getFieldValue('qaId'),
          value: block.getFieldValue('value'),
        };

      case 'expectVisible':
        return {
          op: 'expectVisible',
          qaId: block.getFieldValue('qaId'),
        };

      case 'withinContainer':
        const containerSteps: TestStep[] = [];
        const containerBlock = block.getInputTargetBlock('steps');
        if (containerBlock) {
          const step = blockToTestStep(containerBlock);
          if (step) containerSteps.push(step);
        }
        return {
          op: 'withinContainer',
          containerQaId: block.getFieldValue('containerQaId'),
          steps: containerSteps,
        };

      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>QA Test Builder</h1>
        <div className="header-actions">
          {showRunner ? (
            <button
              className="btn btn-secondary"
              onClick={() => setShowRunner(false)}
              disabled={isRunning}
            >
              ← Back to Editor
            </button>
          ) : (
            <>
              <button
                className="btn btn-primary"
                onClick={handleRunTest}
                disabled={!workspace || isRunning}
              >
                {isRunning ? 'Running...' : '▶️ Run Test'}
              </button>
              <button className="btn btn-secondary" onClick={handleExportJSON}>
                Export JSON
              </button>
              <button className="btn btn-success" onClick={handleDownloadJSON}>
                Download Spec
              </button>
            </>
          )}
        </div>
      </header>

      <div className="main-content">
        <div className="sidebar">
          <h2>Blocks</h2>

          <div className="block-category">
            <h3>Navigation</h3>
            <div className="block-item" data-block-type="goto">
              Go to URL
            </div>
          </div>

          <div className="block-category">
            <h3>Actions</h3>
            <div className="block-item" data-block-type="click">
              Click Element
            </div>
            <div className="block-item" data-block-type="fill">
              Fill Input
            </div>
          </div>

          <div className="block-category">
            <h3>Assertions</h3>
            <div className="block-item" data-block-type="expectVisible">
              Expect Visible
            </div>
          </div>

          <div className="block-category">
            <h3>Containers</h3>
            <div className="block-item" data-block-type="withinContainer">
              Within Container
            </div>
          </div>
        </div>

        <div className="workspace">
          {showRunner ? (
            <TestRunner
              testSpec={testSpec}
              isRunning={isRunning}
              onRunningChange={setIsRunning}
              onClose={() => setShowRunner(false)}
            />
          ) : (
            <BlocklyWorkspace
              onWorkspaceChange={setWorkspace}
              onBlockSelect={setSelectedBlock}
            />
          )}
        </div>

        <div className="inspector">
          <h2>Block Inspector</h2>

          {!sdkDetected && (
            <div className="sdk-warning">
              <strong>SDK Not Detected</strong>
              Add{' '}
              <code>
                &lt;script src="/qa-tagger.v1.js"&gt;&lt;/script&gt;
              </code>{' '}
              to the target page for stable IDs
            </div>
          )}

          {selectedBlock && (
            <Inspector
              block={selectedBlock}
              onPickElement={handlePickElement}
              isPicking={isPicking}
              sdkDetected={sdkDetected}
            />
          )}

          {!selectedBlock && (
            <p style={{ color: '#666', fontSize: '14px' }}>
              Select a block to configure its properties
            </p>
          )}

          <div className="export-section">
            <h3>Test Configuration</h3>
            <div className="field-group">
              <label>Test Name</label>
              <input
                type="text"
                value={testSpec.name}
                onChange={(e) =>
                  setTestSpec({ ...testSpec, name: e.target.value })
                }
              />
            </div>
            <div className="field-group">
              <label>Base URL</label>
              <input
                type="text"
                value={testSpec.baseUrl}
                onChange={(e) =>
                  setTestSpec({ ...testSpec, baseUrl: e.target.value })
                }
              />
            </div>
          </div>

          {testSpec.steps.length > 0 && (
            <div className="export-section">
              <h3>Generated Spec</h3>
              <div className="json-output">
                {JSON.stringify(testSpec, null, 2)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
