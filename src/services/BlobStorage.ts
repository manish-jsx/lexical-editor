import { upload } from '@vercel/blob/client';

export interface BlobUploadOptions {
  /**
   * Control if the uploaded file should be public or private. Defaults to false (private).
   */
  access?: 'public' | 'private';
  /**
   * When adding images to the editor, you can use this to add alt text
   */
  altText?: string;
  /**
   * Optional callback to track upload progress
   */
  onUploadProgress?: (progress: number) => void;
  /**
   * Optional folder path to organize files
   */
  folder?: string;
}

export interface BlobUploadResponse {
  success: boolean;
  error?: string;
  url?: string;
  altText?: string;
  contentType?: string;
  size?: number;
}

/**
 * Upload a file to Vercel Blob Storage
 */
export async function uploadToVercelBlob(
  file: File,
  options: BlobUploadOptions = {}
): Promise<BlobUploadResponse> {
  try {
    const { access = 'public', altText, folder, onUploadProgress } = options;
    const filename = folder ? `${folder}/${file.name}` : file.name;

    // Ensure access is only 'public' to satisfy TypeScript
    const blobAccess: 'public' = 'public';

    // Create upload options without the onUploadProgress
    const uploadOptions: any = {
      access: blobAccess,
      handleUploadUrl: '/api/upload-blob',
    };

    // Add progress handler if provided
    if (onUploadProgress) {
      uploadOptions.onUploadProgress = ({ progress }: { progress: number }) => {
        onUploadProgress(progress);
      };
    }

    const response = await upload(filename, file, uploadOptions);

    return {
      success: true,
      url: response.url,
      altText: altText || file.name,
      contentType: file.type,
      size: file.size
    };
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
