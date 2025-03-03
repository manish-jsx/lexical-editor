import { put, list, del } from '@vercel/blob';
import { getConfig } from './config';

export class BlobStorageClient {
  constructor(options = {}) {
    this.config = getConfig();
    this.token = options.token || this.config.blobReadWriteToken;
    this.baseUrl = options.baseUrl || this.config.blobBaseUrl;
  }

  async uploadImage(file, metadata = {}) {
    if (!this.config.isServer && !this.token) {
      throw new Error('Client-side uploads require a token to be provided');
    }
    
    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const contentType = file.type;
      const result = await put(fileName, file, {
        access: 'public',
        token: this.token,
        addRandomSuffix: true,
        contentType,
        metadata: {
          ...metadata,
          uploadedFrom: this.config.isNextJs ? 'nextjs' : 'react',
        }
      });
      
      return {
        success: true,
        url: result.url,
        pathname: result.pathname,
        contentType: result.contentType,
        size: result.size
      };
    } catch (error) {
      console.error('Failed to upload to Vercel Blob:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async listImages(prefix) {
    if (!this.config.isServer) {
      throw new Error('Listing blobs can only be done server-side');
    }
    
    try {
      const result = await list({ token: this.token, prefix });
      return {
        success: true,
        blobs: result.blobs
      };
    } catch (error) {
      console.error('Failed to list Vercel Blobs:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteImage(url) {
    if (!this.config.isServer) {
      throw new Error('Deleting blobs can only be done server-side');
    }
    
    try {
      await del(url, { token: this.token });
      return { success: true };
    } catch (error) {
      console.error('Failed to delete Vercel Blob:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}
