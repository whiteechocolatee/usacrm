import dynamic from 'next/dynamic';
import Quill from 'quill';
import React, { useRef } from 'react';

const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

function ChatInput({ placeholder }: ChatInputProps) {
  const editorRef = useRef<Quill | null>(null);

  return (
    <div className="px-5 w-full">
      <Editor
        variant="create"
        placeholder={placeholder}
        onSubmit={() => {}}
        onCancel={() => {}}
        disabled={false}
        innerRef={editorRef}
      />
    </div>
  );
}

export default ChatInput;
