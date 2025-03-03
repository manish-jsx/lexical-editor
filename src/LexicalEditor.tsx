import React from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import EditorToolbar from './EditorToolbar';

export interface LexicalEditorProps {
  /**
   * Initial editor state as a JSON string
   */
  initialState?: string;
  /**
   * Placeholder text when editor is empty
   */
  placeholder?: string;
  /**
   * Additional editor configuration
   */
  editorConfig?: Record<string, any>;
  /**
   * Callback when editor state changes
   */
  onChange?: (editorState: any, editor: any) => void;
  /**
   * CSS class for the editor container
   */
  className?: string;
  /**
   * Children elements (plugins, etc.)
   */
  children?: React.ReactNode;
}

const defaultEditorConfig = {
  namespace: 'lexical-editor',
  theme: {
    root: 'editor-root',
    link: 'editor-link',
    text: {
      bold: 'editor-text-bold',
      italic: 'editor-text-italic',
      underline: 'editor-text-underline',
      code: 'editor-text-code',
    },
  },
  onError: (error: any) => {
    console.error('Lexical Editor error:', error);
  },
};

const LexicalEditor: React.FC<LexicalEditorProps> = ({
  initialState,
  placeholder = 'Enter some text...',
  editorConfig = {},
  onChange,
  className = '',
  children,
}) => {
  // Create a merged config object with proper types
  const config = {
    ...defaultEditorConfig,
    ...editorConfig,
  };

  // Create the final config with proper initialization
  const finalConfig: any = {
    ...config,
  };

  // If initialState is provided, add it to the config
  if (initialState) {
    finalConfig.editorState = initialState;
  }

  return (
    <div className={`lexical-editor-container ${className}`}>
      <LexicalComposer initialConfig={finalConfig}>
        <div className="editor-inner">
          <EditorToolbar />
          <div className="editor-content">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
              placeholder={<div className="editor-placeholder">{placeholder}</div>}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            {children}
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
};

export default LexicalEditor;
