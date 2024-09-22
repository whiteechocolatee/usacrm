import Quill, { type QuillOptions } from 'quill';
import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { MdSend } from 'react-icons/md';
import { PiTextAa } from 'react-icons/pi';

import { cn } from '@/lib/utils';
import { Image as ImageIcon, Smile, XIcon } from 'lucide-react';
import Image from 'next/image';
import { Delta, Op } from 'quill/core';
import 'quill/dist/quill.snow.css';
import EmojiPopover from './emoji-popover';
import Hint from './hint';
import { Button } from './ui/button';

type EditorValue = {
  image?: File | null;
  body: string;
};

interface EditorProps {
  variant?: 'create' | 'update';
  onSubmit?: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  defaultValue?: Delta | Op[];
}

function Editor({
  variant = 'create',
  onSubmit,
  onCancel,
  placeholder = 'Write something...',
  defaultValue = [],
  disabled = false,
  innerRef,
}: EditorProps) {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef<Delta | Op[]>(defaultValue);
  const disabledRef = useRef(disabled);
  const imageElementRef = useRef<HTMLInputElement | null>(null);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const editor = container.appendChild(
      container.ownerDocument.createElement('div'),
    );

    const options: QuillOptions = {
      theme: 'snow',
      placeholder: placeholderRef.current,
      modules: {
        toolbar: {
          container: [
            ['bold', 'italic', 'underline', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
          ],
        },
        keyboard: {
          bindings: {
            enter: {
              key: 'Enter',
              handler: () => false,
            },
            shift_enter: {
              key: 'Shift+Enter',
              shiftKey: true,
              handler: () => {
                // eslint-disable-next-line
                quill.insertText(quill.getSelection()?.index || 0, '\n');
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editor, options);

    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    // eslint-disable-next-line
    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = '';
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, []);

  // eslint-disable-next-line
  const onEmojiSelect = (emoji: any) => {
    quillRef.current?.insertText(
      quillRef.current.getSelection()?.index || 0,
      emoji.native,
    );
  };

  const isEmpty = text.replace(/<(.|\n)*?>/g, '').trim().length === 0;

  const toggleToolbar = () => {
    setIsToolbarVisible(prev => !prev);

    const toolbar = containerRef.current?.querySelector('.ql-toolbar');

    if (toolbar) {
      toolbar.classList.toggle('hidden');
    }
  };

  return (
    <div className="flex flex-col">
      <input
        type="file"
        accept="image/*"
        ref={imageElementRef}
        className="hidden"
        onChange={e => setImage(e.target.files![0])}
      />
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div className="h-full ql-custom" ref={containerRef} />
        {!!image && (
          <div className="p-2 ">
            <div className="relative size-[62px] flex items-center justify-center group/image">
              <Hint label="Remove image">
                {/*  eslint-disable-next-line */}
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    imageElementRef.current!.value = '';
                  }}
                  className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
                >
                  <XIcon className="size-3.5" />
                </button>
              </Hint>
              <Image
                className="rounded-xl object-cover overflow-hidden"
                alt="Image preview"
                fill
                src={URL.createObjectURL(image)}
              />
            </div>
          </div>
        )}
        <div className="flex px-2 pb-2 z-[5]">
          <Hint label={`${isToolbarVisible ? 'Show' : 'Hide'} formatting`}>
            <Button
              disabled={disabled}
              size="iconSm"
              variant="ghost"
              onClick={toggleToolbar}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button disabled={disabled} size="iconSm" variant="ghost">
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>
          {variant === 'create' && (
            <Hint label="Image">
              <Button
                disabled={disabled}
                size="iconSm"
                variant="ghost"
                onClick={() => imageElementRef.current?.click()}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {variant === 'update' && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                disabled={disabled}
                onClick={onCancel}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                disabled={disabled || isEmpty}
                onClick={() => {}}
                size="sm"
                className="bg-[#007a5a] hover:bg-[#007a5a] text-white"
              >
                Save
              </Button>
            </div>
          )}
          {variant === 'create' && (
            <Button
              disabled={disabled || isEmpty}
              onClick={() => {}}
              size="iconSm"
              className={cn(
                'ml-auto',
                isEmpty
                  ? 'bg-white hover:bg-white text-muted-foreground'
                  : 'bg-[#007a5a] hover:bg-[#007a5a] text-white',
              )}
            >
              <MdSend className="size-4" />
            </Button>
          )}
        </div>
      </div>
      {variant === 'create' && (
        <div className="p-2 text-[10px] text-muted-foreground flex justify-end">
          <p>
            <strong>Shift + Enter</strong> to add a new line
          </p>
        </div>
      )}
    </div>
  );
}

export default Editor;
