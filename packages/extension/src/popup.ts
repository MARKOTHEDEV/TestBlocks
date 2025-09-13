import { ExtensionMessage } from '@qa-builder/shared';

class PopupController {
  private statusEl: HTMLElement;
  private pickButton: HTMLButtonElement;
  private isPicking = false;

  constructor() {
    this.statusEl = document.getElementById('status')!;
    this.pickButton = document.getElementById('pickButton') as HTMLButtonElement;
    
    this.pickButton.addEventListener('click', this.handlePickClick);
    this.setupMessageListener();
  }

  private handlePickClick = async (): Promise<void> => {
    if (this.isPicking) {
      await this.stopPicking();
    } else {
      await this.startPicking();
    }
  };

  private async startPicking(): Promise<void> {
    try {
      this.isPicking = true;
      this.updateStatus('picking', 'Click an element on the page...');
      this.pickButton.textContent = 'Stop Picking';
      this.pickButton.disabled = true;

      // Send message to content script
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.id) {
        await chrome.tabs.sendMessage(tab.id, { type: 'pick-start' });
      }
    } catch (error) {
      this.updateStatus('error', 'Failed to start picking');
      this.resetButton();
    }
  }

  private async stopPicking(): Promise<void> {
    try {
      this.isPicking = false;
      this.updateStatus('idle', 'Ready to pick elements');
      this.resetButton();

      // Send message to content script
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.id) {
        await chrome.tabs.sendMessage(tab.id, { type: 'pick-stop' });
      }
    } catch (error) {
      this.updateStatus('error', 'Failed to stop picking');
    }
  }

  private resetButton(): void {
    this.pickButton.textContent = 'Pick Element';
    this.pickButton.disabled = false;
  }

  private updateStatus(type: string, message: string): void {
    this.statusEl.className = `status ${type}`;
    this.statusEl.textContent = message;
  }

  private setupMessageListener(): void {
    chrome.runtime.onMessage.addListener((message: ExtensionMessage) => {
      if (message.type === 'ELEMENT_PICKED') {
        this.isPicking = false;
        this.updateStatus('success', 'Element picked successfully!');
        this.resetButton();
        
        // Auto-close after success
        setTimeout(() => {
          window.close();
        }, 1000);
      }
    });
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});
