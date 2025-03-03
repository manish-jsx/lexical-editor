import { createNeonClient } from 'lexical-editor-easy';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { id, content } = await request.json();
    
    if (!id || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: id and content' },
        { status: 400 }
      );
    }
    
    const neonClient = createNeonClient();
    await neonClient.initializeEditorTable();
    const result = await neonClient.saveEditorContent(id, content);
    
    return NextResponse.json({
      success: true,
      id: result[0].id,
      updatedAt: result[0].updated_at
    });
  } catch (error) {
    console.error('Error saving editor content:', error);
    return NextResponse.json(
      { error: 'Failed to save editor content' },
      { status: 500 }
    );
  }
}
