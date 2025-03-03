# Next.js Compatibility Guide

When using lexical-editor-easy with Next.js, you may encounter errors related to Node.js built-in modules that aren't available in browser environments. This guide provides solutions for common issues.

## Common Errors with Node.js Modules

You might encounter errors like:
- "Module not found: Can't resolve 'net'"
- "Module not found: Can't resolve 'stream/web'"
- "Module not found: Can't resolve 'fs'"

These errors occur because the package depends on certain Node.js built-in modules that aren't available in browser environments.

### Solution 1: Configure Next.js to handle Node.js modules

Update your `next.config.js` file to provide empty implementations for Node.js built-in modules:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve Node.js built-in modules on the client
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        http2: false,
        '@neondatabase/serverless': false,
        perf_hooks: false,
        // Add stream-related modules
        'stream': false,
        'stream/web': false,
        'util': false, 
        'buffer': false,
        'crypto': false
      };
    }
    return config;
  },
  transpilePackages: ['lexical-editor-easy'],
};

module.exports = nextConfig;
```

### Solution 2: Use the BrowserSafeEditor Component

Instead of using NextEditor directly, use our BrowserSafeEditor component which is designed to work in browser environments without Node.js dependencies:

```jsx
// ClientOnlyEditor.jsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the BrowserSafeEditor with SSR disabled
const EditorComponent = dynamic(
  () => import('lexical-editor-easy').then((mod) => mod.BrowserSafeEditor),
  { ssr: false }
);

export default function ClientOnlyEditor(props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only render the editor component on the client side
  if (!isMounted) {
    return <div>Loading editor...</div>;
  }

  // Handle image uploads through your own API
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    return data.url; // Return the uploaded image URL
  };

  return <EditorComponent {...props} onImageUpload={handleImageUpload} />;
}
```

### Solution 3: Use separate client and server components

Split your editor implementation into client and server parts:

1. Client component - handles UI and editing
2. Server component - handles database operations

Example server API route:

```jsx
// app/api/editor/save/route.js - Server-side code
import { createNeonClient } from 'lexical-editor-easy';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { id, content } = await request.json();
  const neonClient = createNeonClient();
  const result = await neonClient.saveEditorContent(id, content);
  
  return NextResponse.json({ success: true, data: result });
}
```

Example client component:

```jsx
// Client-side component
'use client';

import { BrowserSafeEditor } from 'lexical-editor-easy';

export default function EditorComponent() {
  const handleSave = async (content) => {
    const response = await fetch('/api/editor/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'doc-id', content })
    });
    return await response.json();
  };

  return (
    <BrowserSafeEditor
      editorId="my-editor"
      onSave={handleSave}
      onImageUpload={/* your image upload logic */}
    />
  );
}
```

## Last Resort: Disable SSR for the Entire Page

If you're still experiencing issues, you can disable SSR for the entire page containing the editor:

```jsx
// pages/editor.js (Pages Router)
import dynamic from 'next/dynamic';

const EditorPage = dynamic(
  () => import('../components/EditorPage'),
  { ssr: false }
);

export default EditorPage;
```

For more information, see the [Next.js documentation](https://nextjs.org/docs/app/building-your-application/rendering).
