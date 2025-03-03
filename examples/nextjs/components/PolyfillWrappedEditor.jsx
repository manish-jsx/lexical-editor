'use client';

import dynamic from 'next/dynamic';

// Import NodeModulePolyfill component
const NodeModulePolyfill = dynamic(
  () => import('lexical-editor-easy').then(mod => mod.NodeModulePolyfill),
  { ssr: false }
);

// Import BrowserSafeEditor with SSR disabled
const EditorComponent = dynamic(
  () => import('lexical-editor-easy').then(mod => mod.BrowserSafeEditor),
  { ssr: false }
);

export default function PolyfillWrappedEditor(props) {
  const handleImageUpload = async (file) => {
    // Handle image upload logic here
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    return data.url;
  };

  return (
    <NodeModulePolyfill>
      <EditorComponent
        onImageUpload={handleImageUpload}
        {...props}
      />
    </NodeModulePolyfill>
  );
}
