/**
 * Browser polyfills for Node.js modules
 * This provides empty implementations or minimal browser-compatible versions of Node.js modules
 */

// Stream/web polyfill (minimal implementation)
export const streamWeb = {
  ReadableStream: typeof ReadableStream !== 'undefined' ? ReadableStream : class MockReadableStream {
    constructor() {
      console.warn('Using mock ReadableStream implementation');
    }
    getReader() {
      return {
        read: async () => ({ done: true, value: undefined }),
        releaseLock: () => {}
      };
    }
  },
  WritableStream: typeof WritableStream !== 'undefined' ? WritableStream : class MockWritableStream {
    constructor() {
      console.warn('Using mock WritableStream implementation');
    }
    getWriter() {
      return {
        write: async () => {},
        close: async () => {},
        abort: async () => {},
        releaseLock: () => {}
      };
    }
  },
  TransformStream: typeof TransformStream !== 'undefined' ? TransformStream : class MockTransformStream {
    constructor() {
      console.warn('Using mock TransformStream implementation');
      this.readable = new streamWeb.ReadableStream();
      this.writable = new streamWeb.WritableStream();
    }
  }
};

// Export other polyfills as needed
export const nodePolyfills = {
  stream: { 
    Readable: class MockReadable {
      constructor() {}
      pipe() { return this; }
      on() { return this; }
      once() { return this; }
    }
  },
  buffer: {
    Buffer: {
      from: (data) => typeof data === 'string' ? new TextEncoder().encode(data) : data,
      isBuffer: () => false
    }
  }
};
