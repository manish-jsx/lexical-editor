'use client';

import React, { useEffect, useState } from 'react';
import { LexicalEditor } from '../LexicalEditor';
import { useLexical } from '../hooks/useLexical';

/**
 * NextEditor - A Next.js optimized version of the LexicalEditor
 */
export function NextEditor({
  editorId,
  initialContent,
  onSave,
  blobToken,
  editable = true,
  toolbarOptions = {},
  ...props
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle hydration issues by only rendering when client-side
  if (!isMounted) {
    return <div className="editor-placeholder">Loading editor...</div>;
  }

  return (
    <LexicalEditor
      editorId={editorId}
      initialContent={initialContent}
      onSave={onSave}
      blobToken={blobToken}
      editable={editable}
      toolbarOptions={toolbarOptions}
      {...props}
    />
  );
}

// Re-export the hook for easier imports
export { useLexical };
