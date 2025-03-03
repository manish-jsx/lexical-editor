import React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  TextFormatType
} from 'lexical';

export interface EditorToolbarProps {
  /**
   * CSS class for the toolbar container
   */
  className?: string;
  /**
   * Additional toolbar items to render
   */
  children?: React.ReactNode;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  className = '',
  children,
}) => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [isUnderline, setIsUnderline] = React.useState(false);

  // Update format states based on selection
  React.useEffect(() => {
    const unregisterListener = editor.registerUpdateListener(
      ({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
          }
        });
      }
    );

    return unregisterListener;
  }, [editor]);

  const onFormatClick = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  return (
    <div className={`editor-toolbar ${className}`}>
      <button
        type="button"
        aria-label="Format Bold"
        className={isBold ? 'active' : ''}
        onClick={() => onFormatClick('bold')}
      >
        B
      </button>
      <button
        type="button"
        aria-label="Format Italic"
        className={isItalic ? 'active' : ''}
        onClick={() => onFormatClick('italic')}
      >
        I
      </button>
      <button
        type="button"
        aria-label="Format Underline"
        className={isUnderline ? 'active' : ''}
        onClick={() => onFormatClick('underline')}
      >
        U
      </button>

      {/* Render additional toolbar items */}
      {children}
    </div>
  );
};

export default EditorToolbar;
