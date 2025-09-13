import React, { useState, useEffect, useRef } from 'react';
import { TestSpec, TestStep } from '@qa-builder/shared';

interface TestRunnerProps {
  testSpec: TestSpec;
  isRunning: boolean;
  onRunningChange: (running: boolean) => void;
  onClose: () => void;
}

interface TestResult {
  step: number;
  operation: string;
  success: boolean;
  error?: string;
  timestamp: string;
}

interface BackendResponse {
  success: boolean;
  results: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
  };
  error?: string;
}

export const TestRunner: React.FC<TestRunnerProps> = ({
  testSpec,
  isRunning,
  onRunningChange,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [testResults, setTestResults] = useState<{
    success: boolean;
    error?: string;
    currentStep?: number;
    backendResults?: TestResult[];
    summary?: { total: number; passed: number; failed: number };
  }>({ success: false });
  const [isBackendRunning, setIsBackendRunning] = useState(false);
  const [backendStatus, setBackendStatus] = useState<
    'idle' | 'running' | 'completed' | 'error'
  >('idle');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isRunning && testSpec.steps.length > 0) {
      runTestWithBackend();
    }
  }, [isRunning, testSpec]);

  const runTestWithBackend = async () => {
    setCurrentStep(0);
    setTestResults({ success: false });
    setIsBackendRunning(true);
    setBackendStatus('running');

    try {
      console.log('🚀 Sending test to backend...', testSpec);

      const response = await fetch('http://localhost:8080/api/run-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blocks: testSpec.steps,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Backend request failed: ${response.status} ${response.statusText}`
        );
      }

      const data: BackendResponse = await response.json();
      console.log('📊 Backend response:', data);

      if (data.success) {
        setTestResults({
          success: true,
          currentStep: testSpec.steps.length,
          backendResults: data.results,
          summary: data.summary,
        });
        setBackendStatus('completed');
      } else {
        throw new Error(data.error || 'Backend test execution failed');
      }
    } catch (error) {
      console.error('❌ Backend test failed:', error);
      setTestResults({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        currentStep,
      });
      setBackendStatus('error');
    } finally {
      setIsBackendRunning(false);
      onRunningChange(false);
    }
  };

  // Backend handles all test execution now

  const getStepDescription = (step: TestStep): string => {
    switch (step.op) {
      case 'goto':
        return `Navigate to ${step.url}`;
      case 'click':
        return `Click element: ${step.qaId}`;
      case 'fill':
        return `Fill ${step.qaId} with "${step.value}"`;
      case 'expectVisible':
        return `Expect ${step.qaId} to be visible`;
      default:
        return `Execute ${step.op}`;
    }
  };

  return (
    <div className="test-runner">
      <div className="test-runner-header">
        <h2>🧪 Running Test: {testSpec.name}</h2>
        <div className="test-controls">
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isBackendRunning}
          >
            ← Back to Editor
          </button>
        </div>
      </div>

      <div className="test-runner-content">
        <div className="test-progress">
          <h3>Test Progress</h3>

          {/* Backend Status */}
          <div className="backend-status">
            <div className={`status-indicator ${backendStatus}`}>
              {backendStatus === 'idle' && '⏸️ Ready'}
              {backendStatus === 'running' && '🔄 Running in Browser...'}
              {backendStatus === 'completed' && '✅ Completed'}
              {backendStatus === 'error' && '❌ Error'}
            </div>
            {backendStatus === 'running' && (
              <p className="status-message">
                🖥️ A browser window should have opened. Watch it execute your
                test steps!
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${testSpec.steps.length > 0 ? ((currentStep + 1) / testSpec.steps.length) * 100 : 0}%`,
              }}
            />
          </div>

          {/* Step List */}
          <div className="step-list">
            {testSpec.steps.map((step, index) => {
              const backendResult = testResults.backendResults?.find(
                (r) => r.step === index + 1
              );
              return (
                <div
                  key={index}
                  className={`step-item ${
                    backendResult
                      ? backendResult.success
                        ? 'completed'
                        : 'failed'
                      : index === currentStep
                        ? 'current'
                        : ''
                  }`}
                >
                  <span className="step-number">{index + 1}</span>
                  <span className="step-description">
                    {getStepDescription(step)}
                  </span>
                  <span className="step-status">
                    {backendResult
                      ? backendResult.success
                        ? '✅'
                        : '❌'
                      : index === currentStep && isBackendRunning
                        ? '🔄'
                        : ''}
                  </span>
                  {backendResult?.error && (
                    <div className="step-error">{backendResult.error}</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Test Results */}
          {testResults.error && (
            <div className="test-error">
              <h4>❌ Test Failed</h4>
              <p>{testResults.error}</p>
            </div>
          )}

          {testResults.success && !isBackendRunning && testResults.summary && (
            <div className="test-success">
              <h4>✅ Test Completed!</h4>
              <div className="test-summary">
                <p>
                  📊 Results: {testResults.summary.passed}/
                  {testResults.summary.total} steps passed
                </p>
                {testResults.summary.failed > 0 && (
                  <p className="failed-count">
                    ❌ {testResults.summary.failed} steps failed
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="test-preview">
          <h3>🌐 Real Browser Automation</h3>
          <div className="browser-info">
            <p>
              🚀 This test runs in a <strong>real browser window</strong> using
              Playwright!
            </p>
            <p>
              👀 Watch the browser window that opens to see your test execute.
            </p>
            <p>⚡ Each step is slowed down so you can see what's happening.</p>

            {backendStatus === 'running' && (
              <div className="running-info">
                <p>
                  🔄 <strong>Test is running...</strong>
                </p>
                <p>Look for the browser window that opened!</p>
              </div>
            )}

            {backendStatus === 'completed' && (
              <div className="completed-info">
                <p>
                  ✅ <strong>Test completed!</strong>
                </p>
                <p>The browser window should have closed automatically.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
