'use client';

import { useEffect } from 'react';
import { streamWeb, nodePolyfills } from '../utils/browserPolyfills';

/**
 * NodeModulePolyfill - Provides browser polyfills for Node.js modules
 * Wrap your component with this to provide polyfills for Node.js modules in browser environments
 */
export function NodeModulePolyfill({ children }) {
  useEffect(() => {
    // Apply polyfills when component mounts
    if (typeof window !== 'undefined') {
      // Stream/web polyfill
      if (!window.streamWeb) {
        window.streamWeb = streamWeb;
      }

      // Other polyfills as needed
      if (!window.Buffer) {
        window.Buffer = nodePolyfills.buffer.Buffer;
      }
    }

    // Clean up polyfills when component unmounts
    return () => {
      if (typeof window !== 'undefined') {
        if (window.streamWeb) {
          delete window.streamWeb;
        }
        if (window.Buffer) {
          delete window.Buffer;
        }
      }
    };
  }, []);

  return children;
}

// Export as default for dynamic imports
export default NodeModulePolyfill;
