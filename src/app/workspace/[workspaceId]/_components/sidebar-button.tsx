import { Button } from '@/components/ui/button';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { IconType } from 'react-icons/lib';

type SidebarButtonProps = {
  icon: LucideIcon | IconType;
  label: string;
  href: string;
  isActive?: boolean;
};

function SidebarButton({
  icon: Icon,
  label,
  isActive,
  href,
}: SidebarButtonProps) {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const generatedHref = `/workspace/${workspaceId}/${href}`;

  const onClick = () => {
    router.push(generatedHref);
  };

  return (
    <div className="flex flex-col items-center justify-start gap-y-0.5 cursor-pointer group">
      <Button
        onClick={onClick}
        variant="transparent"
        className={cn(
          'size-9 p-2 group-hover:bg-accent/20',
          isActive && 'bg-accent/20',
        )}
      >
        <Icon className="size-5 text-white group-hover:scale-110 transition-all" />
      </Button>
      <span className="text-[11px] text-white group-hover:text-accent transition-all">
        {label}
      </span>
    </div>
  );
}

export default SidebarButton;
