# Lexical Editor Easy

A customizable Lexical editor component with Next.js, Vercel Blob and Neon.tech PostgreSQL support.

## Features

- ✅ Works with React and Next.js projects (v13+)
- ✅ Built-in Vercel Blob storage integration for images
- ✅ Neon PostgreSQL database support for content persistence
- ✅ Customizable toolbar with rich text formatting options
- ✅ Server and client components support for Next.js
- ✅ Security audited dependencies

## Installation

```bash
npm install lexical-editor-easy
# or
yarn add lexical-editor-easy
```

## Environment Variables

Create a `.env.local` file (Next.js) or `.env` file (React) with the following variables:

```
# Vercel Blob Storage Configuration
BLOB_READ_WRITE_TOKEN=your_token_here
NEXT_PUBLIC_BLOB_BASE_URL=your_blob_base_url

# Neon Database Configuration
NEON_DATABASE_URL=postgres://user:password@host/database

# Editor Configuration
NEXT_PUBLIC_EDITOR_SAVE_INTERVAL=2000
```

## Usage with Next.js

### Client Component Example

```jsx
'use client';

import { NextEditor } from 'lexical-editor-easy';

export default function EditorPage() {
  const handleSave = async (content) => {
    const response = await fetch('/api/editor/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        id: 'my-document-id', 
        content 
      }),
    });
    
    return response.json();
  };

  return (
    <div className="editor-container">
      <h1>My Rich Text Editor</h1>
      <NextEditor
        editorId="my-document-id"
        onSave={handleSave}
        toolbarOptions={{
          blockType: true,
          align: true,
          fontSize: true,
          fontColor: true,
          highlights: true,
          image: true
        }}
      />
    </div>
  );
}
```

### API Route for Saving Content

```js
// app/api/editor/save/route.js
import { createNeonClient } from 'lexical-editor-easy';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { id, content } = await request.json();
  const neonClient = createNeonClient();
  
  await neonClient.initializeEditorTable();
  const result = await neonClient.saveEditorContent(id, content);
  
  return NextResponse.json({
    success: true,
    id: result[0].id,
    updatedAt: result[0].updated_at
  });
}
```

### API Route for Blob Image Upload

```js
// app/api/upload/route.js
import { BlobStorageClient } from 'lexical-editor-easy';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    const blobClient = new BlobStorageClient();
    const result = await blobClient.uploadImage(file);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
```

## Configuration Options

### NextEditor Props

| Prop | Type | Description |
|------|------|-------------|
| `editorId` | string | Unique identifier for this editor instance |
| `initialContent` | object | Initial editor content state |
| `onSave` | function | Callback for saving content (receives content object) |
| `blobToken` | string | Optional token for client-side Blob uploads |
| `editable` | boolean | Whether the editor is editable |
| `toolbarOptions` | object | Configuration for which toolbar items to display |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
