import { useCallback, useEffect, useState } from 'react';
import { $getRoot, $getSelection } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export function useLexical() {
  const [editor] = useLexicalComposerContext();
  const [editorState, setEditorState] = useState(editor.getEditorState());
  
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      setEditorState(editorState);
    });
  }, [editor]);

  const getEditorState = useCallback(() => {
    return editorState;
  }, [editorState]);

  const getRootElement = useCallback(() => {
    return editorState.read(() => $getRoot());
  }, [editorState]);

  const getSelection = useCallback(() => {
    return editorState.read(() => $getSelection());
  }, [editorState]);

  return {
    editor,
    editorState,
    getEditorState,
    getRootElement,
    getSelection
  };
}
