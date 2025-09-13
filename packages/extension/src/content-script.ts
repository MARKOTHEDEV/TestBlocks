import { ExtensionMessage, ElementPickedMessage } from '@qa-builder/shared';

class ContentScript {
  private isPicking = false;
  private sdkInjected = false;

  constructor() {
    this.setupMessageListener();
    this.injectSDK();
  }

  private async injectSDK(): Promise<void> {
    if (this.sdkInjected) return;

    try {
      // Check if SDK is already present
      if (window.__QATagger) {
        this.sdkInjected = true;
        return;
      }

      // Inject the SDK script
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('qa-tagger.v1.js');
      script.onload = () => {
        this.sdkInjected = true;
      };
      script.onerror = () => {
        console.error('Failed to load QA Tagger SDK');
      };

      (document.head || document.documentElement).appendChild(script);
    } catch (error) {
      console.error('Error injecting SDK:', error);
    }
  }

  private setupMessageListener(): void {
    // Listen for messages from popup/background
    chrome.runtime.onMessage.addListener(
      (message: ExtensionMessage, sender, sendResponse) => {
        switch (message.type) {
          case 'pick-start':
            this.startPicking();
            break;
          case 'pick-stop':
            this.stopPicking();
            break;
        }
      }
    );

    // Listen for messages from the page (SDK)
    window.addEventListener('message', (event) => {
      if (event.data?.__qa === true && event.data.type === 'ELEMENT_PICKED') {
        this.handleElementPicked(event.data as ElementPickedMessage);
      }
    });
  }

  private startPicking(): void {
    if (this.isPicking) return;

    this.isPicking = true;

    // Send message to page to start picking
    window.postMessage(
      {
        __qa: true,
        type: 'START_PICK',
      },
      '*'
    );
  }

  private stopPicking(): void {
    if (!this.isPicking) return;

    this.isPicking = false;

    // Send message to page to stop picking
    window.postMessage(
      {
        __qa: true,
        type: 'STOP_PICK',
      },
      '*'
    );
  }

  private handleElementPicked(message: ElementPickedMessage): void {
    if (!this.isPicking) return;

    this.isPicking = false;

    // Forward to background script
    chrome.runtime.sendMessage({
      type: 'ELEMENT_PICKED',
      payload: message,
    });
  }
}

// Initialize content script
new ContentScript();
