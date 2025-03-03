// Fix the import for LexicalErrorBoundary
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

// Make sure to export the useLexical hook
export { useLexical } from './hooks/useLexical';

// Export Next.js specific components
export { NextEditor } from './components/NextEditor';

// Export browser-safe components
export { BrowserSafeEditor } from './components/BrowserSafeEditor';
export { NodeModulePolyfill } from './components/NodeModulePolyfill';

// Export polyfills for direct usage
export { streamWeb, nodePolyfills } from './utils/browserPolyfills';

// Export database and blob utilities
export { createNeonClient } from './utils/neonClient';
export { BlobStorageClient } from './utils/blobClient';
export { getConfig } from './utils/config';

// Export isomorphic utilities
export { 
  debounce, 
  getEditorStateJSON, 
  parseEditorState 
} from './utils/editorHelpers';
