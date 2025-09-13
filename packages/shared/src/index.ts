// Message protocol between page SDK, extension, and builder
export interface QAMessage {
  __qa: true;
  type: string;
}

export interface StartPickMessage extends QAMessage {
  type: 'START_PICK';
}

export interface StopPickMessage extends QAMessage {
  type: 'STOP_PICK';
}

export interface ElementPickedMessage extends QAMessage {
  type: 'ELEMENT_PICKED';
  qaId: string;
  role?: string;
  name?: string;
  frameChain?: string[];
}

export type PageMessage = StartPickMessage | StopPickMessage | ElementPickedMessage;

// Extension message protocol
export interface ExtensionMessage {
  type: 'ELEMENT_PICKED' | 'pick-start' | 'pick-stop';
  payload?: ElementPickedMessage;
}

// Test specification types
export interface TestStep {
  op: 'goto' | 'click' | 'fill' | 'expectVisible' | 'withinContainer' | 'withinFrame';
  url?: string;
  qaId?: string;
  value?: string;
  containerQaId?: string;
  frameChain?: string[];
  steps?: TestStep[];
}

export interface TestSpec {
  name: string;
  baseUrl: string;
  steps: TestStep[];
}

export interface RunResult {
  success: boolean;
  error?: string;
  artifacts?: {
    screenshots: string[];
    video?: string;
    trace?: string;
  };
}

// SDK API types
export interface QATaggerAPI {
  start(): void;
  stop(): void;
  ensureQaId(element: Element): string;
}

declare global {
  interface Window {
    __QATagger?: QATaggerAPI;
  }
}
