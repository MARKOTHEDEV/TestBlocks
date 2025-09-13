import { ExtensionMessage, ElementPickedMessage } from '@qa-builder/shared';

class BackgroundService {
  private elementQueue: ElementPickedMessage[] = [];

  constructor() {
    this.setupMessageListener();
  }

  private setupMessageListener(): void {
    chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender, sendResponse) => {
      switch (message.type) {
        case 'ELEMENT_PICKED':
          this.handleElementPicked(message.payload!);
          break;
      }
    });

    // Listen for messages from builder app
    chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
      if (message.type === 'GET_PICKED_ELEMENT') {
        const element = this.elementQueue.shift();
        sendResponse(element || null);
      }
    });
  }

  private handleElementPicked(payload: ElementPickedMessage): void {
    // Store in queue for builder app to retrieve
    this.elementQueue.push(payload);

    // Notify all tabs (including builder app if open)
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            type: 'ELEMENT_PICKED',
            payload
          }).catch(() => {
            // Ignore errors for tabs that don't have content scripts
          });
        }
      });
    });
  }
}

// Initialize background service
new BackgroundService();
