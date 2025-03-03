'use client';

import React, { useEffect, useState } from 'react';
import { LexicalEditor } from '../LexicalEditor';
// Import browser polyfills
import { streamWeb, nodePolyfills } from '../utils/browserPolyfills';

// Make polyfills available globally if needed
if (typeof window !== 'undefined') {
  window.streamWeb = streamWeb;
}

/**
 * BrowserSafeEditor - A browser-safe version of LexicalEditor that avoids Node.js module imports
 * This component should be used in browser-only contexts like client components in Next.js
 */
export function BrowserSafeEditor({
  editorId,
  initialContent,
  onSave,
  onImageUpload,  // Required prop for handling image uploads in the browser
  blobToken,
  editable = true,
  toolbarOptions = {},
  ...props
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Clean up any polyfill globals when component unmounts
    return () => {
      if (typeof window !== 'undefined' && window.streamWeb) {
        delete window.streamWeb;
      }
    };
  }, []);

  // Handle hydration issues by only rendering when client-side
  if (!isMounted) {
    return <div className="editor-placeholder">Loading editor...</div>;
  }

  // This component avoids using any direct Node.js dependencies like 'net'
  return (
    <LexicalEditor
      editorId={editorId}
      initialContent={initialContent}
      onSave={onSave}
      onImageUpload={onImageUpload} // Use custom image handler instead of built-in Blob
      editable={editable}
      toolbarOptions={toolbarOptions}
      useServerFeatures={false} // Disable server-dependent features
      browserPolyfills={nodePolyfills} // Pass browser polyfills to editor
      {...props}
    />
  );
}
