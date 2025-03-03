# Lexical Editor

A customizable, reusable React component built on top of Meta's Lexical editor framework, with Vercel Blob Storage and Neon.tech PostgreSQL integration.

## Installation

```bash
npm install lexical-editor-easy
# or
yarn add lexical-editor-easy
```

## Usage

```jsx
import React from 'react';
import { LexicalEditor, EditorToolbar } from 'lexical-editor-easy';

function MyComponent() {
  return (
    <div>
      <h1>My Editor</h1>
      <LexicalEditor 
        placeholder="Enter some text..."
        onChange={(editorState) => console.log(editorState)}
      />
    </div>
  );
}

export default MyComponent;
```

## Features

- Rich text editing capabilities
- Customizable toolbar
- Support for plugins
- Markdown support
- Vercel Blob Storage integration for images
- Neon.tech PostgreSQL integration for content persistence
- And more!

## Vercel Blob Storage Integration

Upload images directly to Vercel Blob storage:

```jsx
import { BlobImageUploader } from 'lexical-editor-easy';

function MyEditor() {
  return (
    <div>
      <EditorToolbar>
        {/* ...other toolbar items */}
        <BlobImageUploader buttonText="Add Image" />
      </EditorToolbar>
      <LexicalEditor />
    </div>
  );
}
```

For API routes, create a file at `/api/upload-blob.js`:

```js
import { put } from '@vercel/blob';

export default async function handler(request, response) {
  const blob = await put(request.query.filename, request.body, {
    access: 'public',
  });
  return response.status(200).json(blob);
}
```

## Neon.tech PostgreSQL Integration

Automatically save and load editor content with Neon.tech PostgreSQL:

```jsx
import { NeonPersistencePlugin } from 'lexical-editor-easy';

function MyEditor() {
  return (
    <div>
      <LexicalEditor>
        <NeonPersistencePlugin 
          connectionString={process.env.NEON_DATABASE_URL}
          contentId="my-document-id"
          title="My Document"
          onSave={(id) => console.log('Saved:', id)}
        />
      </LexicalEditor>
    </div>
  );
}
```

For more advanced usage with the Neon database service:

```jsx
import { initNeonDatabase } from 'lexical-editor-easy';

// Initialize the database service
const neonDb = initNeonDatabase({
  connectionString: process.env.NEON_DATABASE_URL,
  useWebsockets: true
});

// In your component
async function loadDocuments() {
  // Get list of saved documents
  const documents = await neonDb.listContent();
  
  // Load specific document
  const doc = await neonDb.loadContent('document-id');
  
  // Other operations available: saveContent, deleteContent
}
```

## API Reference

### LexicalEditor

Main editor component.

Props:
- `placeholder`: String to display when editor is empty
- `onChange`: Callback function that receives the current editor state
- `config`: Additional editor configuration options
- `plugins`: Array of plugins to enable

### EditorToolbar

Editor toolbar component for formatting.

Props:
- `editor`: Reference to the editor instance

### BlobImageUploader

Component for uploading images to Vercel Blob Storage.

Props:
- `buttonText`: Text to display on the upload button
- `className`: Optional CSS class name

### NeonPersistencePlugin

Plugin for automatic content persistence with Neon PostgreSQL.

Props:
- `connectionString`: Neon database connection string
- `contentId`: Optional unique ID for the content
- `title`: Optional title for the content
- `saveDelay`: Delay in ms before saving changes (default: 1000)
- `onSave`: Callback when content is saved
- `onLoad`: Callback when content is loaded
- `onError`: Callback when an error occurs

## License

MIT
