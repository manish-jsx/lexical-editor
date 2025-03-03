import React from 'react';
import { LexicalEditor } from '../index';
import { NeonPersistencePlugin } from './components/NeonPersistencePlugin';
import { BlobImageUploader } from './components/BlobImageUploader';

export default function SimpleEditorExample() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Lexical Editor with Vercel Blob and Neon.tech</h1>

      <div style={{ marginBottom: '10px' }}>
        <BlobImageUploader buttonText="Insert Image" />
      </div>

      <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
        <LexicalEditor>
          <NeonPersistencePlugin
            connectionString={process.env.NEON_DATABASE_URL || ''}
            contentId="example-document"
            title="Example Document"
            onSave={(id) => console.log('Saved document:', id)}
          />
        </LexicalEditor>
      </div>
    </div>
  );
}
