import Hint from '@/components/hint';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { FaCaretDown } from 'react-icons/fa';
import { useToggle } from 'react-use';

type WorkspaceSectionProps = {
  children: React.ReactNode;
  label: string;
  hint?: string;
  onNew?: () => void;
};

function WorkspaceSection({
  children,
  label,
  hint,
  onNew,
}: WorkspaceSectionProps) {
  const [on, toggle] = useToggle(false);

  return (
    <div className="flex flex-col mt-3 px-2">
      <div className="flex items-center px-3.5 group">
        <Button
          variant="transparent"
          onClick={toggle}
          className="text-sm p-0.5 text-[#f9edffcc] shrink-0 size-6"
        >
          <FaCaretDown
            className={cn(on && '-rotate-90', 'size-4 transition-transform')}
          />
        </Button>
        <Button
          variant="transparent"
          size="sm"
          className="group px-1.5 text-sm text-[#f9edffcc] h-[28px] justify-start overflow-hidden items-center"
        >
          <span className="truncate">{label}</span>
        </Button>
        {onNew && (
          <Hint label={hint!} side="top" align="center">
            <Button
              onClick={onNew}
              variant="transparent"
              size="iconSm"
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-[#f9edffcc] size-6 shrink-0"
            >
              <Plus className="size-5" />
            </Button>
          </Hint>
        )}
      </div>
      {on && children}
    </div>
  );
}

export default WorkspaceSection;
