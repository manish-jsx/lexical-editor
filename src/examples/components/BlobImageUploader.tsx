import React, { useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { uploadToVercelBlob } from '../../services/BlobStorage';
import { $insertNodes, $createParagraphNode, $createTextNode } from 'lexical';

interface ImageUploaderProps {
  buttonText?: string;
  className?: string;
}

// Create a simple image representation without a custom node
function $createSimpleImage(src: string, altText?: string) {
  const paragraph = $createParagraphNode();
  // Create a text node that represents our image
  const textNode = $createTextNode(`[Image: ${altText || 'uploaded image'}]`);
  paragraph.append(textNode);

  // In a real implementation, you would create a proper image node
  // This is a simplification since we don't have access to the proper ImageNode
  return paragraph;
}

export function BlobImageUploader({
  buttonText = 'Upload Image',
  className
}: ImageUploaderProps) {
  const [editor] = useLexicalComposerContext();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await uploadToVercelBlob(file, {
        access: 'public',
        altText: file.name,
        folder: 'lexical-images',
        onUploadProgress: setUploadProgress
      });

      if (response.success && response.url) {
        // Insert text representation of image into editor
        editor.update(() => {
          const imageNode = $createSimpleImage(response.url as string, response.altText);
          $insertNodes([imageNode]);
        });

        // Log the image URL so users can still access it
        console.log('Image uploaded:', response.url);
      } else {
        console.error('Upload failed:', response.error);
      }
    } catch (error) {
      console.error('Error handling image upload:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className={className}>
      <label style={{ cursor: 'pointer' }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          disabled={isUploading}
        />
        {isUploading ? (
          <div>
            Uploading: {Math.round(uploadProgress * 100)}%
          </div>
        ) : (
          <span>{buttonText}</span>
        )}
      </label>
    </div>
  );
}
