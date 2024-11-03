'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import ProjectsList from '@/features/projects/components/projects-list';
import { Project } from '@/features/projects/types';
import { useCreateProjectsModal } from '@/hooks/use-create-project-modal';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { Plus, Search } from 'lucide-react';
import React, { useState, useMemo } from 'react';

function ProjectsPage() {
  const workspaceId = useWorkspaceId();
  const { open } = useCreateProjectsModal();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: projects, isLoading: isProjectsLoading } = useGetProjects({
    workspaceId,
  });

  const filteredProjects = useMemo(() => {
    if (!projects) return [];

    if (!searchQuery.trim()) return projects as Project[];

    const query = searchQuery.toLowerCase().trim();
    return projects.filter(
      (project): project is Project =>
        (project.name.toLowerCase().includes(query) ||
          project.caseId.toLowerCase().includes(query)) &&
        project.importance !== undefined,
    );
  }, [projects, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="h-full max-w-screen-2xl mx-auto px-6 pt-11">
      <div className="w-full flex items-center gap-x-4 justify-between">
        <h2 className="text-4xl font-bold">Projects</h2>
        <div className="relative max-w-[622px] w-full">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-12"
            placeholder="Search projects by name or case ID"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <Button onClick={open} size="lg" variant="primary">
          <Plus className="mr-2 size-6 text-custom-blue" /> Add project
        </Button>
      </div>
      <ProjectsList projects={filteredProjects} isLoading={isProjectsLoading} />
    </div>
  );
}

export default ProjectsPage;
