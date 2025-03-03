/**
 * Configuration utility for handling environment variables in both Next.js and regular React environments
 */

export const getConfig = () => {
  const isServer = typeof window === 'undefined';
  const isNextJs = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_VERCEL_ENV !== undefined;
  
  return {
    blobReadWriteToken: isServer ? 
      process.env.BLOB_READ_WRITE_TOKEN : 
      undefined, // Never expose to client
    
    blobBaseUrl: process.env.NEXT_PUBLIC_BLOB_BASE_URL || '',
    
    neonDatabaseUrl: isServer ? 
      process.env.NEON_DATABASE_URL : 
      undefined, // Never expose to client
    
    editorSaveInterval: parseInt(process.env.NEXT_PUBLIC_EDITOR_SAVE_INTERVAL || '2000', 10),
    
    isServer,
    isNextJs
  };
};
