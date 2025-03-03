import { neon, neonConfig } from '@neondatabase/serverless';
import { getConfig } from './config';

export const createNeonClient = (customConfig = {}) => {
  const config = getConfig();
  
  if (!config.isServer) {
    throw new Error('Neon database client must only be initialized on the server');
  }
  
  const connectionString = customConfig.connectionString || config.neonDatabaseUrl;
  
  if (!connectionString) {
    throw new Error('Missing Neon database connection string. Please set NEON_DATABASE_URL in your environment');
  }
  
  // Configure Neon for edge runtime compatibility
  neonConfig.fetchConnectionCache = true;
  
  const sql = neon(connectionString);
  
  return {
    sql,
    
    // Helper method to create a table for editor content if it doesn't exist
    async initializeEditorTable() {
      await sql`
        CREATE TABLE IF NOT EXISTS editor_content (
          id TEXT PRIMARY KEY,
          content JSONB NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;
    },
    
    // Helper to save editor content
    async saveEditorContent(id, content) {
      return await sql`
        INSERT INTO editor_content (id, content, updated_at)
        VALUES (${id}, ${JSON.stringify(content)}, CURRENT_TIMESTAMP)
        ON CONFLICT (id)
        DO UPDATE SET content = ${JSON.stringify(content)}, updated_at = CURRENT_TIMESTAMP
        RETURNING id, updated_at
      `;
    },
    
    // Helper to load editor content
    async getEditorContent(id) {
      const results = await sql`
        SELECT content FROM editor_content WHERE id = ${id}
      `;
      return results[0]?.content;
    }
  };
};
