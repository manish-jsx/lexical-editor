import { EditorState, LexicalEditor } from 'lexical';
import { createEditor } from 'lexical';

// Initialize the editor
const editor: LexicalEditor = createEditor({
  namespace: 'MyLexicalEditor',
  nodes: [],
  onError: (error: Error) => {
    console.error('Lexical Editor Error:', error);
  },
});

// Function to initialize the editor state
const initializeEditorState = () => {
  const initialState = EditorState.createEmpty();
  editor.setEditorState(initialState);
};

// Function to handle editor updates
const handleEditorUpdate = () => {
  const editorState = editor.getEditorState();
  console.log('Editor State Updated:', editorState.toJSON());
};

// Attach the editor to a DOM element
const attachEditorToDOM = (elementId: string) => {
  const editorElement = document.getElementById(elementId);
  if (editorElement) {
    editor.setRootElement(editorElement);
    initializeEditorState();
    editor.registerUpdateListener(handleEditorUpdate);
  } else {
    console.error(`Element with id ${elementId} not found`);
  }
};

// Example usage
document.addEventListener('DOMContentLoaded', () => {
  attachEditorToDOM('editor-root');
});