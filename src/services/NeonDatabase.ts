import { neon, neonConfig } from '@neondatabase/serverless';
import { LexicalEditor } from 'lexical';

/**
 * Configuration for Neon database connection
 */
export interface NeonConfig {
  /**
   * Neon database connection string
   */
  connectionString: string;
  /**
   * Table name to store editor content
   * Default: 'lexical_content'
   */
  contentTable?: string;
  /**
   * Enable WebSocket for better connection (optional)
   */
  useWebsockets?: boolean;
}

/**
 * Initialize the Neon database connection
 */
export function initNeonDatabase(config: NeonConfig) {
  if (config.useWebsockets) {
    neonConfig.webSocketConstructor = globalThis.WebSocket;
    neonConfig.useSecureWebSocket = true;
  }

  const sql = neon(config.connectionString);
  const contentTable = config.contentTable || 'lexical_content';

  return {
    /**
     * Create tables needed for the lexical editor if they don't exist
     */
    async setupTables() {
      await sql`
        CREATE TABLE IF NOT EXISTS ${sql(contentTable)} (
          id TEXT PRIMARY KEY,
          content JSONB NOT NULL,
          title TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      return true;
    },

    /**
     * Save editor content to the database
     */
    async saveContent(id: string, editorState: string, title?: string) {
      const content = JSON.parse(editorState);
      const result = await sql`
        INSERT INTO ${sql(contentTable)} (id, content, title, updated_at)
        VALUES (${id}, ${content}, ${title || null}, NOW())
        ON CONFLICT (id) DO UPDATE
        SET content = ${content}, 
            title = ${title || null},
            updated_at = NOW()
        RETURNING id;
      `;
      return result[0];
    },

    /**
     * Load editor content from the database
     */
    async loadContent(id: string) {
      const result = await sql`
        SELECT content, title, updated_at
        FROM ${sql(contentTable)}
        WHERE id = ${id};
      `;

      return result.length > 0 ? {
        content: result[0].content,
        title: result[0].title,
        updatedAt: result[0].updated_at
      } : null;
    },

    /**
     * List all saved content entries
     */
    async listContent(limit = 20, offset = 0) {
      const result = await sql`
        SELECT id, title, updated_at
        FROM ${sql(contentTable)}
        ORDER BY updated_at DESC
        LIMIT ${limit} OFFSET ${offset};
      `;
      return result;
    },

    /**
     * Delete content by id
     */
    async deleteContent(id: string) {
      await sql`
        DELETE FROM ${sql(contentTable)}
        WHERE id = ${id};
      `;
      return true;
    }
  };
}

/**
 * Hook to persist Lexical editor state to Neon PostgreSQL
 */
export function usePersistToNeon(
  editor: LexicalEditor | null,
  neonDb: ReturnType<typeof initNeonDatabase>,
  contentId: string,
  options?: {
    title?: string;
    onSaveSuccess?: (id: string) => void;
    onSaveError?: (error: Error) => void;
  }
) {
  const saveContent = async () => {
    if (!editor) return;

    try {
      editor.update(async () => {
        const editorState = editor.getEditorState();
        const jsonState = editorState.toJSON();

        await neonDb.saveContent(
          contentId,
          JSON.stringify(jsonState),
          options?.title
        );

        if (options?.onSaveSuccess) {
          options.onSaveSuccess(contentId);
        }
      });
    } catch (error) {
      console.error('Error saving to Neon database:', error);
      if (options?.onSaveError && error instanceof Error) {
        options.onSaveError(error);
      }
    }
  };

  const loadContent = async () => {
    if (!editor) return null;

    try {
      const data = await neonDb.loadContent(contentId);

      if (data && data.content) {
        editor.setEditorState(editor.parseEditorState(data.content));
        return data;
      }

      return null;
    } catch (error) {
      console.error('Error loading from Neon database:', error);
      return null;
    }
  };

  return { saveContent, loadContent };
}
