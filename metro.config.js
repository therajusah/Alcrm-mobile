const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Configure resolver to handle global variables
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add global polyfills
config.resolver.alias = {
  ...config.resolver.alias,
};

// Optimize bundle for production
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    ...config.transformer.minifierConfig,
    keep_fnames: false, // Allow name mangling for smaller bundle
    mangle: {
      keep_fnames: false,
      toplevel: true, // Mangle top-level names
    },
    compress: {
      ...config.transformer.minifierConfig?.compress,
      warnings: false,
      drop_console: true, // Remove console.log statements
      drop_debugger: true, // Remove debugger statements
      pure_funcs: ['console.log', 'console.info', 'console.debug'], // Remove specific functions
      passes: 3, // Multiple compression passes
    },
  },
};

// Configure reporter to suppress specific warnings
config.reporter = {
  update: (event) => {
    if (event.type === 'log') {
      const msg = String(event.data?.message || '');
      
      // List of warnings to suppress
      const suppressPatterns = [
        'warning: the variable "SharedArrayBuffer" was not declared',
        'warning: the variable "DebuggerInternal" was not declared',
        'warning: the variable "setTimeout" was not declared',
        'warning: the variable "clearTimeout" was not declared',
        'warning: the variable "setImmediate" was not declared',
        'warning: the variable "queueMicrotask" was not declared',
        'warning: the variable "__REACT_DEVTOOLS_GLOBAL_HOOK__" was not declared',
        'warning: the variable "nativeFabricUIManager" was not declared',
        'warning: the variable "RN$enableMicrotasksInReact" was not declared',
        'warning: the variable "fetch" was not declared',
        'warning: the variable "Headers" was not declared',
        'warning: the variable "Request" was not declared',
        'warning: the variable "Response" was not declared',
        'warning: the variable "FileReader" was not declared',
        'warning: the variable "URLSearchParams" was not declared',
        'warning: the variable "AbortController" was not declared',
        'warning: the variable "XMLHttpRequest" was not declared',
        'warning: the variable "self" was not declared',
        'warning: the variable "navigator" was not declared',
        'warning: the variable "MessageChannel" was not declared',
        'warning: the variable "nativeRuntimeScheduler" was not declared',
        'warning: the variable "requestAnimationFrame" was not declared',
        'warning: the variable "_WORKLET" was not declared',
        'warning: the variable "location" was not declared',
        'warning: the variable "__reanimatedLoggerConfig" was not declared',
        'warning: the variable "_toString" was not declared',
        'warning: the variable "structuredClone" was not declared',
        'warning: the variable "document" was not declared',
        'warning: the variable "HTMLElement" was not declared',
        'warning: the variable "MutationObserver" was not declared',
        'warning: the variable "getComputedStyle" was not declared',
        'warning: the variable "jest" was not declared',
        'warning: the variable "_getAnimationTimestamp" was not declared',
        'warning: the variable "Buffer" was not declared',
        'Direct call to eval()',
      ];
      
      // Check if message contains any suppressed patterns
      if (suppressPatterns.some(pattern => msg.includes(pattern))) {
        return; // Suppress this warning
      }
    }
    
    // Default behavior for other events
    if (config.reporter?.update) {
      config.reporter.update(event);
    }
  },
};

module.exports = config;
