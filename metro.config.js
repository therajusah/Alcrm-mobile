const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Suppress noisy hermes/polyfill warnings in bundle logs
config.reporter = {
  update: event => {
    if (event.type === 'log') {
      const msg = String(event.data?.message || '');
      const suppress = [
        'SharedArrayBuffer',
        'DebuggerInternal',
        'setTimeout',
        'clearTimeout',
        'setImmediate',
        'queueMicrotask',
        '__REACT_DEVTOOLS_GLOBAL_HOOK__',
        'XMLHttpRequest',
        'FileReader',
        'URLSearchParams',
        'AbortController',
        'MessageChannel',
        'requestAnimationFrame',
        'structuredClone',
        'HTMLElement',
        'MutationObserver',
        'getComputedStyle',
        'Buffer',
      ];
      if (suppress.some(token => msg.includes(token))) {
        return; // drop log line
      }
    }
    // default behavior
    if (config.reporter?.update) {
      config.reporter.update(event);
    }
  },
};

module.exports = config;
