import { useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $getRoot, $getSelection } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { initNeonDatabase } from '../../services/NeonDatabase';
import { debounce } from '../../utils/debounce';
import { v4 as uuidv4 } from 'uuid';

interface NeonPersistencePluginProps {
  /**
   * Neon database connection string
   */
  connectionString: string;
  /**
   * Unique ID for this content. If not provided, a new UUID will be generated
   */
  contentId?: string;
  /**
   * Optional title for the content
   */
  title?: string;
  /**
   * Delay in milliseconds to wait before saving changes
   * Default: 1000 (1 second)
   */
  saveDelay?: number;
  /**
   * Callback when content is saved successfully
   */
  onSave?: (contentId: string) => void;
  /**
   * Callback when content is loaded successfully
   */
  onLoad?: (contentId: string) => void;
  /**
   * Callback when an error occurs
   */
  onError?: (error: Error) => void;
}

export function NeonPersistencePlugin({
  connectionString,
  contentId: propContentId,
  title,
  saveDelay = 1000,
  onSave,
  onLoad,
  onError
}: NeonPersistencePluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!connectionString) {
      console.error('NeonPersistencePlugin: connectionString is required');
      return;
    }

    const contentId = propContentId || uuidv4();
    const neonDb = initNeonDatabase({
      connectionString,
      useWebsockets: true
    });

    // Setup tables if needed
    neonDb.setupTables().catch(error => {
      console.error('Failed to setup tables:', error);
      if (onError) onError(error as Error);
    });

    // Load initial content if contentId was provided
    if (propContentId) {
      neonDb.loadContent(propContentId).then(data => {
        if (data?.content) {
          editor.setEditorState(editor.parseEditorState(data.content));
          if (onLoad) onLoad(propContentId);
        }
      }).catch(error => {
        console.error('Failed to load content:', error);
        if (onError) onError(error as Error);
      });
    }

    // Save content on changes
    const saveContent = debounce(() => {
      editor.update(async () => {
        try {
          const editorState = editor.getEditorState();
          const jsonState = editorState.toJSON();

          await neonDb.saveContent(
            contentId,
            JSON.stringify(jsonState),
            title
          );

          if (onSave) onSave(contentId);
        } catch (error) {
          console.error('Error saving to Neon database:', error);
          if (onError) onError(error as Error);
        }
      });
    }, saveDelay);

    // Register listener for changes
    const removeListener = editor.registerUpdateListener(() => {
      saveContent();
    });

    return () => {
      removeListener();
    };
  }, [editor, connectionString, propContentId, title, saveDelay, onSave, onLoad, onError]);

  // This is a headless plugin, so it doesn't render anything
  return null;
}