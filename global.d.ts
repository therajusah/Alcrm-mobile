// Global type definitions for React Native environment
declare global {
  // Web APIs that are polyfilled in React Native
  var SharedArrayBuffer: typeof SharedArrayBuffer | undefined;
  var DebuggerInternal: any;
  var setTimeout: typeof setTimeout;
  var clearTimeout: typeof clearTimeout;
  var setImmediate: typeof setImmediate;
  var queueMicrotask: typeof queueMicrotask;
  var __REACT_DEVTOOLS_GLOBAL_HOOK__: any;
  var nativeFabricUIManager: any;
  var RN$enableMicrotasksInReact: boolean;
  var RN$enableMicrotasksInReact: boolean;
  
  // Web APIs
  var fetch: typeof fetch;
  var Headers: typeof Headers;
  var Request: typeof Request;
  var Response: typeof Response;
  var FileReader: typeof FileReader;
  var URLSearchParams: typeof URLSearchParams;
  var AbortController: typeof AbortController;
  var XMLHttpRequest: typeof XMLHttpRequest;
  var self: any;
  var navigator: typeof navigator;
  var MessageChannel: typeof MessageChannel;
  var nativeRuntimeScheduler: any;
  var requestAnimationFrame: typeof requestAnimationFrame;
  var _WORKLET: boolean;
  var location: typeof location;
  var __reanimatedLoggerConfig: any;
  var _toString: (value: any) => string;
  var structuredClone: typeof structuredClone;
  var document: typeof document;
  var HTMLElement: typeof HTMLElement;
  var MutationObserver: typeof MutationObserver;
  var getComputedStyle: typeof getComputedStyle;
  var jest: any;
  var _getAnimationTimestamp: () => number;
  var Buffer: typeof Buffer;
}

export {};
