import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

interface Request {
  method: string;
  body: any;
}

interface Response {
  status: (code: number) => Response;
  json: (data: any) => void;
}

/**
 * Example Vercel API route for handling blob uploads
 * Copy this to your project's /api/upload-blob.ts file
 */
export default async function handler(request: Request, response: Response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const file = request.body;

    if (!file) {
      return response.status(400).json({ error: 'No file provided' });
    }

    // Generate a unique filename to prevent collisions
    const uniqueFilename = `${uuidv4()}-${file.name}`;

    const blob = await put(uniqueFilename, file, {
      access: 'public',
    });

    return response.status(200).json(blob);
  } catch (error) {
    console.error('Error uploading to blob:', error);
    return response.status(500).json({ error: 'Error uploading file' });
  }
}
