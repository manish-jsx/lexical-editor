'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the BrowserSafeEditor with SSR disabled
const EditorComponent = dynamic(
  () => import('lexical-editor-easy').then((mod) => mod.BrowserSafeEditor),
  { ssr: false }
);

export default function ClientEditor({ initialContent, onSave, ...props }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageUpload = async (file) => {
    // Example client-side image upload implementation
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      return data.url; // Return the image URL for the editor
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    }
  };

  if (!mounted) {
    return <div>Loading editor...</div>;
  }

  return (
    <EditorComponent
      initialContent={initialContent}
      onSave={onSave}
      onImageUpload={handleImageUpload}
      {...props}
    />
  );
}
