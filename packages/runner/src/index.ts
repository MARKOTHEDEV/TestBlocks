import { chromium, Browser, Page, Locator } from '@playwright/test';
import { TestSpec, TestStep, RunResult } from '@qa-builder/shared';
import * as path from 'path';
import * as fs from 'fs';

export class QARunner {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private artifactsDir: string;

  constructor(artifactsDir = 'artifacts') {
    this.artifactsDir = artifactsDir;
  }

  async runSpec(spec: TestSpec): Promise<RunResult> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const runDir = path.join(this.artifactsDir, timestamp);

    try {
      // Create artifacts directory
      fs.mkdirSync(runDir, { recursive: true });

      // Launch browser
      this.browser = await chromium.launch({
        headless: false, // Set to true for CI
        slowMo: 100, // Slow down for demo
      });

      this.page = await this.browser.newPage();

      // Enable video recording
      await this.page.video()?.saveAs(path.join(runDir, 'video.webm'));

      // Start tracing
      await this.page.context().tracing.start({
        screenshots: true,
        snapshots: true,
      });

      // Execute test steps
      await this.executeSteps(spec.steps, spec.baseUrl);

      // Stop tracing and save
      await this.page.context().tracing.stop({
        path: path.join(runDir, 'trace.zip'),
      });

      // Take final screenshot
      await this.page.screenshot({
        path: path.join(runDir, 'final-screenshot.png'),
        fullPage: true,
      });

      return {
        success: true,
        artifacts: {
          screenshots: [path.join(runDir, 'final-screenshot.png')],
          video: path.join(runDir, 'video.webm'),
          trace: path.join(runDir, 'trace.zip'),
        },
      };
    } catch (error) {
      // Take error screenshot
      if (this.page) {
        await this.page.screenshot({
          path: path.join(runDir, 'error-screenshot.png'),
          fullPage: true,
        });
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        artifacts: {
          screenshots: [path.join(runDir, 'error-screenshot.png')],
        },
      };
    } finally {
      await this.cleanup();
    }
  }

  private async executeSteps(
    steps: TestStep[],
    baseUrl: string
  ): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');

    for (const step of steps) {
      await this.executeStep(step, baseUrl);
    }
  }

  private async executeStep(step: TestStep, baseUrl: string): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');

    console.log(`Executing: ${step.op}`, step);

    switch (step.op) {
      case 'goto':
        await this.page.goto(new URL(step.url!, baseUrl).toString());
        break;

      case 'click':
        const clickLocator = this.getLocator(step.qaId!, step);
        await clickLocator.click({ timeout: 10000 });
        break;

      case 'fill':
        const fillLocator = this.getLocator(step.qaId!, step);
        await fillLocator.fill(step.value!, { timeout: 10000 });
        break;

      case 'expectVisible':
        const visibleLocator = this.getLocator(step.qaId!, step);
        await visibleLocator.waitFor({ state: 'visible', timeout: 10000 });
        break;

      case 'withinContainer':
        if (step.steps) {
          const containerLocator = this.getLocator(step.containerQaId!, step);
          await this.executeStepsWithinContainer(step.steps, containerLocator);
        }
        break;

      case 'withinFrame':
        if (step.steps) {
          await this.executeStepsWithinFrame(step.steps, step.frameChain!);
        }
        break;

      default:
        throw new Error(`Unknown operation: ${step.op}`);
    }

    // Small delay between steps
    await this.page.waitForTimeout(500);
  }

  private getLocator(qaId: string, step: TestStep): Locator {
    if (!this.page) throw new Error('Page not initialized');

    let locator = this.page.locator(`[data-qa-id="${qaId}"]`);

    // Apply container scoping if present
    if (step.containerQaId) {
      const container = this.page.locator(
        `[data-qa-id="${step.containerQaId}"]`
      );
      locator = container.locator(`[data-qa-id="${qaId}"]`);
    }

    return locator;
  }

  private async executeStepsWithinContainer(
    steps: TestStep[],
    containerLocator: Locator
  ): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');

    // Wait for container to be visible
    await containerLocator.waitFor({ state: 'visible', timeout: 10000 });

    for (const step of steps) {
      if (step.op === 'goto') {
        // Goto operations don't need container scoping
        await this.executeStep(step, '');
      } else {
        // Execute step within container
        const locator = containerLocator.locator(`[data-qa-id="${step.qaId}"]`);

        switch (step.op) {
          case 'click':
            await locator.click({ timeout: 10000 });
            break;
          case 'fill':
            await locator.fill(step.value!, { timeout: 10000 });
            break;
          case 'expectVisible':
            await locator.waitFor({ state: 'visible', timeout: 10000 });
            break;
        }
      }
    }
  }

  private async executeStepsWithinFrame(
    steps: TestStep[],
    frameChain: string[]
  ): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');

    // For now, just execute steps normally
    // Frame handling would require more complex logic
    for (const step of steps) {
      await this.executeStep(step, '');
    }
  }

  private async cleanup(): Promise<void> {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }

    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export async function runSpec(spec: TestSpec): Promise<RunResult> {
  const runner = new QARunner();
  return await runner.runSpec(spec);
}
