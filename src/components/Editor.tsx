'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
}

export default function Editor({ content, onChange, readOnly = false }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: content,
    editable: !readOnly,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base m-5 focus:outline-none max-w-none min-h-[300px]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      const currentPos = editor.state.selection;
      editor.commands.setContent(content);
      try {
        editor.commands.setTextSelection(currentPos);
      } catch (e) {}
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly);
    }
  }, [readOnly, editor]);

  if (!editor) {
    return <div className="p-8 text-center text-zinc-500">Loading editor...</div>;
  }

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      {!readOnly && (
        <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-2 flex gap-2 flex-wrap sticky top-0 z-10">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              editor.isActive('bold') ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
            }`}
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              editor.isActive('italic') ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
            }`}
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              editor.isActive('heading', { level: 1 }) ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
            }`}
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              editor.isActive('heading', { level: 2 }) ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
            }`}
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              editor.isActive('bulletList') ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
            }`}
          >
            Bullet List
          </button>
        </div>
      )}
      <div className="p-4 min-h-[300px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
