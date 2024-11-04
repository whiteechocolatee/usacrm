import UserButton from '@/features/auth/components/user-button';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import {
  Bell,
  CalendarDays,
  ChartPie,
  FolderKanban,
  Home,
  MessagesSquare,
  Phone,
  Users,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import SidebarButton from './sidebar-button';

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[70px] h-full bg-custom-blue flex flex-col gap-y-4 items-center pt-[9px] pb-2">
      {/* <WorkspaceSwitcher /> */}
      <SidebarButton
        icon={Home}
        label="Home"
        isActive={pathname === `/workspace/${useWorkspaceId()}`}
        href="/"
      />
      <SidebarButton
        icon={FolderKanban}
        label="Projects"
        isActive={pathname.includes('/projects')}
        href="/projects"
      />
      <SidebarButton
        icon={CalendarDays}
        label="Calendar"
        isActive={pathname.includes('/calendar')}
        href="/calendar"
      />
      <SidebarButton
        icon={Phone}
        label="Calls"
        isActive={pathname.includes('/calls')}
        href="/calls"
      />
      <SidebarButton
        icon={Users}
        label="Employees"
        isActive={pathname.includes('/employees')}
        href="/employees"
      />
      <SidebarButton
        icon={MessagesSquare}
        label="Messages"
        isActive={pathname.includes('/channel') || pathname.includes('/member')}
        href="/messages"
      />
      <SidebarButton
        icon={ChartPie}
        label="Statistics"
        isActive={pathname.includes('/statistics')}
        href="/statistics"
      />
      <SidebarButton
        icon={Bell}
        label="Notifications"
        isActive={pathname.includes('/notifications')}
        href="/notifications"
      />

      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
}

export default Sidebar;
