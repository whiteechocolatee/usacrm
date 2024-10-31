import UserButton from '@/features/auth/components/user-button';
import {
  Bell,
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
  // TODO: add pathname
  // eslint-disable-next-line
  const pathname = usePathname();

  const isActive = false;

  return (
    <aside className="w-[70px] h-full bg-custom-blue flex flex-col gap-y-4 items-center pt-[9px] pb-2">
      {/* <WorkspaceSwitcher /> */}
      <SidebarButton icon={Home} label="Home" isActive={isActive} href="/" />
      <SidebarButton
        icon={FolderKanban}
        label="Projects"
        isActive={isActive}
        href="/projects"
      />
      <SidebarButton
        icon={Bell}
        label="Calendar"
        isActive={isActive}
        href="/calendar"
      />
      <SidebarButton
        icon={Phone}
        label="Calls"
        isActive={isActive}
        href="/calls"
      />
      <SidebarButton
        icon={Users}
        label="Employees"
        isActive={isActive}
        href="/employees"
      />
      <SidebarButton
        icon={MessagesSquare}
        label="Messages"
        isActive={isActive}
        href="/messages"
      />
      <SidebarButton
        icon={ChartPie}
        label="Statistics"
        isActive={isActive}
        href="/statistics"
      />
      <SidebarButton
        icon={Bell}
        label="Notifications"
        isActive={isActive}
        href="/notifications"
      />

      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
}

export default Sidebar;
