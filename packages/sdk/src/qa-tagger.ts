import { QATaggerAPI, ElementPickedMessage } from '@qa-builder/shared';

class QATagger implements QATaggerAPI {
  private isPicking = false;
  private overlay: HTMLElement | null = null;
  private currentElement: Element | null = null;

  constructor() {
    this.setupMessageListener();
    this.autoGenerateIds();
  }

  start(): void {
    if (this.isPicking) return;
    this.isPicking = true;
    this.createOverlay();
    this.addEventListeners();
  }

  stop(): void {
    if (!this.isPicking) return;
    this.isPicking = false;
    this.removeOverlay();
    this.removeEventListeners();
  }

  ensureQaId(element: Element): string {
    // Check for existing test IDs
    const existingId =
      element.getAttribute('data-testid') ||
      element.getAttribute('data-test') ||
      element.getAttribute('data-qa');

    if (existingId) {
      element.setAttribute('data-qa-id', existingId);
      return existingId;
    }

    // Generate new stable ID
    const qaId = this.generateStableId(element);
    element.setAttribute('data-qa-id', qaId);
    return qaId;
  }

  private autoGenerateIds(): void {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () =>
        this.generateIdsForInteractiveElements()
      );
    } else {
      this.generateIdsForInteractiveElements();
    }

    // Also generate IDs when new elements are added (throttled for performance)
    let sdkUpdateTimeout: number | null = null;
    const observer = new MutationObserver((mutations) => {
      // Throttle to avoid excessive processing
      if (sdkUpdateTimeout) return;

      sdkUpdateTimeout = window.setTimeout(() => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              // Element node
              this.ensureQaIdForElement(node as Element);
            }
          });
        });
        sdkUpdateTimeout = null;
      }, 200); // Throttle to max once per 200ms
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private generateIdsForInteractiveElements(): void {
    // Generate IDs for interactive elements
    const interactiveSelectors = [
      'input',
      'button',
      'select',
      'textarea',
      'a[href]',
      '[onclick]',
      '[role="button"]',
      '[role="link"]',
      '[tabindex]',
    ];

    interactiveSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        this.ensureQaIdForElement(element);
      });
    });
  }

  private ensureQaIdForElement(element: Element): void {
    // Only generate ID if element doesn't already have one
    if (!element.getAttribute('data-qa-id')) {
      this.ensureQaId(element);
    }
  }

  private setupMessageListener(): void {
    window.addEventListener('message', (event) => {
      if (event.data?.__qa === true) {
        switch (event.data.type) {
          case 'START_PICK':
            this.start();
            break;
          case 'STOP_PICK':
            this.stop();
            break;
        }
      }
    });
  }

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

  private removeOverlay(): void {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
  }

  private addEventListeners(): void {
    document.addEventListener('mouseover', this.handleMouseOver);
    document.addEventListener('mouseout', this.handleMouseOut);
    document.addEventListener('click', this.handleClick, true);
  }

  private removeEventListeners(): void {
    document.removeEventListener('mouseover', this.handleMouseOver);
    document.removeEventListener('mouseout', this.handleMouseOut);
    document.removeEventListener('click', this.handleClick, true);
  }

  private handleMouseOver = (event: MouseEvent): void => {
    if (!this.isPicking || !this.overlay) return;

    const element = event.target as Element;
    if (this.isValidTarget(element)) {
      this.currentElement = element;
      this.highlightElement(element);
    }
  };

  private handleMouseOut = (): void => {
    if (this.overlay) {
      this.overlay.style.display = 'none';
    }
    this.currentElement = null;
  };

  private handleClick = (event: MouseEvent): void => {
    if (!this.isPicking || !this.currentElement) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const qaId = this.ensureQaId(this.currentElement);
    const role = this.inferRole(this.currentElement);
    const name = this.getAccessibleName(this.currentElement);
    const frameChain = this.getFrameChain(this.currentElement);

    const message: ElementPickedMessage = {
      __qa: true,
      type: 'ELEMENT_PICKED',
      qaId,
      role,
      name,
      frameChain,
    };

    window.postMessage(message, '*');
    this.stop();
  };

  private isValidTarget(element: Element): boolean {
    // Skip script, style, and other non-interactive elements
    const tagName = element.tagName.toLowerCase();
    const skipTags = ['script', 'style', 'meta', 'link', 'title', 'head'];

    if (skipTags.includes(tagName)) return false;

    // Skip elements that are not visible
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;

    return true;
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

  private buildSemanticSignature(element: Element): string {
    const tag = element.tagName.toLowerCase();
    const role = this.inferRole(element);
    const name = this.getAccessibleName(element);
    const inputType = (element as HTMLInputElement).type || '';
    const href = (element as HTMLAnchorElement).href
      ? new URL((element as HTMLAnchorElement).href).pathname
      : '';
    const parentHint = this.getParentHint(element);
    const siblingOrdinal = this.getSiblingOrdinal(element);

    // Add more stable identifiers
    const id = element.id || '';
    const className = element.className || '';
    const textContent = element.textContent?.trim().substring(0, 30) || '';

    return JSON.stringify({
      tag,
      role,
      name: name?.substring(0, 50), // Limit name length
      inputType,
      href: href.substring(0, 100), // Limit href length
      parentHint,
      siblingOrdinal,
      id, // Add ID for stability
      className: className.substring(0, 50), // Add class for stability
      textContent, // Add text content for stability
    });
  }

  private inferRole(element: Element): string | undefined {
    // Check explicit ARIA role
    const ariaRole = element.getAttribute('role');
    if (ariaRole) return ariaRole;

    // Check semantic HTML elements
    const tagName = element.tagName.toLowerCase();
    const semanticRoles: Record<string, string> = {
      button: 'button',
      a: 'link',
      input: 'textbox',
      textarea: 'textbox',
      select: 'combobox',
      img: 'img',
      h1: 'heading',
      h2: 'heading',
      h3: 'heading',
      h4: 'heading',
      h5: 'heading',
      h6: 'heading',
    };

    if (semanticRoles[tagName]) {
      return semanticRoles[tagName];
    }

    // Check input types
    if (tagName === 'input') {
      const type = (element as HTMLInputElement).type;
      const inputRoles: Record<string, string> = {
        button: 'button',
        submit: 'button',
        reset: 'button',
        checkbox: 'checkbox',
        radio: 'radio',
        email: 'textbox',
        password: 'textbox',
        text: 'textbox',
        search: 'searchbox',
      };
      return inputRoles[type] || 'textbox';
    }

    return undefined;
  }

  private getAccessibleName(element: Element): string | undefined {
    // Check aria-label
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel.trim();

    // Check aria-labelledby
    const ariaLabelledBy = element.getAttribute('aria-labelledby');
    if (ariaLabelledBy) {
      const labelElement = document.getElementById(ariaLabelledBy);
      if (labelElement) return labelElement.textContent?.trim();
    }

    // Check placeholder
    const placeholder = (element as HTMLInputElement).placeholder;
    if (placeholder) return placeholder.trim();

    // Check alt text for images
    const alt = (element as HTMLImageElement).alt;
    if (alt) return alt.trim();

    // Check text content for buttons and links
    const tagName = element.tagName.toLowerCase();
    if (['button', 'a'].includes(tagName)) {
      return element.textContent?.trim();
    }

    // Check label association
    if (element.id) {
      const label = document.querySelector(`label[for="${element.id}"]`);
      if (label) return label.textContent?.trim();
    }

    return undefined;
  }

  private getHint(element: Element): string {
    // Try to get a meaningful hint from the element
    const name = this.getAccessibleName(element);
    if (name) {
      return name
        .substring(0, 12)
        .replace(/[^a-zA-Z0-9]/g, '')
        .toLowerCase();
    }

    const id = element.id;
    if (id) {
      return id
        .substring(0, 12)
        .replace(/[^a-zA-Z0-9]/g, '')
        .toLowerCase();
    }

    const placeholder = (element as HTMLInputElement).placeholder;
    if (placeholder) {
      return placeholder
        .substring(0, 12)
        .replace(/[^a-zA-Z0-9]/g, '')
        .toLowerCase();
    }

    const tagName = element.tagName.toLowerCase();
    return tagName;
  }

  private getParentHint(element: Element): string {
    let parent = element.parentElement;
    let depth = 0;

    while (parent && depth < 3) {
      const id = parent.id;
      if (id) return id;

      const classes = Array.from(parent.classList)
        .filter((cls) => !cls.includes('hash') && cls.length < 20)
        .slice(0, 2);

      if (classes.length > 0) {
        return classes.join('-');
      }

      parent = parent.parentElement;
      depth++;
    }

    return '';
  }

  private getSiblingOrdinal(element: Element): number {
    const parent = element.parentElement;
    if (!parent) return 0;

    const siblings = Array.from(parent.children);
    const sameTagSiblings = siblings.filter(
      (sibling) => sibling.tagName === element.tagName
    );

    return sameTagSiblings.indexOf(element);
  }

  private getFrameChain(element: Element): string[] {
    const chain: string[] = [];
    let current = element;

    // Check for shadow DOM
    while (current) {
      const shadowRoot = current.getRootNode();
      if (shadowRoot instanceof ShadowRoot) {
        const host = shadowRoot.host;
        chain.unshift(host.tagName.toLowerCase());
        current = host;
      } else {
        break;
      }
    }

    return chain;
  }

  private sha256(str: string): string {
    // Simple hash function for demo - in production, use crypto.subtle
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }
}

// Initialize and expose the API
const qaTagger = new QATagger();
window.__QATagger = qaTagger;
